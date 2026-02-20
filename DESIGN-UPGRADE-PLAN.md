# Design Upgrade Plan - ChciAI.cz

## 🎯 Cíl: Moderní, živý, zajímavý web

### Současný stav (nudný):
- ❌ Moc "corporate" look
- ❌ Málo barev
- ❌ Static, bez života
- ❌ Žádný dark mode

### Nový design (wow efekt):
- ✅ Moderní gradients (blue → purple → pink)
- ✅ Glassmorphism effects
- ✅ Smooth animations (framer-motion)
- ✅ Dark/Light mode toggle (auto detect)
- ✅ Floating elements
- ✅ Gradient text
- ✅ Hover effects
- ✅ Micro-interactions

---

## 🎨 Color Palette

### Light Mode:
- **Background:** White, light gradients
- **Primary:** Blue-600 → Purple-600 → Pink-500
- **Accent:** Cyan-400, Emerald-500
- **Text:** Gray-900, Gray-700

### Dark Mode:
- **Background:** Gray-900, Dark gradients
- **Primary:** Blue-400 → Purple-400 → Pink-400
- **Accent:** Cyan-300, Emerald-400
- **Text:** White, Gray-300

---

## ✨ Animation Features

### Homepage Hero:
- Animated gradient background
- Floating bubbles/particles
- Text slide-in animation
- CTA button pulse effect

### Sections:
- Scroll-triggered animations
- Card hover effects (scale + glow)
- Smooth page transitions
- Loading animations

### Micro-interactions:
- Button hover (scale + shadow)
- Input focus (glow effect)
- Checkbox animations
- Success celebrations

---

## 🌙 Dark Mode

### Auto-detect:
```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
```

### Toggle button:
- Sun/Moon icon
- Smooth transition (0.3s)
- Save preference to localStorage

---

## 🎭 Effects to Add

### Glassmorphism:
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Gradient Text:
```css
background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Animated Gradients:
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #10b981);
background-size: 400% 400%;
animation: gradient-shift 15s ease infinite;
```

---

## 📦 Components to Upgrade

1. **Hero** - Animated gradient + particles
2. **Cards** - Hover glow + scale
3. **Buttons** - Pulse + shimmer
4. **Forms** - Focus glow
5. **Navigation** - Blur + sticky
6. **Footer** - Dark gradient
7. **Loading** - Spinner animations
8. **Success** - Confetti effect

---

## 🚀 Implementation Order

1. ✅ Dark mode system
2. ✅ Color palette update
3. ✅ Hero animations
4. ✅ Card effects
5. ✅ Button animations
6. ✅ Form improvements
7. ✅ Scroll animations
8. ✅ Micro-interactions

---

Začínám! 🎨
