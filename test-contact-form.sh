#!/bin/bash

echo "════════════════════════════════════════════════"
echo "🧪 KONTAKTNÍ FORMULÁŘ - AUTOMATICKÝ TEST"
echo "════════════════════════════════════════════════"
echo ""

# Test 1: Zkontroluj že endpoint existuje
echo "📍 TEST 1: Existuje /api/contact endpoint?"
status=$(curl -s -o /dev/null -w "%{http_code}" https://www.chciai.cz/api/contact)
if [ "$status" == "405" ]; then
  echo "   ✅ Ano! Endpoint existuje (405 = Method Not Allowed na GET, což je OK)"
elif [ "$status" == "404" ]; then
  echo "   ❌ NE! 404 - endpoint nebyl deploynut"
  exit 1
else
  echo "   ⚠️  Status: $status (neočekáváno)"
fi
echo ""

# Test 2: Odeslat testovací formulář
echo "📍 TEST 2: POST request na /api/contact"
echo "Posílám data:"
echo '{
  "name": "Martin Test",
  "email": "test@chciai.cz",
  "phone": "+420123456789",
  "company": "Test Company",
  "message": "Automatický test formuláře",
  "language": "cs"
}'
echo ""

response=$(curl -s -X POST https://www.chciai.cz/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Martin Test",
    "email": "test@chciai.cz",
    "phone": "+420123456789",
    "company": "Test Company",
    "message": "Automatický test formuláře",
    "language": "cs"
  }')

echo "Odpověď serveru:"
echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
echo ""

# Test 3: Zkontroluj response
echo "📍 TEST 3: Validace response"
success=$(echo "$response" | grep -o '"success":true' | head -1)
if [ -n "$success" ]; then
  echo "   ✅ success: true"
else
  echo "   ❌ success != true"
fi

voice=$(echo "$response" | grep -o '"voiceCallInitiated":[^,}]*' | head -1)
if [ -n "$voice" ]; then
  echo "   ✅ voiceCallInitiated: $(echo $voice | cut -d':' -f2)"
else
  echo "   ⚠️  voiceCallInitiated pole chybí"
fi
echo ""

# Test 4: Zkontroluj missing fields
echo "📍 TEST 4: Test validace (missing fields)"
error_response=$(curl -s -X POST https://www.chciai.cz/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}')
  
error=$(echo "$error_response" | grep -o '"error"' | head -1)
if [ -n "$error" ]; then
  echo "   ✅ Validace funguje - error když chybí pole"
  echo "   Error message: $(echo "$error_response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','N/A'))" 2>/dev/null)"
else
  echo "   ⚠️  Validace možná nefunguje"
fi
echo ""

# Shrnutí
echo "════════════════════════════════════════════════"
echo "📊 SHRNUTÍ TESTŮ"
echo "════════════════════════════════════════════════"
echo ""
echo "✅ = Test prošel"
echo "❌ = Test selhal"
echo "⚠️  = Varování"
echo ""
echo "NEXT STEPS:"
echo "1. Pokud všechny testy ✅ → Formulář funguje!"
echo "2. Přidej ELEVENLABS_API_KEY pro voice calls"
echo "3. Test na produkci: otevři www.chciai.cz"
echo ""
