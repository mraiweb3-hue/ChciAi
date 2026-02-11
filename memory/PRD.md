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
- ✅ **Use Cases sekce pro 8 oborů**
- ✅ **NOVÉ: Ceník (3 úrovně: Start, Business, Enterprise)**
- ✅ **NOVÉ: Callback formulář s výběrem jazyka**
- ✅ **NOVÉ: Voice-to-text v chatbotu**
- ✅ **NOVÉ: Výběr jazyka v chatbotu (CS, EN, DE, SK)**
- ✅ O nás sekce (Martin + Aji)
- ✅ Kontaktní formulář
- ✅ AI Chatbot (Claude Sonnet 4.5)
- ✅ Calendly embed

## Architektura
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + MongoDB
- **AI Chatbot:** Claude Sonnet 4.5 via emergentintegrations
- **Voice-to-Text:** OpenAI Whisper via emergentintegrations
- **Booking:** react-calendly

## Ceník (implementováno 2026-02-11)
| Plán | Cena/měsíc | Hlavní funkce |
|------|------------|---------------|
| **Start** | 4 990 Kč | 1 AI asistent, 500 konverzací, web integrace, 2 jazyky |
| **Business** | 9 990 Kč | 3 AI asistenti, neomezeno, Web+IG+WhatsApp, hlasový asistent, 4 jazyky |
| **Enterprise** | 19 990 Kč | Neomezeno vše, vlastní AI model, dedikovaný manager, SLA 99.9% |

*Ceny bez DPH, první konzultace zdarma, 14 dní na vyzkoušení*

## Co bylo implementováno (2026-02-11)
1. ✅ Kompletní dark-mode web s moderním tech designem
2. ✅ Glassmorphism navbar s animacemi
3. ✅ Hero sekce s cyan glow efektem
4. ✅ 4 service cards s hover efekty
5. ✅ "AI asistent pro váš obor" sekce (8 kategorií)
6. ✅ **Pricing sekce** - 3 cenové plány s detaily
7. ✅ **Callback sekce** - formulář pro zpětné volání s výběrem jazyka
8. ✅ O nás sekce s profily (Martin + Aji)
9. ✅ Kontaktní formulář s backend integrací
10. ✅ **AI Chatbot widget vylepšený:**
    - Výběr jazyka (🇨🇿 🇬🇧 🇩🇪 🇸🇰)
    - Voice-to-text nahrávání
    - Multi-language odpovědi
11. ✅ Calendly embed pro rezervace konzultací
12. ✅ Responzivní design pro mobily

## API Endpoints
- `POST /api/contact` - kontaktní formulář
- `POST /api/chat` - AI chatbot (s language parametrem)
- `GET /api/chat/history/{session_id}` - historie chatu
- `POST /api/callback` - požadavek na zpětné volání
- `GET /api/callbacks` - seznam callback požadavků
- `POST /api/transcribe` - voice-to-text (Whisper)
- `GET /api/languages` - dostupné jazyky

## Backlog (P1/P2)
### P1 - High Priority
- [ ] Portfolio sekce s case studies
- [ ] Blog sekce pro SEO
- [ ] Email notifikace při novém kontaktu/callback

### P2 - Medium Priority
- [ ] Tmavý/světlý režim toggle
- [ ] Více animací při scrollu
- [ ] LinkedIn integrace
- [ ] Kalkulačka úspor

## Nasazení na produkci
Web je připraven pro nasazení na Vercel:
1. Propojit GitHub repo s Vercel
2. Nastavit DNS záznamy na Wedos pro chciai.cz
3. Nastavit environment variables:
   - EMERGENT_LLM_KEY
   - MONGO_URL (produkční)
4. Nastavit Wedos email pro info@chciai.cz

## Další kroky
1. Vytvořit Calendly účet s URL https://calendly.com/chciai/konzultace
2. Nastavit Wedos email
3. Připravit obsah pro blog sekci
4. Implementovat Twilio pro skutečné callback hovory (volitelné)
