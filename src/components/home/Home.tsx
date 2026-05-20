import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
import { AdvancedBackground } from '../three/AdvancedBackground';
import { AutoDemo } from './AutoDemo';
import { CinematicLoader } from './CinematicLoader';
import {
  Plus, Sparkles, Check, ArrowRight, Play, Users,
  Code, Palette, Building2, AppWindow, Layers,
  Rocket, Wand2, Globe, Zap, Shield, Twitter, Github, Linkedin, MessageSquare, Loader2, ChevronRight, MousePointer2, ExternalLink, Scan, Eye
} from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({ x: (y - centerY) / 15, y: (centerX - x) / 15 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setRotate({ x: 0, y: 0 });
        setIsHovered(false);
      }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`perspective-1000 preserve-3d relative group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px] z-10" />
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
  const yParallax1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const yParallax2 = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

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

          {/* Digital Void Background */}
          <div className="digital-void" />
          <div className="fixed inset-0 z-0">
            <AdvancedBackground />
          </div>

          {/* Interactive Background Grid */}
          <motion.div
            className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            animate={{
              x: (mousePos.x - window.innerWidth / 2) * 0.02,
              y: (mousePos.y - window.innerHeight / 2) * 0.02,
            }}
          />

          {/* Depth Blur Layers */}
          <div className="fixed inset-0 pointer-events-none z-[5]">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
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
                Design. Build. <br /><span className="gradient-text">Export.</span> <br />No Code. No Limits.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="subheading mx-auto text-white/60 text-lg md:text-xl"
              >
                Build production-ready websites visually and export clean HTML, CSS, and JS instantly. 
                The most intuitive workspace for modern creators.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-8 relative z-20"
            >
              <div className="flex flex-wrap justify-center gap-6">
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlank();
                  }} 
                  animate={{ 
                    boxShadow: ["0 20px 40px rgba(124, 58, 237, 0.4)", "0 20px 60px rgba(124, 58, 237, 0.6)", "0 20px 40px rgba(124, 58, 237, 0.4)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="px-12 py-6 bg-primary text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_#7C3AED40] hover:shadow-[0_20px_50px_#7C3AED60] hover:-translate-y-1 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  Start Building <span className="text-white/70 font-medium text-base ml-1 group-hover:text-white transition-colors">→ (No signup required)</span>
                </motion.button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToDemo();
                  }} 
                  className="px-12 py-6 glass-premium text-white rounded-2xl font-black text-xl border-white/10 hover:bg-white/5 transition-all flex items-center gap-3 cursor-pointer"
                >
                  See it in action <span className="text-white/50 font-medium text-base ml-1">(10s)</span> <Play size={20} fill="currentColor" />
                </button>
              </div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30"
              >
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-primary" /> Used by 500+ creators
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-primary" /> Export real HTML/CSS
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-primary" /> No vendor lock-in
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating UI Decorative Elements */}
          <div className="absolute top-[20%] left-[10%] hidden 2xl:block">
            <motion.div
              style={{
                y: yParallax1,
                rotate: -10
              }}
            >
              <ThreeDCard>
                <div className="glass-premium p-6 w-64 space-y-4 border-primary/20">
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
            </motion.div>
          </div>

          <div className="absolute bottom-[20%] right-[10%] hidden 2xl:block">
            <motion.div
              style={{
                y: yParallax2,
                rotate: 10
              }}
            >
              <ThreeDCard>
                <div className="glass-premium p-6 w-64 space-y-4 border-pink-500/20">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500"><Palette size={20} /></div>
                    <div className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-500 text-[8px] font-bold">ACTIVE</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                     {[1,2,3,4].map(i => <div key={i} className="aspect-square rounded-md bg-white/5" />)}
                  </div>
                </div>
              </ThreeDCard>
            </motion.div>
          </div>
        </section>

        {/* Features Showcase */}
        <section id="features" className="py-60 relative">
          <div className="section-wrapper">
            <RevealOnScroll direction="center">
              <div className="text-center space-y-6 mb-24">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <Zap size={12} className="text-primary" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Powerful Features</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
                  Everything you need to<br />build stunning websites
                </h2>
                <p className="text-lg text-white/40 max-w-2xl mx-auto">
                  From AI-powered content generation to instant export, FlowSite gives you all the tools to create professional websites without writing a single line of code.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Wand2, title: 'AI Scanner', desc: 'Upload any image and let AI extract content, colors, and layout suggestions automatically.', color: 'from-violet-500 to-purple-600', glow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]' },
                { icon: Code, title: 'Export Code', desc: 'Download clean, production-ready HTML, CSS, and JavaScript. No dependencies, no lock-in.', color: 'from-blue-500 to-cyan-600', glow: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]' },
                { icon: Eye, title: 'Live Preview', desc: 'See your changes instantly as you edit. Desktop, tablet, and mobile views in real-time.', color: 'from-emerald-500 to-teal-600', glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]' },
                { icon: Layers, title: '4 Website Types', desc: 'Portfolio, College Projects, Business, or App Landing - choose the perfect template for your needs.', color: 'from-amber-500 to-orange-600', glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]' },
                { icon: Palette, title: 'Theme Customizer', desc: 'Full control over colors, layouts, and styling. Dark mode, accent colors, and typography.', color: 'from-pink-500 to-rose-600', glow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.3)]' },
                { icon: Sparkles, title: 'Instant Templates', desc: 'Start with professionally designed templates. Customize in seconds, not hours.', color: 'from-indigo-500 to-blue-600', glow: 'group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]' },
                { icon: Scan, title: 'Content Editor', desc: 'Edit projects, skills, experience, services and more with an intuitive visual editor.', color: 'from-cyan-500 to-sky-600', glow: 'group-hover:shadow-[0_0_40px_rgba(14,165,233,0.3)]' },
                { icon: Rocket, title: 'No Signup Required', desc: 'Start building immediately. Your work is saved locally. Export when ready.', color: 'from-lime-500 to-green-600', glow: 'group-hover:shadow-[0_0_40px_rgba(132,204,22,0.3)]' },
              ].map((feature, i) => (
                <RevealOnScroll key={feature.title} delay={i * 0.1} direction="up">
                  <ThreeDCard>
                    <div className="glass-premium p-8 h-full border-white/5 hover:border-primary/30 cursor-pointer group transition-all">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                        <feature.icon size={28} className="text-white" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-white/40 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </ThreeDCard>
                </RevealOnScroll>
              ))}
            </div>

            {/* Quick Stats */}
            <RevealOnScroll delay={0.3} direction="up">
              <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '4', label: 'Website Types' },
                  { value: '∞', label: 'Projects' },
                  { value: '0', label: 'Cost' },
                  { value: '100%', label: 'Export Ready' },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center p-8 rounded-3xl bg-white/5 border border-white/5">
                    <div className="text-5xl font-black text-primary mb-2">{stat.value}</div>
                    <div className="text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
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

        {/* Live Demo Showcase Section */}
        <section ref={demoRef} id="demo" className="py-60 relative">
          <div className="section-wrapper space-y-32">
            <RevealOnScroll direction="center">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Experience Flow</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">DEMO</h2>
                <p className="subheading mx-auto text-white/40">From concept to creation, watch how FlowSite handles the heavy lifting while you focus on your vision.</p>
              </div>
            </RevealOnScroll>

            <div className="relative group">
              {/* Wow Factor Badge */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-4 z-30 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_10px_30px_rgba(244,63,94,0.4)] hidden md:block"
              >
                100% Interactive
              </motion.div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-premium p-4 md:p-8 border-white/10 bg-black/40 shadow-2xl overflow-hidden">
                <AutoDemo onTryYourself={handleBlank} />
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
    </motion.div>
  )}
</AnimatePresence>
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
