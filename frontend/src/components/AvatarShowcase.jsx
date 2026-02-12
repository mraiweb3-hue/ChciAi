import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, MeshWobbleMaterial, Text } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Simplified humanoid avatar using primitives
const HumanoidAvatar = ({ gender, isSelected }) => {
  const groupRef = useRef();
  
  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const bodyColor = isSelected ? '#00D9FF' : '#ffffff';
  const accentColor = '#00D9FF';

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color={bodyColor} 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Eyes (glowing) */}
      <mesh position={[-0.1, 1.55, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={accentColor} 
          emissive={accentColor}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.1, 1.55, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={accentColor} 
          emissive={accentColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={gender === 'female' ? [0.35, 0.6, 0.25] : [0.4, 0.65, 0.28]} />
        <meshStandardMaterial 
          color={bodyColor} 
          roughness={0.4} 
          metalness={0.6}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.3, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.6, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.12, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.6, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Accent light (chest) */}
      <mesh position={[0, 0.95, 0.13]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isSelected ? 3 : 1}
        />
      </mesh>
    </group>
  );
};

const AvatarShowcase = ({ selectedGender, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Female Avatar - AJI */}
      <div 
        onClick={() => onSelect('female')}
        className={`bg-black/50 rounded-2xl border ${
          selectedGender === 'female' ? 'border-[#00D9FF] shadow-lg shadow-[#00D9FF]/20' : 'border-white/10'
        } p-6 cursor-pointer transition-all hover:border-[#00D9FF]/50 group`}
      >
        <div className="h-64 mb-4">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
            <ambientLight intensity={0.4} />
            <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00D9FF" />
            <HumanoidAvatar gender="female" isSelected={selectedGender === 'female'} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>
        <div className="text-center">
          <h3 className="text-white font-heading font-semibold text-xl mb-2">
            AJI - Ženský hlas
          </h3>
          <p className="text-neutral-400 text-sm mb-3">
            Přátelský, teplý, energický
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span>💪 Fit</span>
            <span>•</span>
            <span>😊 Přátelská</span>
            <span>•</span>
            <span>🚀 Motivující</span>
          </div>
        </div>
      </div>

      {/* Male Avatar - MARTIN */}
      <div 
        onClick={() => onSelect('male')}
        className={`bg-black/50 rounded-2xl border ${
          selectedGender === 'male' ? 'border-[#00D9FF] shadow-lg shadow-[#00D9FF]/20' : 'border-white/10'
        } p-6 cursor-pointer transition-all hover:border-[#00D9FF]/50 group`}
      >
        <div className="h-64 mb-4">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 1.5, 3]} />
            <ambientLight intensity={0.4} />
            <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00D9FF" />
            <HumanoidAvatar gender="male" isSelected={selectedGender === 'male'} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>
        <div className="text-center">
          <h3 className="text-white font-heading font-semibold text-xl mb-2">
            MARTIN - Mužský hlas
          </h3>
          <p className="text-neutral-400 text-sm mb-3">
            Profesionální, jasný, důvěryhodný
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span>💼 Podnikavý</span>
            <span>•</span>
            <span>😊 Přátelský</span>
            <span>•</span>
            <span>🎯 Cílevědomý</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarShowcase;
