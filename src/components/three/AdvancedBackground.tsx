import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Icosahedron, Box, Ring, Plane, Text } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// LAYER 1: Base Grid Pattern (CSS + Three.js)
// ============================================

function GridPattern() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.3) % 3;
    }
  });

  return (
    <group ref={gridRef} position={[0, 0, -15]} rotation={[-Math.PI / 3, 0, 0]}>
      <gridHelper args={[60, 60, '#8B5CF6', '#1E1B4B']} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial transparent opacity={0.08} />
      </gridHelper>
      <gridHelper args={[60, 30, '#6366F1', '#0F172A']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <meshBasicMaterial transparent opacity={0.04} />
      </gridHelper>
    </group>
  );
}

// ============================================
// LAYER 2: Floating Particle System
// ============================================

function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 80;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#6366F1'),
      new THREE.Color('#8B5CF6'),
      new THREE.Color('#06B6D4'),
      new THREE.Color('#EC4899'),
      new THREE.Color('#F59E0B'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 15 - 5;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += Math.sin(time * 0.2 + i) * 0.002;
        positions[i3 + 1] += Math.cos(time * 0.15 + i) * 0.002;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// LAYER 3: Floating 3D Website Cards
// ============================================

interface FloatingCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  colors: { gradient: string; accent: string };
  delay?: number;
  floatSpeed?: number;
}

