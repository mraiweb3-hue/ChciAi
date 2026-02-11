# Google Search Console Setup

## Krok 1: Přidání webu

1. Jděte na: https://search.google.com/search-console
2. Klikněte "Přidat property"
3. Vyberte "URL prefix"
4. Zadejte: https://chciai.cz

## Krok 2: Ověření vlastnictví

### Metoda 1: HTML Tag (Doporučeno)

Přidejte do `/frontend/public/index.html` v `<head>`:

```html
<meta name="google-site-verification" content="VÁŠ_OVĚŘOVACÍ_KÓD" />
```

### Metoda 2: HTML Soubor

Nahrajte soubor do `/frontend/public/google-verification-code.html`

## Krok 3: Odeslání Sitemap

1. V Search Console → "Sitemaps"
2. Přidejte URL: `https://chciai.cz/sitemap.xml`
3. Klikněte "Submit"

## Sitemap je již připraven!

✅ Soubor: `/frontend/public/sitemap.xml`
✅ URL: https://chciai.cz/sitemap.xml
✅ Obsahuje všechny stránky webu

## Co sledovat:

- 🔍 Indexované stránky
- 📊 Vyhledávací dotazy
- 🔗 Backlinky
- ⚡ Core Web Vitals
- 📱 Mobile usability

## Pravidelné úkoly:

- Kontrolovat chyby crawlingu
- Sledovat pozice klíčových slov
- Optimalizovat meta descriptions
- Aktualizovat sitemap při změnách
