# Registration System - ChciAI.cz

## 🎯 Přehled

Automatizovaný registrační systém pro poskytování managed OpenClaw hostingu klientům.

## 📋 User Flow

1. **Návštěvník přijde na www.chciai.cz**
2. **Klikne "Začít zdarma"** → `/signup`
3. **Vyplní registrační formulář:**
   - Jméno a příjmení
   - Email
   - Telefon
   - Název firmy
   - Heslo
4. **Backend automaticky:**
   - Vytvoří klientský účet
   - Nainstaluje OpenClaw na VPS (Docker container)
   - Pošle přihlašovací údaje na email
5. **Klient dostane email s:**
   - URL jeho OpenClaw dashboardu
   - Přihlašovací údaje
   - Návod na první kroky
6. **Klient se přihlásí** → `/login`
7. **Redirect na jeho OpenClaw dashboard**

## 🔧 Komponenty

### Frontend Pages
- ✅ `/signup` - Registrační formulář
- ✅ `/login` - Přihlašovací formulář
- ✅ Header s "Začít zdarma" CTA
- ✅ Hero s "Začít zdarma" CTA

### Backend API
- ✅ `/api/register` - Zpracování registrace (PLACEHOLDER)
- ✅ `/api/login` - Autentizace (PLACEHOLDER)

## 🚧 TODO - Implementace

### 1. Databáze (Supabase nebo Airtable)
```javascript
// Schema pro klienty
{
  clientId: string (unique),
  firstName: string,
  lastName: string,
  email: string (unique),
  phone: string,
  company: string,
  passwordHash: string,
  status: "pending" | "installing" | "active" | "suspended",
  vpsIp: string,
  dockerContainerId: string,
  dashboardUrl: string,
  createdAt: timestamp,
  lastLogin: timestamp,
  subscription: {
    plan: "starter", // 990 Kč/měs
    status: "active" | "cancelled",
    stripeCustomerId: string,
    nextBillingDate: timestamp
  }
}
```

### 2. VPS Auto-Installation Script

**Přístup k VPS:**
- IP: `46.28.111.185`
- User: `root`
- SSH key nebo password

**Instalační proces:**
```bash
#!/bin/bash
# install-openclaw.sh

CLIENT_ID=$1
CLIENT_EMAIL=$2

# 1. Vytvoř složku pro klienta
mkdir -p /opt/chciai/instances/$CLIENT_ID

# 2. Stáhni OpenClaw install script
curl -fsSL https://docs.openclaw.ai/install.sh -o /tmp/openclaw-install.sh

# 3. Spusť Docker kontejner s OpenClaw
docker run -d \
  --name openclaw_$CLIENT_ID \
  --restart unless-stopped \
  -e CLIENT_ID=$CLIENT_ID \
  -e CLIENT_EMAIL=$CLIENT_EMAIL \
  -v /opt/chciai/instances/$CLIENT_ID:/data \
  -p 0:8080 \
  clawdbot/clawdbot:latest

# 4. Zjisti přiřazený port
PORT=$(docker port openclaw_$CLIENT_ID 8080 | cut -d: -f2)

echo "OpenClaw installed for $CLIENT_ID on port $PORT"
```

**Spuštění z backend API:**
```javascript
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

async function installOpenClaw(clientData) {
  const sshCommand = `
    ssh root@46.28.111.185 << 'EOF'
      bash /opt/chciai/scripts/install-openclaw.sh ${clientData.clientId} ${clientData.email}
    EOF
  `
  
  try {
    const { stdout, stderr } = await execAsync(sshCommand)
    console.log('Installation output:', stdout)
    
    // Parse port number from output
    const portMatch = stdout.match(/port (\d+)/)
    const port = portMatch ? portMatch[1] : null
    
    return {
      success: true,
      port,
      dashboardUrl: `http://46.28.111.185:${port}`
    }
  } catch (error) {
    console.error('Installation failed:', error)
    throw error
  }
}
```

### 3. Email Service (WEDOS SMTP)

**SMTP konfigurace:**
```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.wedos.net', // TODO: Verify actual WEDOS SMTP host
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: 'info@chciai.cz',
    pass: process.env.EMAIL_PASSWORD
  }
})

