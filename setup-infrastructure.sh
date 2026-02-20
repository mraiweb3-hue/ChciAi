#!/bin/bash
set -e

# ChciAI.cz - Multi-tenant OpenClaw Infrastructure Setup
# Based on Kimi's architecture recommendation

echo "=================================================="
echo "  ChciAI.cz Infrastructure Setup"
echo "  Multi-tenant OpenClaw Platform"
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo "❌ Please run as root (sudo bash setup-infrastructure.sh)"
   exit 1
fi

# Variables
INSTALL_DIR="/opt/chciai"
DOMAIN="chciai.cz"

echo "📋 Installation directory: $INSTALL_DIR"
echo "🌐 Domain: $DOMAIN"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1/8: Installing dependencies..."
apt-get update -qq
apt-get install -y curl git docker.io docker-compose-plugin ufw certbot nginx -qq

# Enable Docker
systemctl enable docker
systemctl start docker

echo "✅ Dependencies installed"
echo ""

# Step 2: Create directory structure
echo "📁 Step 2/8: Creating directory structure..."
mkdir -p $INSTALL_DIR/{nginx/{conf.d,ssl},templates,scripts,tenants,backups}
mkdir -p $INSTALL_DIR/templates

echo "✅ Directory structure created"
echo ""

# Step 3: Create Docker network
echo "🔗 Step 3/8: Creating Docker network..."
docker network create chciai-network 2>/dev/null || echo "Network already exists"

echo "✅ Docker network ready"
echo ""

# Step 4: Setup firewall
echo "🔥 Step 4/8: Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment "SSH"
ufw allow 80/tcp comment "HTTP"
ufw allow 443/tcp comment "HTTPS"
ufw reload

echo "✅ Firewall configured"
echo ""

# Step 5: Create Nginx reverse proxy config
echo "🌐 Step 5/8: Setting up Nginx reverse proxy..."

cat > $INSTALL_DIR/docker-compose.proxy.yml << 'EOF'
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    container_name: chciai-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - chciai-network
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  chciai-network:
    external: true
EOF

