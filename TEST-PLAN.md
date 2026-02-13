# Debug Plan - ChciAI.cz

## Problém
React app crashuje při přidání nových sekcí (OpenClaw, Vibe Coding, Pricing).

## Možné příčiny:
1. ❌ Emoji v JSX (🤖, 📚, 💰) - encoding issue
2. ❌ Nested components without proper keys
3. ❌ Missing closing tags
4. ❌ Style object syntax errors
5. ❌ Array.map() without proper return

## Test postup:
1. Přidat JEDNU sekci (OpenClaw) bez emoji
2. Otestovat
3. Pokud funguje → přidat další
4. Pokud nefunguje → najít přesný řádek

## Rychlé řešení:
- Vytvořit ultra-clean verzi
- Bez emoji (použít HTML entity)
- Jednodušší styling
- Testovat postupně

## Fallback:
- Separátní stránky (/openclaw, /pricing)
- React Router routes
- Jednotlivé komponenty testované zvlášť
