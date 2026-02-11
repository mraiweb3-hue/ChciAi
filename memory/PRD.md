# ChciAI.cz - Product Requirements Document

## Původní požadavek
Vytvořit profesionální firemní web pro chciai.cz - AI konzultační služby pro české SMB firmy.

## User Personas
- **Malé a střední české firmy (SMB)** - potřebují AI transformaci
- **Podnikatelé** - chtějí automatizovat procesy
- **Firmy s opakovanými procesy** - zákaznická podpora, administrativa

## Core Requirements
- ✅ Tmavý design (černá/bílá + cyan #00D9FF)
- ✅ Responzivní layout
- ✅ Hero sekce s CTA
- ✅ 4 služby (AI Asistenti, Automatizace, Training, Partnerství)
- ✅ Use Cases sekce pro 8 oborů
- ✅ Ceník (3 úrovně: Start, Business, Enterprise)
- ✅ **NOVÉ: Callback formulář - AI zavolá do 2 minut**
- ✅ **NOVÉ: Výběr jazyka pro hovor (CS, EN, DE, SK)**
- ✅ **NOVÉ: ROI Kalkulačka**
- ✅ **NOVÉ: Reference/Testimonials sekce**
- ✅ **NOVÉ: FAQ sekce s animacemi**
- ✅ **NOVÉ: Animované statistiky**
- ✅ **NOVÉ: Video demo sekce**
- ✅ **NOVÉ: Newsletter přihlášení**
- ✅ Voice-to-text v chatbotu
- ✅ AI Chatbot (Claude Sonnet 4.5)
- ❌ Calendly odebráno (nahrazeno callback systémem)

## Architektura
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + MongoDB
- **AI Chatbot:** Claude Sonnet 4.5 via emergentintegrations
- **Voice-to-Text:** OpenAI Whisper via emergentintegrations
- **Telefonní volání:** Twilio Voice API (vyžaduje nastavení)

## Ceník
| Plán | Cena/měsíc | Hlavní funkce |
|------|------------|---------------|
| **Start** | 4 990 Kč | 1 AI asistent, 500 konverzací, web integrace |
| **Business** | 9 990 Kč | 3 AI asistenti, neomezeno, hlasový asistent |
| **Enterprise** | 19 990 Kč | Vše neomezeno, vlastní AI model, SLA 99.9% |

## Co bylo implementováno (2026-02-11)
1. ✅ Kompletní dark-mode web s moderními ikonkami (Lucide React)
2. ✅ Glassmorphism navbar s animacemi
3. ✅ Hero sekce "Zavoláme vám do 2 minut"
4. ✅ **Animované statistiky** (500+ klientů, 50000+ konverzací, 24/7, 3s odpověď)
5. ✅ 4 service cards s novými ikonkami (Brain, RefreshCw, GraduationCap, HeartHandshake)
6. ✅ "AI asistent pro váš obor" sekce (8 kategorií)
7. ✅ **ROI Kalkulačka** - interaktivní kalkulace úspor
8. ✅ **Pricing sekce** - 3 cenové plány s ikonkami (Rocket, TrendingUp, Award)
9. ✅ **Reference sekce** - 3 testimonials s hvězdičkami
10. ✅ **Video demo sekce** - placeholder pro video
11. ✅ **FAQ sekce** - 6 otázek s animovaným rozbalením
12. ✅ **Callback sekce** - formulář pro zpětné volání s:
    - Výběr jazyka (🇨🇿🇬🇧🇩🇪🇸🇰)
    - Odpočet 2 minuty po odeslání
    - Pulzující ikona telefonu
13. ✅ **Newsletter sekce** - přihlášení k odběru
14. ✅ AI Chatbot widget s voice input
15. ✅ Kontaktní formulář

## API Endpoints
- `POST /api/contact` - kontaktní formulář
- `POST /api/chat` - AI chatbot (s language parametrem)
- `GET /api/chat/history/{session_id}` - historie chatu
- `POST /api/callback` - požadavek na zpětné volání
- `GET /api/callbacks` - seznam callback požadavků
- `POST /api/transcribe` - voice-to-text (Whisper)
- `GET /api/languages` - dostupné jazyky

## TWILIO NASTAVENÍ (Pro skutečné volání)

### Krok 1: Založení Twilio účtu
1. Jděte na https://www.twilio.com/try-twilio
2. Registrujte se (potřebujete email + telefon)
3. Získáte $15 trial kredit zdarma

### Krok 2: Získání klíčů
Po přihlášení do Twilio Console najdete:
- **Account SID** (začíná `AC...`)
- **Auth Token**

### Krok 3: Koupě telefonního čísla
1. V Console jděte na Phone Numbers > Buy a Number
2. Vyberte číslo s Voice capability
3. Pro české volání stačí US číslo (~$1/měsíc)

### Krok 4: Konfigurace
Přidejte do backend/.env:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Backlog (P1/P2)
### P1 - High Priority
- [ ] Integrace Twilio pro skutečné volání
- [ ] Portfolio sekce s case studies
- [ ] Blog sekce pro SEO

### P2 - Medium Priority
- [ ] Email notifikace při novém callback
- [ ] Admin dashboard pro správu
- [ ] Více jazyků

## Nasazení na produkci
Web je připraven pro nasazení na Vercel:
1. Propojit GitHub repo s Vercel
2. Nastavit DNS záznamy na Wedos pro chciai.cz
3. Nastavit environment variables (EMERGENT_LLM_KEY, MONGO_URL, TWILIO_*)
4. Nastavit Wedos email pro info@chciai.cz
