# Free LLM Solution - Dočasné řešení

## Situace:
- OpenAI vyžaduje billing
- Martin přidá kartu večer
- Potřebujeme chat FUNGUJÍCÍ teď

## ✅ Řešení: Groq API (FREE & FAST)

### Proč Groq:
- ✅ **100% zdarma** (60 requests/min)
- ✅ **Nejrychlejší inference** na trhu (10x rychlejší než OpenAI)
- ✅ Podporuje llama-3.1-70b (velmi kvalitní čeština)
- ✅ Žádná kreditka potřeba
- ✅ Plug-and-play kompatibilní s OpenAI API

### Modely:
- `llama-3.1-70b-versatile` - nejlepší kvalita, skvělá čeština
- `llama-3.1-8b-instant` - rychlejší, stále dobrá kvalita
- `mixtral-8x7b-32768` - dlouhý context

### API Key:
1. https://console.groq.com/
2. Sign up (email only, žádná karta)
3. Create API key
4. Profit!

### Cost:
- **FREE tier:** 60 requests/min, 6000/den
- Pro startup víc než dost!

### Later (večer):
- Přidat OpenAI billing
- A/B test Groq vs OpenAI
- Rozhodnout co použít (možná Groq je lepší!)

---

## Implementace:
Změnit pouze endpoint a model v `/api/chat.js`:
```javascript
// Groq endpoint
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'llama-3.1-70b-versatile',
    // zbytek stejné jako OpenAI
  })
});
```

**Kompatibilní formát = easy switch!**
