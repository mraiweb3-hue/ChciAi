# ChciAI.cz - AI Asistent pro České Firmy 🤖

Moderní AI asistent postavený na React a FastAPI, specializovaný na automatizaci komunikace pro české firmy.

## 🚀 Funkce

- ✅ AI chatbot s GPT-4 integrací
- ✅ Automatizace zákaznické podpory 24/7
- ✅ Responzivní design (mobile-first)
- ✅ PostHog analytics
- ✅ SEO optimalizace
- ✅ WhatsApp integrace (připraveno)

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- PostHog Analytics
- Lucide Icons

### Backend
- FastAPI (Python)
- OpenAI GPT-4
- CORS middleware
- Async/await architecture

## 📋 Požadavky

- Node.js 18+
- Python 3.11+
- OpenAI API klíč

## 🔧 Instalace

### 1. Naklonujte repozitář

```bash
git clone https://github.com/your-username/chciai-new.git
cd chciai-new
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# nebo
yarn install
```

### 3. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### 4. Nastavení Environment Variables

```bash
# Zkopírujte .env.example
cp .env.example backend/.env

# Upravte backend/.env a přidejte své API klíče:
OPENAI_API_KEY=sk-...
```

## 🚀 Spuštění

### Development

#### Frontend (Terminal 1)
```bash
cd frontend
npm start
# nebo
yarn start
```
Otevře se na `http://localhost:3000`

#### Backend (Terminal 2)
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```
API běží na `http://localhost:8000`

### Production Build

```bash
cd frontend
npm run build
# Build je v ./build/
```

## 📁 Struktura Projektu

```
chciai-new/
├── frontend/                # React aplikace
│   ├── public/             # Statické soubory
│   │   ├── index.html
│   │   ├── sitemap.xml
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/     # React komponenty
│   │   ├── App.js          # Hlavní aplikace
│   │   └── index.js        # Entry point
│   └── package.json
├── backend/                 # FastAPI server
│   ├── server.py           # API endpoints
│   └── requirements.txt
├── memory/                  # Dokumentace
│   └── PRD.md              # Product Requirements
├── .env.example            # Environment variables template
└── README.md               # Tento soubor
```

## 🌐 Deployment

### Frontend na Vercel

```bash
cd frontend
vercel deploy
```

### Backend na Render/Railway

1. Připojte GitHub repozitář
2. Nastavte environment variables
3. Deploy

## 📊 Analytics & Monitoring

- **PostHog**: User behavior tracking
- **Google Search Console**: SEO monitoring
- Logs dostupné v konzoli

## 📧 Kontakt & Podpora

- Web: [chciai.cz](https://chciai.cz)
- Email: info@chciai.cz
- Autoři: Martin & Aji

## 📝 Dokumentace

Další dokumentace v repozitáři:

- `EMAIL-SETUP.md` - Nastavení emailu
- `GOOGLE-SEARCH-CONSOLE.md` - SEO setup
- `POSTHOG-ANALYTICS.md` - Analytics monitoring
- `DEPLOYMENT-CHECKLIST.md` - Deployment checklist

## 🔒 License

Proprietary - ChciAI.cz

## 🎯 Roadmap

- [ ] WhatsApp bot integrace
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] CRM integrace
- [ ] Voice AI support

---

Made with ❤️ in Czech Republic 🇨🇿

