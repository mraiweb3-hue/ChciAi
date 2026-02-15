# OpenClaw - PRD (Product Requirements Document)

## Original Problem Statement
Uživatel chtěl zprovoznit funkce na webu chciai.cz:
1. Odesílání formulářů
2. Požadavek na hovor od AI asistenta
3. AI Chat asistent

## Architecture

### Tech Stack
- **Frontend**: React.js + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI Chat**: OpenAI GPT-4o (via Emergent LLM key)
- **Emails**: Resend API
- **AI Calls**: Retell.ai (prepared for integration)

### Key Files
- `/app/backend/server.py` - FastAPI backend s API endpoints
- `/app/frontend/src/App.js` - React frontend komponenty
- `/app/frontend/src/App.css` - Styling

## User Personas
1. **Podnikatel** - hledá AI automatizaci pro svůj byznys
2. **Návštěvník** - chce zjistit více o službách OpenClaw
3. **Zájemce** - chce kontaktovat firmu nebo si nechat zavolat

## Core Requirements (Static)
- [x] Landing page s popisem služeb OpenClaw
- [x] AI Chat asistent (česky)
- [x] Kontaktní formuláře
- [x] Žádost o zavolání (AI/Lidský operátor)
- [x] Responzivní design
- [x] Dark theme UI

## What's Been Implemented

### 2025-02-15
- ✅ Kompletní landing page OpenClaw
- ✅ AI Chat widget (GPT-4o, česky)
- ✅ Kontaktní formulář s ukládáním do DB
- ✅ Callback modal s výběrem AI/Human
- ✅ AI Call endpoint (/api/ai-call)
- ✅ Email notifikace (vyžaduje ověření domény)
- ✅ Backend API endpoints (health, chat, contact, callback, ai-call)

## Current Status

### Funkční (100%)
- AI Chat asistent
- Všechny formuláře (ukládání do MongoDB)
- Callback modal s AI/Human výběrem
- Všechna API

### Vyžaduje konfiguraci
- **Emaily**: Ověření domény chciai.cz v Resend
- **AI Hovory**: Vytvoření agenta v Retell.ai dashboard

## Prioritized Backlog

### P0 (Critical)
- [PENDING] Ověření domény v Resend pro funkční emaily

### P1 (High)
- [PENDING] Konfigurace Retell.ai agenta pro AI hovory
- [PENDING] Přidání telefonního čísla v Retell.ai

### P2 (Medium)
- [ ] Analytics a tracking
- [ ] Admin dashboard pro správu kontaktů
- [ ] Historie hovorů z Retell.ai

### P3 (Low)
- [ ] Multi-language support
- [ ] A/B testing landing page
- [ ] SEO optimalizace

## Next Tasks
1. Ověřit doménu chciai.cz v Resend (DNS záznamy)
2. Vytvořit agenta v Retell.ai dashboard
3. Získat telefonní číslo od Retell.ai
4. Aktualizovat .env s RETELL_AGENT_ID a RETELL_FROM_NUMBER

## Environment Variables
```
RESEND_API_KEY=re_***
CONTACT_EMAIL=kontakt@chciai.cz
EMERGENT_LLM_KEY=sk-emergent-***
RETELL_API_KEY=key_***
RETELL_AGENT_ID= (čeká na konfiguraci)
RETELL_FROM_NUMBER= (čeká na konfiguraci)
```
