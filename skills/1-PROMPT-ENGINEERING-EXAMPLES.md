# 📝 PROMPT ENGINEERING - PŘÍKLADY PRO NON-TECH

## 🎯 CO TO JE:

**Prompt** = instrukce pro AI (jako když říkáš zaměstnanci co má udělat)

**Špatný prompt:**
```
"Odpověz zákazníkovi"
```

**Dobrý prompt:**
```
"Jsi profesionální asistent pro kadeřnictví Salon Petra v Praze. 
Tvůj úkol je přátelsky odpovědět na dotaz zákazníka a nabídnout 
mu rezervaci termínu. Buď stručný (max 2-3 věty) a používej emoji 😊"
```

---

## 🔥 PRAKTICKÉ PŘÍKLADY PRO TVŮJ CHATBOT:

### Příklad 1: Kadeřnictví

**ŠPATNĚ (teď):**
```
User: "Kolik stojí barva?"
Bot: "To záleží na mnoha faktorech..."
```

**DOBŘE (po úpravě promptu):**
```
System Prompt:
"Jsi asistent pro kadeřnictví. Ceník:
- Střih dámský: 500 Kč
- Střih pánský: 300 Kč  
- Barva: 800-1200 Kč (podle délky vlasů)
- Melír: 1500 Kč

Vždy nabídni konkrétní cenu a termín."

User: "Kolik stojí barva?"
Bot: "Barva vlasů u nás stojí 800-1200 Kč podle délky vlasů 💇‍♀️ 
      Máte zájem o konkrétní termín? Máme volno zítra v 15:00."
```

---

### Příklad 2: Restaurace

**ŠPATNĚ:**
```
User: "Máte volný stůl?"
Bot: "Ano, máme."
```

**DOBŘE:**
```
System Prompt:
"Jsi asistent pro restauraci U Anděla. Otevírací doba:
- Po-Pá: 11:00-22:00
- So-Ne: 12:00-23:00
Vždy se ptej na počet lidí a preferovaný čas."

User: "Máte volný stůl?"
Bot: "Ano! 🍽️ Pro kolik osob a kdy byste chtěli rezervovat?  
      Dnes máme volno od 18:00."
```

---

### Příklad 3: E-shop

**ŠPATNĚ:**
```
User: "Kdy to doručíte?"
Bot: "Dodací lhůta je uvedena v obchodních podmínkách."
```

**DOBŘE:**
```
System Prompt:
"Jsi asistent pro e-shop BotaSklep.cz.
Doprava: 
- Express 24h: 199 Kč
- Standardní 2-3 dny: 79 Kč
- Zdarma nad 1000 Kč

Vždy nabídni nejrychlejší možnost."

User: "Kdy to doručíte?"
Bot: "Máme express dopravu do 24h za 199 Kč 🚚  
      Nebo standardní za 79 Kč (2-3 dny).  
      Nad 1000 Kč je doprava zdarma! Co preferujete?"
```

---

## 🎨 TECHNIKY Z PROMPT-ENGINEERING-GUIDE:

### 1. **Few-Shot Learning** (Ukázat AI příklady)

```
System Prompt:
"Odpovídej jako profesionální recepční. Příklady:

Q: Máte volno?
A: Ano! Pro kdy byste chtěl(a) rezervaci? 😊

Q: Kolik to stojí?
A: Naše služby začínají na 300 Kč. O jakou službu máte zájem?

Q: Kde jste?
A: Najdete nás na Václavském náměstí 10, Praha 1. 📍

Teď odpověz na tento dotaz:"
```

---

### 2. **Chain-of-Thought** (Přemýšlení krok po kroku)

```
System Prompt:
"Když dostaneš dotaz, postupuj:
1. Zjisti co zákazník chce
2. Zkontroluj máš-li tu informaci  
3. Odpověz + nabídni další krok

Příklad myšlení:
User: 'Kolik stojí střih?'
→ 1. Chce vědět cenu
→ 2. Střih = 500 Kč  
→ 3. Řeknu cenu + nabídnu termín"
```

---

### 3. **Role Prompting** (Dát AI roli)

```
"Jsi Petra, majitelka kadeřnictví s 15 lety zkušeností.  
Jsi přátelská, ale profesionální.  
Nikdy neslibuj co nemůžeš splnit.  
Vždy se představ křestním jménem."

User: "Ahoj"
Bot: "Ahoj! Jsem Petra, majitelka salonu. Jak vám mohu pomoci? 💇‍♀️"
```

---

## 🔧 JAK TO POUŽÍT PRO CHCIAI.CZ:

### KROK 1: Otevři soubor s promptem
```
/root/clawd/chciai-new/api/chat.js
```

### KROK 2: Najdi tento řádek (cca řádek 45):
```javascript
content: `Jsi AI asistent pro ChciAI.cz...`
```

### KROK 3: Uprav podle vzoru:
```javascript
content: `Jsi ${firmName}, profesionální AI asistent.

TVOJE FIRMA:
Název: ${firmName}
Typ: ${businessType} (kadeřnictví/restaurace/e-shop)
Služby: ${services}
Ceník: ${pricing}

TVŮJ STYL:
- Přátelský, ale profesionální
- Vždy nabídni konkrétní řešení
- Používej emoji občas 😊
- Odpovídej STRUČNĚ (max 3 věty)

PŘÍKLADY ODPOVĚDÍ:
${examples}

Teď odpověz na dotaz zákazníka:`
```

---

## 📊 CO TO ZLEPŠÍ:

| Před | Po |
|------|-----|
| "To záleží..." | "Střih stojí 500 Kč. Máte zájem o termín?" |
| "Ano, máme." | "Ano! Pro kolik osob? Máme volno od 18:00 🍽️" |
| Obecné odpovědi | Konkrétní + akce |
| 50% spokojenost | 90% spokojenost |

---

## 🎯 DOMÁCÍ ÚKOL:

1. Otevři `skills/prompt-engineering/guides/`
2. Přečti `prompts-intro.md`
3. Zkus napsat vlastní prompt pro svou testovací firmu
4. Pošli mi ho a já ti řeknu jak ho vylepšit!

---

**Repository:** `skills/prompt-engineering/`  
**Nejdůležitější soubory:**
- `guides/prompts-intro.md` - Základy
- `guides/prompts-chatgpt.md` - Pro ChatGPT/Claude
- `techniques/` - Pokročilé techniky
