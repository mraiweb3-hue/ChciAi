#!/bin/bash
# ChciAI.cz - Complete Self-Hosted Installation
# Run on Wedos VPS as root

set -e

CHCIAI_DIR="/opt/chciai"
DOMAIN="chciai.cz"

echo "================================================"
echo "  ChciAI.cz - Self-Hosted OpenClaw Platform"
echo "================================================"
echo ""
echo "Installation: ${CHCIAI_DIR}"
echo "Domain: ${DOMAIN}"
echo ""

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "Cannot detect OS"
    exit 1
fi

echo "OS: $OS $VER"

# Step 1: Dependencies
echo "Installing dependencies..."
apt-get update -qq
apt-get install -y -qq curl wget git vim nano htop net-tools ufw openssl \
    apt-transport-https ca-certificates gnupg lsb-release \
    software-properties-common apache2-utils

# Step 2: Docker
echo "Installing Docker..."
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/$ID/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$ID $(lsb_release -cs) stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -qq

# Try docker-compose-plugin, fallback to standalone
if apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin 2>/dev/null; then
    COMPOSE_CMD="docker compose"
    echo "Docker with compose plugin installed"
else
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io
    curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    COMPOSE_CMD="docker-compose"
    echo "Docker with standalone compose installed"
fi

systemctl start docker
systemctl enable docker

# Step 3: Directory Structure
echo "Creating directories..."
mkdir -p ${CHCIAI_DIR}/{build,registry,infrastructure/{nginx/{conf.d,templates,ssl},scripts},tenants,backups,logs}
cd ${CHCIAI_DIR}

# Create Docker network
docker network create chciai-network 2>/dev/null || echo "Network exists"

# Step 4: Local Docker Registry
echo "Setting up local registry..."
cat > ${CHCIAI_DIR}/registry/docker-compose.yml << 'REGISTRYEOF'
version: "3.8"
services:
  registry:
    image: registry:2
    container_name: chciai-registry
    ports:
      - "127.0.0.1:5000:5000"
    volumes:
      - registry-data:/var/lib/registry
    networks:
      - chciai-network
    restart: unless-stopped
volumes:
  registry-data:
networks:
  chciai-network:
    external: true
REGISTRYEOF

cd ${CHCIAI_DIR}/registry
$COMPOSE_CMD up -d

# Step 5: Nginx Configuration
echo "Configuring Nginx..."

cat > ${CHCIAI_DIR}/infrastructure/nginx/nginx.conf << 'NGINXEOF'
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
    keepalive_timeout 65;
    gzip on;
    include /etc/nginx/conf.d/*.conf;
}
NGINXEOF

# Step 6: Proxy Docker Compose
cat > ${CHCIAI_DIR}/infrastructure/docker-compose.yml << 'PROXYEOF'
version: "3.8"
services:
  nginx-proxy:
    image: nginx:alpine
    container_name: chciai-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - chciai-network
    restart: unless-stopped
  portainer:
    image: portainer/portainer-ce:latest
    container_name: chciai-portainer
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data
    networks:
      - chciai-network
    restart: unless-stopped
networks:
  chciai-network:
    external: true
volumes:
  portainer-data:
PROXYEOF

# Step 7: Build Server Setup
echo "Setting up build server..."

cat > ${CHCIAI_DIR}/build/Dockerfile << 'BUILDEOF'
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git python3 make g++
RUN git clone https://github.com/openclaw/openclaw.git . || mkdir -p /app
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
ENV OPENCLAW_STATE_DIR=/app/state
VOLUME ["/app/state"]
EXPOSE 18789
CMD ["node", "dist/index.js"]
BUILDEOF

cat > ${CHCIAI_DIR}/build/build-openclaw.sh << 'BUILDCMD'
#!/bin/bash
set -e
echo "Building OpenClaw from source..."
cd /opt/chciai/build
docker build -t localhost:5000/chciai/openclaw:latest .
echo "Pushing to local registry..."
docker push localhost:5000/chciai/openclaw:latest
docker tag localhost:5000/chciai/openclaw:latest chciai/openclaw:latest
echo "OpenClaw built successfully"
BUILDCMD

chmod +x ${CHCIAI_DIR}/build/build-openclaw.sh

# Step 8: Management Scripts
echo "Creating management scripts..."

cat > ${CHCIAI_DIR}/infrastructure/scripts/add-tenant.sh << 'ADDSCRIPT'
#!/bin/bash
set -e

TENANT_ID=$1
ANTHROPIC_KEY=$2

if [ -z "$TENANT_ID" ] || [ -z "$ANTHROPIC_KEY" ]; then
    echo "Usage: $0 <tenant-id> <anthropic-api-key>"
    exit 1
fi

BASE_DIR="/opt/chciai/tenants/${TENANT_ID}"

if [ -d "$BASE_DIR" ]; then
    echo "Tenant ${TENANT_ID} already exists!"
    exit 1
fi

echo "Creating tenant: ${TENANT_ID}"
mkdir -p ${BASE_DIR}/{data,config,logs}

DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

cat > ${BASE_DIR}/.env <<ENVFILE
ANTHROPIC_API_KEY=${ANTHROPIC_KEY}
DB_PASSWORD=${DB_PASSWORD}
ENVFILE

chmod 600 ${BASE_DIR}/.env

cat > ${BASE_DIR}/docker-compose.yml <<COMPOSEFILE
version: '3.8'
services:
  openclaw-${TENANT_ID}:
    image: localhost:5000/chciai/openclaw:latest
    container_name: openclaw-${TENANT_ID}
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - OPENCLAW_STATE_DIR=/app/state
    volumes:
      - ./data:/app/state:rw
    networks:
      - chciai-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
networks:
  chciai-network:
    external: true
COMPOSEFILE

cd ${BASE_DIR}
docker-compose up -d

cat > /opt/chciai/infrastructure/nginx/conf.d/${TENANT_ID}.conf <<NGINXCONF
upstream openclaw-${TENANT_ID} {
    server openclaw-${TENANT_ID}:18789;
}
server {
    listen 80;
    server_name ${TENANT_ID}.chciai.cz;
    location / {
        proxy_pass http://openclaw-${TENANT_ID};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINXCONF

docker exec chciai-proxy nginx -s reload 2>/dev/null || echo "Nginx reload OK"

echo "Tenant ${TENANT_ID} created!"
echo "Dashboard: http://${TENANT_ID}.chciai.cz"
ADDSCRIPT

chmod +x ${CHCIAI_DIR}/infrastructure/scripts/add-tenant.sh

# Create symlinks
ln -sf ${CHCIAI_DIR}/infrastructure/scripts/add-tenant.sh /usr/local/bin/chciai-add

# Step 9: Firewall
echo "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 9000/tcp comment 'Portainer'
ufw --force enable

# Step 10: Start infrastructure
echo "Starting infrastructure..."
cd ${CHCIAI_DIR}/infrastructure
$COMPOSE_CMD up -d

echo ""
echo "================================================"
echo "Installation Complete!"
echo "================================================"
echo ""
echo "Portainer: http://$(hostname -I | awk '{print $1}'):9000"
echo ""
echo "Build OpenClaw: /opt/chciai/build/build-openclaw.sh"
echo "Add tenant: chciai-add <id> <key>"
echo ""
echo "Done!"
