import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

// Simple animated avatar
const AnimatedAvatar = ({ gender, action, intensity = 1 }) => {
  const groupRef = useRef();
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Different animations based on action
    switch(action) {
      case 'wave':
        // Waving hand
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = Math.sin(time * 5) * 0.8 - 0.3;
        }
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        break;
        
      case 'point':
        // Pointing animation
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = -0.8;
          rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.1;
        }
        break;
        
      case 'dance':
        // Dancing
        groupRef.current.rotation.y = Math.sin(time * 2) * 0.3;
        groupRef.current.position.y = Math.sin(time * 3) * 0.1 * intensity;
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = Math.sin(time * 3) * 0.5 + 0.3;
          rightArmRef.current.rotation.z = Math.sin(time * 3 + Math.PI) * 0.5 - 0.3;
        }
        break;
        
      case 'celebrate':
        // Celebration
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.2;
        groupRef.current.position.y = Math.abs(Math.sin(time * 4)) * 0.15 * intensity;
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.z = 0.8;
          rightArmRef.current.rotation.z = -0.8;
          leftArmRef.current.rotation.x = Math.sin(time * 4) * 0.3;
          rightArmRef.current.rotation.x = Math.sin(time * 4) * 0.3;
        }
        break;
        
      default:
        // Idle
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
        groupRef.current.position.y = Math.sin(time * 2) * 0.03 * intensity;
    }
  });

  const baseColor = gender === 'female' ? '#00D9FF' : '#00B8D9';
  const scale = gender === 'female' ? 0.9 : 1;

  return (
    <group ref={groupRef} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={baseColor} roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Glowing eyes */}
      <mesh position={[-0.08, 1.52, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color="#00D9FF" 
          emissive="#00D9FF"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[0.08, 1.52, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color="#00D9FF" 
          emissive="#00D9FF"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.9, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.2]} />
        <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.25, 0.9, 0]}>
        <mesh rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.25, 0.9, 0]}>
        <mesh rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.1, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0.1, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Glow effect */}
      <pointLight position={[0, 1, 0.3]} intensity={2} distance={2} color="#00D9FF" />
    </group>
  );
};

// Floating avatar component with scroll tracking
const FloatingAvatar = ({ gender, action, text, side = 'left' }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      // Hide on mobile or if scrolled too far
      setIsVisible(window.innerWidth > 768 && window.scrollY < 5000);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const position = side === 'left' ? 'left-8' : 'right-8';
  const translateY = Math.sin(scrollY * 0.002) * 30;

  return (
    <motion.div
      className={`fixed ${position} z-40 pointer-events-none hidden lg:block`}
      style={{ 
        top: `${20 + scrollY * 0.5}px`,
        transform: `translateY(${translateY}px)`,
      }}
      initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-48 h-48">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 1.2, 2.5]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[3, 3, 3]} angle={0.3} intensity={1.5} />
            <pointLight position={[-2, 2, -2]} intensity={0.8} color="#00D9FF" />
            <AnimatedAvatar gender={gender} action={action} intensity={0.5} />
          </Canvas>
        </div>

        {/* Speech bubble */}
        {text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={`absolute ${side === 'left' ? 'left-full ml-4' : 'right-full mr-4'} top-1/2 -translate-y-1/2 pointer-events-auto`}
          >
            <div className="bg-[#00D9FF] text-black px-4 py-3 rounded-2xl max-w-xs shadow-lg relative">
              <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? '-left-2' : '-right-2'} w-4 h-4 bg-[#00D9FF] rotate-45`} />
              <p className="text-sm font-semibold relative z-10">{text}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Main component - multiple avatars at different scroll positions
const ScrollingAvatars = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show different avatars at different scroll positions
  const avatars = [
    {
      show: scrollY < 800,
      gender: 'female',
      action: 'wave',
      text: 'Vítejte! 👋',
      side: 'left'
    },
    {
      show: scrollY > 600 && scrollY < 1800,
      gender: 'male',
      action: 'point',
      text: 'Podívejte na tyto výhody! 👉',
      side: 'right'
    },
    {
      show: scrollY > 1500 && scrollY < 3000,
      gender: 'female',
      action: 'celebrate',
      text: 'Skvělé příklady! 🎉',
      side: 'left'
    },
    {
      show: scrollY > 2800 && scrollY < 4500,
      gender: 'male',
      action: 'dance',
      text: 'Vyber si balíček! 💃',
      side: 'right'
    },
    {
      show: scrollY > 4200,
      gender: 'female',
      action: 'wave',
      text: 'Zavoláme vám! 📞',
      side: 'left'
    }
  ];

  return (
    <>
      {avatars.map((avatar, index) => 
        avatar.show && (
          <FloatingAvatar
            key={index}
            gender={avatar.gender}
            action={avatar.action}
            text={avatar.text}
            side={avatar.side}
          />
        )
      )}
    </>
  );
};

// Fallback for SSR/build
const ScrollingAvatarsSafe = () => {
  if (typeof window === 'undefined' || !Canvas) {
    return null;
  }
  return <ScrollingAvatars />;
};

export default ScrollingAvatarsSafe;
