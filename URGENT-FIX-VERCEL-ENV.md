# 🚨 URGENT: Vercel Environment Variable Missing!

## ❌ PROBLÉM:

Frontend na chciai.cz se snaží volat:
```
http://localhost:8002/api/chat  ❌ (nefunguje na produkci)
```

Místo:
```
/api/chat  ✅ (správná cesta)
```

## 🔧 ŘEŠENÍ - UDĚLEJ TERAZ:

### Krok 1: Jdi do Vercel Dashboard
```
https://vercel.com/dashboard
```

### Krok 2: Vyber projekt "chciai" (nebo jak se to jmenuje)

### Krok 3: Jdi do Settings → Environment Variables

### Krok 4: Najdi `REACT_APP_BACKEND_URL`

**Buď:**
- ❌ Je nastavená na `http://localhost:8002` → **SMAŽ TO**
- ❌ Není tam vůbec → **PŘIDEJ JI** (viz níže)

### Krok 5: Nastav správně:

**KLÍČ:** `REACT_APP_BACKEND_URL`  
**HODNOTA:** *(nech prázdné - žádný text!)*  
**ENVIRONMENT:** Production, Preview, Development (všechny 3)

### Krok 6: Redeploy

Po uložení:
1. Jdi do "Deployments"
2. Najdi poslední deployment
3. Klikni "..." → "Redeploy"
4. Počkaj 3 minuty

---

## 🧪 JAK TO OVĚŘIT:

Po redeployu:
1. Otevři https://www.chciai.cz
2. F12 → Network tab
3. Klikni na chat widget
4. Pošli zprávu
5. **Měl by volat `/api/chat` (ne localhost!)**

---

## 🎯 CO SE STANE:

**PŘED (špatně):**
```
Frontend → http://localhost:8002/api/chat → ❌ Connection refused
```

**PO (správně):**
```
Frontend → /api/chat → Vercel Edge Function → ✅ Funguje!
```

---

## ⏱️ ČAS: 2 minuty práce + 3 minuty deploy = 5 minut celkem

**UDĚLEJ TO TEĎ A CHATBOT BUDE FUNGOVAT!** 🚀
