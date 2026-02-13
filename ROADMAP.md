# ChciAI.cz - Development Roadmap

## ✅ HOTOVO (Phase 0 - Foundation)
- [x] Minimální funkční verze webu
- [x] Vercel deployment
- [x] DNS + Email (MX záznamy)
- [x] Google Search Console
- [x] SEO základy (sitemap, robots.txt)

---

## 🚀 PHASE 1 - Core Features (TEĎKA)
**Cíl:** Plně funkční web s leadgen formuláři a AI chatbotem

### 1.1 Frontend - Moderní Design
- [ ] Lucide-react ikony (postupně, testovat každou)
- [ ] Framer-motion animace (fade-in, slide-in)
- [ ] Responzivní navbar (mobile hamburger menu)
- [ ] Hero s gradient textem a animacemi
- [ ] Sekce: Vibe Coding, OpenClaw, Služby, Use Cases, FAQ, Pricing
- [ ] Floating chat button (pravý dolní roh)
- [ ] Voice call button (levý dolní roh)

### 1.2 Lead Generation Formuláře
- [ ] **Callback Form** - "Zavolejte mi zpět"
  - Jméno, telefon, čas hovoru, jazyk
  - Validace (česká čísla, email format)
  - reCAPTCHA (spam ochrana)
  
- [ ] **Contact Form** - "Napište nám"
  - Jméno, email, zpráva
  - Kategorie (Chatbot, Voice AI, Custom)
  
- [ ] **Voice Call Form** - "AI Voice hovor TEĎKA"
  - Telefon, jazyk
  - Okamžité spuštění hovoru

### 1.3 AI Chatbot Widget
- [ ] Floating ikona (pravý dolní roh)
- [ ] Chat okno (expandable)
- [ ] Multi-language (cs/sk/en/de/uk/vi/zh/ar)
- [ ] Voice input (mikrofon tlačítko)
- [ ] Voice output (TTS odpovědi)
- [ ] Session tracking
- [ ] API endpoint: POST /api/chat
- [ ] Error handling (offline mode)

### 1.4 Backend API (Node.js/Express)
**Endpoints:**
```
POST /api/callback       → Uložit callback request
POST /api/contact        → Uložit kontakt zprávu
POST /api/voice/call     → Spustit ElevenLabs hovor
POST /api/chat           → AI chat odpověď
POST /api/speak          → TTS (text-to-speech)
POST /api/transcribe     → STT (speech-to-text)
GET  /api/admin/leads    → Seznam leads (auth)
GET  /api/admin/stats    → Statistiky (auth)
```

### 1.5 Database (MongoDB)
**Collections:**
- `leads` - callback requesty a kontakty
  - name, phone, email, language, type, timestamp, status
- `chat_sessions` - chat historie
  - session_id, messages[], language, timestamp
- `voice_calls` - voice call logy
  - phone, language, duration, transcript, timestamp

---

## 🎨 PHASE 2 - Advanced Features
**Cíl:** Blog, admin panel, analytics

### 2.1 Blog System
- [ ] `/blog` sekce
- [ ] Markdown články (nebo headless CMS)
- [ ] Kategorie: AI, Automatizace, Případové studie
- [ ] SEO optimalizace (meta tagy, schema)
- [ ] 10 úvodních článků:
  1. "Jak AI chatbot zvýší vaše tržby o 40%"
  2. "WhatsApp Business API - průvodce pro firmy"
  3. "Voice AI - budoucnost zákaznické podpory"
  4. "Vibe Coding: Vývoj bez kódu pomocí AI"
  5. "OpenClaw: Open-source AI infrastruktura"
  6. "5 způsobů jak automatizovat byznys v 2026"
  7. "ROI AI chatbotů - reálná čísla"
  8. "ElevenLabs vs Twilio Voice - porovnání"
  9. "GDPR a AI - co potřebujete vědět"
  10. "Případová studie: E-shop zvýšil konverze o 60%"

### 2.2 Admin Dashboard (`/admin`)
**Auth:** JWT token nebo API key
- [ ] Login stránka
- [ ] Dashboard přehled
  - Počet leads (dnes/týden/měsíc)
  - Konverze rate
  - Top jazyky
  - Graf návštěvnosti
- [ ] Leads tabulka (filtr, export CSV)
- [ ] Chat sessions (přehrát konverzace)
- [ ] Voice calls (přehrát nahrávky)
- [ ] Nastavení (API keys, languages, business hours)

