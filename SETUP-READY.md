# ✅ Setup Script Ready!

## 📦 Co je hotové:

**File:** `setup-infrastructure.sh` vytvořený a commited!

## 🚀 Jak ho spustit na VPS:

### **Z VPS (Termius):**
```bash
curl -fsSL https://raw.githubusercontent.com/mraiweb3-hue/ChciAi/main/setup-infrastructure.sh | sudo bash
```

### **Nebo manuálně:**
```bash
# Stáhni
wget https://raw.githubusercontent.com/mraiweb3-hue/ChciAi/main/setup-infrastructure.sh

# Spusť
sudo bash setup-infrastructure.sh
```

---

## 📋 Co script dělá:

1. ✅ Instaluje Docker, Docker Compose, Nginx, UFW
2. ✅ Vytváří directory strukturu `/opt/chciai/`
3. ✅ Nastavuje firewall (porty 22, 80, 443)
4. ✅ Vytváří Docker network `chciai-network`
5. ✅ Spouští Nginx reverse proxy
6. ✅ Vytváří management skripty:
   - `add-tenant.sh` - přidat nového klienta
   - `manage-tenant.sh` - start/stop/logs/backup
   - `list-tenants.sh` - seznam všech klientů

---

## ⚠️ PUSH FAILED - Udělej to manuálně:

```bash
cd /root/clawd/ChciAi
git add setup-infrastructure.sh
git commit -m "Add setup script"
git push origin main
```

Nebo použij GitHub Desktop / web interface k uploadu souboru.

---

## 🧪 Po instalaci:

### **1. Vytvoř prvního klienta:**
```bash
/opt/chciai/scripts/add-tenant.sh client1 test@chciai.cz
```

### **2. Zobraz seznam:**
```bash
/opt/chciai/scripts/list-tenants.sh
```

### **3. Sleduj logy:**
```bash
/opt/chciai/scripts/manage-tenant.sh logs client1
```

---

**Martine, pushni `setup-infrastructure.sh` do GitHubu a pak ho spustíme na VPS!** 🚀
