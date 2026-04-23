import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// LAYER 1: Interactive Holographic Shapes
// ============================================

function InteractiveShape({ geometry, color, position, speed, rotationSpeed }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Smooth floating movement
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
    meshRef.current.rotation.x += 0.005 * rotationSpeed;
    meshRef.current.rotation.y += 0.005 * rotationSpeed;

    // React to mouse parallax (handled by parent group, but can add local spice here)
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        {geometry}
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.3}
          radius={1}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// ============================================
// LAYER 2: Holographic Code Shards
// ============================================

function CodeShard({ position, color, delay }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime + delay;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[2, 0.1]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
      {/* Decorative lines to simulate code */}
      <mesh position={[0, -0.2, 0]}>
        <planeGeometry args={[1.5, 0.05]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </mesh>
  );
}

// ============================================
// LAYER 3: Reactive Particle Field
// ============================================

function ReactiveParticles() {
  const sparklesRef = useRef<any>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (!sparklesRef.current) return;
    
    // Gently tilt the particle field based on mouse
    const targetX = (mouse.x * viewport.width) / 20;
    const targetY = (mouse.y * viewport.height) / 20;
    
    sparklesRef.current.rotation.y = THREE.MathUtils.lerp(sparklesRef.current.rotation.y, targetX * 0.1, 0.05);
    sparklesRef.current.rotation.x = THREE.MathUtils.lerp(sparklesRef.current.rotation.x, -targetY * 0.1, 0.05);
  });

  return (
    <group ref={sparklesRef}>
      <Sparkles count={100} scale={20} size={2} speed={0.4} opacity={0.2} color="#6366F1" />
      <Sparkles count={50} scale={15} size={4} speed={0.6} opacity={0.1} color="#EC4899" />
    </group>
  );
}

// ============================================
// LAYER 4: Dynamic Scene Controller (Parallax)
// ============================================

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Parallax effect: the entire background moves opposite to the mouse
    const x = (mouse.x * viewport.width) / 10;
    const y = (mouse.y * viewport.height) / 10;
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, -x, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -y, 0.05);
    
    // Slight tilt
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.1, 0.05);
  });

  return (
    <group ref={groupRef}>
      {/* Interactive Shapes */}
      <InteractiveShape 
        geometry={<icosahedronGeometry args={[1, 1]} />} 
        color="#6366F1" 
        position={[-6, 3, -5]} 
        speed={1} 
        rotationSpeed={1} 
      />
      <InteractiveShape 
        geometry={<torusGeometry args={[0.8, 0.2, 16, 32]} />} 
        color="#EC4899" 
        position={[7, -4, -4]} 
        speed={1.5} 
        rotationSpeed={2} 
      />
      <InteractiveShape 
        geometry={<octahedronGeometry args={[0.7, 0]} />} 
        color="#06B6D4" 
        position={[-8, -5, -6]} 
        speed={1.2} 
        rotationSpeed={1.5} 
      />
      
      {/* Code Shards */}
      <CodeShard position={[4, 5, -8]} color="#818CF8" delay={0} />
      <CodeShard position={[-5, 0, -10]} color="#F472B6" delay={2} />
      <CodeShard position={[8, 2, -12]} color="#22D3EE" delay={4} />

      {/* Background Grid (Deeper) */}
      <gridHelper args={[100, 40, '#4F46E5', '#1E1B4B']} position={[0, -10, -20]} rotation={[Math.PI / 4, 0, 0]}>
        <meshBasicMaterial transparent opacity={0.05} />
      </gridHelper>
    </group>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AdvancedBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020617]">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366F1" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#EC4899" />
        
        <SceneContent />
        <ReactiveParticles />
      </Canvas>

      {/* Premium Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-80" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] opacity-60" />
    </div>
  );
}

export function MiniAdvancedScene({ color = '#6366F1' }: { color?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={1} />
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <MeshWobbleMaterial color={color} speed={2} factor={0.4} />
        </mesh>
      </Float>
    </Canvas>
  );
}

export function SimpleBackground() {
  return <AdvancedBackground />;
}
