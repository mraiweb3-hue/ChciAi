# chciai.cz - Deployment Guide

## ✅ Co jsme udělali

### 1. **Nový profesionální design**
- Světlá paleta (bílá + cyan akcenty)
- Čistý, business-focused design bez přehnaných AI efektů
- Responzivní na všech zařízeních

### 2. **Reálné příklady pro konkrétní odvětví**
Přidali jsme detailní use-cases pro:
- 🔧 **Autoservisy** - Rezervace, dotazy na služby 24/7
- 💇 **Kadeřnictví** - Automatické rezervace během práce
- 💪 **Fitness trenéry** - Odpovědi na časté dotazy, připomínky
- 🛍️ **E-shopy** - Produktové dotazy, sledování objednávek
- 🍕 **Restaurace** - Rezervace stolů, menu, alergeny
- 🏠 **Reality** - Filtrování dotazů, domlouvání prohlídek

Každý příklad obsahuje:
- Konkrétní problém podnikatele
- Jak AI řeší problém
- Měřitelné výsledky
- Ukázku konverzace

### 3. **Struktura stránky**

```
Hero Section
  └─ Hlavní CTA: "Chci AI asistenta"
  └─ Trust indicators (48h, bez tech. znalostí, česká podpora)

Příklady pro odvětví (NOVÉ!)
  └─ Interaktivní tabs pro různá odvětví
  └─ Reálné use-cases a ukázky konverzací

Služby
  └─ Nasazení AI, automatizace, školení, partnerství

Jak to funguje
  └─ 5-krokový proces od konzultace po dlouhodobou podporu

Proč my
  └─ Statistiky + 6 důvodů (česky, transparentně, rychle, open-source...)

Kontakt (CTA)
  └─ Formulář + přímé kontakty

Footer
  └─ Odkazy, kontakty, social media
```

## 🚀 Nasazení

### Vercel (doporučeno - nejjednodušší)

1. **Připoj GitHub repo k Vercel:**
   ```bash
   cd /root/clawd/chciai.cz
   git remote add origin <tvuj-github-repo>
   git push -u origin main
   ```

2. **Import do Vercel:**
   - Jdi na vercel.com
   - Klikni "Import Project"
   - Vyber GitHub repo
   - Vercel automaticky detekuje Next.js
   - Deploy! ✅

3. **Nastav custom doménu:**
   - V Vercel Settings → Domains
   - Přidej `chciai.cz`
   - Nastav DNS záznamy (Vercel ti řekne jaké)

### Wedos hosting (alternativa)

1. **Build statickou verzi:**
   ```bash
   cd /root/clawd/chciai.cz
   npm run build
   ```

2. **Export obsahu `/out` složky:**
   Stránka je už ve složce `out/` připravená k nahrání

3. **Nahraj na Wedos FTP/File Manager:**
   - Nahraj obsah `out/` do `www/` složky na Wedosu
   - Ujisti se, že doména je aktivní

## 🔧 Co dál?

### Okamžitě:
1. ✅ Aktivovat doménu chciai.cz na Wedosu
2. ✅ Nastavit DNS záznamy (A record → Vercel/server IP)
3. ✅ Nasadit na Vercel nebo nahrát na Wedos
4. ✅ Testovat na mobilu a desktopu

### Brzy:
1. **Funkční kontaktní formulář:**
   - Přidat webhook/email endpoint
   - Notifikace při nové poptávce

2. **Analytics:**
   - Google Analytics / Plausible
   - Sledovat konverze z formuláře

3. **SEO:**
   - Meta descriptions
   - Open Graph tagy pro social sharing
   - Sitemap

4. **Content:**
   - Vyplnit reálné kontakty (tel, email)
   - Případné sekce s referencemi klientů

## 📝 Poznámky

- **Doména chciai.cz** je registrována na Wedosu, ale je **NEAKTIVNÍ**
- Musíme ji aktivovat a nastavit DNS
- Stránka je **statická** (Next.js export) - lze hostovat kdekoliv
- Design je **production-ready** - profesionální, ne "AI-generated"
- Příklady jsou **konkrétní a měřitelné** - ne generické kecy

## 🎨 Design principy

- ✅ Čistý, bílý základ
- ✅ Cyan (#00D9FF) jako jediný accent color
- ✅ Minimální animace - jen tam, kde přidávají hodnotu
- ✅ Focus na obsah a use-cases
- ✅ Business-first, tech-second

---

**Status:** 🟡 Ready to deploy, čeká na aktivaci domény
