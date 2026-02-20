# Testing Checklist - ChciAI.cz

## 🧪 TEST PLAN:

### 1. **Homepage**
- [ ] Dark/Light mode toggle funguje
- [ ] "Začít zdarma" button funguje
- [ ] Scroll animace fungují
- [ ] Responsive design (mobile)

### 2. **Registrace (/signup)**
- [ ] Formulář validace funguje
- [ ] Email duplicate check funguje
- [ ] Password hashing funguje
- [ ] Success redirect na /dashboard
- [ ] Error messages zobrazují

### 3. **Dashboard (/dashboard)**
- [ ] Trial countdown zobrazuje správně
- [ ] OpenClaw URL správná
- [ ] "Aktivovat" button funguje
- [ ] Support buttons fungují

### 4. **Install/Checkout (/dashboard/install)**
- [ ] Cena 499 Kč zobrazena
- [ ] Academy checkbox funguje
- [ ] Mock Stripe funguje
- [ ] Redirect po platbě

### 5. **API Endpoints**
- [ ] /api/register - vytváří klienta
- [ ] /api/client - vrací data
- [ ] /api/create-checkout - mock funguje
- [ ] /api/login - placeholder

### 6. **Edge Cases**
- [ ] Duplicate email registration
- [ ] Invalid password
- [ ] Expired trial
- [ ] Missing data

---

## 🐛 KNOWN ISSUES TO FIX:

1. Login není implementovaný (používá placeholder email)
2. Dashboard potřebuje real auth
3. Email notifications nejsou aktivní
4. VPS auto-install není propojený

---

Začínám testování...
