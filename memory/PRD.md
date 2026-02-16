# Chci AI - PRD (Product Requirements Document)

## Original Problem Statement
Build CHCIAI as AI transformation agency with:
1. 7-step collaboration model (PŘITAŽENÍ → DIAGNOSTIKA → NASAZENÍ → PERSONALIZACE → VZDĚLÁVÁNÍ → SPUŠTĚNÍ → RŮST)
2. Clawix as professional sales AI assistant with qualification logic
3. Client onboarding dashboard
4. Academy with video modules
5. Security-first approach with trust badges
6. Multi-tenant SaaS-ready architecture

## Clawix System Prompt
Clawix je profesionální digitální zaměstnanec společnosti CHCIAI.
- Klidný, profesionální, srozumitelný, sebevědomý
- Zjišťuje: obor, velikost firmy, hlavní problém, technickou úroveň
- Nabízí varianty: Online (990 Kč) / Osobní instalace (4.990 Kč)
- Buduje důvěru a dlouhodobý vztah

## Architecture
- **Frontend**: React.js with Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Multi-tenant ready**: Separate instances, separate databases

## User Personas
1. **Podnikatel začátečník** - Technicky méně zdatný, potřebuje osobní variantu
2. **Technicky zdatný podnikatel** - Zvládne online variantu sám
3. **Rostoucí firma** - Potřebuje škálovat automatizaci

## What's Been Implemented

### Landing Page Sections
- ✅ Hero s 3D logem "Chci AI" a typewriter efektem
- ✅ Statistiky (500+ klientů, 1200+ AI, 24/7, 98%)
- ✅ "Poznejte Clawixe" - 6 feature cards
- ✅ "Jak spolupráce probíhá" - 7-krokový vizuální proces
- ✅ "Bezpečnost na prvním místě" - 6 security features + trust badges
- ✅ FAQ sekce - 5 otázek s accordion
- ✅ Ceník - Základ vs Růst

### Clawix Chatbot
- ✅ Profesionální úvodní zpráva
- ✅ Kvalifikační flow (obor, velikost, problém, tech úroveň)
- ✅ Automatická doporučení variant
- ✅ Response handling pro různé dotazy
- ✅ Lead ukládání do MongoDB

### Backend Endpoints
- ✅ `POST /api/clawix/callback` - Callback request
- ✅ `POST /api/clawix/callback/action` - Cancel/Reschedule
- ✅ `POST /api/leads` - Create qualified lead
- ✅ `GET /api/leads` - List leads (admin)
- ✅ `POST /api/onboarding/start` - Start onboarding
- ✅ `GET /api/onboarding/status` - Get status
- ✅ `PUT /api/onboarding/update` - Update progress
- ✅ `GET /api/academy/modules` - Get modules
- ✅ `POST /api/academy/progress/{id}` - Mark complete
- ✅ `GET /api/admin/stats` - Admin dashboard stats
- ✅ `GET /api/seo/structured-data` - SEO JSON-LD

### Pages
- ✅ `/` - Landing page
- ✅ `/auth` - Login/Register
- ✅ `/client-onboarding` - Onboarding dashboard
- ✅ `/academy` - Learning modules
- ✅ `/dashboard` - Main dashboard
- ✅ `/chatbots` - Chatbot management
- ✅ `/leads` - Leads management

### Security Features
- End-to-end šifrování
- Vlastnictví dat
- Oddělené instance
- Audit log
- GDPR Compliance
- Open Source základ

## Files Structure
```
/frontend/src/
├── components/
│   ├── Logo3D.js
│   ├── ClawixCallbackForm.js
│   ├── ChatbotWidget.js (with qualification logic)
│   ├── ProcessSteps.js (7-step process)
│   ├── SecuritySection.js
│   ├── ThemeToggle.js
│   └── ...
├── pages/
│   ├── LandingPage.js
│   ├── ClientOnboardingPage.js
│   ├── AcademyPage.js
│   └── ...
└── contexts/
    └── ThemeContext.js

/backend/
├── server.py (all endpoints)
└── models.py
```

## MongoDB Collections
- `clients` - User accounts
- `leads` - Qualified leads from chatbot
- `clawix_callbacks` - Callback requests
- `onboarding` - Client onboarding progress
- `academy_progress` - Module completion tracking
- `content_sections` - Dynamic content

## Pricing
- **Online varianta**: 990 Kč - Video školení, dokumentace, online podpora
- **Osobní instalace**: 4.990 Kč - AI Audit, kompletní nastavení, Vibe Coding školení

## Recent Updates (Feb 2025)
- ✅ Fixed GitHub Actions CI/CD workflow (`/.github/workflows/deploy.yml`)
  - Changed cache from `npm` to `yarn`
  - Changed `cache-dependency-path` from `frontend/package-lock.json` to `frontend/yarn.lock`
  - Set Node.js version to `20` (compatible with @craco/craco)

## Next Tasks (Prioritized Backlog)

### P0 (Critical)
- ✅ CI/CD workflow fix - COMPLETED

### P1 (High)
- SMS provider integration (Twilio) for callback notifications
- Clawix voice service integration (when ready)
- Video content for academy modules

### P2 (Medium)
- Admin dashboard for leads/callbacks management
- Email notifications
- Analytics dashboard
- More academy modules

### P3 (Future SaaS)
- Multi-tenant isolation
- Subscription billing
- Custom domains
- White-label options
