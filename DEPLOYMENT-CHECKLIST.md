# Deployment Checklist - ChciAI.cz

## ✅ Dokončeno:

### Frontend
- ✅ React aplikace vytvořena
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Chat interface
- ✅ PostHog analytics integrován
- ✅ Sitemap.xml vytvořen
- ✅ Robots.txt nastaven
- ✅ SEO meta tags
- ✅ OG tags pro social sharing

### Backend
- ✅ FastAPI server
- ✅ OpenAI GPT-4 integrace
- ✅ CORS konfigurace
- ✅ Error handling
- ✅ Rate limiting

### Hosting
- ✅ WEDOS.cz doména registrována
- ✅ DNS záznamy nastaveny
- ✅ Frontend ready pro deploy

## 📋 Doporučené další kroky:

### 1. Email Setup
- [ ] Vytvořit info@chciai.cz na WEDOS
- [ ] Nastavit SMTP pro kontaktní formulář
- [ ] Vytvořit auto-reply zprávy

### 2. Google Search Console
- [ ] Přidat web do Search Console
- [ ] Ověřit vlastnictví (HTML tag)
- [ ] Odeslat sitemap.xml
- [ ] Nastavit alerts

### 3. Analytics Monitoring
- [ ] Zkontrolovat PostHog dashboard
- [ ] Nastavit conversion funnels
- [ ] Vytvořit custom events tracking
- [ ] Nastavit alerts pro kritické metriky

### 4. Social Media Assets
- [ ] Vytvořit og-image.jpg (1200x630px)
- [ ] Design pro Facebook sharing
- [ ] Design pro Twitter/X card
- [ ] LinkedIn preview

### 5. Git & Version Control
- [ ] Push změny do GitHubu
- [ ] Vytvořit README.md s instrukcemi
- [ ] Přidat .env.example
- [ ] Dokumentovat API endpoints

### 6. Performance
- [ ] Lighthouse audit
- [ ] Optimalizace obrázků
- [ ] CDN konfigurace (Cloudflare?)
- [ ] Caching strategie

### 7. Security
- [ ] SSL certifikát (HTTPS)
- [ ] Security headers
- [ ] Rate limiting review
- [ ] API key rotation policy

### 8. Legal
- [ ] Ochrana osobních údajů (GDPR)
- [ ] Cookies consent
- [ ] Obchodní podmínky
- [ ] Kontaktní informace

## 🚀 Pro GitHub Push:

```bash
cd /root/clawd/chciai-new
git add .
git commit -m "feat: Add email setup, SEO, and deployment docs"
git push origin main
```

## 📊 Monitoring URLs:

- PostHog: https://us.posthog.com/
- Search Console: https://search.google.com/search-console
- WEDOS Admin: https://client.wedos.com/
- Web: https://chciai.cz
