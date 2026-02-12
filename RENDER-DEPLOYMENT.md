# 🚀 Render.com Backend Deployment - Krok za Krokem

## ⚡ URGENTNÍ - Frontend čeká na backend!

**Frontend živý:** https://chciai.cz ✅
**Backend:** ❌ Potřebuje nasazení

---

## 📋 Postup (15 minut):

### Krok 1: Render.com Registrace (2 min)

1. Jděte na: **https://render.com/**
2. Klikněte **"Get Started"**
3. **Sign up with GitHub** (použijte účet mraiweb3-hue)
4. Autorizujte Render přístup k repozitářům

---

### Krok 2: Vytvoření Web Service (3 min)

1. V Render dashboardu klikněte **"New +"**
2. Vyberte **"Web Service"**
3. Najděte a vyberte repository: **mraiweb3-hue/ChciAi**
4. Klikněte **"Connect"**

---

### Krok 3: Konfigurace Služby (5 min)

**Základní nastavení:**
```
Name: chciai-backend
Region: Frankfurt (Europe)
Branch: main
Root Directory: backend
Runtime: Python 3
```

**Build & Deploy:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

**Instance Type:**
```
✅ Free (0 USD/měsíc)
```

---

### Krok 4: Environment Variables (5 min)

**Klikněte "Advanced" → "Add Environment Variable"**

Přidejte tyto proměnné:

```env
MONGO_URL
mongodb+srv://chciai_admin:Australie2026%2B@cluster0.kh2mmxq.mongodb.net/?retryWrites=true&w=majority

DB_NAME
chciai_production

EMERGENT_LLM_KEY
sk-emergent-bEcBa024324F8269f8

CORS_ORIGINS
https://chciai.cz,https://www.chciai.cz

PYTHON_VERSION
3.11.0
```

**⚠️ DŮLEŽITÉ:** Zkopírujte hodnoty přesně!

---

### Krok 5: Deploy! (Auto)

1. Klikněte **"Create Web Service"**
2. Render začne build (3-5 minut)
3. Sledujte logy v reálném čase
4. Počkejte na **"Live"** status ✅

---

## ✅ Po úspěšném deployi:

### Vaše Backend URL bude:
```
https://chciai-backend.onrender.com
```
(nebo jiný název pokud jste změnili)

### Test API:

**1. Health Check:**
```bash
curl https://chciai-backend.onrender.com/api/
```
Mělo by vrátit:
```json
{"message":"ChciAI API is running"}
```

**2. Chat Test:**
```bash
curl -X POST https://chciai-backend.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test-prod","message":"Ahoj!","language":"cs"}'
```
Mělo by vrátit AI odpověď v češtině.

---

## 📨 Co poslat OpenClaw/Emergent:

```
✅ Backend nasazený!
URL: https://chciai-backend.onrender.com
Status: Live
Test výsledky: API odpovídá správně
```

---

## 🔧 Troubleshooting:

### Problém: Build Failed
**Řešení:** Zkontrolujte logy, pravděpodobně:
- Chybějící requirements.txt
- Špatná cesta (Root Directory)

### Problém: MongoDB Connection Error
**Řešení:** Zkontrolujte:
- MONGO_URL je správně URL encoded (+ jako %2B)
- MongoDB Atlas IP whitelist (0.0.0.0/0)

### Problém: CORS Error
**Řešení:**
- CORS_ORIGINS obsahuje https://chciai.cz

---

## 🎯 Alternativní Řešení (pokud Render nefunguje):

### Railway.app (také free tier):

1. https://railway.app/
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Stejné ENV variables
5. Deploy

---

## ⏱️ Timeline:

- **0-2 min:** Registrace na Render
- **2-5 min:** Konfigurace služby
- **5-10 min:** ENV variables setup
- **10-15 min:** Build & Deploy
- **15+ min:** Testing

**Celkem: ~15 minut do live backendu!**

---

## 🔥 Po dokončení:

Pošlete backend URL Emergent agentovi, který:
1. Přidá URL do Vercel (frontend)
2. Redeployuje frontend
3. **Chatbot bude ŽIVÝ!** 🎉

---

**Držím palce! 💪**
