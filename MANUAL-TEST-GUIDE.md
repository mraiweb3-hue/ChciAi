# Manual Test Guide - ChciAI.cz

## 🧪 Jak otestovat celý systém

### Test 1: Registrace nového uživatele

1. **Otevři:** https://chciaicz.vercel.app
2. **Klikni:** "Začít zdarma"
3. **Vyplň:**
   - Jméno: Jan
   - Příjmení: Novák
   - Email: test@test.cz
   - Telefon: +420123456789
   - Firma: Test s.r.o.
   - Heslo: test1234
   - Potvrdit heslo: test1234
4. **Klikni:** "Vytvořit účet zdarma"
5. **Očekávaný výsledek:**
   - ✅ Zobrazí se "Instalace OpenClaw..."
   - ✅ Po 2 sekundách přesměrování na `/dashboard`

---

### Test 2: Dashboard (Trial stav)

1. **Měl bys vidět:**
   - ✅ Zelený banner: "24h Trial aktivní! Zbývá X hodin"
   - ✅ Modrý card: "Přejít do OpenClaw" s URL
   - ✅ Žlutý card: "Aktivovat nyní"
   - ✅ Email nahoře (test@test.cz)
   - ✅ Tlačítko "Odhlásit"

2. **Vyzkoušej:**
   - Klikni na "Otevřít OpenClaw Dashboard" (otevře novou záložku s URL)
   - Klikni na "Aktivovat" → přesměruje na checkout page

---

### Test 3: Checkout / Platba (Mock režim)

1. **Na checkout page vidíš:**
   - ✅ Cena: 499 Kč/měs
   - ✅ Checkbox: "VibeCooding Academy (+349 Kč)"
   - ✅ Celková cena se přepočítá

2. **Klikni:** "Zaplatit a aktivovat"
3. **Očekávaný výsledek:**
   - ✅ Alert: "TEST REŽIM: Platba simulována jako úspěšná!"
   - ✅ Přesměrování na `/dashboard?payment=success`
   - ✅ Zelený banner: "Platba úspěšná! 🎉"

---

### Test 4: Odhlášení a Login

1. **V dashboardu klikni:** "Odhlásit"
2. **Očekávaný výsledek:**
   - ✅ Přesměrování na homepage
   - ✅ Session vymazána

3. **Klikni:** "Přihlásit se" (v headeru)
4. **Vyplň:**
   - Email: test@test.cz
   - Heslo: test1234
5. **Klikni:** "Přihlásit se"
6. **Očekávaný výsledek:**
   - ✅ Přesměrování na `/dashboard`
   - ✅ Data zobrazena (trial countdown, OpenClaw URL)

---

### Test 5: Dark Mode

1. **Klikni:** Měsíc/Slunce icon (vpravo nahoře)
2. **Očekávaný výsledek:**
   - ✅ Celý web přepne na dark mode
   - ✅ Barvy se změní (dark background, light text)
   - ✅ Preference uložena (refresh zachová dark mode)

---

### Test 6: Mobile Responsive

1. **Otevři dev tools** (F12)
2. **Zapni mobile view** (Ctrl+Shift+M)
3. **Zkontroluj:**
   - ✅ Menu se složí do hamburgeru
   - ✅ Formuláře jsou použitelné
   - ✅ Buttons jsou dostatečně velké
   - ✅ Text je čitelný

---

### Test 7: Edge Cases

#### Duplicitní email:
1. Zkus registrovat test@test.cz znovu
2. **Očekávaný výsledek:**
   - ✅ Error: "Email je již registrován"

#### Slabé heslo:
1. Zkus heslo: "1234"
2. **Očekávaný výsledek:**
   - ✅ Error: "Heslo musí mít minimálně 8 znaků"

#### Nesprávné heslo při loginu:
1. Login s email test@test.cz, heslo: wrongpass
2. **Očekávaný výsledek:**
   - ✅ Error: "Nesprávný email nebo heslo"

#### Přístup k dashboardu bez loginu:
1. Vymaž cookies/localStorage
2. Jdi na https://chciaicz.vercel.app/dashboard
3. **Očekávaný výsledek:**
   - ✅ Přesměrování na `/signup`

---

## 🐛 Známé problémy (aktuálně):

1. ❌ OpenClaw URL je placeholder (46.28.111.185:PORT)
   - Fix: Potřeba real VPS instalace

2. ❌ Email notifikace nechodí
   - Fix: Potřeba SMTP credentials

3. ❌ Real Stripe není aktivní
   - Fix: Přidat Stripe keys

4. ❌ Trial countdown je mockup
   - Fix: Database tracking (funguje v memory DB)

---

## ✅ Co funguje:

1. ✅ Registrace s validací
2. ✅ Password hashing (bcrypt)
3. ✅ Login/Logout
4. ✅ Session management (localStorage)
5. ✅ Dark/Light mode
6. ✅ Mock payment flow
7. ✅ Responsive design
8. ✅ Error handling
9. ✅ Success messages
10. ✅ Dashboard s trial info

---

## 🚀 Ready for Production po:

1. Stripe keys
2. VPS OpenClaw auto-install
3. Email SMTP
4. Database migrate (memory → Supabase)

Martin: Otestuj prosím tento checklist a dej feedback! 🎯
