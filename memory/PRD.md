# ChciAi / OpenClaw - PRD

## Original Problem Statement
User requested changes to www.chciai.cz website:
1. Remove "Made with Emergent" badge from the bottom right corner
2. Move the design variant selector from bottom left corner to the left side, vertically centered

## Architecture
- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Deployment**: Vercel (chciai-new.vercel.app)

## User Personas
- Czech business owners looking for AI-powered digital assistant
- Entrepreneurs wanting automation for customer service, marketing, SEO

## Core Requirements
- Landing page showcasing OpenClaw AI assistant features
- User authentication system
- Dashboard for managing chatbots, conversations, leads
- Callback request functionality
- Design variant selector for different color themes

## What's Been Implemented
### Jan 15, 2026
- ✅ Removed "Made with Emergent" badge from index.html
- ✅ Moved design variant selector to left side, vertically centered
- ✅ Changed variant selector layout from horizontal to vertical

## Files Modified
- `/app/frontend/public/index.html` - Removed Emergent badge
- `/app/frontend/src/pages/LandingPage.js` - Repositioned variant selector

## Prioritized Backlog
### P0 (Critical)
- None currently

### P1 (High)
- SEO optimization for better visibility
- Performance optimization

### P2 (Medium)
- Additional color themes
- Improved mobile responsiveness
- Analytics integration

## Next Tasks
- User feedback on current changes
- Any additional content/information changes requested by user
