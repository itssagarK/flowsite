import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { useBuilder, WebsiteType } from '../../context/BuilderContext';
import { CinematicLoader } from './CinematicLoader';
import { Code, Palette, Building2, AppWindow, Rocket, Smartphone } from 'lucide-react';

// Import Modular Sections
import { Navigation } from './sections/Navigation';
import { HeroSection } from './sections/HeroSection';
import { WorkflowSection } from './sections/WorkflowSection';
import { UseCasesSection } from './sections/UseCasesSection';
import { LiveDemoSection } from './sections/LiveDemoSection';
import { PricingSection } from './sections/PricingSection';
import { Footer } from './sections/Footer';

// --- Template Data ---
const allTemplates: any = {
  portfolio: [
    { title: 'Midnight Dev', subtitle: 'Modern dark theme for developers', icon: Code, color: 'from-blue-600 to-indigo-700', data: { websiteType: 'portfolio', settings: { theme: 'dark', accentColor: '#3B82F6' } } },
    { title: 'Clean Portfolio', subtitle: 'Minimalist portfolio design', icon: Palette, color: 'from-slate-600 to-gray-700', data: { websiteType: 'portfolio', settings: { theme: 'light', accentColor: '#64748B' } } },
  ],
  college: [
    { title: 'Scholar Port', subtitle: 'Academic research showcase', icon: Rocket, color: 'from-emerald-600 to-teal-700', data: { websiteType: 'college', settings: { theme: 'dark', accentColor: '#10B981' } } },
    { title: 'Campus Life', subtitle: 'Student club & event site', icon: Building2, color: 'from-cyan-600 to-blue-700', data: { websiteType: 'college', settings: { theme: 'dark', accentColor: '#06B6D4' } } },
  ],
  business: [
    { title: 'Nexus Agency', subtitle: 'Professional agency website', icon: Building2, color: 'from-amber-600 to-orange-700', data: { websiteType: 'business', settings: { theme: 'dark', accentColor: '#F59E0B' } } },
    { title: 'Startup Landing', subtitle: 'Modern startup website', icon: Rocket, color: 'from-rose-600 to-pink-700', data: { websiteType: 'business', settings: { theme: 'dark', accentColor: '#F43F5E' } } },
  ],
  app: [
    { title: 'SaaS Alpha', subtitle: 'SaaS product launch', icon: AppWindow, color: 'from-violet-600 to-purple-700', data: { websiteType: 'app', settings: { theme: 'dark', accentColor: '#7C3AED' } } },
    { title: 'Mobile App', subtitle: 'Mobile app landing page', icon: Smartphone, color: 'from-cyan-600 to-teal-700', data: { websiteType: 'app', settings: { theme: 'dark', accentColor: '#22D3EE' } } },
  ],
};

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');
  const [isLoading, setIsLoading] = useState(true);
  const demoRef = useRef<HTMLElement>(null);

  // Mouse interaction for background effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-8, 8]);
  const gridY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-8, 8]);
  const gridSpringX = useSpring(gridX, { stiffness: 100, damping: 30 });
  const gridSpringY = useSpring(gridY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleSelectTemplate = (templateData: any) => {
    resetToBlank(activeWebsiteType);
    updateData(templateData);
    onNavigate();
  };

  const handleBlank = () => {
    resetToBlank(activeWebsiteType);
    onNavigate();
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { scrollYProgress } = useScroll();
  const templates = allTemplates[activeWebsiteType];

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <CinematicLoader key="loader" onComplete={() => setIsLoading(false)} />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#020617] selection:bg-primary/30 font-sans min-h-screen origin-center"
          onMouseMove={handleMouseMove}
        >
          {/* Scroll Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
            style={{ scaleX: scrollYProgress }}
          />

          {/* Ambient Background Effects */}
          <div className="digital-void" />
          <div className="ambient-glow" />
          <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />
          <div
            className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
          <motion.div
            className="touch-glow"
            style={{ x: mouseX, y: mouseY }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ opacity: { repeat: Infinity, duration: 4 } }}
          />

          <div className="relative z-10">
            <Navigation onGetStarted={handleBlank} />
            
            <HeroSection 
              onStartBuilding={handleBlank} 
              onViewDemo={scrollToDemo} 
              gridSpringX={gridSpringX} 
              gridSpringY={gridSpringY} 
            />
            
            <WorkflowSection />
            
            <UseCasesSection 
              activeWebsiteType={activeWebsiteType}
              setActiveWebsiteType={setActiveWebsiteType}
              templates={templates}
              onStartBlank={handleBlank}
              onSelectTemplate={handleSelectTemplate}
            />
            
            <LiveDemoSection 
              demoRef={demoRef}
              onTryYourself={handleBlank}
            />
            
            <PricingSection onStartFree={handleBlank} />
            
            <Footer />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
