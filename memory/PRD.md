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
- ✅ **NOVÉ: Use Cases sekce pro 8 oborů**
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
5. ✅ **NOVÉ: "AI asistent pro váš obor" sekce**
   - 8 kategorií: Autoservisy, Kadeřnictví, Kosmetika, Restaurace, Fitness, Reality, E-shopy, Účetní
   - Konkrétní problémy a řešení pro každý obor
   - Úspora času a výhody
   - Interaktivní přepínání kategorií
6. ✅ O nás sekce s profily (Martin + Aji)
7. ✅ Kontaktní formulář s backend integrací
8. ✅ AI Chatbot widget (Claude Sonnet 4.5) - plně funkční
9. ✅ Calendly embed pro rezervace konzultací
10. ✅ Responzivní design pro mobily

## Use Cases obory
| Obor | Problém | Úspora |
|------|---------|--------|
| Autoservisy | Zmeškané telefonáty, STK | 5+ hodin/týden |
| Kadeřnictví | No-shows, chaos v kalendáři | 70% méně no-shows |
| Kosmetika | Přeplněné DMs | 3+ hodiny/den |
| Restaurace | Přetížená linka | 40% více rezervací |
| Fitness | Zrušené lekce | 10+ hodin/měsíc |
| Reality | Stovky dotazů | 60% méně zbytečných prohlídek |
| E-shopy | "Kde je zásilka?" | 80% méně ticketů |
| Účetní | Zmeškané termíny | 15+ hodin/měsíc |

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
