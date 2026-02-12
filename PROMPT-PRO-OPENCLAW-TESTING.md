# 🧪 PROMPT PRO OPENCLAW AI - KOMPLETNÍ TEST ChciAI.cz

---

## 🎯 ÚKOL PRO OPENCLAW AI:

Proveď **kompletní analýzu, test a opravu** webové aplikace ChciAI.cz. Hlavní focus: **AI CHATBOT MUSÍ FUNGOVAT!**

---

## 📍 LOKACE PROJEKTU:

**Hlavní projekt:**
```
/root/clawd/chciai-new/
├── frontend/          # React aplikace
│   ├── src/          # Source kód
│   ├── api/          # Vercel Edge Functions
│   └── public/       # Statické soubory
├── backend/          # FastAPI (lokální backup)
└── dokumentace/      # Různé MD soubory
```

**Live web:**
```
🌐 https://www.chciai.cz
```

---

## 🔴 HLAVNÍ PROBLÉM:

**CHATBOT NEKOMUNIKUJE!**

- ✅ Web je živý
- ✅ UI vypadá dobře  
- ✅ Chat widget se otevírá
- ❌ **AI neodpovídá na zprávy**
- ❌ Error: "The object can not be cloned"

---

## 🔍 CO MUSÍŠ UDĚLAT:

### **FÁZE 1: ANALÝZA (15 minut)**

#### 1.1 Zkontroluj Edge Functions
```
Soubory k analýze:
📁 /root/clawd/chciai-new/frontend/api/chat.js
📁 /root/clawd/chciai-new/frontend/api/index.js
📁 /root/clawd/chciai-new/frontend/api/speak.js
📁 /root/clawd/chciai-new/frontend/api/transcribe.js

Hledej:
- Syntax errors
- "The object can not be cloned" příčina
- Runtime: 'edge' vs 'nodejs' (může být problém!)
- Response object issues
- Async/await problémy
```

#### 1.2 Zkontroluj Frontend Chat Widget
```
Soubor k analýze:
📁 /root/clawd/chciai-new/frontend/src/App.js

Hledej:
- Kde je ChatWidget komponenta (řádek ~1259)
- Jak volá API: axios.post(`${API}/chat`, ...)
- Co je v proměnné API (REACT_APP_BACKEND_URL)
- Error handling
- Console.log errors
```

#### 1.3 Zkontroluj Environment Variables
```
Soubory:
📁 /root/clawd/chciai-new/frontend/.env
📁 /root/clawd/chciai-new/frontend/vercel.json

Ověř:
- REACT_APP_BACKEND_URL je správně
- Vercel ENV variables (pokud máš přístup)
- API routing configuration
```

#### 1.4 Zkontroluj Vercel Config
```
Soubor:
📁 /root/clawd/chciai-new/frontend/vercel.json

Hledej:
- Rewrites/redirects pro /api/*
- Headers konfigurace
- Edge Function runtime settings
```

---

### **FÁZE 2: TESTOVÁNÍ (10 minut)**

#### 2.1 Test API Endpoints Lokálně
```bash
# Test Edge Function lokálně (pokud možné)
cd /root/clawd/chciai-new/frontend
vercel dev

# Nebo test s curl přes live URL:
curl -X POST https://www.chciai.cz/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Ahoj test",
    "language": "cs"
  }'

# Očekávaný výsledek:
# {"response":"...AI odpověď...","session_id":"..."}
```

#### 2.2 Test Frontend → Backend Connection
```
Otevři v prohlížeči (Chrome DevTools):
1. https://www.chciai.cz
2. F12 (DevTools)
3. Console tab
4. Network tab
5. Otevři chat
6. Pošli zprávu
7. Sleduj:
   - Jaké API volá? (/api/chat?)
   - Jaký error vrací?
   - Status code? (200, 404, 500?)
   - Response body?
```

#### 2.3 Identifikuj RCA (Root Cause Analysis)
```
Možné příčiny:
1. Edge Function není deploynutý (Vercel issue)
2. API key chybí v Vercel ENV (GROQ_API_KEY nebo EMERGENT_LLM_KEY)
3. "object can not be cloned" - Response/Request object issue
4. CORS blocking
5. Routing issue (vercel.json)
6. Frontend API URL je špatně
```

---

### **FÁZE 3: OPRAVY (20 minut)**

#### 3.1 Fix "The object can not be cloned"
```
Obvyklé příčiny v Edge Functions:
- ❌ Špatný runtime (mělo by být 'edge' ne 'nodejs')
- ❌ Response obsahuje non-cloneable objects
- ❌ Fetch response není správně deserializovaný

Fix:
- Změň export config = { runtime: 'edge' }
- Nebo přepiš na Node.js runtime (není edge compatible)
- Nebo simplifikuj response (jen JSON.stringify)
```

#### 3.2 Alternativní Backend (pokud Edge nefunguje)
```
Pokud Edge Functions mají problémy:

OPTION A: Použij lokální backend jako proxy
- Spusť backend na port 8002
- Exponuj přes Emergent preview
- Frontend bude volat preview URL

OPTION B: Deploy na Render.com (původní plán)
- 15 minut setup
- Free tier
- Spolehlivé

OPTION C: Simplifikuj Edge Function
- Odstraň složité objekty
- Pure JSON responses
- Minimální kód
```

