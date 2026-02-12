# 🔍 DEBUG CHECKLIST - Než smažeme, zjistíme co vidíš!

## 📸 PROSÍM POŠLI MI:

### 1. Screenshot z Chrome DevTools:

**JAK NA TO:**
1. Otevři https://www.chciai.cz
2. Zmáčkni **F12** (otevře DevTools)
3. Klikni na **Network** tab (nahoře)
4. Klikni na chat widget
5. Napiš zprávu "Test"
6. **UDĚLEJ SCREENSHOT** celé obrazovky (včetně DevTools)

**CO MĚ ZAJÍMÁ:**
- Vidíš nějaký request na `/api/chat`?
- Jaký je status code? (200, 404, 500?)
- Co je v response?

---

### 2. Co přesně vidíš?

**A) Chat se otevře, napíšeš zprávu a:**
- ❌ Nic se nestane (zpráva zmizí?)
- ❌ Zobrazí se error message?
- ❌ Točí se loader pořád?
- ❌ Něco jiného?

**B) Chat se vůbec neotevře?**

---

### 3. Console Errors:

V DevTools:
1. Klikni na **Console** tab
2. **UDĚLEJ SCREENSHOT** všech červených errorů

---

## 🧪 ALTERNATIVNÍ TEST:

Zkus tenhle přímý test (bez webu):

**Otevři tuhle URL v prohlížeči:**
```
https://www.chciai.cz/api/
```

**Co vidíš?**
- ✅ Měl bys vidět: `{"message":"ChciAI API is running","status":"ok"...}`
- ❌ Nebo nějakou chybu?

---

## 💡 MOŽNÉ PŘÍČINY:

1. **Cache** - Prohlížeč má starou verzi webu
   - **FIX:** Ctrl+Shift+R (hard reload)

2. **DNS Propagation** - `chciai.cz` ještě neukazuje na nový Vercel
   - **FIX:** Počkat 5-10 minut

3. **Frontend cache** - Vercel má cached starý build
   - **FIX:** Purge cache v Vercel

4. **Různé URL** - Možná máš 2 projekty (chciai.cz vs chciai-new.vercel.app)
   - **FIX:** Ověřit správnou URL

---

## ⚠️ NEŽ SMAŽEME:

**NEMAŽ NIC!** Nejdřív zjistíme co je špatně.

**Pošli mi:**
1. Screenshot DevTools (Network + Console)
2. Zkus https://www.chciai.cz/api/ - co vidíš?
3. Zkus Ctrl+Shift+R a pak test

**Za 2 minuty zjistíme příčinu!** 🔍
