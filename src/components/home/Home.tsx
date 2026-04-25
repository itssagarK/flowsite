import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
// import { AdvancedBackground } from '../three/AdvancedBackground';
import { AutoDemo } from './AutoDemo';
import { CinematicLoader } from './CinematicLoader';
import {
  Plus, Sparkles, Check, ArrowRight, Play, Users,
  Code, Palette, Building2, AppWindow, Layers,
  Rocket, Wand2, Globe, Zap, Shield, Twitter, Github, Linkedin, MessageSquare, Loader2, ChevronRight, MousePointer2, ExternalLink, Layout, Type
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

function PreviewCard() {
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
    setRotate({ x: (y - centerY) / 20, y: (centerX - x) / 20 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: 'blur(20px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative perspective-1000 hidden lg:block"
    >
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
        className="preserve-3d relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-6 bg-primary/20 rounded-[2.5rem] blur-3xl"
          animate={{ opacity: isHovered ? 0.5 : 0.15 }}
          transition={{ duration: 0.3 }}
        />

        {/* Subtle floating animation */}
        <motion.div
          animate={{ y: isHovered ? 0 : [-4, 4, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="relative glass-premium border-white/10 bg-black/60 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
            {/* Mock Editor Navbar */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="px-6 py-1.5 bg-primary/20 border border-primary/30 rounded-lg text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <Code size={12} /> Export Code
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Mock Sidebar */}
              <div className="w-20 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-white/5">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><Layout size={18} /></div>
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20"><Type size={18} /></div>
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20"><Palette size={18} /></div>
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/20"><Layers size={18} /></div>
              </div>

              {/* Mock Canvas Area */}
              <div className="flex-1 bg-[#030303] p-10 relative">
                <div className="absolute inset-0 wireframe-grid opacity-[0.02]" />
                <div className="space-y-6 relative z-10">
                  <div className="w-2/3 h-12 bg-white/5 rounded-2xl border border-white/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-primary/5 border border-primary/20 rounded-2xl" />
                    <div className="h-32 bg-white/5 border border-white/10 rounded-2xl" />
                  </div>
                  <div className="w-full h-40 bg-white/5 rounded-2xl border border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');
  const [isLoading, setIsLoading] = useState(true);
  const demoRef = useRef<HTMLDivElement>(null);

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

          {/* Main Background */}
          <div className="digital-void" />

          {/* Ambient Glow Layer */}
          <div className="ambient-glow" />

          {/* Subtle Top Gradient */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-30" />

          {/* Interactive Background Grid */}
          <div
            className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Hand Interaction Glow */}
          <motion.div
            className="touch-glow"
            style={{ x: mouseX, y: mouseY }}
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ opacity: { repeat: Infinity, duration: 4 } }}
          />

          <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FlowSite</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {[
                { name: 'Templates', href: '#templates' },
                { name: 'Demo', href: '#demo' },
                { name: 'Pricing', href: '#pricing' },
              ].map(item => (
                <a key={item.name} href={item.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">{item.name}</a>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBlank();
              }}
              className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:scale-105 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
          {/* Subtle Grid Background with Mouse Parallax */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              opacity: 0.02,
              x: gridSpringX,
              y: gridSpringY,
            }}
          />

          {/* Hero Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="section-wrapper relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side: Content */}
              <div className="space-y-10 text-left">
                <div className="space-y-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
                  >
                    Build Websites Visually. <br />
                    <span className="gradient-text">Export Real Code.</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-xl text-white/50 max-w-lg font-medium leading-relaxed"
                  >
                    Design modern websites visually and export production-ready HTML, CSS, and JS instantly.
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="space-y-2 text-center">
                      <motion.button
                        onClick={handleBlank}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_40px_rgba(124,58,237,0.5),0_0_30px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
                      >
                        Start Building <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-white/20">No signup required</p>
                    </div>

                    <motion.button
                      onClick={scrollToDemo}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      See Live Demo <span className="text-white/40 text-sm font-medium ml-1">(10s)</span>
                    </motion.button>
                  </div>

                  {/* Trust Strip */}
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pt-4">
                    <span>Export real code</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>No vendor lock-in</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>Instant preview</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Side: Realistic Product UI Preview with Hover Tilt */}
              <PreviewCard />
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section id="templates" className="py-40 relative bg-black/20">
          <div className="section-wrapper">
            <RevealOnScroll direction="left">
              <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Templates</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Choose Your Template</h2>
                  <p className="text-lg text-white/50 max-w-xl">Start with a professionally designed template and customize it to fit your needs.</p>
                </div>
                <div className="flex gap-2 p-1.5 glass-premium rounded-2xl border-white/5 bg-black/40">
                  {[
                    { id: 'portfolio', title: 'Developer', icon: Code },
                    { id: 'college', title: 'Student', icon: Rocket },
                    { id: 'business', title: 'Business', icon: Building2 },
                    { id: 'app', title: 'Product', icon: AppWindow },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveWebsiteType(type.id as WebsiteType)}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                        activeWebsiteType === type.id
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <type.icon size={16} />
                      {type.title}
                    </button>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20">
              <ThreeDCard>
                <div onClick={(e) => { e.stopPropagation(); handleBlank(); }} className="glass-premium p-8 h-full flex flex-col items-center justify-center border-dashed border-white/20 hover:border-primary/50 cursor-pointer group gap-4 min-h-[280px]">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-primary/30 transition-all">
                    <Plus size={32} className="text-white/30 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">Start Blank</h3>
                    <p className="text-sm text-white/40 mt-1">Empty canvas for full control</p>
                  </div>
                </div>
              </ThreeDCard>

              {templates.map((template: any, i: number) => (
                <RevealOnScroll key={i} delay={i * 0.1} direction="center">
                  <ThreeDCard className="h-full">
                    <div onClick={(e) => { e.stopPropagation(); handleSelectTemplate(template.data); }} className="glass-premium p-6 h-full flex flex-col justify-between border-white/5 hover:border-primary/50 cursor-pointer group min-h-[280px]">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${template.color} shadow-lg`}>
                            <template.icon size={24} className="text-white" />
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Template</span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-white">{template.title}</h3>
                          <p className="text-sm text-white/50 leading-relaxed">{template.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-sm font-semibold text-primary">Use Template</span>
                        <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-transparent transition-all">
                          <ArrowRight size={16} className="text-white" />
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
        <section ref={demoRef} id="demo" className="py-40 relative">
          <div className="section-wrapper space-y-16">
            <RevealOnScroll direction="center">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Live Demo</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">See It In Action</h2>
                <p className="text-lg text-white/50">Watch how FlowSite transforms your ideas into production-ready websites in seconds.</p>
              </div>
            </RevealOnScroll>

            <div className="relative group">
              {/* Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-4 z-30 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg hidden md:block"
              >
                Fully Interactive
              </motion.div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/10 to-pink-500/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative glass-premium p-2 md:p-3 border-white/10 bg-black/60 rounded-2xl shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-t-xl border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4 px-4 py-1.5 bg-black/30 rounded-lg text-xs text-white/40 text-center">
                    flowsite.studio/preview
                  </div>
                </div>
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
        <section id="pricing" className="py-40">
          <div className="section-wrapper">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 rounded-full">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">Free Forever</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">No Hidden Costs</h2>
              <p className="text-lg text-white/50 max-w-xl mx-auto">Everything you need to build professional websites, completely free. No credit card required.</p>
            </div>

            <div className="max-w-3xl mx-auto glass-premium p-10 border-primary/20 rounded-3xl">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                {[
                  { title: 'Unlimited Projects', desc: 'Create as many as you want' },
                  { title: 'Export Code', desc: 'Yours forever, no lock-in' },
                  { title: 'AI Assistance', desc: 'Smart suggestions' },
                  { title: '3D Canvas', desc: 'Visual editing made easy' },
                  { title: 'Production Ready', desc: 'Optimized output' },
                  { title: 'Instant Preview', desc: 'Real-time changes' },
                ].map((item) => (
                  <div key={item.title} className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-primary/20 flex items-center justify-center">
                      <Check size={18} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleBlank} className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.01] transition-all shadow-lg">
                Start Building Free
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5">
          <div className="section-wrapper">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <span className="font-black text-xl tracking-tight text-white">FLOWSITE</span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">Build beautiful websites visually. Export clean, production-ready code.</p>
                <p className="text-xs text-white/20">© 2026 FlowSite. All rights reserved.</p>
              </div>
              {[
                { title: 'Product', items: ['Features', 'Templates', 'Pricing', 'Demo'] },
                { title: 'Resources', items: ['Documentation', 'Blog', 'Community', 'Support'] },
                { title: 'Company', items: ['About', 'Careers', 'Contact', 'Press'] },
              ].map((col) => (
                <div key={col.title} className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white/60">{col.title}</h5>
                  <ul className="space-y-3">
                    {col.items.map(item => (
                      <li key={item}><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a></li>
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
