import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Octahedron, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedParticle({ position, color, delay = 0 }: { position: [number, number, number]; color: string; delay?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.2;
      ref.current.rotation.x = state.clock.elapsedTime * 0.2 + delay;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.6} />
    </mesh>
  );
}

function FloatingGeometricShape({ position, color, geometry, speed = 1, delay = 0, scale = 1 }: {
  position: [number, number, number];
  color: string;
  geometry: 'sphere' | 'torus' | 'icosahedron' | 'octahedron' | 'box';
  speed?: number;
  delay?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed + delay) * 0.4;
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5 + delay) * 0.15;
    }
  });

  const GeometryComponent = {
    sphere: Sphere,
    torus: Torus,
    icosahedron: Icosahedron,
    octahedron: Octahedron,
  }[geometry];

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.15 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {geometry === 'sphere' && <Sphere args={[0.6, 32, 32]} />}
        {geometry === 'torus' && <Torus args={[0.5, 0.2, 16, 48]} />}
        {geometry === 'icosahedron' && <Icosahedron args={[0.6, 1]} />}
        {geometry === 'octahedron' && <Octahedron args={[0.6, 0]} />}
        <MeshWobbleMaterial
          color={color}
          factor={0.15}
          speed={2}
          roughness={0.2}
          metalness={0.6}
          transparent
          opacity={hovered ? 0.8 : 0.4}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 150 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPalette = ['#818CF8', '#A78BFA', '#F472B6', '#22D3EE', '#34D399'];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;

      const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FloatingRing({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3;
      meshRef.current.rotation.y += 0.002 * speed;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.8, 0.02, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

function GridFloor() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <group ref={gridRef} position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[40, 40, '#6366F1', '#6366F1']}>
        <meshBasicMaterial transparent opacity={0.08} />
      </gridHelper>
    </group>
  );
}

export function BackgroundScene({ variant = 'default' }: { variant?: 'default' | 'light' | 'accent' }) {
  const colorSchemes = {
    default: {
      primary: '#818CF8',
      secondary: '#A78BFA',
      accent: '#F472B6',
      tertiary: '#22D3EE',
      quaternary: '#34D399'
    },
    light: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      tertiary: '#06B6D4',
      quaternary: '#10B981'
    },
    accent: {
      primary: '#F472B6',
      secondary: '#FB923C',
      accent: '#F43F5E',
      tertiary: '#FBBF24',
      quaternary: '#A78BFA'
    }
  };

  const colors = colorSchemes[variant];
  const shapes = [
    { position: [-6, 2, -6] as [number, number, number], color: colors.primary, geometry: 'icosahedron' as const, speed: 0.7, delay: 0 },
    { position: [5, -1, -5] as [number, number, number], color: colors.secondary, geometry: 'sphere' as const, speed: 1, delay: 1 },
    { position: [-4, -2, -4] as [number, number, number], color: colors.accent, geometry: 'octahedron' as const, speed: 0.8, delay: 2 },
    { position: [4, 2, -5] as [number, number, number], color: colors.tertiary, geometry: 'torus' as const, speed: 0.9, delay: 1.5 },
    { position: [-5, 0, -7] as [number, number, number], color: colors.quaternary, geometry: 'sphere' as const, speed: 0.6, delay: 3 },
    { position: [3, -2, -6] as [number, number, number], color: colors.primary, geometry: 'icosahedron' as const, speed: 1.1, delay: 0.5 },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#818CF8" />

      <ParticleField count={100} />
      <GridFloor />
      <FloatingRing position={[-3, 1, -3]} color={colors.primary} speed={0.5} />
      <FloatingRing position={[4, -1, -4]} color={colors.accent} speed={0.7} />

      {shapes.map((shape, index) => (
        <FloatingGeometricShape key={index} {...shape} />
      ))}
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