# Deployment Checklist - ChciAI.cz

## ✅ Phase 1: Infrastructure Setup (10 min)

### 1. Supabase Database
- [ ] Create Supabase project: https://supabase.com/dashboard
- [ ] Run `DATABASE-SCHEMA.sql` in SQL Editor
- [ ] Copy Supabase URL and keys to `.env.production`
- [ ] Test connection

### 2. VPS Docker Setup (46.28.111.185)
```bash
# SSH into VPS
ssh root@46.28.111.185

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Create directories
mkdir -p /opt/chciai/instances
mkdir -p /opt/chciai/scripts

# Upload install script
# (create install-openclaw.sh - see REGISTRATION-SYSTEM.md)
```

### 3. Stripe Account
- [ ] Create Stripe account: https://dashboard.stripe.com
- [ ] Create product: "ChciAI - AI Assistant" (990 Kč/month recurring)
- [ ] Get API keys (publishable + secret)
- [ ] Setup webhook: https://chciaicz.vercel.app/api/webhook/stripe
- [ ] Test mode first, then activate live mode

### 4. Email (WEDOS SMTP)
- [ ] Get SMTP credentials from WEDOS
- [ ] Add to `.env.production`
- [ ] Test with Nodemailer

## ✅ Phase 2: Deploy to Vercel (5 min)

### Environment Variables in Vercel Dashboard
```bash
# Add all variables from .env.production
# Settings → Environment Variables
```

### Deploy
```bash
cd /root/clawd/chciai.cz
npm install
vercel --prod
```

## ✅ Phase 3: Testing (10 min)

### Test Registration Flow
1. Go to https://chciaicz.vercel.app/signup
2. Register with test email
3. Check Supabase: client record created
4. Check VPS: Docker container running
5. Check email: welcome email received

### Test Payment Flow
1. Login to trial account
2. Click "Activate Account"
3. Use Stripe test card: 4242 4242 4242 4242
4. Check webhook received
5. Check Supabase: status = 'active'
6. Check dashboard: full access granted

### Test OpenClaw
1. Login to activated account
2. Try sending a message
3. Check AI response
4. Test integrations (WhatsApp, Email)

## ✅ Phase 4: Go Live (5 min)

### Switch to Production
- [ ] Stripe: Switch to live mode
- [ ] Supabase: Check RLS policies
- [ ] Vercel: Set production environment variables
- [ ] Test one real registration

### Monitoring Setup
- [ ] Vercel Analytics
- [ ] Supabase Logs
- [ ] Stripe Dashboard
- [ ] Email notifications for:
  - New registrations → Martin's WhatsApp
  - Payment failures → Martin's email
  - VPS errors → Martin's email

## 📋 Quick Start Commands

### Install dependencies
```bash
cd /root/clawd/chciai.cz
npm install
```

### Test locally
```bash
npm run dev
# Visit http://localhost:3000/signup
```

### Deploy to Vercel
```bash
vercel --prod --token YOUR_TOKEN
```

### Check VPS Docker containers
```bash
ssh root@46.28.111.185 "docker ps"
```

### Tail Vercel logs
```bash
vercel logs --token YOUR_TOKEN
```

## 🚨 Troubleshooting

### Registration fails
- Check Supabase connection
- Check database schema is created
- Check API route logs in Vercel

### Payment fails
- Check Stripe webhook is configured
- Check webhook secret matches
- Check Stripe API keys

### OpenClaw not starting
- SSH into VPS
- Check Docker logs: `docker logs openclaw_CLIENT_ID`
- Check disk space: `df -h`
- Check memory: `free -h`

## 📞 Support

If anything fails:
- Martin: +420608922096
- Email: info@chciai.cz
- Vercel logs: `vercel logs`
- Supabase logs: Dashboard → Logs

## 🎯 Success Metrics

After deployment, monitor:
- [ ] Registration success rate > 95%
- [ ] Payment conversion rate (trial → paid)
- [ ] OpenClaw uptime > 99%
- [ ] Average installation time < 5 minutes
- [ ] Customer satisfaction

## 💰 Expected Results

**Week 1:**
- 5-10 registrations
- 2-3 paid conversions
- Test all edge cases

**Month 1:**
- 50+ registrations
- 20+ paid clients
- 19,800 Kč revenue

**Month 3:**
- 200+ clients
- 198,000 Kč/month revenue
- Ready to scale VPS infrastructure

---

**Ready to launch? Let's go! 🚀**
