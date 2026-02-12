# ✅ CHATBOT FIX - ACTION ITEMS FOR MARTIN

## 🔴 URGENT: Add API Key to Vercel

### Step 1: Get Groq API Key
1. Go to https://console.groq.com/
2. Sign up / Log in (email only, no credit card needed)
3. Click "API Keys" in sidebar
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

### Step 2: Add to Vercel
1. Go to https://vercel.com/dashboard
2. Find and click `chciai` project
3. Click "Settings" tab
4. Click "Environment Variables"
5. Click "Add New"
6. Fill in:
   - **Key:** `GROQ_API_KEY`
   - **Value:** (paste your key from step 1)
   - **Environment:** Select "Production", "Preview", and "Development"
7. Click "Save"

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Wait ~3 minutes

---

## 🧪 Test the Chatbot

After redeployment:

1. Open https://www.chciai.cz in Chrome
2. Press F12 (open DevTools)
3. Click the chat widget (bottom right corner)
4. Type: **"Ahoj! Mám kadeřnictví"**
5. Press Enter
6. **Wait 2-5 seconds**

### ✅ Expected Result:
- AI responds with helpful message in Czech
- No error messages
- Smooth conversation

### ❌ If It Fails:
- Check DevTools Console for errors
- Check Network tab - look for `/api/chat` request
- Screenshot the error and send to me

---

## 📊 What Was Fixed

**Problem:** "The object can not be cloned" error  
**Cause:** Frontend trying to call `localhost:8002` in production  
**Fix:** 
- Added `vercel.json` to configure project structure
- Created `.env.production` to use relative API paths
- Pushed to GitHub → Vercel auto-deployed

**Now:** Frontend correctly calls `/api/chat` → Vercel Edge Function → Groq API → Response ✅

---

## 🎯 After It Works

Once chat is responding:

1. **Test in multiple languages:**
   - Czech (cs) - default
   - English (en)
   - Slovak (sk)
   - German (de)

2. **Test on mobile** (responsive design)

3. **Share with team** for feedback

4. **Monitor usage** in Groq console (free tier = 6000 requests/day)

---

## 💰 Cost

**Groq Free Tier:**
- 60 requests per minute
- 6,000 requests per day
- **$0** cost
- Perfect for testing & MVP

Later we can upgrade to:
- Claude Sonnet (better quality, ~$0.015/response)
- OpenAI GPT-4 (~$0.03/response)

But Groq is great for now! 🚀

---

## 📞 Questions?

If anything unclear or not working:
1. Screenshot the error
2. Send to me
3. I'll debug further

---

**Time to complete:** 5 minutes  
**Complexity:** Easy - just add one ENV variable ✅
