import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Animated 3D-style logo for navbar
export default function NavLogo3D({ theme = 'light' }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !isHovered) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 25;
      const rotateX = ((centerY - e.clientY) / rect.height) * 25;
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  // Auto-rotation when not hovered
  useEffect(() => {
    if (isHovered) return;
    
    let animationFrame;
    let angle = 0;
    
    const autoRotate = () => {
      angle += 0.5;
      setRotation({
        x: Math.sin(angle * 0.02) * 5,
        y: Math.sin(angle * 0.03) * 8
      });
      animationFrame = requestAnimationFrame(autoRotate);
    };
    
    animationFrame = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block cursor-pointer"
      style={{ perspective: '500px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="nav-logo-3d"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 blur-xl opacity-50 rounded-full"
        style={{
          background: `radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, transparent 70%)`
        }}
        animate={{
          scale: isHovered ? 1.3 : [1, 1.15, 1],
          opacity: isHovered ? 0.7 : [0.3, 0.5, 0.3]
        }}
        transition={isHovered ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
      />

      {/* 3D Text container */}
      <motion.div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      >
        {/* Shadow/depth layers */}
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="absolute text-xl font-extrabold tracking-tight select-none"
            style={{
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              transform: `translateZ(${-i * 2}px)`,
              opacity: 0.1 - i * 0.03,
              color: theme === 'dark' ? '#0e4d6d' : '#a5d8ff',
            }}
            aria-hidden="true"
          >
            Chci AI
          </span>
        ))}

        {/* Main text with gradient */}
        <motion.span
          className="relative text-xl font-extrabold tracking-tight"
          style={{
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: theme === 'dark' 
              ? '0 0 30px rgba(6,182,212,0.4)' 
              : '0 0 20px rgba(6,182,212,0.2)',
            filter: `drop-shadow(0 2px 8px rgba(6,182,212,0.3))`
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%'
          }}
          transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
        >
          Chci AI
        </motion.span>

        {/* Shine effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ 
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      {/* Floating particles */}
      {isHovered && [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${20 + i * 20}%`,
            top: '50%',
            filter: 'blur(0.5px)'
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [-5, -15, -25]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            repeat: Infinity
          }}
        />
      ))}
    </div>
  );
}
