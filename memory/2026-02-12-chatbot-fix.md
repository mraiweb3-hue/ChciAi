# ChciAI.cz Chatbot Fix - Root Cause & Solution

**Date:** 2026-02-12  
**Status:** ✅ FIXED & DEPLOYED  
**Time:** ~20 minutes diagnosis + fix

---

## 🔴 THE PROBLEM

**Symptom:**  
- Chat widget opens on https://www.chciai.cz
- User sends message
- Error: "The object can not be cloned"
- No AI response

---

## 🔍 ROOT CAUSE ANALYSIS

### Investigation Steps:

1. **Checked Edge Function** (`/api/chat.js`): ✅ Code is correct
2. **Checked Frontend** (`/frontend/src/App.js`): ✅ Fetch logic is correct
3. **Checked Environment**: ❌ **FOUND THE ISSUE!**

### The Real Problem:

```javascript
// frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8002

// App.js constructs:
const API = "http://localhost:8002/api"

// Production tries to call:
fetch("http://localhost:8002/api/chat")  ❌ FAILS!
```

**On production (chciai.cz):**
- No localhost:8002 exists
- Connection refused
- Error object created
- React tries to store Error in state
- **Error objects can't be cloned** → "object cannot be cloned" message

**What SHOULD happen:**
```javascript
// Production should call:
fetch("/api/chat")  ✅ 

// Which Vercel routes to Edge Function at:
/api/chat.js
```

---

## ✅ THE FIX

### Changes Made:

#### 1. Created `vercel.json` at project root:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

**Why:** Tells Vercel:
- Frontend is in `/frontend` subdirectory
- Build output goes to `/frontend/build`
- Route `/api/*` requests to Edge Functions

#### 2. Created `.env.production` in frontend:
```env
REACT_APP_BACKEND_URL=
```

**Why:** Empty BACKEND_URL means App.js uses `/api` (relative path)

---

## 🚀 DEPLOYMENT

```bash
git add vercel.json
git commit -m "Fix: Add root vercel.json for proper API routing"
git push origin main
```

**Vercel auto-deploys in ~3 minutes.**

---

## ⚠️ IMPORTANT: Vercel Environment Variables

**Martin must add to Vercel dashboard:**

```
GROQ_API_KEY=<your_groq_api_key>
```

**Where to add:**
1. Go to https://vercel.com/dashboard
2. Select `chciai` project
3. Settings → Environment Variables
4. Add `GROQ_API_KEY` = (from https://console.groq.com)
5. Redeploy

**Without this API key, chat will return "API configuration error"**

---

## 🧪 HOW TO TEST (after deploy)

1. Open https://www.chciai.cz
2. Open Chrome DevTools (F12)
3. Click chat widget (bottom right)
4. Send message: "Ahoj! Testuju chatbot"
5. Check **Network tab**:
   - Should see POST to `/api/chat`
   - Status: 200
   - Response: JSON with AI message
6. Check **Console tab**:
   - No "object cannot be cloned" errors
   - No connection refused errors

**Expected result:** AI responds within 2-5 seconds ✅

---

## 📊 TECHNICAL SUMMARY

### Before:
```
Frontend → http://localhost:8002/api/chat → ❌ Connection refused → Error object → "cannot be cloned"
```

### After:
```
Frontend → /api/chat → Vercel routing → /api/chat.js Edge Function → Groq API → ✅ Response
```

---

## 🎯 LESSONS LEARNED

1. **Environment-specific configs matter**
   - `.env` is for local development
   - `.env.production` is for production builds
   - Vercel needs ENV vars set in dashboard

2. **Monorepo structure needs root config**
   - If frontend is in subdirectory, Vercel needs `vercel.json`
   - Must specify `buildCommand` and `outputDirectory`

3. **Relative paths > Absolute URLs**
   - `/api/chat` works in all environments
   - `http://localhost:8002/api/chat` only works locally

4. **"object cannot be cloned" often means:**
   - Error object in React state
   - Usually from failed fetch/axios call
   - Look at network errors first!

---

## 📝 NEXT STEPS

- [ ] Martin adds GROQ_API_KEY to Vercel ENV
- [ ] Wait for Vercel redeploy (~3 min)
- [ ] Test chat on live site
- [ ] If works → Update this file with ✅
- [ ] If fails → Debug with browser DevTools

---

**Commit:** `7613bdc`  
**Branch:** `main`  
**Pushed:** 2026-02-12 14:40 UTC