# Main Nginx config
cat > $INSTALL_DIR/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Include site configs
    include /etc/nginx/conf.d/*.conf;
}
EOF

echo "✅ Nginx configuration created"
echo ""

# Step 6: Create OpenClaw tenant template
echo "📄 Step 6/8: Creating tenant template..."

cat > $INSTALL_DIR/templates/docker-compose.yml << 'EOF'
version: '3.8'

services:
  openclaw-gateway:
    image: node:22-alpine
    container_name: openclaw-TENANT_ID
    working_dir: /workspace
    environment:
      - CLIENT_ID=TENANT_ID
      - CLIENT_EMAIL=CLIENT_EMAIL
      - EMERGENT_API_KEY=EMERGENT_KEY
      - NODE_ENV=production
    volumes:
      - ./workspace:/workspace:rw
    networks:
      - chciai-network
    restart: unless-stopped
    command: >
      sh -c "apk add --no-cache git &&
             npm install -g clawdbot@latest &&
             cd /workspace &&
             clawdbot gateway start --port 3000"
    expose:
      - "3000"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  chciai-network:
    external: true
EOF

echo "✅ Tenant template created"
echo ""

# Step 7: Create management scripts
echo "🛠️  Step 7/8: Creating management scripts..."

# Add tenant script
cat > $INSTALL_DIR/scripts/add-tenant.sh << 'EOFSCRIPT'
#!/bin/bash
set -e

TENANT_ID=$1
CLIENT_EMAIL=$2
EMERGENT_KEY=${3:-"sk-emergent-bEcBa024324F8269f8"}

if [ -z "$TENANT_ID" ] || [ -z "$CLIENT_EMAIL" ]; then
    echo "Usage: ./add-tenant.sh <tenant-id> <client-email> [emergent-key]"
    exit 1
fi

INSTALL_DIR="/opt/chciai"
TENANT_DIR="$INSTALL_DIR/tenants/$TENANT_ID"

echo "🚀 Creating tenant: $TENANT_ID"
echo "📧 Email: $CLIENT_EMAIL"

# Create tenant directory
mkdir -p $TENANT_DIR/workspace

# Copy docker-compose template
cp $INSTALL_DIR/templates/docker-compose.yml $TENANT_DIR/

# Replace placeholders
sed -i "s/TENANT_ID/$TENANT_ID/g" $TENANT_DIR/docker-compose.yml
sed -i "s/CLIENT_EMAIL/$CLIENT_EMAIL/g" $TENANT_DIR/docker-compose.yml
sed -i "s|EMERGENT_KEY|$EMERGENT_KEY|g" $TENANT_DIR/docker-compose.yml

# Create Nginx config
cat > $INSTALL_DIR/nginx/conf.d/$TENANT_ID.conf <<EOF
server {
    listen 80;
    server_name $TENANT_ID.chciai.cz;

    location / {
        proxy_pass http://openclaw-$TENANT_ID:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Start tenant
cd $TENANT_DIR
docker compose up -d

# Reload Nginx
docker exec chciai-proxy nginx -s reload 2>/dev/null || echo "⚠️  Nginx not running yet"

echo ""
echo "✅ Tenant created successfully!"
echo "🌐 URL: http://$TENANT_ID.chciai.cz"
echo "📁 Directory: $TENANT_DIR"
echo ""
echo "⚠️  Don't forget to:"
echo "  1. Add DNS record: $TENANT_ID.chciai.cz → your-vps-ip"
echo "  2. Setup SSL certificate"
echo ""
EOFSCRIPT

chmod +x $INSTALL_DIR/scripts/add-tenant.sh

# Manage tenant script
cat > $INSTALL_DIR/scripts/manage-tenant.sh << 'EOFSCRIPT'
#!/bin/bash

ACTION=$1
TENANT_ID=$2
INSTALL_DIR="/opt/chciai"

if [ -z "$TENANT_ID" ]; then
    echo "Usage: $0 {start|stop|restart|logs|status|backup|delete} <tenant-id>"
    exit 1
fi

TENANT_DIR="$INSTALL_DIR/tenants/$TENANT_ID"

if [ ! -d "$TENANT_DIR" ] && [ "$ACTION" != "list" ]; then
    echo "❌ Tenant $TENANT_ID not found"
    exit 1
fi

case "$ACTION" in
    start)
        echo "🚀 Starting $TENANT_ID..."
        docker compose -f $TENANT_DIR/docker-compose.yml up -d
        ;;
    stop)
        echo "⏸️  Stopping $TENANT_ID..."
        docker compose -f $TENANT_DIR/docker-compose.yml stop
        ;;
    restart)
        echo "🔄 Restarting $TENANT_ID..."
        docker compose -f $TENANT_DIR/docker-compose.yml restart
        ;;
    logs)
        docker compose -f $TENANT_DIR/docker-compose.yml logs -f
        ;;
    status)
        echo "📊 Status for $TENANT_ID:"
        docker compose -f $TENANT_DIR/docker-compose.yml ps
        docker stats --no-stream openclaw-$TENANT_ID 2>/dev/null || echo "Container not running"
        ;;
    backup)
        echo "💾 Backing up $TENANT_ID..."
        BACKUP_FILE="$INSTALL_DIR/backups/${TENANT_ID}_$(date +%Y%m%d_%H%M%S).tar.gz"
        tar czf $BACKUP_FILE $TENANT_DIR/workspace
        echo "✅ Backup saved: $BACKUP_FILE"
        ;;
    delete)
        read -p "⚠️  Are you sure you want to delete $TENANT_ID? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo "🗑️  Deleting $TENANT_ID..."
            docker compose -f $TENANT_DIR/docker-compose.yml down -v
            rm -rf $TENANT_DIR
            rm -f $INSTALL_DIR/nginx/conf.d/${TENANT_ID}.conf
            docker exec chciai-proxy nginx -s reload 2>/dev/null
            echo "✅ Tenant deleted"
        else
            echo "❌ Cancelled"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|backup|delete} <tenant-id>"
        exit 1
        ;;
esac
EOFSCRIPT

chmod +x $INSTALL_DIR/scripts/manage-tenant.sh

# List tenants script
cat > $INSTALL_DIR/scripts/list-tenants.sh << 'EOFSCRIPT'
#!/bin/bash

INSTALL_DIR="/opt/chciai"

echo "========================================"
echo "  ChciAI.cz - Active Tenants"
echo "========================================"
echo ""

if [ ! -d "$INSTALL_DIR/tenants" ] || [ -z "$(ls -A $INSTALL_DIR/tenants)" ]; then
    echo "No tenants found."
    exit 0
fi

for tenant_dir in $INSTALL_DIR/tenants/*/; do
    if [ -d "$tenant_dir" ]; then
        TENANT_ID=$(basename "$tenant_dir")
        echo "📦 Tenant: $TENANT_ID"
        echo "   URL: http://$TENANT_ID.chciai.cz"
        
        # Check container status
        if docker ps --format '{{.Names}}' | grep -q "openclaw-$TENANT_ID"; then
            echo "   Status: ✅ Running"
            docker stats --no-stream --format "   CPU: {{.CPUPerc}} | Memory: {{.MemUsage}}" openclaw-$TENANT_ID
        else
            echo "   Status: ⚠️  Stopped"
        fi
        echo ""
    fi
done
EOFSCRIPT

chmod +x $INSTALL_DIR/scripts/list-tenants.sh

echo "✅ Management scripts created"
echo ""

# Step 8: Start Nginx proxy
echo "🚀 Step 8/8: Starting Nginx reverse proxy..."
cd $INSTALL_DIR
docker compose -f docker-compose.proxy.yml up -d

echo "✅ Nginx proxy started"
echo ""

# Final summary
echo "=================================================="
echo "  ✅ Installation Complete!"
echo "=================================================="
echo ""
echo "📁 Installation directory: $INSTALL_DIR"
echo ""
echo "🛠️  Management Commands:"
echo "  Add tenant:    $INSTALL_DIR/scripts/add-tenant.sh <id> <email>"
echo "  List tenants:  $INSTALL_DIR/scripts/list-tenants.sh"
echo "  Manage tenant: $INSTALL_DIR/scripts/manage-tenant.sh {start|stop|logs} <id>"
echo ""
echo "📝 Next Steps:"
echo "  1. Setup wildcard DNS: *.chciai.cz → $(curl -s ifconfig.me)"
echo "  2. Create first tenant: $INSTALL_DIR/scripts/add-tenant.sh client1 test@example.com"
echo "  3. Setup SSL (Cloudflare recommended)"
echo ""
echo "📚 Documentation: https://github.com/mraiweb3-hue/ChciAi"
echo ""
