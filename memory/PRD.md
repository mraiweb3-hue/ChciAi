# ChciAi / OpenClaw - PRD

## Original Problem Statement
Major design overhaul for www.chciai.cz website including:
1. 3D AI robot as interactive element (SVG-based with eye tracking, blinking, particles)
2. Dark/Light mode with system detection and localStorage persistence
3. UX improvements (typewriter effect, parallax, scroll progress bar, reveal animations, floating CTA)
4. SEO optimization (meta tags, structured data, robots.txt, sitemap.xml)
5. Modern engagement elements (animated counters, glassmorphism, FAQ section)

## Architecture
- **Frontend**: React.js with Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Libraries**: framer-motion, react-intersection-observer, react-helmet-async

## User Personas
- Czech business owners looking for AI-powered digital assistant
- Entrepreneurs wanting automation for customer service, marketing, SEO

## Core Requirements
- Modern, futuristic AI-themed landing page
- Interactive robot mascot with animations
- Dark/Light mode switching
- Smooth animations and transitions
- SEO-optimized for search engines and AI crawlers

## What's Been Implemented
### Jan 15, 2026 - Session 1
- ✅ Removed "Made with Emergent" badge
- ✅ Moved design variant selector to left side

### Jan 16, 2026 - Session 2 (Major Redesign)
- ✅ SVG Robot component with:
  - Eye tracking following mouse
  - Blinking animation
  - Particle effects on hover
  - Speech bubbles on hover
  - Action panel on click
- ✅ Dark/Light mode:
  - Theme toggle in navbar
  - System preference detection
  - localStorage persistence
  - Smooth 300ms transition
- ✅ UX Improvements:
  - Typewriter text in hero
  - Scroll progress bar
  - Reveal animations on sections
  - Floating CTA button
  - Glassmorphism cards
  - Animated counters (500+, 1200+, 24/7, 98%)
- ✅ FAQ Section with accordion
- ✅ SEO:
  - robots.txt with AI crawler support
  - sitemap.xml
  - Updated title and description

## Files Created/Modified
- `/app/frontend/src/contexts/ThemeContext.js` - Dark/Light mode state
- `/app/frontend/src/components/Robot3D.js` - SVG robot with animations
- `/app/frontend/src/components/ThemeToggle.js` - Theme switch button
- `/app/frontend/src/components/ScrollProgress.js` - Progress bar
- `/app/frontend/src/components/TypewriterText.js` - Typing animation
- `/app/frontend/src/components/AnimatedCounter.js` - Number animation
- `/app/frontend/src/components/FloatingCTA.js` - Floating button
- `/app/frontend/src/components/SEOHead.js` - SEO meta tags
- `/app/frontend/src/pages/LandingPage.js` - Complete redesign
- `/app/frontend/public/robots.txt` - SEO robots file
- `/app/frontend/public/sitemap.xml` - SEO sitemap

## Prioritized Backlog
### P0 (Critical)
- None currently

### P1 (High)
- Fix SEOHead component (Helmet issue)
- Add more FAQ questions
- Optimize images to WebP

### P2 (Medium)
- Add video testimonials
- Implement cookie consent
- Add live chat widget integration
- More micro-animations

## Next Tasks
- Re-enable SEOHead component after fixing Helmet issue
- Performance optimization (lazy loading images)
- Add more interactive elements based on user feedback
