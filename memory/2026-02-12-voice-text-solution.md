# ChciAI.cz - Voice + Text Solution

## Požadavek: Nejlepší kvalita pro voice + text chat

## 🎯 Optimální Stack:

### **Text Chat: Anthropic Claude Sonnet 4**
**Proč:**
- ✅ Nejpřirozenější konverzace
- ✅ Nejlepší čeština
- ✅ Empatický a lidský tone
- ✅ Skvělý pro business use case
- ✅ Lepší context understanding

**Cost:** ~$3/1M input, $15/1M output
**Real cost:** ~$15-20 / 1000 konverzací

---

### **Voice (Speech-to-Text): OpenAI Whisper**
**Proč:**
- ✅ Nejlepší přesnost pro češtinu
- ✅ 99%+ accuracy
- ✅ Robustní proti šumu
- ✅ Levné ($0.006 / minuta)

**Cost:** ~$0.60 / 100 minut nahrávek

---

### **Voice (Text-to-Speech): ElevenLabs**
**Proč:**
- ✅ #1 realistický hlas na trhu
- ✅ Perfektní čeština
- ✅ Emoce a intonace
- ✅ Zní jako skutečný člověk
- ✅ Professional tier pro business

**Cost:** $99/měsíc = 500k znaků/měsíc
**Alt:** $22/měsíc starter (100k znaků)

**Srovnání:**
- OpenAI TTS: robotický, levný
- Google TTS: OK kvalita
- **ElevenLabs: WOW efekt** ⭐

---

## 📊 Celkové náklady (realistic):

**1000 konverzací (50% text, 50% voice):**
- Claude Sonnet: $10
- Whisper STT: $3
- ElevenLabs TTS: $20-30
**Total: ~$35-45 / 1000 konverzací**

**Pro 100 konverzací/měsíc (start):**
- ~$4-5/měsíc + ElevenLabs subscription

---

## 🚀 Setup Plan:

### Fáze 1: Core (dnes)
1. **OpenAI API** - pro Whisper STT + fallback TTS
2. **Anthropic API** - pro Claude Sonnet chat
3. Deploy + test

### Fáze 2: Premium Voice (příští týden)
1. **ElevenLabs API** - upgrade TTS
2. Voice cloning (vlastní hlas pro brand)
3. A/B testing

---

## ✅ Akce NOW:

Potřebuji 2 API klíče:

1. **OpenAI** (Whisper + fallback):
   - https://platform.openai.com/api-keys
   - Billing: $20 limit

2. **Anthropic** (Claude Sonnet):
   - https://console.anthropic.com/
   - Billing: $20 credit start

*ElevenLabs later (až ověříme demand)*

---

## 🎤 Voice Flow:

```
User speaks → Whisper (STT) → Claude (AI brain) → ElevenLabs (TTS) → User hears
              $0.006/min        $0.015/response    $0.10/response
```

**Result:** Hlas co zní jako profesionální call center agent 🎯
