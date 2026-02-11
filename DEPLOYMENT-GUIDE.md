# Deployment Guide - ChciAI.cz

## 🚀 Quick Start Deployment

### Prerequisites:
- ✅ GitHub repository: https://github.com/mraiweb3-hue/ChciAi.git
- ✅ MongoDB Atlas account created
- ✅ Emergent LLM Key: `sk-emergent-bEcBa024324F8269f8`

---

## 📦 Step 1: Backend Setup

### 1.1 Environment Variables

```bash
cd /root/clawd/chciai-new/backend
cp .env.template .env
```

Edit `.env` and fill in:
```env
MONGO_URL=mongodb+srv://chciai_admin:PASSWORD@cluster.mongodb.net/
DB_NAME=chciai_production
EMERGENT_LLM_KEY=sk-emergent-bEcBa024324F8269f8
CORS_ORIGINS=https://chciai.cz,http://localhost:3000
```

### 1.2 Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 1.3 Test Backend Locally

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Test: http://localhost:8000/api/

---

## 🌐 Step 2: Frontend Setup

### 2.1 Environment Variables

```bash
cd /root/clawd/chciai-new/frontend
cp .env.template .env
```

Edit `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2.2 Install Dependencies

```bash
cd frontend
yarn install
```

### 2.3 Test Frontend Locally

```bash
yarn start
```

Test: http://localhost:3000

---

## 🚀 Step 3: Deploy to Production

### Option A: Deploy on Emergent (Recommended)

#### Backend:
```bash
# Backend already in /root/clawd/chciai-new/backend
# Just ensure .env is configured
cd /root/clawd/chciai-new/backend
uvicorn server:app --host 0.0.0.0 --port 8000
```

#### Frontend:
```bash
cd /root/clawd/chciai-new/frontend
yarn build
# Serve build folder
```

### Option B: Deploy Frontend on Vercel

1. **Push to GitHub** (use Emergent UI "Save to GitHub")

2. **Connect Vercel:**
   - Go to: https://vercel.com/new
   - Import `mraiweb3-hue/ChciAi`
   - Root directory: `frontend`
   - Framework preset: `Create React App`

3. **Environment Variables in Vercel:**
   ```
   REACT_APP_BACKEND_URL = https://api.chciai.cz
   REACT_APP_POSTHOG_KEY = phc_pHEDH8bMEr9jzD0vvLgR0BXMRGKPc21EvWdDxFvKCaV
   REACT_APP_POSTHOG_HOST = https://us.i.posthog.com
   ```

4. **Deploy!** ✅

### Option C: Deploy Backend on Render.com

1. **Create account:** https://render.com

2. **New Web Service:**
   - Connect GitHub: `mraiweb3-hue/ChciAi`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables:**
   ```
   MONGO_URL = mongodb+srv://...
   DB_NAME = chciai_production
   EMERGENT_LLM_KEY = sk-emergent-bEcBa024324F8269f8
   CORS_ORIGINS = https://chciai.cz
   ```

4. **Deploy!** ✅

---

## 🔍 Step 4: Testing

### Test Backend API:

```bash
# Health check
curl https://api.chciai.cz/api/

# Test chat
curl -X POST https://api.chciai.cz/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Ahoj!",
    "language": "cs"
  }'
```

### Test Frontend:

1. Open: https://chciai.cz
2. Click "Začít Chat"
3. Send message
4. Verify AI response

---

## 📊 Step 5: Monitoring

### PostHog Analytics:
- Dashboard: https://us.posthog.com/
- Check: Daily Active Users, Chat engagement

### MongoDB Atlas:
- Dashboard: https://cloud.mongodb.com/
- Check: Database size, connections

### Backend Logs:
```bash
# If on Emergent
tail -f /var/log/backend.log

# If on Render
# Check Render dashboard logs
```

---

## 🔧 Troubleshooting

### Issue: CORS Error
**Solution:** Update `CORS_ORIGINS` in backend `.env`
```env
CORS_ORIGINS=https://chciai.cz,https://www.chciai.cz
```

### Issue: MongoDB Connection Failed
**Solution:** Check:
1. IP whitelist (0.0.0.0/0 for all)
2. Correct password in connection string
3. Database user permissions

### Issue: AI Not Responding
**Solution:** Check:
1. `EMERGENT_LLM_KEY` is valid
2. Key has credits
3. Backend logs for errors

### Issue: Frontend Can't Reach Backend
**Solution:** Check:
1. `REACT_APP_BACKEND_URL` in frontend `.env`
2. Backend is running
3. CORS is configured

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB connected
- [ ] AI chatbot responding
- [ ] PostHog tracking events
- [ ] Custom domain configured (chciai.cz)
- [ ] SSL certificate active (HTTPS)
- [ ] Google Search Console setup
- [ ] Email forwarding configured

---

## 🎯 Next Steps

1. **Monitor analytics** (PostHog)
2. **Submit sitemap** to Google Search Console
3. **Setup email** (info@chciai.cz)
4. **Create real OG image** (1200x630px)
5. **Performance testing** (Lighthouse)
6. **Security audit** (headers, rate limiting)

---

## 📞 Support

If you need help:
- Check logs first
- Review environment variables
- Test locally before production
- Contact: Emergent Agent or OpenClaw AI

---

**Ready to deploy!** 🚀
