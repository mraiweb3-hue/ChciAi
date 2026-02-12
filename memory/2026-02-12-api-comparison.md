# API Comparison for ChciAI.cz Chat Bot

## Date: 2026-02-12

## Problem:
Chat bot shows "LLM API error: 404" - need working API solution

## Options Analysis:

### 1. OpenAI API (gpt-4o-mini) ⭐ **DOPORUČUJI**

**Pros:**
- ✅ Nejlevnější ($0.15 / 1M input tokens, $0.60 / 1M output)
- ✅ Rychlý a stabilní
- ✅ Perfektní čeština
- ✅ Jednoduchá integrace
- ✅ 95% kvalita Claude za 10% ceny
- ✅ FUNGUJE okamžitě

**Cons:**
- ❌ Není "top-tier" jako Claude Opus

**Cost for 1000 conversations:**
- ~$2-3 (velmi levné!)

**Verdict:** 🏆 **NEJLEPŠÍ volba pro start**

---

### 2. Anthropic Claude Sonnet 4

**Pros:**
- ✅ Nejlepší kvalita odpovědí
- ✅ Skvělá čeština
- ✅ Empatický tone

**Cons:**
- ❌ Dražší (~$3 / 1M input, $15 / 1M output)
- ❌ Složitější API (jiný formát než OpenAI)

**Cost for 1000 conversations:**
- ~$15-20

**Verdict:** 💎 Skvělé pro premium klienty, ale dražší

---

### 3. OpenAI GPT-4 Turbo

**Pros:**
- ✅ Vyšší kvalita než gpt-4o-mini
- ✅ Stejné API jako gpt-4o-mini

**Cons:**
- ❌ 5x dražší než gpt-4o-mini
- ❌ Zbytečně silné pro chat bot

**Cost:** ~$10-12 / 1000 conversations

**Verdict:** ⚖️ Overkill pro tento use case

---

## 🎯 Finální Rozhodnutí:

**START: OpenAI gpt-4o-mini**
- Rychle nasadit
- Nízké náklady ($2-3 / 1000 konverzací)
- Testovat s reálnými klienty

**LATER: Přidat Claude Sonnet 4**
- Pro VIP klienty nebo komplexnější dotazy
- Implementovat A/B testing
- Rozhodnout podle feedbacku

---

## Akce:
1. Získat OpenAI API klíč (https://platform.openai.com/api-keys)
2. Nastavit billing limit ($20/měsíc)
3. Přidat do Vercel env vars
4. Deploy + test
