# 3D Robotic Avatars - Implementation Plan

## 🤖 **Koncept:**
2 animované 3D robotické avatary (žena + muž) reprezentující AI asistenty.

---

## 🎨 **Design Specifikace:**

### **Avatar #1: Ženský (AJI)**
- **Styl:** Futuristický, přátelský robot
- **Barvy:** Cyan (#00D9FF) + bílá + černá
- **Charakteristiky:**
  - Kulatější tvary (přátelštější)
  - Svítící LED "oči" v cyan
  - Elegantní, moderní look
  - Hovořící animace (ústa/světla)
  - Idle animace (jemné kývání)

### **Avatar #2: Mužský (MARTIN)**
- **Styl:** Futuristický, profesionální robot
- **Barvy:** Cyan (#00D9FF) + šedá + černá
- **Charakteristiky:**
  - Geometričtější tvary (profesionálnější)
  - Svítící LED "oči" v cyan
  - Robustnější design
  - Hovořící animace
  - Idle animace (stabilní postoj)

---

## 🛠️ **Implementační možnosti:**

### **Možnost A: Ready-Made 3D Models** ⚡ FASTEST
**Zdroje:**
- [Sketchfab](https://sketchfab.com/search?q=robot+character&type=models) - 3D modely k zakoupení/stažení
- [TurboSquid](https://www.turbosquid.com/Search/3D-Models/robot) - Profesionální modely
- [CGTrader](https://www.cgtrader.com/3d-models/robot) - Robot modely

**Cena:** $20-100 za model  
**Čas:** 1 den (import + úprava barev)

---

### **Možnost B: AI-Generated 3D** 🤖 MODERN
**Nástroje:**
- [Meshy.ai](https://www.meshy.ai/) - Text-to-3D AI
- [Spline AI](https://spline.design/ai) - 3D design s AI
- [Luma AI Genie](https://lumalabs.ai/genie) - Text-to-3D

**Prompt příklad:**
```
"Futuristic friendly female robot assistant, 
cyan and white colors, LED eyes, modern design, 
T-pose, low poly style, 3D model"
```

**Cena:** FREE - $20/měsíc  
**Čas:** 2-3 dny (generování + úpravy)

---

### **Možnost C: Custom Design (Blender)** 🎨 BEST QUALITY
**Software:** Blender (FREE)  
**Designer:** Freelancer z Fiverr/Upwork

**Cena:** $100-300 za oba avatary  
**Čas:** 1-2 týdny

---

## 💻 **Integrace na web:**

### **React Three Fiber:**
```bash
npm install @react-three/fiber @react-three/drei three
```

### **Komponenta:**
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const RobotAvatar = ({ gender, isAnimating }) => {
  const model = useGLTF(`/models/${gender}-robot.glb`);
  
  return (
    <primitive 
      object={model.scene} 
      scale={gender === 'female' ? 1.2 : 1.3}
      rotation={[0, isAnimating ? Math.PI / 4 : 0, 0]}
    />
  );
};

const AvatarShowcase = () => {
  const [selectedGender, setSelectedGender] = useState('female');
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Ženský avatar */}
      <div className="bg-black/50 rounded-2xl border border-white/10 p-6">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.3} />
          <RobotAvatar gender="female" isAnimating={selectedGender === 'female'} />
          <OrbitControls enableZoom={false} />
        </Canvas>
        <h3 className="text-white font-semibold mt-4 text-center">
          Ženský hlas - AJI
        </h3>
        <p className="text-neutral-400 text-sm text-center">
          Přátelský, teplý tón
        </p>
      </div>
      
      {/* Mužský avatar */}
      <div className="bg-black/50 rounded-2xl border border-white/10 p-6">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.3} />
          <RobotAvatar gender="male" isAnimating={selectedGender === 'male'} />
          <OrbitControls enableZoom={false} />
        </Canvas>
        <h3 className="text-white font-semibold mt-4 text-center">
          Mužský hlas - MARTIN
        </h3>
        <p className="text-neutral-400 text-sm text-center">
          Profesionální, jasný tón
        </p>
      </div>
    </div>
  );
};
```

---

## 🎬 **Animace:**

### **Idle Animation (klid):**
```javascript
useFrame((state) => {
  if (modelRef.current) {
    modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
  }
});
```

### **Speaking Animation (hovoří):**
```javascript
const speakingAnimation = useSpring({
  scale: isSpeaking ? [1.1, 1.1, 1.1] : [1, 1, 1],
  config: { tension: 300, friction: 10 },
});
```

---

## 📍 **Kde použít avatary:**

1. **Voice Gender Selector** - Ukázat avatary místo ikony User
2. **Hero Section** - Animovaný avatar v pozadí
3. **Pricing Section** - "Kdo bude váš asistent?"
4. **Chat Widget** - Avatar chatbota

---

## 🚀 **Doporučený postup:**

### **FÁZE 1: Quick Solution** (1-2 dny)
1. Najít 2 robot modely na Sketchfab (FREE/cheap)
2. Upravit barvy v Blender (cyan theme)
3. Export jako GLB
4. Implementovat s React Three Fiber
5. Přidat do Voice Gender Selector

### **FÁZE 2: Custom Avatars** (1-2 týdny)
1. Zadat na Fiverr/Upwork custom design
2. Profesionální modelování + animace
3. Brand-specific look

---

## 💰 **Budget:**

**Quick:** $50-100 (ready-made + úpravy)  
**Custom:** $100-300 (profesionální designer)  
**Premium:** $500-1000 (3D studio, full animation)

---

## ✅ **TODO:**

- [ ] Rozhodnout mezi Quick/Custom/Premium
- [ ] Najít/objednat 3D modely
- [ ] Install React Three Fiber
- [ ] Vytvořit Avatar komponenty
- [ ] Integrovat do VoiceGenderSelector
- [ ] Přidat hover animace
- [ ] Optimalizovat pro mobile

---

## 📧 **Kontakty pro 3D designery:**

**Fiverr:** [3D Robot Character Modeling](https://www.fiverr.com/search/gigs?query=3d%20robot%20character)  
**Upwork:** [3D Character Designers](https://www.upwork.com/freelance-jobs/3d-character-design/)  
**Local:** Praha-based 3D artists na LinkedIn