function FloatingCard({ position, rotation, scale = 1, colors: colorScheme, delay = 0, floatSpeed = 2 }: FloatingCardProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime + delay;
      groupRef.current.position.y = position[1] + Math.sin(time * floatSpeed * 0.5) * 0.3;
      groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        {/* Card Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.8, 2, 0.1]} />
          <meshStandardMaterial color="#1E293B" transparent opacity={0.7} metalness={0.3} roughness={0.5} />
        </mesh>

        {/* Gradient Overlay */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.7, 1.9]} />
          <meshBasicMaterial color={colorScheme.gradient} transparent opacity={0.3} />
        </mesh>

        {/* Card Content - Simple shapes representing website elements */}
        {/* Header */}
        <mesh position={[0, 0.7, 0.08]}>
          <planeGeometry args={[2.4, 0.4]} />
          <meshBasicMaterial color={colorScheme.accent} transparent opacity={0.4} />
        </mesh>

        {/* Body sections */}
        <mesh position={[-0.8, 0.2, 0.08]}>
          <planeGeometry args={[0.6, 0.5]} />
          <meshBasicMaterial color="#475569" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0.4, 0.2, 0.08]}>
          <planeGeometry args={[1.4, 0.5]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.3} />
        </mesh>

        {/* Bottom section */}
        <mesh position={[0, -0.5, 0.08]}>
          <planeGeometry args={[2.4, 0.6]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.2} />
        </mesh>

        {/* Decorative elements */}
        <mesh position={[-1.1, 0.7, 0.08]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color={colorScheme.accent} transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingCards() {
  return (
    <>
      {/* Card 1: Portfolio - Top Right */}
      <FloatingCard
        position={[5, 2, -3]}
        rotation={[0.1, -0.8, 0.05]}
        scale={0.9}
        colors={{ gradient: '#3B82F6', accent: '#60A5FA' }}
        delay={0}
        floatSpeed={1.8}
      />

      {/* Card 2: Landing Page - Middle Left */}
      <FloatingCard
        position={[-5, 0, -4]}
        rotation={[0.15, 0.6, -0.1]}
        scale={1}
        colors={{ gradient: '#8B5CF6', accent: '#A78BFA' }}
        delay={2}
        floatSpeed={2.2}
      />

      {/* Card 3: App Showcase - Bottom Right */}
      <FloatingCard
        position={[4, -2, -2]}
        rotation={[-0.1, -0.5, 0.1]}
        scale={0.8}
        colors={{ gradient: '#06B6D4', accent: '#22D3EE' }}
        delay={4}
        floatSpeed={1.6}
      />

      {/* Card 4: Design Canvas - Top Left */}
      <FloatingCard
        position={[-4, 2.5, -5]}
        rotation={[0.2, 0.4, -0.15]}
        scale={0.75}
        colors={{ gradient: '#EC4899', accent: '#F472B6' }}
        delay={1}
        floatSpeed={2}
      />
    </>
  );
}

// ============================================
// LAYER 4: Animated Code Blocks (Text in 3D)
// ============================================

function CodeBlock({ position, rotation, text, color, delay = 0 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  text: string[];
  color: string;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime + delay;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {visible && (
        <group>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3, 1.5]} />
            <meshBasicMaterial color="#0F172A" transparent opacity={0.6} />
          </mesh>
          {text.map((line, i) => (
            <mesh key={i} position={[-1.2, 0.5 - i * 0.2, 0.01]}>
              <planeGeometry args={[2.4, 0.15]} />
              <meshBasicMaterial color={color} transparent opacity={0.25} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function CodeBlocks() {
  const htmlCode = ['<div class="hero">', '  <h1>Welcome</h1>', '  <section class="content">', '  </section>', '</div>'];
  const cssCode = ['.hero {', '  display: flex;', '  justify-content: center;', '  align-items: center;', '}'];
  const jsCode = ['const app = {', '  init: () => {', '    console.log("Ready!");', '  },', '};'];

  return (
    <>
      <CodeBlock
        position={[0, 3, -6]}
        rotation={[0, 0, 0]}
        text={htmlCode}
        color="#A78BFA"
        delay={0}
      />
      <CodeBlock
        position={[-6, -2, -7]}
        rotation={[0.1, 0.3, 0]}
        text={cssCode}
        color="#F472B6"
        delay={3}
      />
      <CodeBlock
        position={[5, 1, -8]}
        rotation={[0, -0.2, 0]}
        text={jsCode}
        color="#22D3EE"
        delay={6}
      />
    </>
  );
}

// ============================================
// LAYER 5: Geometric Shape Animations
// ============================================

function GeometricShapes() {
  const circleRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const squareRef = useRef<THREE.Mesh>(null);
  const hexagonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotating gradient circle
    if (circleRef.current) {
      circleRef.current.rotation.z = time * 0.3;
      circleRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1);
    }

    // Animated cube
    if (cubeRef.current) {
      cubeRef.current.rotation.x = time * 0.4;
      cubeRef.current.rotation.y = time * 0.3;
    }

    // Pulsing square
    if (squareRef.current) {
      squareRef.current.scale.setScalar(1 + Math.sin(time * 1) * 0.15);
      squareRef.current.rotation.z = time * 0.2;
    }

    // Morphing hexagon
    if (hexagonRef.current) {
      hexagonRef.current.rotation.x = time * 0.25;
      hexagonRef.current.rotation.y = time * 0.35;
      const morph = Math.sin(time * 0.5);
      hexagonRef.current.scale.setScalar(0.8 + morph * 0.3);
    }
  });

  return (
    <>
      {/* Rotating Circle - Top Right */}
      <mesh ref={circleRef} position={[6, 3, -8]}>
        <ringGeometry args={[1.5, 2, 64]} />
        <meshBasicMaterial color="#6366F1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Animated Cube - Center Right */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh ref={cubeRef} position={[5, 0, -6]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8B5CF6" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>

      {/* Pulsing Square - Bottom Left */}
      <mesh ref={squareRef} position={[-6, -3, -7]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.15} />
      </mesh>

      {/* Morphing Hexagon - Top Left */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={hexagonRef} position={[-5, 3, -9]}>
          <circleGeometry args={[1, 6]} />
          <meshBasicMaterial color="#EC4899" transparent opacity={0.12} />
        </mesh>
      </Float>
    </>
  );
}

// ============================================
// LAYER 6: Data Flow Visualization
// ============================================

function DataFlowLines() {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const points = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];

    // Create curved paths between elements
    for (let i = 0; i < 5; i++) {
      const startX = (Math.random() - 0.5) * 15;
      const startY = (Math.random() - 0.5) * 10;
      const startZ = -3 - Math.random() * 5;

      const endX = (Math.random() - 0.5) * 15;
      const endY = (Math.random() - 0.5) * 10;
      const endZ = -3 - Math.random() * 5;

      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2 + 2;
      const midZ = (startZ + endZ) / 2;

      curves.push(new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3(midX, midY, midZ),
        new THREE.Vector3(endX, endY, endZ),
      ]));
    }

    return curves;
  }, []);

  return (
    <group ref={linesRef}>
      {points.map((curve, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={curve.getPoints(20).length}
              array={new Float32Array(curve.getPoints(20).flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#06B6D4" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  );
}

// ============================================
// LAYER 7: Light & Glow Effects
// ============================================

function AmbientLights() {
  return (
    <>
      {/* Purple glow from top-left */}
      <pointLight position={[-10, 8, 5]} intensity={0.8} color="#8B5CF6" distance={20} />
      <pointLight position={[-8, 6, 3]} intensity={0.5} color="#8B5CF6" distance={15} />

      {/* Blue glow from bottom-right */}
      <pointLight position={[10, -6, 5]} intensity={0.8} color="#6366F1" distance={20} />
      <pointLight position={[8, -4, 3]} intensity={0.5} color="#6366F1" distance={15} />

      {/* Cyan glow from top-right */}
      <pointLight position={[8, 8, 3]} intensity={0.6} color="#06B6D4" distance={18} />

      {/* Pink accent light */}
      <pointLight position={[0, -5, 2]} intensity={0.4} color="#EC4899" distance={12} />
    </>
  );
}

// ============================================
// MAIN BACKGROUND SCENE
// ============================================

export function AdvancedBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        {/* Camera settings */}
        <ambientLight intensity={0.3} />

        {/* Layer 1: Grid */}
        <GridPattern />

        {/* Layer 2: Particles */}
        <ParticleSystem />

        {/* Layer 3: Floating Cards */}
        <FloatingCards />

        {/* Layer 4: Code Blocks */}
        <CodeBlocks />

        {/* Layer 5: Geometric Shapes */}
        <GeometricShapes />

        {/* Layer 6: Data Flow */}
        <DataFlowLines />

        {/* Layer 7: Lights */}
        <AmbientLights />
      </Canvas>

      {/* Layer 8: Overlay/Clarity Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.4) 70%, rgba(15, 23, 42, 0.7) 100%)',
        }}
      />

      {/* Additional clarity layer for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, transparent 20%, transparent 80%, rgba(15, 23, 42, 0.3) 100%)',
        }}
      />
    </div>
  );
}

// ============================================
// MINI VERSION FOR PREVIEWS
// ============================================

export function MiniAdvancedScene({ color = '#6366F1' }: { color?: string }) {
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

      <Sparkles count={30} scale={3} size={1.5} speed={0.5} opacity={0.4} color={color} />
    </Canvas>
  );
}

// ============================================
// RESPONSIVE SIMPLIFIED VERSION
// ============================================

export function SimpleBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)' }}>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        dpr={1}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366F1" />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#8B5CF6" />

        <Sparkles count={50} scale={8} size={1.5} speed={0.3} opacity={0.3} color="#818CF8" />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={[2, 1, -3]}>
            <icosahedronGeometry args={[0.5, 1]} />
            <MeshDistortMaterial color="#6366F1" speed={2} distort={0.3} transparent opacity={0.6} />
          </mesh>
        </Float>

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <mesh position={[-2, -1, -4]}>
            <torusGeometry args={[0.4, 0.15, 16, 32]} />
            <meshStandardMaterial color="#8B5CF6" wireframe transparent opacity={0.5} />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.2}>
          <mesh position={[0, 2, -5]}>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color="#EC4899" transparent opacity={0.4} />
          </mesh>
        </Float>
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.5) 100%)',
        }}
      />
    </div>
  );
}