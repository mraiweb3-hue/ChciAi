# Email Setup pro ChciAI.cz

## Email: info@chciai.cz

### Možnosti nastavení:

#### 1. WEDOS Email Hosting
- Přihlaste se na WEDOS.cz
- Sekce "Email" → "Vytvořit schránku"
- Email: info@chciai.cz
- Nastavte heslo
- SMTP/IMAP přístup pro integraci

#### 2. Gmail s vlastní doménou
- Google Workspace (placené)
- Nebo Gmail aliasing

#### 3. Forwardování
- WEDOS → Nastavení DNS
- Vytvořit MX záznamy
- Forwardovat na existující email

### SMTP Konfigurace (pro formuláře):

```env
SMTP_HOST="smtp.wedos.net"
SMTP_PORT=587
SMTP_USER="info@chciai.cz"
SMTP_PASSWORD="vaše_heslo"
SMTP_FROM="info@chciai.cz"
```

### DNS Záznamy (MX):

```
Type: MX
Name: @
Priority: 10
Value: mx.wedos.net
```

## Doporučení:
✅ Vytvořit email info@chciai.cz na WEDOS
✅ Nastavit auto-reply
✅ Integrovat do kontaktního formuláře
