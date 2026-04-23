import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
import { AdvancedBackground } from '../three/AdvancedBackground';
import { AutoDemo } from './AutoDemo';
import {
  Plus, Sparkles, Check, ArrowRight, Play, Users,
  Code, Palette, Building2, AppWindow, Layers,
  Rocket, Wand2, Globe, Zap, Shield, Twitter, Github, Linkedin, MessageSquare, Loader2, ChevronRight, MousePointer2, ExternalLink
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
      className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center"
      style={{ pointerEvents: loading ? 'auto' : 'none' }}
    >
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
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase mb-4">FlowSite</h1>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </motion.div>
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
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#7C3AED]" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{subtitle || 'Feature'}</span>
      </motion.div>
      <h2 className="heading-huge text-white text-glow">{title}</h2>
    </div>
  );
}

function ThreeDCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({ x: (y - centerY) / 20, y: (centerX - x) / 20 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`perspective-1000 preserve-3d ${className}`}
    >
      {children}
    </motion.div>
  );
}

function RevealOnScroll({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' | 'center' }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
        x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
        scale: direction === 'center' ? 0.95 : 1
      }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const demoRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const templates = allTemplates[activeWebsiteType];

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="bg-[#020617] selection:bg-primary/30 font-sans min-h-screen" onMouseMove={handleMouseMove}>
      {/* Digital Void Background */}
      <div className="digital-void" />
      <div className="fixed inset-0 z-0">
        <AdvancedBackground />
      </div>

      {/* Hand Interaction Glow */}
      <motion.div 
        className="touch-glow"
        animate={{ 
          x: mousePos.x - 100, 
          y: mousePos.y - 100,
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ opacity: { repeat: Infinity, duration: 3 } }}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-10 py-8">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_#7C3AED80] group-hover:rotate-12 transition-transform">
                <Sparkles size={24} className="text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase text-white">FlowSite</span>
            </div>
            <div className="hidden lg:flex items-center gap-12">
              {['Features', 'Templates', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">{item}</a>
              ))}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleBlank();
              }} 
              className="px-10 py-4 bg-white text-black rounded-2xl text-sm font-black uppercase tracking-[0.1em] shadow-xl hover:scale-105 transition-all cursor-pointer relative z-20"
            >
              Launch App
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <div className="section-wrapper text-center space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 glass-premium rounded-full border-primary/20 bg-primary/5"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Engineered for Creators</span>
            </motion.div>

            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase"
              >
                Build your <br /><span className="gradient-text">Vision,</span> <br />Beautifully.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="subheading mx-auto text-white/40"
              >
                The most intuitive way to design, build, and deploy your next project. 
                Experience a workspace where your ideas flow without limits.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 relative z-20"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlank();
                }} 
                className="px-12 py-6 bg-primary text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_#7C3AED40] hover:shadow-[0_20px_50px_#7C3AED60] hover:-translate-y-1 transition-all flex items-center gap-3 cursor-pointer"
              >
                Start Building <ArrowRight size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToDemo();
                }} 
                className="px-12 py-6 glass-premium text-white rounded-2xl font-black text-xl border-white/10 hover:bg-white/5 transition-all flex items-center gap-3 cursor-pointer"
              >
                Watch Demo <Play size={20} fill="currentColor" />
              </button>
            </motion.div>
          </div>

          {/* Floating UI Decorative Elements */}
          <div className="absolute top-[20%] left-[10%] hidden 2xl:block">
            <ThreeDCard>
              <div className="glass-premium p-6 w-64 space-y-4 border-primary/20 rotate-[-10deg]">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Code size={20} /></div>
                  <div className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-500 text-[8px] font-bold">READY</div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-white/5 rounded-full" />
                </div>
              </div>
            </ThreeDCard>
          </div>

          <div className="absolute bottom-[20%] right-[10%] hidden 2xl:block">
            <ThreeDCard>
              <div className="glass-premium p-6 w-64 space-y-4 border-pink-500/20 rotate-[10deg]">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500"><Palette size={20} /></div>
                  <div className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-500 text-[8px] font-bold">ACTIVE</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                   {[1,2,3,4].map(i => <div key={i} className="aspect-square rounded-md bg-white/5" />)}
                </div>
              </div>
            </ThreeDCard>
          </div>
        </section>

        {/* Live Demo Showcase Section */}
        <section ref={demoRef} id="demo" className="py-60 relative">
          <div className="section-wrapper space-y-32">
            <RevealOnScroll direction="center">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Live Experience</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">Automated <br />Intelligence.</h2>
                <p className="subheading mx-auto text-white/40">Witness the synergy of design and logic as FlowSite builds in real-time.</p>
              </div>
            </RevealOnScroll>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-premium p-4 md:p-8 border-white/10 bg-black/40 shadow-2xl overflow-hidden">
                <AutoDemo />
              </div>

              {/* Mock Browser Controls Overlay */}
              <div className="absolute top-12 left-16 hidden md:flex items-center gap-3 z-20">
                <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={10} /> flowsite.studio/preview-01
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section id="templates" className="py-60 relative bg-black/20">
          <div className="section-wrapper">
            <RevealOnScroll direction="left">
              <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-16">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Foundations</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">Choose Your <br />Architecture.</h2>
                </div>
                <div className="flex gap-4 p-3 glass-premium rounded-[2.5rem] border-white/5">
                  {[
                    { id: 'portfolio', title: 'Developer', icon: Code },
                    { id: 'college', title: 'Student', icon: Rocket },
                    { id: 'business', title: 'Business', icon: Building2 },
                    { id: 'app', title: 'Product', icon: AppWindow },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveWebsiteType(type.id as WebsiteType)}
                      className={`px-10 py-5 rounded-[1.8rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all ${
                        activeWebsiteType === type.id ? 'bg-primary text-white' : 'text-white/40 hover:bg-white/5'
                      }`}
                    >
                      {type.title}
                    </button>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-20">
              <ThreeDCard>
                <div onClick={(e) => { e.stopPropagation(); handleBlank(); }} className="glass-premium p-12 h-full flex flex-col items-center justify-center border-dashed border-white/20 hover:border-primary/50 cursor-pointer group gap-6 min-h-[500px]">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <Plus size={40} className="text-white/20 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white uppercase">Start Blank</h3>
                    <p className="text-white/40 font-medium">Total Creative Control</p>
                  </div>
                </div>
              </ThreeDCard>

              {templates.map((template, i) => (
                <RevealOnScroll key={i} delay={i * 0.1} direction="center">
                  <ThreeDCard className="h-full">
                    <div onClick={(e) => { e.stopPropagation(); handleSelectTemplate(template.data); }} className="glass-premium p-12 h-full flex flex-col justify-between border-white/5 hover:border-primary/50 cursor-pointer group min-h-[500px]">
                      <div className="space-y-10">
                        <div className="flex items-center justify-between">
                          <div className={`p-5 rounded-3xl bg-gradient-to-br ${template.color} shadow-lg`}>
                            <template.icon size={32} className="text-white" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Elite Base</span>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white leading-tight uppercase">{template.title}</h3>
                          <p className="text-lg text-white/40 font-medium leading-relaxed">{template.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-10">
                        <span className="text-sm font-black uppercase text-primary tracking-widest group-hover:translate-x-2 transition-transform">Select Base</span>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-transparent transition-all">
                          <ArrowRight size={20} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-60">
          <div className="section-wrapper text-center">
            <SectionHeading title="FREE FOREVER." subtitle="Zero Boundaries" />
            <div className="max-w-4xl mx-auto glass-premium p-20 border-primary/20 shadow-[0_50px_100px_#000000]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-16">
                {['Unlimited Projects', 'AI Core Synthesis', '3D Canvas Pro', 'Production Export', 'Zero Dependencies', 'Global Support'].map(f => (
                  <div key={f} className="flex items-center gap-6">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={16} className="text-primary" />
                    </div>
                    <span className="text-xl font-bold text-white/80">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleBlank} className="w-full py-8 bg-white text-black rounded-3xl font-black text-2xl uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl">
                Start Building Now
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-40 border-t border-white/5">
          <div className="section-wrapper">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <span className="font-black text-2xl tracking-tighter uppercase text-white">FLOWSITE</span>
                </div>
                <p className="text-white/40 font-medium leading-relaxed max-w-[200px]">Architecting the next dimension of web experiences.</p>
              </div>
              {['Product', 'Company', 'Legal'].map((col, i) => (
                <div key={col} className="space-y-10">
                  <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">{col}</h5>
                  <ul className="space-y-6">
                    {[['Features', 'Pricing', 'Docs'][i], ['About', 'Blog', 'Careers'][i], ['Privacy', 'Terms', 'Security'][i]].map(item => (
                      <li key={item}><a href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors tracking-widest uppercase">{item}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// --- Template Data ---
const allTemplates: any = {
  portfolio: [
    { title: 'Midnight Dev', subtitle: 'Ultra-modern grid architecture for developers.', icon: Code, color: 'from-blue-600 to-indigo-700', data: { websiteType: 'portfolio', settings: { theme: 'dark', accentColor: '#3B82F6' } } },
    { title: 'Studio Canvas', subtitle: 'The elite foundation for visual artists and designers.', icon: Palette, color: 'from-pink-600 to-rose-700', data: { websiteType: 'portfolio', settings: { theme: 'light', accentColor: '#EC4899' } } },
  ],
  college: [
    { title: 'Scholar Port', subtitle: 'Academic win through research-focused showcases.', icon: Rocket, color: 'from-emerald-600 to-teal-700', data: { websiteType: 'college', settings: { theme: 'dark', accentColor: '#10B981' } } },
  ],
  business: [
    { title: 'Nexus Agency', subtitle: 'High-conversion engine for modern service teams.', icon: Building2, color: 'from-amber-600 to-orange-700', data: { websiteType: 'business', settings: { theme: 'dark', accentColor: '#F59E0B' } } },
  ],
  app: [
    { title: 'SaaS Alpha', subtitle: 'Definitive foundation for software product launches.', icon: AppWindow, color: 'from-violet-600 to-purple-700', data: { websiteType: 'app', settings: { theme: 'dark', accentColor: '#7C3AED' } } },
  ],
};
