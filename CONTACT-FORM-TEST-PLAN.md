# 📋 KONTAKTNÍ FORMULÁŘ - TESTOVACÍ PLÁN

## 🎯 CO TESTUJEME:

1. ✅ Formulář se odešle
2. ✅ API endpoint funguje
3. ✅ Telefon se uloží
4. ✅ Success message se zobrazí
5. 🔜 AI voice call se spustí (až bude ElevenLabs key)

---

## 🧪 TEST 1: ZÁKLADNÍ FUNKČNOST

### Kroky:
1. Otevři: **https://www.chciai.cz**
2. Scroll dolů na sekci **"Napište nám"**
3. Vyplň formulář:
   - **Jméno:** Martin Testovací
   - **Email:** test@chciai.cz
   - **Telefon:** +420 123 456 789
   - **Firma:** Test s.r.o.
   - **Zpráva:** Testuji kontaktní formulář
4. Klikni **"Odeslat"**

### Očekávaný výsledek:
```
✅ Zelená ikonka se objeví
✅ Text: "Děkujeme!"
✅ Text: "Formulář byl úspěšně odeslán."
✅ Text: "📞 Náš AI asistent vám zavolá do 2 minut!"
```

### Co zkontrolovat v DevTools (F12):
```
Network tab → /api/contact
Status: 200 OK
Response: {
  "success": true,
  "message": "Formulář odeslán úspěšně",
  "voiceCallInitiated": true/false,
  "estimatedCallTime": "2 minuty"
}
```

---

## 🧪 TEST 2: VOICE CALL (BEZ ELEVENLABS KEY)

### Co se stane TEĎ (bez API key):
```
1. Formulář se odešle ✅
2. Data se uloží ✅
3. Backend zkusí zavolat ElevenLabs
4. Selže (no API key) ❌
5. ALE formulář je OK! ✅
```

### Response:
```json
{
  "success": true,
  "message": "Formulář odeslán úspěšně",
  "voiceCallInitiated": false,  ← false protože chybí key
  "estimatedCallTime": "2 minuty"
}
```

---

## 🧪 TEST 3: VOICE CALL (S ELEVENLABS KEY)

### Po přidání API key:

1. **Přidej do Vercel:**
   ```bash
   vercel env add ELEVENLABS_API_KEY production
   → vlož: sk_xxxxxxxxxxxxx
   ```

2. **Redeploy:**
   ```bash
   vercel --prod
   ```

3. **Pak zkus formulář znovu**

### Co se stane:
```
1. Formulář odeslán ✅
2. Backend volá ElevenLabs API ✅
3. ElevenLabs generuje AI audio ✅
4. Audio URL se uloží
5. Response: "voiceCallInitiated": true ✅
```

---

## 🎤 JAK FUNGUJE VOICE CALL:

### Současný stav (bez Twilio):
```
User vyplní formulář
    ↓
Backend /api/contact.js
    ↓
ElevenLabs API vytvoří audio
    ↓
Audio se uloží (zatím jen URL)
    ↓
[MANUAL] Můžeš ho přehrát/poslat klientovi
```

### Budoucí stav (s Twilio):
```
User vyplní formulář
    ↓
Backend /api/contact.js
    ↓
ElevenLabs → vygeneruje audio
    ↓
Twilio → zavolá na telefon
    ↓
Přehraje audio
    ↓
User dostane SKUTEČNÝ hovor! 📞
```

---

## 🛠️ CO CHYBÍ PRO PLNOU FUNKČNOST:

### Fáze 1: ✅ HOTOVO
- [x] Kontaktní formulář
- [x] API endpoint `/api/contact`
- [x] Telefon pole
- [x] ElevenLabs integrace v kódu

### Fáze 2: ⏳ ČEKÁ NA TEBE
- [ ] ElevenLabs API key do Vercel ENV
- [ ] Test že audio se generuje

### Fáze 3: 🔜 BUDOUCNOST
- [ ] Twilio účet
- [ ] Twilio API key
- [ ] Koupit telefonní číslo
- [ ] Integrace Twilio → skutečné hovory
- [ ] MongoDB pro ukládání kontaktů
- [ ] Email notifikace

---

## 📊 DEBUGGING CHECKLIST:

### Pokud formulář nefunguje:

**1. Zkontroluj Network tab:**
```
POST /api/contact
Status: ??? (mělo by být 200)
```

**2. Pokud 404:**
```
→ API endpoint nebyl deploynut
→ Zkontroluj vercel.json
→ Redeploy: vercel --prod
```

**3. Pokud 500:**
```
→ Podívej se do Response na error message
→ Možné příčiny:
   - Missing field (phone/name)
   - ElevenLabs API error
   - Network timeout
```

**4. Pokud form se neodešle vůbec:**
```
→ F12 → Console
→ Hledej červené errory
→ Možná: CORS issue, axios timeout
```

---

## 🎯 VÝSLEDKY TESTŮ:

### Test 1: Formulář submit ✅/❌
```
Očekáváno: Success message
Výsledek: _______
Status: _______
```

### Test 2: API response ✅/❌
```
Očekáváno: 200 OK + JSON
Výsledek: _______
Response: _______
```

### Test 3: Voice call ✅/❌
```
Očekáváno: voiceCallInitiated: true/false
Výsledek: _______
API Key configured: _______
```

---

## 🔧 QUICK FIX COMMANDS:

### Pokud nefunguje, zkus:

```bash
# 1. Force redeploy
cd /root/clawd/chciai-new
vercel --prod --force

# 2. Zkontroluj že /api/contact.js je v Gitu
ls -la api/contact.js

# 3. Zkontroluj ENV variables
vercel env ls

# 4. Zkontroluj deployment status
vercel ls
```

---

## 📞 MANUAL TEST (pro kontrolu):

### Zavolej API přímo z terminálu:

```bash
curl -X POST https://www.chciai.cz/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.cz",
    "phone": "+420123456789",
    "company": "Test Company",
    "message": "Test message",
    "language": "cs"
  }'
```

### Očekávaná odpověď:
```json
{
  "success": true,
  "message": "Formulář odeslán úspěšně",
  "voiceCallInitiated": false,
  "estimatedCallTime": "2 minuty"
}
```

---

## 🎉 KDYŽ VŠE FUNGUJE:

### Frontend:
- ✅ Formulář má všechna pole
- ✅ Submit button funguje
- ✅ Success message se zobrazí
- ✅ Formulář se vyčistí

### Backend:
- ✅ API endpoint odpovídá
- ✅ Validace dat funguje
- ✅ Telefon se ukládá
- ✅ ElevenLabs integrace ready

### Next:
- 🔜 Přidat ElevenLabs key
- 🔜 Test voice generation
- 🔜 Twilio integrace
- 🔜 Database storage
- 🔜 Email notifications

---

**STATUS:** Deploy běží... Počkej 2-3 minuty a pak zkus test! 🚀
