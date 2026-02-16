import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// 3D-like animated logo using CSS transforms and SVG
export default function Logo3D({ theme = 'light', size = 'large' }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse tracking for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 20;
      const rotateX = ((centerY - e.clientY) / rect.height) * 20;
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sizeClasses = {
    small: 'text-3xl',
    medium: 'text-5xl md:text-6xl',
    large: 'text-6xl md:text-8xl lg:text-9xl'
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-block perspective-1000"
      style={{ perspective: '1000px' }}
    >
      {/* Glow background */}
      <motion.div
        className="absolute inset-0 blur-3xl opacity-50"
        style={{
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main 3D text */}
      <motion.div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        {/* Shadow layers for 3D depth */}
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`absolute ${sizeClasses[size]} font-black tracking-tight select-none`}
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transform: `translateZ(${-i * 4}px)`,
              opacity: 0.1 - i * 0.02,
              color: theme === 'dark' ? '#1e3a5f' : '#93c5fd',
              textShadow: 'none',
              WebkitTextStroke: '0'
            }}
            aria-hidden="true"
          >
            Chci Ai
          </span>
        ))}

        {/* Main text with gradient */}
        <motion.span
          className={`relative ${sizeClasses[size]} font-black tracking-tight bg-clip-text text-transparent`}
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            textShadow: theme === 'dark' 
              ? '0 0 60px rgba(6,182,212,0.5), 0 0 120px rgba(59,130,246,0.3)'
              : '0 0 40px rgba(6,182,212,0.3), 0 0 80px rgba(59,130,246,0.2)',
            filter: 'drop-shadow(0 4px 20px rgba(6,182,212,0.3))'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          data-testid="logo-3d-text"
        >
          Chci Ai
        </motion.span>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ 
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
            maskImage: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)'
          }}
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            filter: 'blur(0.5px)'
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}