#### 3.3 Implementuj Fix & Test
```
1. Uprav problémové soubory
2. Commitni změny
3. Push do GitHub
4. Počkej na Vercel redeploy (3 min)
5. Test znovu
6. Pokud nefunguje → zkus jiný přístup
```

---

### **FÁZE 4: VERIFIKACE (5 minut)**

#### 4.1 End-to-End Test
```
Test scenario:
1. Otevři https://www.chciai.cz
2. Klikni na chat widget (pravý dolní roh)
3. Napiš: "Ahoj! Mám kadeřnictví a potřebuji pomoc"
4. Odešli
5. Čekej max 5 sekund
6. ✅ AI MUSÍ ODPOVĚDĚT!

Pokud odpovídá:
- Test voice chat (pokud implementováno)
- Test různé jazyky
- Test edge cases
```

#### 4.2 Performance Check
```
- Response time < 3s? ✅
- Chat scrolluje správně? ✅
- Mobile responsive? ✅
- No console errors? ✅
```

---

## 📊 CO POTŘEBUJI OD TEBE (OPENCLAW):

### **1. ANALÝZA REPORT:**
```markdown
## Nalezené problémy:
1. [Problém 1]
   - Soubor: ...
   - Řádek: ...
   - Chyba: ...
   - Důvod: ...

2. [Problém 2]
   ...

## Root Cause:
[Hlavní příčina, proč chatbot nefunguje]
```

### **2. NAVRŽENÉ OPRAVY:**
```markdown
## Fix 1: [Název]
- Soubor: /path/to/file
- Změna: [Co změnit]
- Kód:
```javascript
// Před:
[starý kód]

// Po:
[nový kód]
```
```

### **3. TEST VÝSLEDKY:**
```markdown
## Test po opravě:
- ✅ API endpoint responds
- ✅ Chat widget functional
- ✅ AI responses working
- ✅ No console errors

Nebo:
- ❌ Stále nefunguje - potřeba jiné řešení
```

---

## 🎯 JASNÉ CÍLE:

**ÚSPĚCH znamená:**
1. ✅ Otevřu https://www.chciai.cz
2. ✅ Kliknu na chat
3. ✅ Napíšu zprávu
4. ✅ **AI ODPOVÍ DO 5 SEKUND**
5. ✅ Konverzace funguje plynule

**SELHÁNÍ znamená:**
- ❌ Žádná odpověď
- ❌ Error message
- ❌ Loading forever
- ❌ Console errors

---

## 💡 TIPY PRO RYCHLOU DIAGNÓZU:

### **Problém: Edge Functions**
```
Edge runtime má omezení:
- Nemůže používat Node.js libraries
- Nemůže používat fs, process, atd.
- Response musí být pure JSON

Zkontroluj:
- export const config = { runtime: 'edge' }
- Žádné Node.js specific imports
- Pure fetch() calls (ne axios)
```

### **Problém: API Keys**
```
Vercel ENV musí mít:
- EMERGENT_LLM_KEY nebo
- GROQ_API_KEY

Zkontroluj v chat.js na řádku ~20:
const GROQ_API_KEY = process.env.GROQ_API_KEY;
```

### **Problém: CORS**
```
Možná frontend nemůže volat /api/
Zkontroluj vercel.json rewrites
```

---

## 🔧 ALTERNATIVNÍ PŘÍSTUP (pokud Edge nefunguje):

### **Quick Fix: Použij MongoDB + FastAPI Backend**

```
Backend už existuje v:
/root/clawd/chciai-new/backend/server.py

Je plně funkční s:
- Claude Sonnet 4.5
- MongoDB
- All endpoints

Můžeme:
1. Spustit na Emergent (port 8002)
2. Exponovat jako preview URL
3. Frontend bude volat tu URL
4. BUDE FUNGOVAT 100%!
```

---

## 📞 KOMUNIKACE:

**OPENCLAW - PROSÍM ODPOVĚZ S:**

1. **Analýza:** Co jsi našel v kódu?
2. **Root Cause:** Proč "object can not be cloned"?
3. **Fix navržený:** Konkrétní kód změny
4. **Alternativa:** Pokud Edge nefunguje, co použít?

---

## ⏱️ ČASOVÝ LIMIT:

Máme ještě **78k tokenů** v této session. Po tomto úkolu bude potřeba `/new`.

**PRIORITY:**
1. 🔴 Najdi RCA (root cause)
2. 🔴 Navrhni fix
3. 🔴 Test fix
4. 🔴 Pokud nefunguje → použij alternative (FastAPI backend)

---

## 🎯 GOAL:

**Za max 30 minut od teď:**
- ✅ Chatbot na https://www.chciai.cz **MUSÍ FUNGOVAT**
- ✅ AI musí odpovídat
- ✅ Žádné error messages

---

**OPENCLAW - START TESTING NOW!** 🚀

**Zkopírujte tento prompt a pošlete do OpenClaw chatu!** 📋