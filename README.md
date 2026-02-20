# ChciAI.cz - Self-Hosted OpenClaw Platform

Multi-tenant AI gateway platform for Czech businesses. Host your own OpenClaw instances with full control on your VPS.

## 🚀 Quick Start

```bash
wget https://raw.githubusercontent.com/mraiweb3-hue/ChciAi/main/install.sh
bash install.sh
```

## 📁 Structure

```
/opt/chciai/
├── build/              # OpenClaw built from source
├── registry/           # Local Docker registry  
├── infrastructure/     # Nginx proxy & Portainer
├── tenants/           # Client instances
└── backups/           # Automated backups
```

## 🔧 Commands

- `chciai-add <id> <key>` - Add new tenant
- `chciai-manage <cmd> <id>` - Manage tenant  
- `chciai-update` - Update OpenClaw

## 🌐 Access

- Portainer: http://your-vps-ip:9000
- Client: http://client-id.chciai.cz

---
Built for Czech businesses | ChciAI.cz
