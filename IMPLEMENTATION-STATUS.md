# Implementation Status - ChciAI.cz

## ✅ HOTOVO (Implemented)

### 1. **Database System**
- ✅ In-memory database (`lib/database.js`)
- ✅ Client storage (email, password, trial dates)
- ✅ Trial time tracking
- ✅ Status management (trial, active, expired, suspended)
- ✅ Port assignment for each client
- ✅ Helper functions for trial management

### 2. **Registration Flow**
- ✅ Signup page with validation
- ✅ Password hashing (bcryptjs)
- ✅ Email duplicate check
- ✅ Automatic 24h trial assignment
- ✅ Port generation for OpenClaw
- ✅ Success animation with progress

### 3. **Dashboard**
- ✅ Real-time trial countdown
- ✅ Trial status display (active/expired)
- ✅ OpenClaw link with URL
- ✅ Payment CTA for activation
- ✅ Support cards (Clawix chat, call request)
- ✅ Auto-refresh trial time (every minute)

### 4. **API Endpoints**
- ✅ `/api/register` - Registration with trial
- ✅ `/api/client` - Get client info + trial status
- ✅ `/api/create-checkout` - Stripe checkout (prepared)
- ✅ `/api/webhook/stripe` - Stripe webhooks (prepared)

### 5. **Payment Flow**
- ✅ Install/checkout page
- ✅ Base price: 499 Kč/měs
- ✅ Optional Academy: +349 Kč
- ✅ Stripe integration prepared (waiting for keys)
- ✅ Mock payment for testing

### 6. **Trial System**
- ✅ 24h trial on signup
- ✅ Countdown timer in dashboard
- ✅ Expired trial detection
- ✅ Helper functions for trial management

---

## 🚧 TODO (Needs Implementation)

### 1. **VPS OpenClaw Installation**
```bash
# Script to create on VPS: /opt/chciai/scripts/install-openclaw.sh

#!/bin/bash
CLIENT_ID=$1
PORT=$2

# Create directory
mkdir -p /opt/chciai/instances/$CLIENT_ID

# Pull OpenClaw (Docker or direct install)
# Example: docker run or git clone + npm install

# Start OpenClaw on specified port
# Example: docker run -d --name openclaw_$CLIENT_ID -p $PORT:8080 openclaw/image

echo "OpenClaw installed for $CLIENT_ID on port $PORT"
```

**How to trigger:**
- From `/api/register` after client creation
- SSH to VPS and run install script
- Store container ID in database

### 2. **Trial Expiration Cron Job**
```javascript
// /api/cron/check-trials/route.js

import { getExpiredTrials, getSoonExpiringTrials, updateClientStatus } from '@/lib/database'

export async function GET(request) {
  // Check authorization (cron secret)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get expired trials
  const expired = await getExpiredTrials()
  for (const client of expired) {
    console.log('🔴 Trial expired for:', client.email)
    
    // Stop OpenClaw container
    // await stopOpenClawContainer(client.clientId)
    
    // Update status
    await updateClientStatus(client.clientId, 'expired')
    
    // Send email
    // await sendTrialExpiredEmail(client)
  }

  // Get soon expiring (2h before)
  const expiring = await getSoonExpiringTrials(2)
  for (const client of expiring) {
    console.log('⚠️ Trial expiring soon for:', client.email)
    // await sendTrialExpiringEmail(client)
  }

  return Response.json({ 
    expired: expired.length,
    expiring: expiring.length 
  })
}
```

**Setup cron:**
- Vercel Cron (vercel.json)
- Or external cron service (cron-job.org)
- Run every hour

### 3. **Email Notifications**
```javascript
// lib/email.js

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.wedos.net
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // info@chciai.cz
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendWelcomeEmail(client) {
  await transporter.sendMail({
    from: '"ChciAI.cz" <info@chciai.cz>',
    to: client.email,
    subject: '🎉 Váš OpenClaw je připravený!',
    html: `
      <h1>Vítejte v ChciAI!</h1>
      <p>Váš OpenClaw byl nainstalován a je připravený k použití.</p>
      <p><strong>Přihlašovací údaje:</strong></p>
      <ul>
        <li>URL: ${client.openclawUrl}</li>
        <li>Email: ${client.email}</li>
        <li>Heslo: (vaše zvolené heslo)</li>
      </ul>
      <p><strong>24h trial:</strong> Máte plný přístup po dobu 24 hodin zdarma.</p>
      <p>Po trial můžete aktivovat za 499 Kč/měs.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Přejít do dashboardu</a>
    `,
  })
}

export async function sendTrialExpiringEmail(client) {
  // Similar email warning about trial expiration
}

export async function sendTrialExpiredEmail(client) {
  // Email about trial expiration + activation link
}

export async function sendActivationEmail(client) {
  // Confirmation after payment
}
```

### 4. **Authentication System**
Currently uses hardcoded email. Need to add:
- JWT tokens or NextAuth.js
- Session management
- Login flow with password verification
- Logout functionality

### 5. **Stripe Integration**
Uncomment code in:
- `/api/create-checkout/route.js`
- `/api/webhook/stripe/route.js`

Add environment variables:
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 6. **Database Migration**
Current: In-memory (resets on restart)
Future: Migrate to Supabase or PostgreSQL

Replace imports in all API routes:
```javascript
// From:
import { createClient, getClientByEmail } from '@/lib/database'

// To:
import { createClient, getClientByEmail } from '@/lib/supabase'
```

---

## 🔒 Security Checklist

- ✅ Password hashing (bcryptjs)
- ✅ Input validation
- ⏳ Rate limiting (TODO)
- ⏳ CSRF protection (TODO)
- ⏳ Session security (TODO)
- ⏳ Environment variables for secrets
- ⏳ Stripe webhook signature verification

---

## 📊 Environment Variables Needed

```bash
# .env.production

# Database (when migrating from in-memory)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# VPS
VPS_IP=46.28.111.185
VPS_SSH_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email (WEDOS)
SMTP_HOST=smtp.wedos.net
SMTP_PORT=587
SMTP_USER=info@chciai.cz
SMTP_PASSWORD=

# App
NEXT_PUBLIC_APP_URL=https://chciaicz.vercel.app
CRON_SECRET= # For cron job authentication
JWT_SECRET= # For session tokens
```

---

## 🚀 Next Steps (Priority Order)

1. **Add Stripe keys** → Enable real payments
2. **Setup VPS Docker** → Test OpenClaw installation
3. **Add email SMTP** → Welcome + expiration emails
4. **Create cron job** → Trial expiration checker
5. **Add authentication** → Real login/logout
6. **Migrate to Supabase** → Persistent database

---

## 📝 Notes

**Current state:**
- ✅ Full UI/UX implemented
- ✅ Trial system working
- ✅ Payment flow ready
- ⏳ Backend automation pending

**Test flow:**
1. Register → Creates trial
2. Dashboard → Shows trial countdown
3. Click "Aktivovat" → Mock Stripe (ready for real)
4. OpenClaw link → Placeholder URL (ready for real VPS)

**Everything is prepared - just needs:**
- Stripe keys
- VPS setup
- Email SMTP
- Cron job

Martin can test the full UI flow right now! 🎯
