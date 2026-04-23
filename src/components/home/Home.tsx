import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
import { AdvancedBackground } from '../three/AdvancedBackground';
import {
  Plus, Sparkles, Check, ArrowRight, Play, Users,
  Code, Palette, Building2, AppWindow, Layers,
  Rocket, Wand2, Globe, Zap, Shield, Twitter, Github, Linkedin, MessageSquare, Loader2, ChevronRight
} from 'lucide-react';

// --- Loading Screen Component ---
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setLoading(false);
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-[#0F172A] flex items-center justify-center"
      style={{ pointerEvents: loading ? 'auto' : 'none' }}
    >
      {/* Center Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: loading ? 1 : 1.5, opacity: loading ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_60px_#7C3AED80]"
        >
          <Sparkles size={40} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black tracking-tighter text-white uppercase mb-4"
        >
          FlowSite
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-medium text-white/40 uppercase tracking-[0.3em] mb-8"
        >
          Loading Experience
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-medium text-white/30 mt-4"
        >
          {Math.round(progress)}%
        </motion.p>
      </motion.div>

      {/* Particle Explosion Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: (Math.random() - 0.5) * 2000,
              y: (Math.random() - 0.5) * 2000,
              opacity: loading ? [0, 1, 0] : 0,
              scale: loading ? [0, 1, 0.5] : 0,
            }}
            transition={{
              duration: 2,
              delay: 0.5 + Math.random() * 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ left: '50%', top: '50%' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// --- Reusable Components ---

function SectionHeading({ title, subtitle, centered = true }: { title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={`space-y-6 mb-24 ${centered ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#7C3AED]"
        />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{subtitle || 'Feature'}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="heading-huge text-white text-glow"
      >
        {title}
      </motion.h2>
    </div>
  );
}

function ThreeDCard({ children, className = "", hoverIntensity = 8 }: { children: React.ReactNode, className?: string, hoverIntensity?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    return {
      rotateX: (centerY - y) / hoverIntensity,
      rotateY: (x - centerX) / hoverIntensity,
    };
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={(e) => {
        const coords = handleMouseMove(e);
        if (coords) {
          cardRef.current!.style.transform = `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (cardRef.current) {
          cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      }}
      className={`transform-gpu transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// --- Scroll-Reveal Animation Wrapper ---
function RevealOnScroll({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' | 'center' }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [direction === 'up' ? 80 : direction === 'down' ? -80 : 0, 0]);
  const x = useTransform(scrollYProgress, [0, 0.2], [direction === 'left' ? 80 : direction === 'right' ? -80 : 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [direction === 'center' ? 0.8 : 1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x, scale }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// --- Parallax Image/Element ---
function ParallaxElement({ children, speed = 0.2 }: { children: React.ReactNode, speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

// --- Main Home Component ---

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the entire page
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const handleSelectTemplate = (templateData: any) => {
    updateData(templateData);
    setWebsiteType(activeWebsiteType);
    onNavigate();
  };

  const handleBlank = () => {
    setWebsiteType(activeWebsiteType);
    resetToBlank();
    onNavigate();
  };

  const websiteTypes: { id: WebsiteType; title: string; icon: any; color: string }[] = [
    { id: 'portfolio', title: 'Developer', icon: Code, color: 'from-blue-500' },
    { id: 'college', title: 'Student', icon: Rocket, color: 'from-emerald-500' },
    { id: 'business', title: 'Business', icon: Building2, color: 'from-orange-500' },
    { id: 'app', title: 'Product', icon: AppWindow, color: 'from-violet-500' },
  ];

  const templates = allTemplates[activeWebsiteType];

  if (isLoading) {
    return (
      <>
        <LoadingScreen onComplete={() => setIsLoading(false)} />
        <div className="fixed inset-0 bg-[#0F172A]" />
      </>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="bg-background selection:bg-primary/30 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary z-[100] origin-left shadow-[0_0_20px_#7C3AED]"
        style={{ scaleX: scaleProgress }}
      />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <AdvancedBackground />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-10 py-8">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[1400px] mx-auto flex items-center justify-between"
          >
            <motion.div
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_30px_#7C3AED80]"
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>
              <span className="text-3xl font-black tracking-tighter uppercase text-white">FlowSite</span>
            </motion.div>

            <motion.div
              className="hidden lg:flex items-center gap-12 glass-premium px-12 py-4 rounded-full border-white/5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {['Templates', 'Features', 'Pricing'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-black uppercase tracking-[0.2em] hover:text-primary transition-colors text-white/70"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>

            <motion.button
              onClick={handleBlank}
              className="px-10 py-4 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-[0.1em] shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Start Building
            </motion.button>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
          <div className="section-wrapper text-center space-y-12">
            <RevealOnScroll delay={0.1}>
              <div className="inline-flex items-center gap-4 px-8 py-2 glass-premium rounded-full border-white/5">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/60">Digital Visionaries Choice</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <motion.h1
                className="heading-huge text-white text-glow"
              >
                CRAFT YOUR <br />
                <span className="gradient-text">DIGITAL DESTINY.</span>
              </motion.h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <p className="subheading mx-auto text-white/50 max-w-2xl">
                Architecture meets interactivity. Build premium, production-ready
                sites with our real-time 3D engine and AI synthesis.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4} direction="center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
                <motion.button
                  onClick={handleBlank}
                  className="px-12 py-6 bg-primary rounded-3xl font-black text-xl text-white shadow-[0_20px_50px_#7C3AED50] flex items-center gap-4"
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: '0 30px 60px rgba(124, 58, 237, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Launch Workspace <ArrowRight size={24} />
                </motion.button>
                <motion.button
                  className="px-12 py-6 glass-premium rounded-3xl font-black text-xl text-white"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-4">
                    <Play size={24} className="fill-white" /> Watch Demo
                  </span>
                </motion.button>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Templates Showcase */}
        <section id="templates" className="py-60">
          <div className="section-wrapper">
            <RevealOnScroll direction="left">
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-16">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Templates</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase">CHOOSE YOUR <br />BASE.</h2>
                </div>

                <div className="flex gap-4 p-3 glass-premium rounded-[2.5rem] border-white/5">
                  {websiteTypes.map((type, i) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setActiveWebsiteType(type.id)}
                      className={`px-10 py-5 rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                        activeWebsiteType === type.id
                          ? 'bg-primary text-white shadow-[0_10px_30px_#7C3AED50]'
                          : 'hover:bg-white/5 text-white/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {type.title}
                    </motion.button>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <RevealOnScroll delay={0} direction="center">
                <ThreeDCard className="h-full">
                  <motion.div
                    onClick={handleBlank}
                    className="glass-premium p-12 h-full flex flex-col items-center justify-center border-white/5 border-dashed hover:border-primary/50 transition-colors cursor-pointer group gap-6"
                    whileHover={{
                      borderColor: 'rgba(124, 58, 237, 0.5)',
                      boxShadow: '0 20px 60px rgba(124, 58, 237, 0.2)'
                    }}
                  >
                    <motion.div 
                      className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                    >
                      <Plus size={48} className="text-white/40 group-hover:text-primary transition-colors" />
                    </motion.div>
                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-black text-white uppercase">Start Blank</h3>
                      <p className="text-white/40 font-medium">Ultimate creative freedom.</p>
                    </div>
                  </motion.div>
                </ThreeDCard>
              </RevealOnScroll>

              {templates.map((template, i) => (
                <RevealOnScroll key={i} delay={(i + 1) * 0.1} direction="center">
                  <ThreeDCard className="h-full">
                    <motion.div
                      onClick={() => handleSelectTemplate(template.data)}
                      className="glass-premium p-12 h-full flex flex-col justify-between border-white/5 cursor-pointer group"
                      whileHover={{
                        borderColor: 'rgba(124, 58, 237, 0.5)',
                        boxShadow: '0 20px 60px rgba(124, 58, 237, 0.2)'
                      }}
                    >
                      <div className="space-y-10">
                        <div className="flex items-center justify-between">
                          <motion.div
                            className={`p-5 rounded-3xl bg-gradient-to-br ${template.color} shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <template.icon size={32} className="text-white" />
                          </motion.div>
                          <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/20">PREMIUM FOUNDATION</span>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white leading-tight uppercase">{template.title}</h3>
                          <p className="text-lg text-white/40 font-medium leading-relaxed">{template.subtitle}</p>
                        </div>
                      </div>
                      <div className="mt-16 flex items-center justify-between">
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-4 transition-transform">Select Base</span>
                        <motion.div
                          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"
                          whileHover={{ backgroundColor: 'rgba(124, 58, 237, 1)', borderColor: 'transparent' }}
                        >
                          <ArrowRight size={20} className="text-white" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </ThreeDCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-60 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] -z-10" />
          
          <div className="section-wrapper">
            <SectionHeading title="UNMATCHED POWER." subtitle="Core Engine" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Wand2, title: 'AI Logic', desc: 'Auto-generate SEO-optimized sections instantly.', color: 'text-violet-400', bg: 'bg-violet-400/10' },
                { icon: Globe, title: 'Edge Export', desc: 'Deploy anywhere with clean, zero-dep code.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { icon: Zap, title: 'Live Sync', desc: 'See changes in real-time with zero latency.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                { icon: Shield, title: 'Secure Store', desc: 'End-to-end encryption for your digital assets.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              ].map((f, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.2)' }}
                    className="glass-premium p-10 rounded-[2.5rem] space-y-6 group border border-white/5 h-full"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                      <f.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white">{f.title}</h3>
                    <p className="text-white/40 font-medium leading-relaxed text-sm">{f.desc}</p>
                    <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ChevronRight size={14} />
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto glass-premium rounded-[3rem] overflow-hidden border-white/5 shadow-2xl">
             <div className="grid md:grid-cols-2">
                <div className="p-12 md:p-16 space-y-8 bg-white/[0.02]">
                   <RevealOnScroll>
                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Why FlowSite?</h2>
                     <p className="text-white/50 mt-4 text-lg">We built the engine we always wanted. Fast, clean, and interactive.</p>
                   </RevealOnScroll>
                   <div className="space-y-6 pt-6">
                      {[
                        'Vanilla HTML/CSS Output',
                        'Real-time 3D Preview',
                        'No subscription lock-in',
                        'Blazing fast performance'
                      ].map((item, i) => (
                        <RevealOnScroll key={item} delay={i * 0.1}>
                          <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Check size={16} className="text-primary" />
                             </div>
                             <span className="text-lg font-bold text-white/80">{item}</span>
                          </div>
                        </RevealOnScroll>
                      ))}
                   </div>
                </div>
                <div className="bg-[#0A0F1E] p-12 md:p-16 border-t md:border-t-0 md:border-l border-white/5 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 blur-[50px]" />
                   <RevealOnScroll delay={0.3} direction="center">
                     <motion.div 
                       className="relative w-full aspect-square max-w-[300px]"
                       animate={{ rotate: 360 }}
                       transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                     >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur-[60px] opacity-30" />
                        <div className="absolute inset-4 border border-white/10 rounded-full border-dashed" />
                        <div className="absolute inset-8 border border-white/5 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Sparkles size={60} className="text-primary animate-pulse" />
                        </div>
                     </motion.div>
                   </RevealOnScroll>
                </div>
             </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-60">
          <div className="section-wrapper">
            <RevealOnScroll direction="center">
              <div className="text-center space-y-24">
                <div className="space-y-6">
                  <motion.h2
                    className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-none uppercase text-glow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    FREE FOREVER.
                  </motion.h2>
                  <p className="text-2xl text-white/40 max-w-2xl mx-auto font-medium">
                    Access the peak of digital architecture at zero cost for everyone.
                  </p>
                </div>

                <motion.div
                  className="max-w-4xl mx-auto glass-premium p-20 border-primary/20 shadow-[0_50px_100px_#000000]"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01, boxShadow: '0 60px 120px rgba(124, 58, 237, 0.2)' }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-16">
                    {[
                      'Unlimited Projects', '3D Canvas Pro', 'AI Core Synthesis',
                      'Production Export', 'Zero Dependencies', 'Global Hosting'
                    ].map((f, i) => (
                      <motion.div
                        key={f}
                        className="flex items-center gap-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 8 }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                          whileHover={{ scale: 1.2, backgroundColor: 'rgba(124, 58, 237, 0.4)' }}
                        >
                          <Check size={16} className="text-primary" />
                        </motion.div>
                        <span className="text-xl font-bold text-white/80">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    onClick={handleBlank}
                    className="w-full py-8 bg-white text-black rounded-3xl font-black text-2xl uppercase tracking-widest"
                    whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Start Building Now
                  </motion.button>
                </motion.div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-40 border-t border-white/5">
          <div className="section-wrapper">
            <RevealOnScroll>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                <div className="space-y-10">
                  <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase text-white">FLOWSITE</span>
                  </motion.div>
                  <p className="text-white/40 font-medium leading-relaxed max-w-[200px]">Architecting the next dimension of the web.</p>
                </div>

                {['Product', 'Company', 'Legal'].map((col, i) => (
                  <div key={col} className="space-y-10">
                    <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">{col}</h5>
                    <ul className="space-y-6">
                      {[['Features', 'Pricing', 'Docs'][i], ['About', 'Blog', 'Careers'][i], ['Privacy', 'Terms', 'Security'][i]].map(item => (
                        <motion.li key={item}>
                          <motion.a
                            href="#"
                            className="text-sm font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest"
                            whileHover={{ x: 4 }}
                          >
                            {item}
                          </motion.a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}

// --- Template Data ---
const allTemplates: any = {
  portfolio: [
    { title: 'Midnight Dev', subtitle: 'Modern developer portfolio with grid aesthetics.', icon: Code, color: 'from-blue-600 to-indigo-700', data: { websiteType: 'portfolio', settings: { theme: 'dark', accentColor: '#3B82F6' } } },
    { title: 'Studio Canvas', subtitle: 'Minimalist foundation for designers and artists.', icon: Palette, color: 'from-pink-600 to-rose-700', data: { websiteType: 'portfolio', settings: { theme: 'light', accentColor: '#EC4899' } } },
  ],
  college: [
    { title: 'Scholar Port', subtitle: 'Research and academic project showcase.', icon: Rocket, color: 'from-emerald-600 to-teal-700', data: { websiteType: 'college', settings: { theme: 'dark', accentColor: '#10B981' } } },
  ],
  business: [
    { title: 'Nexus Agency', subtitle: 'High-conversion business landing pages.', icon: Building2, color: 'from-amber-600 to-orange-700', data: { websiteType: 'business', settings: { theme: 'dark', accentColor: '#F59E0B' } } },
  ],
  app: [
    { title: 'SaaS Alpha', subtitle: 'Modern software and mobile app showcase.', icon: AppWindow, color: 'from-violet-600 to-purple-700', data: { websiteType: 'app', settings: { theme: 'dark', accentColor: '#7C3AED' } } },
  ],
};