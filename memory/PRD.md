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
- ✅ O nás sekce (Martin + Aji)
- ✅ Kontaktní formulář
- ✅ AI Chatbot (Claude Sonnet 4.5)
- ✅ Calendly embed

## Architektura
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** FastAPI + MongoDB
- **AI Chatbot:** Claude Sonnet 4.5 via emergentintegrations
- **Booking:** react-calendly

## Co bylo implementováno (2026-02-11)
1. ✅ Kompletní dark-mode web s moderním tech designem
2. ✅ Glassmorphism navbar s animacemi
3. ✅ Hero sekce s cyan glow efektem
4. ✅ 4 service cards s hover efekty
5. ✅ O nás sekce s profily (Martin + Aji)
6. ✅ Kontaktní formulář s backend integrací
7. ✅ AI Chatbot widget (Claude Sonnet 4.5) - plně funkční
8. ✅ Calendly embed pro rezervace konzultací
9. ✅ Responzivní design pro mobily

## API Endpoints
- `POST /api/contact` - kontaktní formulář
- `POST /api/chat` - AI chatbot
- `GET /api/chat/history/{session_id}` - historie chatu

## Backlog (P1/P2)
### P1 - High Priority
- [ ] Portfolio sekce s case studies
- [ ] Blog sekce pro SEO
- [ ] Email notifikace při novém kontaktu

### P2 - Medium Priority
- [ ] Tmavý/světlý režim toggle
- [ ] Více animací při scrollu
- [ ] LinkedIn integrace

## Nasazení na produkci
Web je připraven pro nasazení na Vercel:
1. Propojit GitHub repo s Vercel
2. Nastavit DNS záznamy na Wedos pro chciai.cz
3. Nastavit EMERGENT_LLM_KEY jako environment variable
4. Nastavit MONGO_URL pro produkční databázi

## Další kroky
1. Vytvořit Calendly účet s URL https://calendly.com/chciai/konzultace
2. Nastavit Wedos email pro info@chciai.cz
3. Připravit obsah pro blog sekci