async function sendWelcomeEmail(clientData) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .credentials { background: white; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Vítejte v ChciAI.cz!</h1>
        </div>
        <div class="content">
          <p>Ahoj ${clientData.firstName},</p>
          
          <p>Váš OpenClaw účet byl úspěšně vytvořen! 🚀</p>
          
          <div class="credentials">
            <h3>📋 Vaše přihlašovací údaje:</h3>
            <p><strong>Dashboard URL:</strong> ${clientData.dashboardUrl}</p>
            <p><strong>Email:</strong> ${clientData.email}</p>
            <p><strong>Heslo:</strong> (vaše zvolené heslo)</p>
          </div>
          
          <a href="${clientData.dashboardUrl}" class="button">Přejít do dashboardu →</a>
          
          <h3>📚 Další kroky:</h3>
          <ol>
            <li>Přihlaste se do dashboardu</li>
            <li>Projděte si základní nastavení</li>
            <li>Připojte své komunikační kanály (WhatsApp, Email, ...)</li>
            <li>Nakonfigurujte svého AI asistenta</li>
          </ol>
          
          <p><strong>Potřebujete pomoc?</strong><br>
          📧 Email: <a href="mailto:info@chciai.cz">info@chciai.cz</a><br>
          📱 WhatsApp: +420608922096<br>
          🎓 Akademie: <a href="https://www.chciai.cz/academy">www.chciai.cz/academy</a></p>
          
          <p>S pozdravem,<br>
          <strong>Tým ChciAI.cz</strong></p>
        </div>
      </div>
    </body>
    </html>
  `
  
  await transporter.sendMail({
    from: '"ChciAI.cz" <info@chciai.cz>',
    to: clientData.email,
    subject: '🎉 Váš OpenClaw účet je připraven!',
    html: emailHtml
  })
}
```

### 4. Stripe Integration (Payments)

**Webhook handler:**
```javascript
// /api/webhook/stripe

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )
  
  switch (event.type) {
    case 'invoice.payment_succeeded':
      // Platba OK → ujisti se že OpenClaw běží
      await resumeClient(event.data.object.customer)
      break
      
    case 'invoice.payment_failed':
      // Platba selhala → pozastav OpenClaw
      await suspendClient(event.data.object.customer)
      break
      
    case 'customer.subscription.deleted':
      // Zrušení předplatného → smaž OpenClaw
      await deleteClient(event.data.object.customer)
      break
  }
  
  return new Response('OK', { status: 200 })
}
```

### 5. Docker Management Functions

```javascript
// Suspend client (non-payment)
async function suspendClient(clientId) {
  await execAsync(`ssh root@46.28.111.185 "docker stop openclaw_${clientId}"`)
  await db.clients.updateOne(
    { clientId },
    { $set: { status: 'suspended' } }
  )
}

// Resume client (payment received)
async function resumeClient(clientId) {
  await execAsync(`ssh root@46.28.111.185 "docker start openclaw_${clientId}"`)
  await db.clients.updateOne(
    { clientId },
    { $set: { status: 'active' } }
  )
}

// Delete client (unsubscribe)
async function deleteClient(clientId) {
  await execAsync(`ssh root@46.28.111.185 "docker rm -f openclaw_${clientId}"`)
  await execAsync(`ssh root@46.28.111.185 "rm -rf /opt/chciai/instances/${clientId}"`)
  await db.clients.deleteOne({ clientId })
}
```

## 🔒 Security

### Environment Variables
```bash
# .env.local
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EMAIL_PASSWORD=
VPS_SSH_KEY=
JWT_SECRET=
```

### Password Hashing
```javascript
import bcrypt from 'bcryptjs'

async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}
```

### JWT Authentication
```javascript
import jwt from 'jsonwebtoken'

function generateToken(clientId) {
  return jwt.sign(
    { clientId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}
```

## 📊 Monitoring

### Health Checks
```javascript
// Check if client's OpenClaw is running
async function checkClientHealth(clientId) {
  const { stdout } = await execAsync(
    `ssh root@46.28.111.185 "docker ps --filter name=openclaw_${clientId} --format '{{.Status}}'"`
  )
  return stdout.includes('Up')
}
```

### Notifications
- Email: OpenClaw instance down
- Email: Payment failed
- WhatsApp: New registration (Martin)

## 🚀 Deployment Checklist

- [ ] Setup Supabase/Airtable database
- [ ] Configure WEDOS SMTP credentials
- [ ] Setup Stripe account + webhook
- [ ] Install Docker on VPS (46.28.111.185)
- [ ] Deploy install-openclaw.sh script to VPS
- [ ] Add environment variables to Vercel
- [ ] Test registration flow end-to-end
- [ ] Setup monitoring and alerts
- [ ] Create email templates
- [ ] Document client onboarding process

## 💰 Pricing

**Starter Plan: 990 Kč/měsíc**
- Vlastní OpenClaw instance
- Až 3 komunikační kanály
- Support v češtině
- Přístup k akademii

## 📞 Support

Martin: +420608922096
Email: info@chciai.cz
Web: www.chciai.cz
