import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Octahedron, MeshWobbleMaterial, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { AdvancedBackground } from './AdvancedBackground';

// Re-export from AdvancedBackground
export { AdvancedBackground, SimpleBackground, MiniAdvancedScene } from './AdvancedBackground';

function ResponsiveFloatingShape({ color, geometry, speed = 1, delay = 0, scale = 1, offset = [0, 0, 0] }: {
  color: string;
  geometry: 'sphere' | 'torus' | 'icosahedron' | 'octahedron';
  speed?: number;
  delay?: number;
  scale?: number;
  offset: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      // Calculate responsive position based on viewport
      const x = (offset[0] / 10) * viewport.width;
      const y = (offset[1] / 10) * viewport.height;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y + Math.sin(state.clock.elapsedTime * speed * 0.5 + delay) * 0.2, 0.1);
      
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.2 + delay) * 0.3;
      meshRef.current.rotation.y += 0.005 * speed;
    }
  });

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        scale={hovered ? scale * 1.2 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {geometry === 'sphere' && <Sphere args={[0.6, 64, 64]} />}
        {geometry === 'torus' && <Torus args={[0.5, 0.15, 32, 64]} />}
        {geometry === 'icosahedron' && <Icosahedron args={[0.6, 2]} />}
        {geometry === 'octahedron' && <Octahedron args={[0.6, 0]} />}
        <MeshDistortMaterial
          color={color}
          speed={2 * speed}
          distort={0.4}
          radius={1}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={hovered ? 0.9 : 0.5}
        />
      </mesh>
    </Float>
  );
}

function MovingStars() {
  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Sparkles 
      ref={ref}
      count={200} 
      scale={20} 
      size={2} 
      speed={0.5} 
      opacity={0.3} 
      color="#818CF8" 
    />
  );
}

function FuturisticGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.8) % 2;
    }
  });

  return (
    <group ref={gridRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[50, 50, '#6366F1', '#1E293B']}>
        <meshBasicMaterial transparent opacity={0.1} />
      </gridHelper>
    </group>
  );
}

export function BackgroundScene({ variant = 'default' }: { variant?: 'default' | 'light' | 'accent' }) {
  // Use advanced background for default, simple for others
  if (variant === 'default') {
    return <AdvancedBackground />;
  }

  const colorSchemes = {
    default: {
      primary: '#818CF8',
      secondary: '#A78BFA',
      accent: '#F472B6',
      tertiary: '#22D3EE',
    },
    light: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      tertiary: '#06B6D4',
    },
    accent: {
      primary: '#F472B6',
      secondary: '#FB923C',
      accent: '#F43F5E',
      tertiary: '#FBBF24',
    }
  };

  const colors = colorSchemes[variant];

  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={colors.primary} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={colors.tertiary} />
      <spotLight position={[0, 5, 0]} intensity={0.5} color={colors.accent} />

      <MovingStars />
      <FuturisticGrid />

      <ResponsiveFloatingShape offset={[-4, 3, -2]} color={colors.primary} geometry="icosahedron" speed={0.8} delay={0} scale={1.2} />
      <ResponsiveFloatingShape offset={[5, -2, -3]} color={colors.secondary} geometry="torus" speed={1.2} delay={1} scale={1} />
      <ResponsiveFloatingShape offset={[-6, -3, -4]} color={colors.accent} geometry="octahedron" speed={0.9} delay={2} scale={0.8} />
      <ResponsiveFloatingShape offset={[4, 4, -5]} color={colors.tertiary} geometry="sphere" speed={1} delay={1.5} scale={1.1} />
    </Canvas>
  );
}


export function MiniScene({ color = '#6366F1' }: { color?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color={color} />

      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <MeshWobbleMaterial color={color} factor={0.2} speed={3} roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.4}>
        <mesh position={[1.2, 0.3, -0.8]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#A78BFA" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[-1, -0.5, -0.5]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#F472B6" roughness={0.2} metalness={0.7} />
        </mesh>
      </Float>
    </Canvas>
  );
}

export function Card3DPreview({ accentColor = '#6366F1' }: { accentColor?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={0.4} />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.5} />
        </mesh>
      </Float>
    </Canvas>
  );
}