### 2.3 Analytics & Tracking
- [ ] PostHog events
  - page_view, form_submit, chat_start, voice_call_start
  - Funnels: Visit → Chat → Form → Conversion
- [ ] A/B testing (různé CTA texty)
- [ ] Heatmapy (kam uživatelé klikají)

---

## 🔧 PHASE 3 - Integrations
**Cíl:** Propojení s real-world systémy

### 3.1 ElevenLabs Voice AI
- [ ] Account setup + API key
- [ ] Voice selection (český hlas)
- [ ] Conversational AI integration
- [ ] Webhook pro status hovoru
- [ ] Cost tracking (~$0.30/min)

### 3.2 WhatsApp Business API
- [ ] Twilio nebo Meta Business API
- [ ] QR code pro chat
- [ ] Automatické odpovědi
- [ ] Templates (potvrzení objednávky, připomenutí)
- [ ] 24/7 dostupnost

### 3.3 CRM Integration
- [ ] Export leads do Google Sheets (auto-sync)
- [ ] Webhook pro external CRM (HubSpot, Pipedrive)
- [ ] Email notifikace (nový lead → info@chciai.cz)

### 3.4 Payment Gateway (optional)
- [ ] Stripe nebo GoPay
- [ ] Pricing tiers (Starter/Pro/Enterprise)
- [ ] Subscription management
- [ ] Invoicing

---

## 🛡️ PHASE 4 - Production Hardening
**Cíl:** Bezpečnost, výkon, stabilita

### 4.1 Security
- [ ] Rate limiting (API abuse protection)
- [ ] reCAPTCHA v3 (spam bot ochrana)
- [ ] CORS properly configured
- [ ] Environment variables (secrets)
- [ ] HTTPS only (force SSL)
- [ ] CSP headers (already done)
- [ ] SQL injection protection (use ORM)

### 4.2 Performance
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting (dynamic imports)
- [ ] CDN for static assets
- [ ] Gzip compression
- [ ] Browser caching (max-age headers)
- [ ] Lighthouse score >90

### 4.3 Monitoring
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Log aggregation (LogTail)
- [ ] Performance monitoring (Web Vitals)
- [ ] Alerts (email/SMS když web down)

### 4.4 Backups
- [ ] Database backup (daily)
- [ ] Code backup (GitHub già hotovo)
- [ ] Config backup (.env files)
- [ ] Recovery plan (disaster recovery)

---

## 📊 Success Metrics

### Week 1
- [ ] Web live and working on all devices
- [ ] First 10 leads collected
- [ ] Chat functionality tested

### Month 1
- [ ] 100+ leads
- [ ] 10 blog posts published
- [ ] Google Search Console indexed
- [ ] First paying customer

### Month 3
- [ ] 500+ leads
- [ ] 50+ active chat sessions/day
- [ ] Voice AI integration live
- [ ] 10+ case studies

---

## Tech Stack

### Frontend
- React 18
- React Router
- Lucide React (icons)
- Framer Motion (animations)
- Axios (API calls)

### Backend
- Node.js + Express
- MongoDB (Atlas)
- JWT auth
- CORS
- Helmet (security headers)

### Services
- Hosting: Vercel (frontend)
- Backend: Vercel Serverless Functions nebo Railway
- Database: MongoDB Atlas (free tier)
- Email: WEDOS SMTP
- Voice: ElevenLabs
- WhatsApp: Twilio
- Analytics: PostHog
- Monitoring: UptimeRobot

### DevOps
- Git: GitHub
- CI/CD: Vercel auto-deploy
- DNS: Vercel
- SSL: Vercel (auto)

---

## Cost Estimate (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| MongoDB Atlas | Free tier | $0 |
| Domain (WEDOS) | Paid yearly | $15/year |
| PostHog | Free tier | $0 |
| ElevenLabs | Pay-as-go | ~$30-100 |
| Twilio WhatsApp | Pay-as-go | ~$20-50 |
| **Total** | | **~$50-150/month** |

**Break-even:** 1-2 paying customers

---

## Next Steps (RIGHT NOW)

1. **Gradually add original App.js sections** (one at a time, test each)
2. **Setup backend API** (Express + MongoDB)
3. **Implement forms** with validation
4. **Add chat widget** with API
5. **Deploy backend** to Railway or Vercel Functions
6. **Test everything** on mobile

---

*Last updated: 2026-02-13*
*Status: Phase 1 in progress*
