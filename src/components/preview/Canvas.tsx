import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Canvas as ThreeCanvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useBuilder } from '../../context/BuilderContext';
import { Hero } from './Hero';
import { About } from './About';
import { Projects } from './Projects';
import { Contact } from './Contact';
import { Skills } from './Skills';
import { Experience } from './Experience';
import { BusinessHero } from './BusinessHero';
import { Services } from './Services';
import { Stats } from './Stats';
import { Team } from './Team';
import { AppHero } from './AppHero';
import { Features } from './Features';
import { Pricing } from './Pricing';
import { CollegeProjects } from './CollegeProjects';
import { Education } from './Education';

function FloatingElement({ position, color, delay = 0 }: { position: [number, number, number]; color: string; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.15;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position}>
        <Sphere args={[0.2, 16, 16]}>
          <meshStandardMaterial color={color} transparent opacity={0.12} roughness={0.2} metalness={0.8} />
        </Sphere>
      </mesh>
    </Float>
  );
}

function Background3D({ accentColor }: { accentColor: string }) {
  return (
    <ThreeCanvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <FloatingElement position={[-2, 2, -2]} color={accentColor} delay={0} />
      <FloatingElement position={[2, -1, -1.5]} color={accentColor} delay={1} />
      <FloatingElement position={[-1.5, -2, -1]} color={accentColor} delay={2} />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[2, 2, -3]}>
          <torusGeometry args={[0.3, 0.08, 16, 32]} />
          <meshStandardMaterial color={accentColor} transparent opacity={0.08} />
        </mesh>
      </Float>
    </ThreeCanvas>
  );
}

export function Canvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const { data, activeDevice } = useBuilder();
  const { websiteType } = data;

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element && containerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sectionOrder = data.settings.sectionOrder || ['hero', 'projects', 'skills', 'experience', 'services', 'contact', 'stats', 'team', 'pricing', 'education', 'about'];

  const getNavItems = () => {
    const visible = data.settings.visibleSections || {};
    const items: { id: string; label: string }[] = [];

    sectionOrder.forEach(id => {
      if (visible[id] === false) return;

      switch (id) {
        case 'hero': break; // Usually not in nav or at the top
        case 'projects': items.push({ id, label: websiteType === 'college' ? 'Projects' : 'Work' }); break;
        case 'skills': items.push({ id, label: 'Skills' }); break;
        case 'experience': items.push({ id, label: 'Experience' }); break;
        case 'services': items.push({ id, label: 'Services' }); break;
        case 'stats': items.push({ id, label: 'Stats' }); break;
        case 'team': items.push({ id, label: 'Team' }); break;
        case 'pricing': items.push({ id, label: 'Pricing' }); break;
        case 'education': items.push({ id, label: 'Education' }); break;
        case 'about': items.push({ id, label: 'About' }); break;
        case 'contact': items.push({ id, label: 'Contact' }); break;
      }
    });

    return items;
  };

  const renderSections = () => {
    const visible = data.settings.visibleSections || {};

    return sectionOrder.map((id) => {
      if (visible[id] === false) return null;

      switch (id) {
        case 'hero':
          if (websiteType === 'business') return <BusinessHero key={id} />;
          if (websiteType === 'app') return <AppHero key={id} />;
          return <Hero key={id} />;
        case 'projects':
          return websiteType === 'college' ? <CollegeProjects key={id} /> : <Projects key={id} />;
        case 'skills': return <Skills key={id} />;
        case 'experience': return <Experience key={id} />;
        case 'services': return <Services key={id} />;
        case 'stats': return <Stats key={id} />;
        case 'team': return <Team key={id} />;
        case 'pricing': return <Pricing key={id} />;
        case 'education': return <Education key={id} />;
        case 'about': return <About key={id} />;
        case 'contact': return <Contact key={id} />;
        default: return null;
      }
    });
  };

  const deviceConfigs = {
    mobile: {
      width: '375px',
      frameClass: 'rounded-[40px] border-4 border-gray-700 shadow-2xl',
      hasNotch: true,
    },
    tablet: {
      width: '768px',
      frameClass: 'rounded-[20px] border-4 border-gray-600 shadow-xl',
      hasNotch: false,
    },
    desktop: {
      width: '100%',
      frameClass: 'rounded-none border-0 shadow-none',
      hasNotch: false,
    },
  };

  const currentConfig = deviceConfigs[activeDevice];

  return (
    <div className="flex-1 bg-canvas-bg w-full flex items-start lg:items-center justify-center p-4 lg:p-8 relative transition-colors duration-300 overflow-hidden">
      <Background3D accentColor={data.settings.accentColor} />

      {/* Progress Bar */}
      <motion.div className="fixed top-16 left-0 right-0 h-0.5 bg-primary/20 z-[60] hidden lg:block">
        <motion.div className="h-full bg-gradient-to-r from-primary to-violet-500" style={{ scaleX, transformOrigin: 'left' }} />
      </motion.div>

      {/* Main Device Frame Wrapper */}
      <div className="w-full h-full flex items-center justify-center relative z-10">
        <motion.div
          layoutId="device-frame"
          initial={false}
          animate={{
            width: currentConfig.width,
            height: activeDevice === 'desktop' ? '100%' : '85vh',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className={`bg-card flex flex-col transition-all duration-300 relative overflow-hidden bg-background ${currentConfig.frameClass} ${
            activeDevice !== 'desktop' ? 'max-h-[900px] border-border' : 'h-full w-full'
          }`}
        >
          {currentConfig.hasNotch && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-700 rounded-b-2xl z-[60] flex items-center justify-center gap-1.5">
              <div className="w-8 h-1 bg-gray-600 rounded-full" />
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
            </div>
          )}

          <motion.div className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left z-50" style={{ scaleX }} />

          <div ref={containerRef} className="flex-1 relative overflow-y-auto bg-background scroll-smooth">
            <nav className="p-4 md:px-8 flex justify-between items-center bg-card/80 backdrop-blur-md sticky top-0 z-40 border-b border-border/50">
              <button className="font-bold text-foreground text-lg cursor-pointer hover:text-primary transition-colors" onClick={() => scrollTo('hero')}>
                {data.user.name?.slice(0, 2) || 'SG'}.
              </button>
              <div className="flex gap-4 md:gap-6 text-sm font-medium text-muted-foreground">
                {getNavItems().map((item) => (
                  <button key={item.id} onClick={() => scrollTo(item.id)} className="hover:text-primary transition-colors cursor-pointer relative group">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex flex-col gap-8 md:gap-12">
              {renderSections()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview Badge */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="absolute top-4 right-4 md:right-8 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 z-50 pointer-events-none hidden md:flex">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-white rounded-full" />
        Preview
      </motion.div>
    </div>
  );
}
