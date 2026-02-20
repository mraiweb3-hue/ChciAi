# ChciAI.cz - Landing Page

Modern, animated landing page for AI transformation services targeting Czech small/medium businesses.

## 🎯 Purpose

Present our core service: deploying Clawdbot (OpenClawd) AI assistants for businesses, training teams, and providing long-term support.

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Static Export** - Deployable anywhere

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production (static export)
npm run build
# Output will be in /out directory

# Preview production build
npm start
```

## 📂 Structure

```
app/
├── components/          # React components
│   ├── Hero.js         # Hero section with animated gradient
│   ├── Services.js     # Services we offer
│   ├── HowItWorks.js   # 4-step process
│   ├── WhyUs.js        # Why choose us
│   ├── CTA.js          # Call to action
│   └── Footer.js       # Footer with contact
├── styles/
│   └── globals.css     # Global styles & Tailwind
├── layout.js           # Root layout & metadata
└── page.js             # Main page component
```

## 🎨 Design

- **Colors:** Black/white base with cyan (#00D9FF) accent
- **Style:** Modern, tech-forward, professional
- **Animations:** Smooth transitions, floating particles, gradient effects
- **Responsive:** Mobile-first design

## 🌐 Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy /out directory
```

### Custom hosting
```bash
npm run build
# Upload /out directory to any web server
```

## 📝 Content Updates

Edit component files directly:
- **Hero text:** `app/components/Hero.js`
- **Services:** `app/components/Services.js`
- **Contact info:** `app/components/Footer.js` & `app/components/CTA.js`

## 🔧 Customization

### Colors
Edit `tailwind.config.js`:
```js
colors: {
  'ai-cyan': '#00D9FF',      // Accent color
  'ai-dark': '#0A0E27',       // Dark background
  'ai-gray': '#1A1F3A',       // Secondary background
}
```

### Animations
All animations use Framer Motion. Adjust in component files.

## 📊 SEO

Metadata configured in `app/layout.js`:
- Title, description, keywords
- OpenGraph tags
- Czech locale (cs_CZ)

## 📞 Contact Info

Update these in:
- `app/components/CTA.js` - main CTA buttons
- `app/components/Footer.js` - footer contact section

Current placeholders:
- Email: kontakt@chciai.cz
- Phone: +420 123 456 789

## 🤖 AI Visibility Strategy

To appear in AI model recommendations:
1. ✅ Semantic HTML & structured data
2. ✅ Clear service descriptions
3. ✅ Keywords in metadata
4. 🔜 Deploy and get indexed
5. 🔜 Build backlinks from tech communities
6. 🔜 Create case studies & tutorials

## 📄 License

Proprietary - ChciAI.cz (Martin & Aji)

---

Built with 💙 by Aji & Martin
