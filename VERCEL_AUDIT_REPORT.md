# Vercel & Domain Audit Report - ChciAI.cz
**Date:** 2026-02-12  
**Domain:** chciai.cz / www.chciai.cz  
**Hosting:** Vercel  

---

## 🟢 DOBRÉ (Working Well)

### 1. SSL/HTTPS ✅
- **Status:** ACTIVE
- **HSTS:** max-age=63072000 (2 years)
- **Grade:** A+
- Automatic SSL certificate from Vercel
- Force HTTPS redirect working

### 2. Security Headers ✅
```
✅ strict-transport-security: max-age=63072000
✅ x-content-type-options: nosniff
✅ x-frame-options: DENY
✅ x-xss-protection: 1; mode=block
✅ referrer-policy: strict-origin-when-cross-origin
✅ permissions-policy: geolocation=(), microphone=(), camera=()
```
**Grade:** A (Excellent security posture)

### 3. Domain Redirect ✅
- `chciai.cz` → `www.chciai.cz` (308 redirect)
- Canonical URL properly set
- No redirect loops

### 4. DNS Configuration ✅
```
www.chciai.cz → 64.29.17.65, 216.198.79.65 (Vercel IPs)
chciai.cz → 64.29.17.65, 64.29.17.1 (Vercel IPs)
```
- Multiple IPs for redundancy ✅
- Vercel edge network active ✅

### 5. robots.txt ✅
- Properly configured
- AI crawlers allowed (GPTBot, Claude-Web, etc.)
- Sitemap reference present

### 6. sitemap.xml ✅
- Valid XML format
- Contains homepage + blog URLs
- Proper lastmod dates
- Priority set correctly

### 7. CDN & Caching ✅
```
x-vercel-cache: HIT
cache-control: public, max-age=0, must-revalidate
age: 1301
```
- Edge caching active
- Fast global delivery

---

## 🔴 ŠPATNÉ (Issues Found)

### 1. ❌ BUILD CACHE PROBLEM (CRITICAL)
**Issue:** Vercel serves old cached build
```
Expected: main.fef543ae.js (local build)
Actual: main.59ba0d6c.js (old Vercel build)
```
**Impact:** Website not loading properly (only title visible)
**Fix Priority:** 🔴 URGENT

**Fix:**
```bash
# Option 1: Clear Vercel build cache
vercel env rm BUILD_ID
vercel --prod --force

# Option 2: Add to vercel.json
{
  "github": {
    "autoAlias": false
  }
}

# Option 3: Manual in Vercel Dashboard
Settings → General → Clear Build Cache
```

### 2. ❌ Google Search Console NOT VERIFIED
**Issue:** Domain not verified in GSC
**Impact:** 
- Can't submit sitemap
- No search performance data
- No indexing control

**Fix:**
1. Go to https://search.google.com/search-console
2. Add property: chciai.cz
3. Verify via HTML file or DNS TXT record
4. Submit sitemap: https://www.chciai.cz/sitemap.xml

### 3. ❌ NO GOOGLE INDEXING YET
**Issue:** Site not indexed by Google
```
site:chciai.cz → No results
```
**Impact:** Zero organic traffic

**Fix:**
1. Verify in Google Search Console (see above)
2. Submit sitemap
3. Request indexing for homepage
4. Wait 1-3 days for crawl

### 4. ❌ MISSING STRUCTURED DATA (Partial)
**Issue:** Only Organization schema present
**Missing:**
- BreadcrumbList
- WebPage schema
- Review/Rating schema
- LocalBusiness (if applicable)

