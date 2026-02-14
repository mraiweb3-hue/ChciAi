# WEDOS Deployment - ChciAI.cz

## Proč WEDOS místo Vercelu?
- ✅ Už zaplaceno (do 11.02.2027)
- ✅ Plná kontrola
- ✅ Spolehlivé
- ✅ FTP přístup
- ✅ Vercel má problémy s našim setupem

---

## 🎯 Co nahrajeme:

1. **Static files** z `frontend/build/` na WEDOS
2. **Backend API** na Railway/Render (zdarma)
3. **Domain** chciai.cz už je nastavena

---

## 📁 WEDOS FTP Přístup:

```
Host: w392188@392188.w88.wedos.net
User: w392188
Password: [v WEDOS-INFO.md]
Port: 21 (FTP) nebo 22 (SFTP)
```

---

## 🚀 Deployment kroky:

### 1) Build frontend lokálně:
```bash
cd /root/clawd/ChciAi/frontend
npm run build
```

### 2) Upload na WEDOS přes FTP:
```bash
cd build
lftp -u w392188 w392188@392188.w88.wedos.net
cd www  # nebo public_html
mirror -R . .
quit
```

### 3) Test:
- https://www.chciai.cz/ → měl by fungovat!

---

## 🔧 Backend API (Railway):

1. Vytvoř account: https://railway.app/
2. New Project → Deploy from GitHub → ChciAi
3. Root Directory: `backend/`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Environment Variables:
   - OPENAI_API_KEY=...
   - ELEVENLABS_API_KEY=...

Railway ti dá URL např: `chciai-backend-production.railway.app`

---

## 🔗 Propojení:

V `frontend/.env`:
```
REACT_APP_API_URL=https://chciai-backend-production.railway.app
```

Rebuild → upload na WEDOS → HOTOVO!

---

## 💰 Náklady:

- WEDOS: 0 Kč (už zaplaceno)
- Railway: 0 Kč (free tier: $5 kredit měsíčně)
- OpenAI: jen dle spotřeby
- ElevenLabs: od $5/měsíc

**Celkem: ~$5-10/měsíc** (levnější než Vercel Pro!)

---

## ✅ Výhody tohoto setupu:

- ✅ Spolehlivé (WEDOS má 99.9% uptime)
- ✅ Rychlé (české servery)
- ✅ Levné (využíváme co už máme)
- ✅ Škálovatelné (Railway zvládne i tisíce requestů)

---

*Aktualizováno: 2026-02-14*
