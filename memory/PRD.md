# Chci AI - PRD (Product Requirements Document)

## Original Problem Statement
Complete redesign of www.chciai.cz with:
1. Remove robots from right side, add 3D "Chci Ai" logo with rotation and glow
2. Blue "Vyzkoušet" button that opens chatbot
3. Clawix callback form with:
   - Name, phone, website (optional)
   - Language selection (CZ, EN, DE, SV, VI, UK)
   - Call time options (30s, 5min, 30min, tomorrow)
   - SMS consent with cancel/reschedule options
4. Chatbot widget in bottom right corner
5. Dark/Light mode
6. Full responsivity for all devices
7. SEO optimization

## Architecture
- **Frontend**: React.js with Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Key Libraries**: framer-motion, react-intersection-observer

## User Personas
1. **Small Business Owners** - Want to automate customer communication
2. **Entrepreneurs** - Looking for 24/7 AI assistant
3. **Multi-language Businesses** - Need support in multiple languages

## Core Requirements
- [x] Modern futuristic AI-themed landing page
- [x] Clawix AI assistant branding
- [x] Dark/Light mode switching
- [x] 6 language support (CZ, EN, DE, SV, VI, UK)
- [x] Ethical approach - SMS confirmation before calls
- [x] Mobile-first responsive design

## What's Been Implemented

### Jan 15, 2026 - Session 1
- ✅ Removed "Made with Emergent" badge
- ✅ Moved design variant selector to left side

### Jan 16, 2026 - Session 2 (Major Redesign)
- ✅ Removed robots from right side
- ✅ Created 3D "Chci Ai" logo with:
  - Gradient effect (cyan → blue → purple)
  - Mouse-tracking 3D rotation
  - Glow effect
  - Floating particles
- ✅ Clawix Callback Form with:
  - 2-step wizard flow
  - Name, phone, website fields
  - 6 language selection with flags
  - 4 call time options
  - SMS and call consent checkboxes
  - Confirmation code on success
- ✅ Chatbot Widget:
  - Clawix branding
  - Welcome message
  - Quick replies
  - Real-time chat UI
  - Typing indicator
- ✅ Backend Clawix API:
  - POST /api/clawix/callback
  - POST /api/clawix/callback/action (cancel/reschedule)
  - GET /api/clawix/callback/:id
- ✅ SEO endpoints:
  - GET /api/seo/structured-data
  - GET /api/content/sections
- ✅ Full responsivity (mobile, tablet, desktop)

## Files Created/Modified
### Frontend
- `/app/frontend/src/components/Logo3D.js` - 3D animated logo
- `/app/frontend/src/components/ClawixCallbackForm.js` - Callback wizard
- `/app/frontend/src/components/ChatbotWidget.js` - Chat widget
- `/app/frontend/src/pages/LandingPage.js` - Complete redesign

### Backend
- `/app/backend/server.py` - Added Clawix endpoints
- `/app/backend/models.py` - Added Clawix models

## API Endpoints

### Clawix Callback
- `POST /api/clawix/callback` - Create callback request
  - Body: name, phone, language, call_time, website, consent_sms, consent_call
  - Returns: id, confirmation_code, scheduled_time
- `POST /api/clawix/callback/action` - Cancel/reschedule
  - Body: callback_id, confirmation_code, action (cancel/reschedule/confirm)
- `GET /api/clawix/callback/:id?code=XXX` - Get callback status

## Prioritized Backlog

### P0 (Critical)
- None currently - all core features implemented

### P1 (High)
- Actual SMS integration (Twilio/etc)
- Actual voice calling integration
- Admin dashboard for callback management

### P2 (Medium)
- Advanced chatbot with AI responses
- More languages
- Analytics dashboard
- Email notifications

## Next Tasks
1. Integrate real SMS provider for notifications
2. Connect Clawix voice service when ready
3. Add more AI capabilities to chatbot
4. Implement admin dashboard for callback management