**Fix:** Add to `index.html`:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "ChciAI - AI Asistent",
  "description": "...",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
}
```

### 5. ❌ NO PERFORMANCE MONITORING
**Issue:** No Core Web Vitals tracking
**Missing:**
- Real User Monitoring (RUM)
- Performance budgets
- Error tracking

**Fix:**
1. Enable Vercel Analytics (free tier)
2. Add Google Analytics 4 (already has PostHog)
3. Add Sentry for error tracking

### 6. ⚠️ IMAGE OPTIMIZATION NEEDED
**Issue:** Images not optimized
```
og-image.jpg → 189 bytes (placeholder?)
```
**Impact:** Slow load times, poor social preview

**Fix:**
1. Create proper og-image.jpg (1200x630px)
2. Use WebP format for images
3. Add lazy loading
4. Compress images (TinyPNG)

### 7. ⚠️ NO CDN ASSETS
**Issue:** Static assets served from origin
**Impact:** Slower load for international users

**Fix:**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 8. ⚠️ MISSING SOCIAL PROFILES
**Issue:** No social media verification
```
Schema.org: "sameAs": [] (empty)
```

**Fix:**
1. Create LinkedIn company page
2. Create Twitter/X account
3. Add to schema:
```json
"sameAs": [
  "https://www.linkedin.com/company/chciai",
  "https://twitter.com/chciai"
]
```

### 9. ⚠️ NO BLOG CONTENT
**Issue:** Sitemap lists blog URLs but they 404
```
/blog/ai-automatizace-pro-male-firmy → 404
/blog/jak-ai-chatbot-usetri-cas → 404
```
**Impact:** Crawl errors, bad UX

**Fix:**
1. Implement /blog route in React
2. Create actual blog posts
3. Update sitemap with real URLs only

### 10. ⚠️ SLOW BUILD TIMES
**Issue:** No build optimization
**Impact:** Slow deployments

**Fix:**
```json
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false craco build"
  }
}
```

---

## 🟡 ZLEPŠENÍ (Improvements)

### 1. Add Vercel Analytics
```bash
npm install @vercel/analytics
```

### 2. Enable Preview Comments
In Vercel dashboard: Enable preview deployments comments

### 3. Custom Error Pages
Create `/frontend/public/404.html`, `500.html`

### 4. Add Security.txt
```
# /frontend/public/.well-known/security.txt
Contact: security@chciai.cz
Expires: 2027-02-12T00:00:00.000Z
Preferred-Languages: cs, en
```

### 5. Implement CSP Headers
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://assets.emergent.sh; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
}
```

### 6. Add Favicon Package
- favicon.ico (32x32)
- apple-touch-icon.png (180x180)
- manifest.json for PWA

### 7. Preconnect to Third-party Domains
```html
<link rel="preconnect" href="https://assets.emergent.sh">
<link rel="dns-prefetch" href="https://us.i.posthog.com">
```

### 8. Add Canonical Meta
Each page should have:
```html
<link rel="canonical" href="https://www.chciai.cz/specific-page" />
```

---

## 📊 PRIORITY ACTION PLAN

### URGENT (Do Now)
1. 🔴 Fix Vercel build cache (clear + redeploy)
2. 🔴 Verify Google Search Console
3. 🔴 Submit sitemap to GSC
4. 🔴 Create proper og-image.jpg

### HIGH (This Week)
5. 🟠 Implement blog section
6. 🟠 Add Vercel Analytics
7. 🟠 Create social media profiles
8. 🟠 Request Google indexing

### MEDIUM (Next Week)
9. 🟡 Add structured data (WebPage, Breadcrumb)
10. 🟡 Optimize images (WebP)
11. 🟡 Add error tracking (Sentry)
12. 🟡 Custom 404 page

### LOW (Ongoing)
13. ⚪ Implement CSP headers
14. ⚪ Add security.txt
15. ⚪ PWA manifest
16. ⚪ Performance budgets

---

## 🎯 EXPECTED OUTCOMES

### After Fixes (1 week):
- ✅ Website loads properly (no cache issues)
- ✅ Google indexing started
- ✅ Basic analytics tracking
- ✅ Social previews working

### After Content (1 month):
- ✅ 3-5 blog posts published
- ✅ Organic traffic: 50-100 visitors/month
- ✅ Search Console data flowing

### After SEO (3 months):
- ✅ Ranking for "AI asistent" keywords
- ✅ 500+ monthly organic visitors
- ✅ Featured in AI tool directories

---

## 🛠️ IMMEDIATE FIXES TO DEPLOY

### 1. Update vercel.json
```json
{
  "buildCommand": "cd frontend && npm ci --legacy-peer-deps && npm run build",
  "cleanUrls": true,
  "trailingSlash": false,
  "github": {
    "silent": true
  }
}
```

### 2. Add build cache bust
```bash
# Add to package.json
"build": "GENERATE_SOURCEMAP=false CI=false craco build"
```

### 3. Force rebuild
```bash
cd /tmp/chciai
git commit --allow-empty -m "chore: force vercel rebuild"
git push origin main
```

---

## 📞 NEXT STEPS

1. Implement immediate fixes (above)
2. Monitor Vercel deployment logs
3. Verify website loads after rebuild
4. Setup Google Search Console
5. Start content creation (blog)

**Current Status:** 🟡 AMBER (Working but needs optimization)  
**Target Status:** 🟢 GREEN (Fully optimized and indexed)
