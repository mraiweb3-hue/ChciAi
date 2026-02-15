# ChciAI / OpenClaw - PRD

## Original Problem Statement
Uživatel chtěl opravit a zprovoznit aplikaci z GitHubu https://github.com/mraiweb3-hue/ChciAi

## Architecture

### Tech Stack
- **Frontend**: React.js + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI Chat**: Claude Sonnet 4.5 (via Emergent LLM key) s Gemini fallback
- **Auth**: JWT tokens + bcrypt

### Key Files
- `/app/backend/server.py` - Main FastAPI server
- `/app/backend/auth.py` - JWT authentication
- `/app/backend/ai_service.py` - AI chat integration
- `/app/backend/models.py` - Pydantic models
- `/app/frontend/src/pages/LandingPage.js` - Marketing landing page
- `/app/frontend/src/contexts/AuthContext.js` - Auth state management

## Core Features (Implemented)
- [x] Landing page s callback formulářem
- [x] Meeting request formulář
- [x] User registration & login
- [x] JWT authentication
- [x] Dashboard (protected routes)
- [x] Chatbot management CRUD
- [x] Widget chat API s AI odpověďmi
- [x] Leads collection
- [x] Conversations history
- [x] GDPR compliance endpoints

## What's Working (2026-02-15)
- ✅ Landing page plně funkční
- ✅ Callback formulář ukládá do DB
- ✅ Auth (register/login) funguje
- ✅ JWT tokens validace
- ✅ AI chat service (Claude + Gemini fallback)
- ✅ Dashboard protected routes

## Environment Variables Required
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=chciai_database
EMERGENT_LLM_KEY=sk-emergent-xxx
JWT_SECRET=your-secret-key
```

## Next Steps
1. Deploy na produkční server
2. Ověřit doménu v Resend pro emaily
3. Nastavit Retell.ai pro AI hovory
