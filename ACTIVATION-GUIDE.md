# Aktivační Návod - VPS Auto-Installation

## 🎯 CÍLE:

Při registraci klienta se **automaticky** spustí instalace OpenClaw na VPS.
Klient počká ~2 minuty a pak má funkční OpenClaw.

---

## ✅ KROK 1: SSH KEY SETUP (KRITICKÉ!)

VPS musí povolit SSH připojení z Vercel bez hesla.

### Na VPS (46.28.111.185):

```bash
# Připoj se jako root
ssh root@46.28.111.185

# Zkontroluj authorized_keys
cat ~/.ssh/authorized_keys

# Pokud je prázdný nebo neexistuje, přidej Vercel key
# (Vercel používá shared runners, takže můžeme použít passwordless nebo specifický key)
```

### Doporučený přístup:

**Možnost A: Passwordless SSH (jednodušší):**
```bash
# Na tvém lokálním PC (kde máš přístup k VPS):
ssh-copy-id root@46.28.111.185

# Nebo manuálně:
cat ~/.ssh/id_rsa.pub | ssh root@46.28.111.185 "cat >> ~/.ssh/authorized_keys"
```

**Možnost B: Specific key pro Vercel:**
```bash
# Vygeneruj nový key pair:
ssh-keygen -t rsa -b 4096 -C "vercel@chciai.cz" -f vercel_key

# Přidej public key na VPS:
cat vercel_key.pub | ssh root@46.28.111.185 "cat >> ~/.ssh/authorized_keys"

# Private key dej do Vercel Environment Variables jako:
VPS_SSH_KEY="-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----"
```

### Test:
```bash
# Z lokálního PC:
ssh -o StrictHostKeyChecking=no root@46.28.111.185 "echo SSH OK"

# Mělo by vypsat "SSH OK" bez hesla
```

---

## ✅ KROK 2: VERCEL ENVIRONMENT VARIABLES

Jdi do Vercel Dashboard:
1. https://vercel.com/chci-ais-projects/chciai.cz
2. Settings → Environment Variables

### Přidej:

```
ENABLE_VPS_INSTALL=true
```

**(Optional - pokud chceš custom config):**
```
VPS_HOST=46.28.111.185
VPS_USER=root
VPS_INSTALL_SCRIPT=/opt/chciai/scripts/install-openclaw.sh
```

### Potvrď:
- ✅ Production environment
- ✅ Apply changes

### Redeploy:
```bash
cd /root/clawd/chciai.cz
vercel deploy --prod
```

---

## ✅ KROK 3: TEST NA VPS (Manual)

Před spuštěním auto-instalace, otestuj manuálně:

```bash
ssh root@46.28.111.185

# Test install scriptu:
bash /opt/chciai/scripts/install-openclaw.sh test_manual 9001 test@manual.cz

# Počkej ~2 minuty, pak check:
docker ps | grep openclaw_test_manual

# Mělo by ukázat:
# openclaw_test_manual   Up X seconds   0.0.0.0:9001->8080/tcp

# Test přístupu:
curl http://localhost:9001

# Mělo by vrátit něco (HTML nebo JSON response)

# Cleanup:
docker rm -f openclaw_test_manual
rm -rf /opt/chciai/openclaw-instances/test_manual
```

**Pokud tohle funguje → Auto-instalace bude fungovat! ✅**

---

## ✅ KROK 4: TEST REGISTRACE (Production)

1. Jdi na: https://chciaicz.vercel.app/signup
2. Zaregistruj test účet:
   - Email: test.auto@chciai.cz
   - Heslo: test1234
   - Jméno, firma: cokoliv

3. **Sleduj Vercel logs:**
   - https://vercel.com/chci-ais-projects/chciai.cz
   - Functions → Recent Deployments → Logs

4. **Očekávané logy:**
   ```
   ✅ Client registered: test.auto@chciai.cz
   🚀 Starting OpenClaw installation for: client_xyz
   📡 Executing: ssh root@46.28.111.185 'bash /opt/chciai/scripts/install-openclaw.sh ...'
   ✅ OpenClaw installed for client_xyz: http://46.28.111.185:9001
   ```

5. **Jdi do dashboardu:**
   - Měl bys vidět:
     - ✅ "Kontroluji OpenClaw..." (chvilku)
     - Pak buď:
       - ✅ Card zmizí (running - úspěch!)
       - ⚠️ Warning card (stopped - instalace selhala)

---

## 🐛 TROUBLESHOOTING:

### **Problém: SSH connection failed**

**Příčina:** Vercel nemá přístup k VPS

**Fix:**
```bash
# Check SSH z Vercel:
# V Vercel Dashboard → Settings → Environment Variables
# Přidej debug log v kódu:

console.log('Testing SSH...')
const { stdout } = await execAsync('ssh -v root@46.28.111.185 "echo OK"')
console.log('SSH result:', stdout)
```

**Alternativa:**
- Použij SSH passwordless auth
- Nebo přidej VPS_SSH_KEY do environment

---

### **Problém: Install script not found**

**Příčina:** Script neexistuje nebo není executable

**Fix:**
```bash
ssh root@46.28.111.185
ls -la /opt/chciai/scripts/install-openclaw.sh

# Mělo by ukázat:
# -rwxr-xr-x 1 root root ... install-openclaw.sh

# Pokud není executable:
chmod +x /opt/chciai/scripts/install-openclaw.sh
```

---

### **Problém: Docker error**

**Příčina:** Docker není spuštěný nebo má issues

**Fix:**
```bash
ssh root@46.28.111.185
systemctl status docker

# Pokud není spuštěný:
systemctl start docker
systemctl enable docker

# Check:
docker ps
```

---

### **Problém: Port already in use**

**Příčina:** Port je obsazený jiným procesem

**Fix:**
```bash
# Check co běží na portu:
netstat -tuln | grep 9001

# Kill process:
fuser -k 9001/tcp

# Nebo použij jiný port v databázi
```

---

## 📊 MONITORING:

### **Check všechny běžící instalace:**
```bash
ssh root@46.28.111.185 'docker ps --filter "name=openclaw_"'
```

### **Check logs konkrétní instalace:**
```bash
ssh root@46.28.111.185 'docker logs openclaw_CLIENT_ID'
```

### **Check Vercel function logs:**
https://vercel.com/chci-ais-projects/chciai.cz → Functions → Logs

---

## ✅ SUCCESS CHECKLIST:

Po úspěšném testu:

- [ ] SSH z Vercel na VPS funguje
- [ ] Manual install script funguje
- [ ] ENABLE_VPS_INSTALL=true v Vercel
- [ ] Test registrace proběhla
- [ ] Vercel logy ukazují úspěšnou instalaci
- [ ] Dashboard zobrazuje "OpenClaw running"
- [ ] Klient může otevřít OpenClaw URL

---

## 🚀 READY TO GO!

**Až všechny checklisty proběhnou ✅ → SYSTÉM JE LIVE!**

Klienti se budou registrovat a dostanou funkční OpenClaw za 2 minuty!

---

Martin: Postupuj podle tohoto návodu. Začni KROKEM 1 (SSH setup). Dej mi vědět kde se zastavíš! 💪
