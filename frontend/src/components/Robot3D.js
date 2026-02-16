import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Robot Component using CSS/SVG instead of Three.js for better compatibility
export default function Robot3D({ 
  position = 'top', 
  message = '', 
  theme = 'light',
  scrollY = 0 
}) {
  const containerRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Mouse tracking for eye movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / 200;
        const y = (e.clientY - centerY) / 200;
        setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-28 h-28 md:w-36 md:h-36 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsPanelOpen(!isPanelOpen)}
      data-testid={`robot-3d-${position}`}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {isVisible && isHovered && !isPanelOpen && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.3 }}
            className={`absolute -left-48 top-1/2 -translate-y-1/2 w-44 p-3 rounded-xl text-sm font-medium shadow-xl z-10 ${
              theme === 'dark' 
                ? 'bg-slate-800/95 text-white border border-cyan-500/30' 
                : 'bg-white/95 text-slate-800 border border-slate-200'
            } backdrop-blur-sm`}
          >
            <div className="relative">
              {message}
              <div className={`absolute -right-5 top-1/2 -translate-y-1/2 w-0 h-0 border-8 border-transparent ${
                theme === 'dark' ? 'border-l-slate-800/95' : 'border-l-white/95'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className={`absolute -left-56 top-1/2 -translate-y-1/2 w-52 p-4 rounded-2xl shadow-2xl z-20 ${
              theme === 'dark'
                ? 'bg-slate-800/95 border border-cyan-500/30'
                : 'bg-white/95 border border-slate-200'
            } backdrop-blur-md`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setIsPanelOpen(false); }}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <h4 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Rychlé akce
            </h4>
            <div className="space-y-2">
              <a href="#voice" className="block w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity">
                Nechat si zavolat
              </a>
              <a href="#pricing" className="block w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity">
                Zobrazit ceník
              </a>
              <a href="/auth" className={`block w-full py-2 px-3 rounded-lg border text-sm font-medium text-center transition-colors ${
                theme === 'dark' 
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}>
                Vyzkoušet demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot SVG */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: isHovered ? [0, -2, 2, 0] : 0
        }}
        transition={{ 
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.5 }
        }}
        className="relative w-full h-full"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          {/* Glow effect */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Body */}
          <ellipse cx="50" cy="70" rx="18" ry="22" fill={theme === 'dark' ? '#e2e8f0' : '#f8fafc'} stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Head */}
          <circle cx="50" cy="38" r="28" fill={theme === 'dark' ? '#e2e8f0' : '#f8fafc'} stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Ear pieces */}
          <rect x="18" y="32" width="8" height="12" rx="3" fill="#374151"/>
          <rect x="74" y="32" width="8" height="12" rx="3" fill="#374151"/>
          
          {/* Left Eye */}
          <g transform={`translate(${mousePos.x * 2}, ${mousePos.y * 2})`}>
            <circle cx="38" cy="36" r="10" fill="#1e293b"/>
            <circle cx="38" cy="36" r="8" fill="url(#eyeGlow)" filter="url(#glow)"/>
            <ellipse 
              cx="38" 
              cy="36" 
              rx="8" 
              ry={isBlinking ? 1 : 8} 
              fill="none" 
              stroke="#00d4ff" 
              strokeWidth="2"
              style={{ transition: 'ry 0.1s ease' }}
            />
            <circle 
              cx={38 + mousePos.x * 3} 
              cy={36 + mousePos.y * 3} 
              r={isBlinking ? 0 : 3} 
              fill="#00d4ff"
              style={{ transition: 'r 0.1s ease' }}
            />
          </g>
          
          {/* Right Eye */}
          <g transform={`translate(${mousePos.x * 2}, ${mousePos.y * 2})`}>
            <circle cx="62" cy="36" r="10" fill="#1e293b"/>
            <circle cx="62" cy="36" r="8" fill="url(#eyeGlow)" filter="url(#glow)"/>
            <ellipse 
              cx="62" 
              cy="36" 
              rx="8" 
              ry={isBlinking ? 1 : 8} 
              fill="none" 
              stroke="#00d4ff" 
              strokeWidth="2"
              style={{ transition: 'ry 0.1s ease' }}
            />
            <circle 
              cx={62 + mousePos.x * 3} 
              cy={36 + mousePos.y * 3} 
              r={isBlinking ? 0 : 3} 
              fill="#00d4ff"
              style={{ transition: 'r 0.1s ease' }}
            />
          </g>
          
          {/* Smile */}
          <path d="M 42 48 Q 50 54 58 48" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
          
          {/* Flowers on head */}
          <circle cx="35" cy="14" r="4" fill="#ec4899"/>
          <circle cx="50" cy="10" r="5" fill="#f472b6"/>
          <circle cx="65" cy="14" r="4" fill="#ec4899"/>
          <circle cx="42" cy="12" r="3" fill="#f9a8d4"/>
          <circle cx="58" cy="12" r="3" fill="#f9a8d4"/>
          
          {/* Arms */}
          <ellipse cx="28" cy="65" rx="5" ry="12" fill="#374151"/>
          <ellipse cx="72" cy="65" rx="5" ry="12" fill="#374151"/>
        </svg>

        {/* Glow overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ 
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
            filter: 'blur(15px)'
          }}
        />
      </motion.div>

      {/* Particle effects on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 50,
                  y: Math.sin(i * 60 * Math.PI / 180) * 50
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none"
                style={{ filter: 'blur(1px)' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
