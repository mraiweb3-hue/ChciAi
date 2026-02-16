import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, useTexture, Environment, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Robot Eye Component with glow and tracking
function RobotEye({ position, mousePos, isBlinking }) {
  const eyeRef = useRef();
  const glowRef = useRef();
  const pupilRef = useRef();
  
  useFrame((state) => {
    if (pupilRef.current && mousePos) {
      const targetX = THREE.MathUtils.clamp(mousePos.x * 0.15, -0.08, 0.08);
      const targetY = THREE.MathUtils.clamp(mousePos.y * 0.15, -0.08, 0.08);
      pupilRef.current.position.x = THREE.MathUtils.lerp(pupilRef.current.position.x, targetX, 0.1);
      pupilRef.current.position.y = THREE.MathUtils.lerp(pupilRef.current.position.y, targetY, 0.1);
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Eye socket */}
      <mesh ref={eyeRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cyan ring glow */}
      <mesh ref={glowRef} scale={isBlinking ? [1, 0.1, 1] : [1, 1, 1]}>
        <torusGeometry args={[0.22, 0.03, 16, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
      </mesh>
      {/* Pupil */}
      <mesh ref={pupilRef} position={[0, 0, 0.15]} scale={isBlinking ? [1, 0.1, 1] : [1, 1, 1]}>
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
    </group>
  );
}

// Main Robot Body
function RobotBody({ mousePos, scrollY }) {
  const groupRef = useRef();
  const headRef = useRef();
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    if (headRef.current && mousePos) {
      // Head follows mouse slightly
      const targetRotY = mousePos.x * 0.2;
      const targetRotX = -mousePos.y * 0.1;
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.05);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={0.8}>
        {/* Head */}
        <group ref={headRef} position={[0, 0.8, 0]}>
          {/* Main head sphere */}
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial color="#f5f5f5" metalness={0.3} roughness={0.4} />
          </mesh>
          
          {/* Eyes */}
          <RobotEye position={[-0.25, 0.1, 0.55]} mousePos={mousePos} isBlinking={isBlinking} />
          <RobotEye position={[0.25, 0.1, 0.55]} mousePos={mousePos} isBlinking={isBlinking} />
          
          {/* Smile */}
          <mesh position={[0, -0.15, 0.6]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.15, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          
          {/* Ear pieces */}
          <mesh position={[-0.65, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.65, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Flower crown (simplified) */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[
              Math.sin(i * Math.PI * 0.4) * 0.5,
              0.6 + Math.random() * 0.1,
              Math.cos(i * Math.PI * 0.4) * 0.3
            ]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#e91e8c" emissive="#e91e8c" emissiveIntensity={0.2} />
            </mesh>
          ))}
        </group>
        
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.35, 0.4, 8, 16]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.3} roughness={0.4} />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Particles effect
function Particles() {
  const count = 50;
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2],
        speed: 0.01 + Math.random() * 0.02
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Scene setup
function Scene({ mousePos, scrollY }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 3, 2]} intensity={0.5} color="#00d4ff" />
      <RobotBody mousePos={mousePos} scrollY={scrollY} />
      <Particles />
    </>
  );
}

// Speech bubble component
function SpeechBubble({ message, isVisible, theme }) {
  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3 }}
          className={`absolute -left-48 top-1/2 -translate-y-1/2 w-44 p-3 rounded-xl text-sm font-medium shadow-xl ${
            theme === 'dark' 
              ? 'bg-slate-800/90 text-white border border-cyan-500/30' 
              : 'bg-white/90 text-slate-800 border border-slate-200'
          } backdrop-blur-sm`}
          data-testid="robot-speech-bubble"
        >
          <div className="relative">
            {message}
            <div className={`absolute -right-5 top-1/2 -translate-y-1/2 w-0 h-0 border-8 border-transparent ${
              theme === 'dark' ? 'border-l-slate-800/90' : 'border-l-white/90'
            }`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Action panel component
function ActionPanel({ isOpen, onClose, theme }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20 }}
          className={`absolute -left-56 top-1/2 -translate-y-1/2 w-52 p-4 rounded-2xl shadow-2xl ${
            theme === 'dark'
              ? 'bg-slate-800/95 border border-cyan-500/30'
              : 'bg-white/95 border border-slate-200'
          } backdrop-blur-md`}
          data-testid="robot-action-panel"
        >
          <button
            onClick={onClose}
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
            <a href="/auth" className="block w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Vyzkoušet demo
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Fallback for mobile/low-performance
function RobotFallback({ theme }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-24 h-24 relative"
    >
      <img
        src="https://customer-assets.emergentagent.com/job_chciai-upgrade/artifacts/74zwcrx8_1719436835469.jpeg"
        alt="AI Robot Assistant"
        className="w-full h-full object-contain rounded-full shadow-lg"
        style={{ filter: theme === 'dark' ? 'brightness(0.9)' : 'none' }}
      />
      <div className="absolute inset-0 rounded-full animate-pulse bg-cyan-400/20" />
    </motion.div>
  );
}

// Main Robot3D Component
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
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        setMousePos({ x, y });
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
      className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsPanelOpen(!isPanelOpen)}
      data-testid={`robot-3d-${position}`}
    >
      <SpeechBubble message={message} isVisible={isVisible && isHovered && !isPanelOpen} theme={theme} />
      <ActionPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} theme={theme} />
      
      {isMobile ? (
        <RobotFallback theme={theme} />
      ) : (
        <Suspense fallback={<RobotFallback theme={theme} />}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            <Scene mousePos={mousePos} scrollY={scrollY} />
          </Canvas>
        </Suspense>
      )}
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} style={{
        background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
        filter: 'blur(20px)'
      }} />
    </div>
  );
}
