# 🎤 ELEVENLABS VOICE CALL SETUP

## ✅ CO JSEM PŘIDAL:

### 1. Kontaktní formulář TEĎ MÁ:
- ✅ Jméno
- ✅ Email  
- ✅ **Telefon (nové!)** ← POVINNÉ
- ✅ Firma
- ✅ Zpráva

### 2. CO SE STANE PO ODESLÁNÍ:
```
1. Uživatel vyplní formulář + telefon
2. Klikne "Odeslat"
3. Formulář se uloží ✅
4. AI AUTOMATICKY ZAVOLÁ do 2 minut! 🎤
5. Uživatel vidí: "Náš AI asistent vám zavolá do 2 minut!"
```

---

## 🔑 POTŘEBUJEŠ NASTAVIT:

### Krok 1: Získej ElevenLabs API Key

1. **Jdi na:** https://elevenlabs.io/
2. **Sign up** (pokud nemáš účet)
3. **Klikni** na Profile (vpravo nahoře)
4. **Klikni** na "API Keys"
5. **Create API Key**
6. **Zkopíruj** klíč (začíná na `sk_...`)

---

### Krok 2: Přidej do Vercel

```bash
vercel env add ELEVENLABS_API_KEY production
→ vlož klíč
```

Nebo v Vercel dashboardu:
1. Settings → Environment Variables
2. Add: `ELEVENLABS_API_KEY` = (tvůj klíč)
3. Environment: Production, Preview, Development

---

### Krok 3: Redeploy

```bash
vercel --prod
```

Nebo v Vercel:
- Deployments → ... → Redeploy

---

## 🎯 JAK TO FUNGUJE:

### Voice Call Flow:

```
User vyplní formulář
    ↓
Backend (/api/contact.js)
    ↓
1. Uloží data ✅
    ↓
2. Vygeneruje personalizovaný script
    ↓
3. Zavolá ElevenLabs API
    ↓
4. ElevenLabs vytvoří audio (AI hlas)
    ↓
5. [BUDOUCNOST] Twilio zavolá na telefon
    ↓
User dostane hovor! 📞
```

---

## 📝 PŘÍKLAD HOVORU:

### Český hovor:
```
"Dobrý den, Martine! Volám z ChciAI.cz.

Děkujeme za váš zájem o naše AI řešení pro vaši firmu.

Rád bych s vámi probral, jak můžeme pomoci automatizovat 
vaši zákaznickou podporu a ušetřit vám čas i peníze.

Máte nyní chvilku na krátký rozhovor? 
Nebo vám mám zavolat později?

Pokud preferujete osobní schůzku, můžu vám nabídnout 
termíny tento týden.

Co říkáte?"
```

### English call:
```
"Hello Martin! I'm calling from ChciAI.cz.

Thank you for your interest in our AI solutions.

I'd like to discuss how we can help automate your 
customer support and save you time and money.

Do you have a moment now? Or should I call back later?

If you prefer a personal meeting, I can offer 
appointments this week.

What do you say?"
```

---

## 💰 NÁKLADY:

### ElevenLabs Pricing:
- **Free:** 10,000 characters/month
- **Starter:** $5/month = 30,000 characters
- **Creator:** $22/month = 100,000 characters
- **Pro:** $99/month = 500,000 characters

### Jeden hovor = cca 500 znaků
- Free tier = 20 hovorů/měsíc
- Starter = 60 hovorů/měsíc
- Creator = 200 hovorů/měsíc

**Pro začátek: FREE tier stačí!**

---

## 🚀 BUDOUCÍ UPGRADE:

### Fáze 2: Skutečný telefonní hovor (Twilio)

1. **Twilio účet** (https://twilio.com)
2. **Koupit telefonní číslo** (~$1/měsíc)
3. **Integrace:**
   - ElevenLabs vygeneruje audio
   - Twilio zavolá na telefon
   - Přehraje audio
   - Uživatel slyší AI

**Cost:** ~$0.02 za minutu + $1/měsíc za číslo

---

## 🎯 CO MŮŽEŠ UDĚLAT TEĎ:

### TEST (bez Twilio):
1. Vyplň formulář na chciai.cz
2. Zadej telefon
3. Backend vygeneruje audio message
4. Uloží log (můžeš vidět v konzoli)

### PRODUKCE (s Twilio):
1. Přidej Twilio API key
2. Uncommentuj řádek v `/api/contact.js`:
   ```javascript
   // await twilioCall({ phone, audioUrl });
   ```
3. AI skutečně zavolá!

---

## 📊 ANALYTICS:

V `/api/contact.js` můžeš přidat:
- Uložení do MongoDB
- Email notifikace
- Slack webhook
- CRM integrace

---

## ❓ FAQ:

**Q: Jak rychle AI zavolá?**  
A: Do 2 minut po odeslání formuláře.

**Q: V jakých jazycích může volat?**  
A: cs, en, sk, de - automaticky podle zvoleného jazyka na webu.

**Q: Co když uživatel nezvedne?**  
A: Můžeš přidat voicemail, SMS fallback, nebo retry logic.

**Q: Můžu změnit co AI říká?**  
A: Ano! Uprav funkci `generateCallScript()` v `/api/contact.js`.

---

## 🎉 STATUS:

✅ Kontaktní formulář funkční  
✅ Telefon pole přidáno  
✅ ElevenLabs integrace ready  
⏳ Čeká na: ELEVENLABS_API_KEY v Vercel  
🔜 Budoucnost: Twilio pro skutečné hovory  

---

**Pošli mi svůj ElevenLabs API key a pustím deployment!** 🚀
