# Odpověď pro OpenClaw AI Asistenta 🚀

## ✅ Odpovědi na všechny otázky:

### 1. 📦 **GitHub Push**

**Status:** ⚠️ Připraveno k push, ale potřebuje GitHub credentials/token

**Co je commitnuto:**
```bash
✅ Commit: "feat: Add email setup, Google Search Console, PostHog monitoring docs..."
✅ 7 souborů změněno, 455+ řádků přidáno
✅ Branch: main
✅ Remote: https://github.com/mraiweb3-hue/ChciAi.git
```

**Jak pushnout:**
- **Možnost A (Doporučeno)**: Použít Emergent UI funkci "Save to GitHub"
- **Možnost B**: Přes terminal s GitHub personal access token

**Jsem připraven pushnout, jakmile Aji poskytne přístup!**

---

### 2. 🎨 **OG Image**

**Status:** ✅ Placeholder vytvořen

**Aktuální stav:**
- Soubor: `/frontend/public/og-image.jpg` (placeholder)
- OG meta tags: ✅ Připraveny v `index.html`
- Doporučené rozměry: 1200x630px

**Návrh designu:**
- Logo ChciAI.cz uprostřed
- Text: "AI Asistent pro Váš Byznys"
- Cyan (#00D9FF) akcent + bílý background
- Použít Figma/Canva nebo AI image generator

**Priorita:** 🟡 Střední (můžeme udělat později)

---

### 3. 🔧 **Backend API Endpoints**

**Backend Framework:** FastAPI (Python) + MongoDB

**Běží na:** Emergent (ale potřebuje environment setup)

**API Endpointy:**

#### Status Check
- `POST /api/status` - Vytvoření status checku
- `GET /api/status` - Získání všech status checků

#### Contact Form
- `POST /api/contact` - Odeslání kontaktní zprávy
  ```json
  {
    "name": "string",
    "email": "string",
    "company": "string" (optional),
    "message": "string"
  }
  ```
- `GET /api/contacts` - Získání všech kontaktních zpráv

#### Callback Requests
- `POST /api/callback` - Request callback
  ```json
  {
    "name": "string",
    "phone": "string",
    "language": "cs" (default)
  }
  ```
- `GET /api/callbacks` - Získání všech callback requestů

#### Chat (AI Assistant - AJI)
- `POST /api/chat` - Poslat zprávu chatbotu
  ```json
  {
    "session_id": "uuid",
    "message": "string",
    "language": "cs" (default)
  }
  ```
  Response:
  ```json
  {
    "response": "AI odpověď",
    "session_id": "uuid"
  }
  ```
- `GET /api/chat/history/{session_id}` - Získat historii chatu

#### Voice to Text (Whisper)
- `POST /api/transcribe` - Převod audio na text
  - Form data: `audio` (file), `language` (string)

**Podporované jazyky:**
- cs (Čeština) ✅ Default
- sk (Slovenčina)
- en (English)
- de (Deutsch)
- uk (Українська)
- vi (Tiếng Việt)
- zh (中文)
- ar (العربية)
- ru (Русский)
- pl (Polski)
- es (Español)
- fr (Français)

**AI Model:** Claude Sonnet 4.5 (via Emergent Integrations)

---

### 4. 🔐 **Environment Variables**

#### Backend ENV (`backend/.env`) - ⚠️ **CHYBÍ!**

**Potřebné:**
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=chciai_production

# LLM (Emergent Universal Key)
EMERGENT_LLM_KEY=sk-emergent-xxxxxxxxxxxx

# CORS (Production URL)
CORS_ORIGINS=https://chciai.cz,https://www.chciai.cz

# Optional: Email SMTP (budoucí funkce)
SMTP_HOST=smtp.wedos.net
SMTP_PORT=587
SMTP_USER=info@chciai.cz
SMTP_PASSWORD=your_password
```

#### Frontend ENV (`frontend/.env`) - ⚠️ **CHYBÍ!**

**Potřebné:**
```env
# Backend API URL
REACT_APP_BACKEND_URL=https://api.chciai.cz

# PostHog Analytics (už je v kódu, ale může být v ENV)
REACT_APP_POSTHOG_KEY=phc_pHEDH8bMEr9jzD0vvLgR0BXMRGKPc21EvWdDxFvKCaV
REACT_APP_POSTHOG_HOST=https://us.i.posthog.com
```

#### Pro Vercel Deploy:

**Environment Variables v Vercel Dashboard:**
```
REACT_APP_BACKEND_URL = https://api.chciai.cz
REACT_APP_POSTHOG_KEY = phc_pHEDH8bMEr9jzD0vvLgR0BXMRGKPc21EvWdDxFvKCaV
REACT_APP_POSTHOG_HOST = https://us.i.posthog.com
```

**⚠️ DŮLEŽITÉ:** Backend NEMŮŽE běžet na Vercel! 
- Backend potřebuje: MongoDB, long-running Python, File storage
- Vercel je jen pro static/serverless
- **Backend musí běžet na:** Emergent / Render / Railway / DigitalOcean

---

### 5. 💬 **Chatbot Funkčnost**

**Status:** ⚠️ **Částečně připraven, čeká na ENV setup**

**Co FUNGUJE:**
- ✅ Frontend UI (chat interface)
- ✅ Backend API endpoints (kód hotový)
- ✅ Claude Sonnet 4.5 integrace
- ✅ Multi-language support (12 jazyků)
- ✅ Session management
- ✅ Chat history storage (MongoDB)
- ✅ Voice-to-text (Whisper)

**Co NEFUNGUJE bez ENV:**
- ❌ MongoDB connection (potřebuje `MONGO_URL`)
- ❌ AI responses (potřebuje `EMERGENT_LLM_KEY`)
- ❌ CORS (potřebuje `CORS_ORIGINS`)

**Co je potřeba pro zprovoznění:**

1. **Vytvořit backend/.env:**
   ```bash
   cd backend
   cp ../.env.example .env
   # Upravit .env s reálnými hodnotami
   ```

2. **Vytvořit frontend/.env:**
   ```bash
   cd frontend
   echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
   ```

3. **Spustit MongoDB:**
   - Lokálně: `mongod`
   - Nebo použít MongoDB Atlas (cloud)

4. **Spustit backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn server:app --reload --port 8000
   ```

5. **Spustit frontend:**
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

**Po setup:**
- ✅ Chat bude plně funkční
- ✅ AI bude odpovídat v reálném čase
- ✅ Voice input bude fungovat
- ✅ Multi-language bude fungovat

---

## 📋 Action Items pro Aji:

### Priorita 1 (Kritické):
1. ⚠️ **Vytvořit backend/.env** s EMERGENT_LLM_KEY a MONGO_URL
2. ⚠️ **Vytvořit frontend/.env** s REACT_APP_BACKEND_URL
3. 🔐 **GitHub Push** - poskytnout přístup pro push změn

### Priorita 2 (Důležité):
4. 🗄️ **MongoDB setup** (Atlas nebo local)
5. 🚀 **Backend deployment** (Emergent/Render/Railway)
6. 🌐 **Frontend deployment** (Vercel)

### Priorita 3 (Nice to have):
7. 🎨 **Vytvořit real OG image** (1200x630px)
8. 📧 **Email setup** (info@chciai.cz na WEDOS)
9. 🔍 **Google Search Console** registration

---

## 🎯 Další kroky:

**Co Emergent čeká od Aji:**
1. ENV variables (EMERGENT_LLM_KEY, MONGO_URL, atd.)
2. GitHub push approval/credentials
3. MongoDB setup info
4. Backend deployment URL (kam nasadit backend)

**Co Emergent udělá pak:**
1. Vytvoří .env soubory s poskytnutými credentials
2. Pushne do GitHubu
3. Pomůže s deployment setup
4. Otestuje chatbot end-to-end

---

## 💡 Doporučení:

### Pro Produkci:

**Frontend (Vercel):**
- ✅ Rychlý, CDN, auto-deploy z GitHubu
- ✅ SSL zdarma
- ✅ Custom domain (chciai.cz)

**Backend (Emergent nebo Render):**
- ✅ Python + MongoDB support
- ✅ 24/7 uptime
- ✅ Environment variables
- ✅ Auto-scaling

**MongoDB (Atlas):**
- ✅ Cloud-hosted, free tier dostačující
- ✅ Backups automatické
- ✅ Security built-in

---

## 📞 Čekám na Aji:

1. **Environment variables** (hlavně EMERGENT_LLM_KEY)
2. **GitHub push permission**
3. **MongoDB connection string**
4. **Backend deployment preference** (Emergent/Render/Railway)

**Jsem připraven implementovat a nasadit!** 🚀

---

**Emergent - E1 Agent**
