import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
// import { AdvancedBackground } from '../three/AdvancedBackground';
import { AutoDemo } from './AutoDemo';
import { CinematicLoader } from './CinematicLoader';
import {
  Plus, Sparkles, Check, ArrowRight, Play, Users,
  Code, Palette, Building2, AppWindow, Layers,
  Rocket, Wand2, Globe, Zap, Shield, Twitter, Github, Linkedin, MessageSquare, Loader2, ChevronRight, MousePointer2, ExternalLink, Layout, Type,
  Smartphone, Moon, FlaskConical, Calendar, Briefcase, ShoppingBag, TrendingUp, UtensilsCrossed, LayoutDashboard, CreditCard, BookOpen, X, Lightbulb,
  Scan, Eye
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
        {/* Subtle shadow instead of excessive glow */}
        <motion.div
          className="absolute -inset-2 bg-black/40 rounded-[2.5rem] blur-xl"
          animate={{ opacity: isHovered ? 0.8 : 0.4 }}
          transition={{ duration: 0.3 }}
        />

        {/* Subtle floating animation */}
        <motion.div
          animate={{ y: isHovered ? 0 : [-4, 4, -4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="relative glass-premium border-white/5 bg-[#0a0a0a] shadow-2xl overflow-hidden aspect-[4/3] flex flex-col rounded-3xl">
            {/* Mock Editor Navbar */}
            <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="px-4 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-medium text-white/70 flex items-center gap-2">
                <Code size={12} /> Export Code
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Mock Sidebar */}
              <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"><Layout size={14} /></div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30"><Type size={14} /></div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30"><Palette size={14} /></div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30"><Layers size={14} /></div>
              </div>

              {/* Mock Canvas Area */}
              <div className="flex-1 bg-black p-8 relative">
                <div className="absolute inset-0 wireframe-grid opacity-[0.02]" />
                <div className="space-y-6 relative z-10 max-w-sm mx-auto pt-4">
                  <div className="w-3/4 h-8 bg-white/10 rounded border border-white/5" />
                  <div className="w-full h-4 bg-white/5 rounded border border-white/5" />
                  <div className="w-5/6 h-4 bg-white/5 rounded border border-white/5" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-white/5 border border-white/10 rounded-lg" />
                    <div className="h-24 bg-white/5 border border-white/10 rounded-lg" />
                  </div>
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
  const [showMoreTemplates, setShowMoreTemplates] = useState(false);
  const [showSuggestTemplate, setShowSuggestTemplate] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
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
                    className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]"
                  >
                    Ship your digital identity <br />
                    <span className="text-white/60">in seconds.</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-xl text-white/50 max-w-lg font-medium leading-relaxed"
                  >
                    The developer-first AI builder. Generate, customize, and deploy production-grade portfolios instantly. Zero dependencies, pure code.
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="space-y-2 text-center">
                      <motion.button
                        onClick={handleBlank}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-white text-black rounded-lg font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2 group cursor-pointer shadow-lg shadow-white/10"
                      >
                        Start Building <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>

                    <motion.button
                      onClick={scrollToDemo}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/5 hover:border-white/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      View Live Demo
                    </motion.button>
                  </div>

                  {/* Trust Strip */}
                  <div className="flex items-center gap-4 text-xs font-medium text-white/40 pt-4">
                    <span className="flex items-center gap-1"><Check size={14} className="text-emerald-500" /> Free export</span>
                    <span className="flex items-center gap-1"><Check size={14} className="text-emerald-500" /> No vendor lock-in</span>
                    <span className="flex items-center gap-1"><Check size={14} className="text-emerald-500" /> Instant preview</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Side: Realistic Product UI Preview with Hover Tilt */}
              <PreviewCard />
            </div>
          </div>
        </section>

        {/* Product Workflow Section (SaaS Plan Part 2) */}
        <section id="workflow" className="py-40 relative border-t border-white/5 bg-black/20">
          <div className="section-wrapper">
            <RevealOnScroll direction="center">
              <div className="text-center space-y-6 mb-24 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <Layers size={12} className="text-white/70" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">How it works</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  From idea to production <br className="hidden md:block" />
                  <span className="text-white/40">in four seamless steps.</span>
                </h2>
                <p className="text-lg text-white/50">
                  Stop wrestling with complex frameworks. FlowSite streamlines the entire deployment pipeline so you can focus on your content.
                </p>
              </div>
            </RevealOnScroll>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {[
                  { 
                    step: '01', 
                    title: 'Input', 
                    desc: 'Upload a screenshot of your LinkedIn, resume, or just start typing. Our AI extracts your structure instantly.', 
                    icon: Scan 
                  },
                  { 
                    step: '02', 
                    title: 'Process', 
                    desc: 'Gemini 1.5 Flash generates your copy, selects optimal layouts, and sets up your design tokens automatically.', 
                    icon: Sparkles 
                  },
                  { 
                    step: '03', 
                    title: 'Customize', 
                    desc: 'Refine your design in our real-time visual editor. Tweak colors, layouts, and content with instant preview.', 
                    icon: Layout 
                  },
                  { 
                    step: '04', 
                    title: 'Deploy', 
                    desc: 'Export production-ready HTML/CSS or deploy directly to Vercel, GitHub Pages, or Netlify with zero lock-in.', 
                    icon: Rocket 
                  },
                ].map((workflow, i) => (
                  <RevealOnScroll key={workflow.step} delay={i * 0.15} direction="up">
                    <div className="relative flex flex-col items-center text-center space-y-6 group">
                      <div className="w-24 h-24 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-white/30 transition-colors shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <workflow.icon size={32} className="text-white/70 group-hover:text-white transition-colors relative z-10" />
                        <div className="absolute top-2 left-2 text-[10px] font-black text-white/20">{workflow.step}</div>
                      </div>
                      <div className="space-y-3 px-4">
                        <h3 className="text-xl font-bold text-white tracking-tight">{workflow.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                          {workflow.desc}
                        </p>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
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
              {/* Start Blank */}
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

              {/* Pre-built Templates (2 per category) */}
              {templates.slice(0, 2).map((template: any, i: number) => (
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

              {/* More Templates Card */}
              <ThreeDCard>
                <div onClick={() => setShowMoreTemplates(true)} className="glass-premium p-6 h-full flex flex-col items-center justify-center border-white/10 hover:border-primary/50 cursor-pointer group gap-4 min-h-[280px]">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <Layers size={32} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">More Templates</h3>
                    <p className="text-sm text-white/40 mt-1">Browse additional options</p>
                  </div>
                </div>
              </ThreeDCard>

              {/* Suggest Template Card */}
              <ThreeDCard>
                <div onClick={() => setShowSuggestTemplate(true)} className="glass-premium p-6 h-full flex flex-col items-center justify-center border-white/10 hover:border-yellow-500/50 cursor-pointer group gap-4 min-h-[280px]">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all">
                    <Lightbulb size={32} className="text-yellow-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">Suggest Template</h3>
                    <p className="text-sm text-white/40 mt-1">Request a custom template</p>
                  </div>
                </div>
              </ThreeDCard>
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

        {/* More Templates Modal */}
        <AnimatePresence>
          {showMoreTemplates && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
              onClick={() => setShowMoreTemplates(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-premium p-8 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white">More Templates</h3>
                    <p className="text-white/50 mt-1">Browse all available templates</p>
                  </div>
                  <button onClick={() => setShowMoreTemplates(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={24} className="text-white/50" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(moreTemplates[activeWebsiteType] || moreTemplates.portfolio).map((template: any, i: number) => (
                    <div key={i} className="glass-premium p-5 rounded-2xl border border-white/10 hover:border-primary/50 cursor-pointer group transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${template.color} shrink-0`}>
                          <template.icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{template.title}</h4>
                          <p className="text-sm text-white/40 mt-1">{template.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-center text-white/40 text-sm">More templates coming soon!</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggest Template Modal */}
        <AnimatePresence>
          {showSuggestTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
              onClick={() => setShowSuggestTemplate(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-premium p-8 rounded-3xl max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <Lightbulb size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Suggest Template</h3>
                      <p className="text-white/40 text-sm">Request a custom template</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSuggestTemplate(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={24} className="text-white/50" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Describe your ideal template</label>
                    <textarea
                      value={suggestionText}
                      onChange={(e) => setSuggestionText(e.target.value)}
                      placeholder="e.g., I need a template for a fitness gym website with bold colors and energetic vibe..."
                      className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (suggestionText.trim()) {
                        alert('Thank you for your suggestion! We\'ll review it.');
                        setSuggestionText('');
                        setShowSuggestTemplate(false);
                      }
                    }}
                    className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors"
                  >
                    Submit Suggestion
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

// More templates for each category
const moreTemplates: any = {
  portfolio: [
    { title: 'Creative Pro', subtitle: 'For designers & creatives', icon: Palette, color: 'from-pink-500 to-rose-600' },
    { title: 'Minimal Dev', subtitle: 'Clean developer portfolio', icon: Code, color: 'from-zinc-500 to-slate-600' },
    { title: 'Dark Mode Pro', subtitle: 'Full dark portfolio', icon: Moon, color: 'from-purple-600 to-indigo-700' },
    { title: 'Interactive', subtitle: 'Animation-heavy portfolio', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
  ],
  college: [
    { title: 'Research Lab', subtitle: 'Lab & research group', icon: FlaskConical, color: 'from-blue-500 to-cyan-600' },
    { title: 'Department', subtitle: 'Department website', icon: Building2, color: 'from-indigo-500 to-purple-600' },
    { title: 'Alumni Network', subtitle: 'Alumni portal design', icon: Users, color: 'from-teal-500 to-emerald-600' },
    { title: 'Event Hub', subtitle: 'Conference & events', icon: Calendar, color: 'from-red-500 to-rose-600' },
  ],
  business: [
    { title: 'Corporate', subtitle: 'Corporate business site', icon: Briefcase, color: 'from-slate-600 to-zinc-700' },
    { title: 'E-Commerce', subtitle: 'Online store template', icon: ShoppingBag, color: 'from-green-500 to-emerald-600' },
    { title: 'Consulting', subtitle: 'Consulting firm site', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
    { title: 'Restaurant', subtitle: 'Restaurant & cafe', icon: UtensilsCrossed, color: 'from-orange-500 to-amber-600' },
  ],
  app: [
    { title: 'Dashboard', subtitle: 'Admin dashboard template', icon: LayoutDashboard, color: 'from-sky-500 to-blue-600' },
    { title: 'SaaS Pricing', subtitle: 'Pricing page template', icon: CreditCard, color: 'from-violet-500 to-purple-600' },
    { title: 'Landing Page', subtitle: 'App landing page', icon: Rocket, color: 'from-pink-500 to-rose-600' },
    { title: 'Documentation', subtitle: 'Docs & help center', icon: BookOpen, color: 'from-teal-500 to-cyan-600' },
  ],
};
