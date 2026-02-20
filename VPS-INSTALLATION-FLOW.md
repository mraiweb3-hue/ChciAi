# VPS Installation Flow - Jak funguje automatická instalace

## 🔄 COMPLETE FLOW:

### 1. **Registrace** (`/api/register`)
```
Klient vyplní formulář → POST /api/register
├── Vytvoří se účet v databázi
├── Přiřadí se unikátní port (9001-9999)
├── Status: "trial" (24h zdarma)
└── Spustí se instalace na pozadí (async)
```

### 2. **VPS Instalace** (`/lib/vps-installer.js`)
```
installOpenClawOnVPS(clientId, port, email)
├── SSH připojení k VPS (46.28.111.185)
├── Spustí install script: /opt/chciai/scripts/install-openclaw.sh
├── Vytvoří Docker kontejner: openclaw_${clientId}
├── Mapuje port: 9001-9999
└── Vrátí URL: http://46.28.111.185:PORT
```

**Čas: ~2 minuty**

### 3. **Dashboard Check** (`/dashboard`)
```
Dashboard načte klientská data
├── Zavolá /api/install-openclaw?email=... (GET)
├── Zkontroluje status: docker ps --filter name=openclaw_...
├── Pokud running → zobrazí "Otevřít OpenClaw"
└── Pokud stopped → zobrazí "Nainstalovat OpenClaw" button
```

### 4. **Manual Install** (fallback)
```
Pokud instalace při registraci selhala:
├── Dashboard zobrazí warning card
├── Klient klikne "Nainstalovat OpenClaw"
├── POST /api/install-openclaw { email }
└── Instalace proběhne ručně
```

---

## 🔐 BEZPEČNOST:

### 1. **Input Sanitization**
```javascript
// Všechny vstupy jsou sanitizovány
const sanitizedClientId = clientId.replace(/[^a-zA-Z0-9_-]/g, '')
const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/g, '')
```

### 2. **SSH Key Authentication**
```bash
# VPS má SSH klíč pro passwordless login
# Pouze z Vercel serverů (whitelisted IP)
ssh -o StrictHostKeyChecking=no root@46.28.111.185
```

### 3. **Docker Isolation**
```bash
# Každý klient má izolovaný kontejner
docker run -d \
  --name openclaw_${clientId} \
  --restart unless-stopped \
  -v /opt/chciai/openclaw-instances/${clientId}:/data \
  -p ${port}:8080 \
  clawdbot/clawdbot:latest
```

### 4. **Port Range Limit**
```javascript
// Pouze porty 9001-9999 povoleny
if (port < 9001 || port > 9999) {
  throw new Error('Invalid port number')
}
```

---

## 📊 STATUS MONITORING:

### Check OpenClaw Status:
```bash
# GET /api/install-openclaw?email=client@email.com
{
  "success": true,
  "clientId": "client_xyz",
  "url": "http://46.28.111.185:9001",
  "running": true,
  "status": "Up 5 minutes"
}
```

### VPS Commands:
```bash
# List all OpenClaw instances
docker ps --filter "name=openclaw_"

# Check specific client
docker ps --filter "name=openclaw_client_xyz"

# View logs
docker logs openclaw_client_xyz

# Stop instance (trial expired)
docker stop openclaw_client_xyz

# Start instance (after payment)
docker start openclaw_client_xyz

# Remove instance
docker rm -f openclaw_client_xyz
rm -rf /opt/chciai/openclaw-instances/client_xyz
```

---

## 🎯 USER EXPERIENCE:

### Ideální flow (vše funguje):
```
1. Registrace → "Instalace probíhá..."
2. [2 minuty čekání - automaticky na pozadí]
3. Dashboard → ✅ "OpenClaw je připravený!"
4. Klikne "Otevřít OpenClaw" → funguje okamžitě
```

### Pokud instalace selhala:
```
1. Registrace → úspěšná
2. Dashboard → ⚠️ "OpenClaw čeká na instalaci"
3. Klikne "Nainstalovat OpenClaw" → čeká 2 minuty
4. ✅ "Instalace dokončena!"
5. Klikne "Otevřít OpenClaw" → funguje
```

---

## 🔧 ENVIRONMENT VARIABLES:

Pro aktivaci VPS instalace:
```bash
# Vercel Environment Variables
ENABLE_VPS_INSTALL=true
VPS_HOST=46.28.111.185
VPS_USER=root
VPS_INSTALL_SCRIPT=/opt/chciai/scripts/install-openclaw.sh
```

---

## 🧪 TESTING:

### 1. Test registrace (local):
```bash
# Bez VPS instalace (dev mode)
npm run dev
# Zaregistruj se → instalace se přeskočí
```

### 2. Test s VPS instalací:
```bash
# Set env var
export ENABLE_VPS_INSTALL=true

# nebo v Vercel dashboard:
# Settings → Environment Variables → Add
ENABLE_VPS_INSTALL=true
```

### 3. Manual test na VPS:
```bash
ssh root@46.28.111.185
bash /opt/chciai/scripts/install-openclaw.sh test_001 9001 test@test.cz

# Check if running
docker ps | grep openclaw_test_001

# Test access
curl http://localhost:9001
```

---

## ⚠️ ERROR HANDLING:

### Možné chyby:

1. **SSH Connection Failed**
   - Check VPS is online
   - Verify SSH keys
   - Check firewall rules

2. **Docker Error**
   - Check Docker is running: `systemctl status docker`
   - Check disk space: `df -h`
   - Check logs: `docker logs openclaw_${clientId}`

3. **Port Already in Use**
   - Check: `netstat -tuln | grep ${port}`
   - Reassign different port
   - Update client record

4. **Installation Timeout**
   - Script takes >3 minutes
   - Check VPS resources
   - Check internet connection

---

## 📧 NOTIFICATIONS:

### Admin alerts (TODO):
```javascript
// Pokud instalace selže → email Martinovi
await sendAdminAlert({
  subject: 'OpenClaw Installation Failed',
  clientId,
  error: result.error,
  email: clientEmail,
})
```

### Client notifications (TODO):
```javascript
// Email klientovi když je ready
await sendEmail({
  to: clientEmail,
  subject: 'Váš OpenClaw je připravený!',
  body: `
    OpenClaw byl úspěšně nainstalován.
    
    Přejít do dashboardu: http://46.28.111.185:${port}
    
    Email: ${clientEmail}
    Heslo: (vaše zvolené heslo)
  `,
})
```

---

## 🚀 PRODUCTION CHECKLIST:

Před spuštěním production:

- [ ] SSH keys nakonfigurované na VPS
- [ ] Firewall pravidla (allow ports 9001-9999)
- [ ] Docker běží a je updated
- [ ] Install script tested manually
- [ ] Environment vars set v Vercel
- [ ] ENABLE_VPS_INSTALL=true
- [ ] Admin alert emails configured
- [ ] Client notification emails ready
- [ ] Monitoring setup (uptime checks)

---

Martin: Tohle je kompletní dokumentace! 🎯
