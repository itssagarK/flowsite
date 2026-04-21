import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
import { AdvancedBackground, SimpleBackground, BackgroundScene } from '../three/Background3D';
import {
  Plus, Code, Palette, Rocket, GraduationCap, Building2, AppWindow, Layers, Camera,
  Sparkles, ArrowRight, Wand2, Code2, Layers as LayersIcon, RefreshCw, Heart, Star, Zap,
  Play, Check, Users, Globe, Shield, Zap as ZapIcon, ChevronRight, MessageSquare, Twitter, Github, Linkedin, Award, Layout, Briefcase, Mail, MapPin, Eye, MousePointer2, X
} from 'lucide-react';

// --- Components ---

function SectionHeading({ title, subtitle, centered = true }: { title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={`space-y-6 mb-20 ${centered ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{subtitle || 'Feature'}</span>
      </motion.div>
      <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] text-glow">{title}</h2>
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
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`perspective-1000 preserve-3d ${className}`}
    >
      {children}
    </motion.div>
  );
}

// --- Sections ---

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank, data } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const handleSelectType = (type: WebsiteType) => setActiveWebsiteType(type);
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

  // Website type definitions
  const websiteTypes: { id: WebsiteType; title: string; subtitle: string; icon: any; color: string; accent: string }[] = [
    { id: 'portfolio', title: 'Developer', subtitle: 'Showcase work', icon: Code, color: 'from-blue-500', accent: '#3B82F6' },
    { id: 'college', title: 'Student', subtitle: 'Academic win', icon: GraduationCap, color: 'from-emerald-500', accent: '#10B981' },
    { id: 'business', title: 'Business', subtitle: 'Scale fast', icon: Building2, color: 'from-orange-500', accent: '#F97316' },
    { id: 'app', title: 'Product', subtitle: 'App landing', icon: AppWindow, color: 'from-violet-500', accent: '#7C3AED' },
  ];

  const templates = allTemplates[activeWebsiteType];

  return (
    <div className="min-h-screen w-full bg-background selection:bg-primary/30 font-sans">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left" style={{ scaleX: scaleProgress }} />

      {/* Background Layer - Responsive */}
      <div className="fixed inset-0 z-0">
        {/* Desktop: Full advanced background */}
        <div className="hidden md:block">
          <AdvancedBackground />
        </div>
        {/* Tablet: Simplified but still feature-rich */}
        <div className="hidden sm:block md:hidden">
          <SimpleBackground />
        </div>
        {/* Mobile: Very simple background for performance */}
        <div className="block sm:hidden">
          <SimpleBackground />
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all border-b border-white/5 backdrop-blur-xl bg-background/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase hidden sm:block">FlowSite</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 glass px-8 py-3 rounded-full border-white/5">
              <a href="#templates" className="text-sm font-bold hover:text-primary transition-colors">Templates</a>
              <a href="#features" className="text-sm font-bold hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-bold hover:text-primary transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-6 py-2 text-sm font-bold hover:text-primary transition-colors hidden sm:block">Login</button>
              <button onClick={handleBlank} className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-black shadow-lg hover:scale-105 active:scale-95 transition-all">Start Building</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-56 pb-32 px-6 overflow-hidden min-h-screen flex flex-col items-center justify-center">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 glass-premium rounded-full border-white/10"
            >
              <Users size={18} className="text-primary" />
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Join 10K+ Digital Visionaries</span>
            </motion.div>

            <div className="space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="heading-huge text-glow"
              >
                BUILD YOUR <br />
                <span className="gradient-text">DIGITAL WORLD.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="subheading mx-auto text-white/90 font-medium"
              >
                The premium website builder for creators. Combine high-fidelity 3D interactive canvases, 
                AI intelligence, and production-ready export in seconds.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6"
            >
              <button onClick={handleBlank} className="btn-premium group relative w-full sm:w-auto px-12 py-6 bg-primary rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(124,58,237,0.4)] hover:shadow-[0_20px_60px_rgba(124,58,237,0.6)] hover:-translate-y-2 transition-all flex items-center justify-center gap-4 text-white">
                <span>Start Free</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-12 py-6 glass-premium rounded-2xl font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-white">
                <Play size={24} className="fill-white" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Scroll to Explore</span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* Template Showcase */}
        <section id="templates" className="py-44 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-12">
              <SectionHeading title="CHOOSE YOUR BASE." subtitle="Foundations" centered={false} />
              
              <div className="flex gap-3 p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
                {websiteTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type.id)}
                    className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                      activeWebsiteType === type.id ? 'bg-primary text-white shadow-[0_10px_20px_rgba(124,58,237,0.3)]' : 'hover:bg-white/5 text-white/50'
                    }`}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Start Blank Card */}
              <ThreeDCard className="h-full">
                <div 
                  onClick={handleBlank}
                  className="h-[500px] rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-primary/50 flex flex-col items-center justify-center gap-6 cursor-pointer group transition-all hover:bg-primary/5"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={40} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-black">Start Blank</h3>
                    <p className="text-muted-foreground text-sm">Full creative freedom</p>
                  </div>
                </div>
              </ThreeDCard>

              {/* Template Cards */}
              <AnimatePresence mode="popLayout">
                {templates.map((template, i) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleSelectTemplate(template.data)}
                    className="group relative h-[480px] rounded-[2rem] overflow-hidden cursor-pointer bg-[#0A0F1E] border border-white/5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-300"
                  >
                    {/* Header with Logo */}
                    <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                        {template.logo ? (
                           <img src={template.logo} className="w-5 h-5 object-contain" alt="Logo" />
                        ) : (
                           <Sparkles size={14} className="text-primary" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">{template.brand || 'Premium'}</span>
                      </div>
                      <div className="px-3 py-1.5 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Pro</span>
                      </div>
                    </div>

                    {/* Preview Image Container */}
                    <div className={`h-[260px] bg-gradient-to-br ${template.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                      {template.previewImg ? (
                        <img src={template.previewImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={template.title} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                           {React.createElement(template.icon, { size: 140, className: "text-white" })}
                        </div>
                      )}
                      
                      {/* Interaction Overlay */}
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="px-6 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Select Base
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-4">
                      <div>
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{template.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-2">{template.subtitle}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(j => (
                            <div key={j} className="w-6 h-6 rounded-full border border-[#0A0F1E] bg-muted flex items-center justify-center">
                              <Check size={10} className="text-primary" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Fully Responsive</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="UNMATCHED POWER." subtitle="Core Engine" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Wand2, title: 'AI Logic', desc: 'Auto-generate SEO-optimized sections instantly.', color: 'text-violet-400', bg: 'bg-violet-400/10' },
                { icon: Globe, title: 'Edge Export', desc: 'Deploy anywhere with clean, zero-dep code.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { icon: ZapIcon, title: 'Live Sync', desc: 'See changes in real-time with zero latency.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                { icon: Shield, title: 'Secure Store', desc: 'End-to-end encryption for your digital assets.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="glass-premium p-10 rounded-[2.5rem] space-y-6 group"
                >
                  <div className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform`}>
                    <f.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
                  <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight size={14} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto glass-premium rounded-[3rem] overflow-hidden border-white/5">
             <div className="grid md:grid-cols-2">
                <div className="p-12 md:p-16 space-y-8 bg-white/[0.02]">
                   <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Why FlowSite?</h2>
                   <p className="text-muted-foreground">We built the engine we always wanted. Fast, clean, and interactive.</p>
                   <div className="space-y-4 pt-6">
                      {[
                        'Vanilla HTML/CSS Output',
                        'Real-time 3D Preview',
                        'No subscription lock-in',
                        'Blazing fast performance'
                      ].map(item => (
                        <div key={item} className="flex items-center gap-3">
                           <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <Check size={12} className="text-emerald-500" />
                           </div>
                           <span className="text-sm font-bold">{item}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="p-12 md:p-16 border-l border-white/5 space-y-8">
                   <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">The Competition</h3>
                   <div className="space-y-4 opacity-50">
                      {[
                        'Proprietary messy code',
                        'Flat 2D static builders',
                        'High monthly fees',
                        'Slow bloated scripts'
                      ].map(item => (
                        <div key={item} className="flex items-center gap-3 grayscale">
                           <X size={16} className="text-red-500" />
                           <span className="text-sm">{item}</span>
                        </div>
                      ))}
                   </div>
                   <button className="mt-8 text-primary font-black uppercase tracking-widest text-xs flex items-center gap-2">
                      Join the movement <ArrowRight size={14} />
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-44 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/10 rounded-full blur-[160px] -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="FREE FOR EVERYONE." subtitle="Access" />
            
            <div className="max-w-4xl mx-auto">
              <motion.div 
                whileHover={{ y: -10 }}
                className="glass-premium p-16 md:p-24 rounded-[4rem] text-center border-primary/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/40 transition-colors" />
                
                <div className="space-y-12 relative z-10">
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">ZERO COST. <br /><span className="text-primary">FOREVER.</span></h3>
                    <p className="text-xl text-white/60 font-medium">We believe high-end design should be accessible to all visionaries.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left py-12 border-y border-white/10">
                    {[
                      'Unlimited Premium Templates',
                      'Full 3D Interactive Canvas',
                      'AI Intelligence Integration',
                      'Production-Ready Code Export',
                      'Zero Dependency Output',
                      'Community & Dev Support'
                    ].map(feature => (
                      <div key={feature} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                          <Check size={14} className="text-primary" />
                        </div>
                        <span className="text-lg font-bold text-white/90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <button onClick={handleBlank} className="btn-premium px-16 py-8 bg-white text-black rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-xl">
                      Start Building Now
                    </button>
                    <p className="text-sm text-white/40 mt-6 font-black uppercase tracking-[0.2em]">No Credit Card Required • Instant Access</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-44 px-6 text-center">
          <div className="max-w-5xl mx-auto glass-premium p-16 md:p-32 rounded-[4rem] relative overflow-hidden shadow-glow">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -mr-48 -mt-48" />
            <div className="relative z-10 space-y-12">
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter">READY TO <br /><span className="gradient-text">LAUNCH?</span></h2>
               <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join 10,000+ creators who have already built their dream site. 
                  Start building for free today.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button onClick={handleBlank} className="w-full sm:w-auto px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform active:scale-95 shadow-xl">
                    Create Website
                  </button>
                  <button className="w-full sm:w-auto px-12 py-6 glass rounded-full font-black text-xl hover:bg-white/5 transition-all">
                    Talk to Us
                  </button>
               </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#000000] py-20 px-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {/* ABOUT */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-accent-purple flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="font-black text-lg tracking-tighter uppercase text-white">FLOWSITE</span>
              </div>
              <p className="text-sm font-medium text-[#A0AEC0] max-w-[200px]">Build. Create. Launch.</p>
              <div className="flex gap-4 pt-4">
                {[Twitter, Github, Linkedin, MessageSquare].map((Icon, i) => (
                  <motion.a 
                    key={i} 
                    href="#" 
                    whileHover={{ y: -2, color: '#FFFFFF' }} 
                    className="text-[#64748B] transition-colors"
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* PRODUCT */}
            <div>
              <h5 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-8">Product</h5>
              <ul className="space-y-4">
                {['Features', 'Templates', 'Pricing', 'Export', 'Documentation'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-all relative group inline-block">
                      {link}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* COMPANY */}
            <div>
              <h5 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-8">Company</h5>
              <ul className="space-y-4">
                {['About', 'Blog', 'Careers', 'Press Kit', 'Status'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-all relative group inline-block">
                      {link}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* LEGAL */}
            <div>
              <h5 className="text-[12px] font-bold uppercase tracking-[1.5px] text-white mb-8">Legal</h5>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#A0AEC0] hover:text-white transition-all relative group inline-block">
                      {link}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <span className="text-[12px] text-[#64748B]">© 2026 FlowSite. Built for creators.</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[12px] text-[#64748B] font-medium">Instant Creation. Zero Dependencies.</span>
            </div>
            <div className="flex items-center gap-6">
               <a href="#" className="text-[12px] font-bold text-[#64748B] hover:text-white transition-colors">TW</a>
               <a href="#" className="text-[12px] font-bold text-[#64748B] hover:text-white transition-colors">GH</a>
               <a href="#" className="text-[12px] font-bold text-[#64748B] hover:text-white transition-colors">DC</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// --- Templates Configuration ---

const allTemplates: Record<WebsiteType, { id: string; title: string; subtitle: string; icon: any; color: string; accent: string; brand?: string; logo?: string; previewImg?: string; data: PortfolioData }[]> = {
  portfolio: [
    { id: 'dev', title: 'Midnight Dev', brand: 'NEO-TECH', subtitle: 'Ultra-modern developer portfolio with grid layouts.', icon: Code, color: 'from-blue-600 to-indigo-700', accent: '#3B82F6', data: { websiteType: 'portfolio', user: { name: 'Alex Chen', role: 'Full Stack Developer', bio: 'Building amazing web experiences.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#3B82F6' }, projects: [], skills: [], experience: [] } },
    { id: 'designer', title: 'Studio Canvas', brand: 'ART-FLOW', subtitle: 'Minimalist canvas for creative designers and artists.', icon: Palette, color: 'from-pink-600 to-rose-700', accent: '#EC4899', data: { websiteType: 'portfolio', user: { name: 'Sarah Miller', role: 'Product Designer', bio: 'Crafting beautiful interfaces.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#EC4899' }, projects: [], skills: [] } },
  ],
  college: [
    { id: 'cs', title: 'Scholar Port', brand: 'EDU-GRID', subtitle: 'Detailed academic and research-focused portfolio.', icon: Code, color: 'from-emerald-600 to-teal-700', accent: '#10B981', data: { websiteType: 'college', user: { name: 'Student Name', role: 'CS Student', bio: 'Building the future with code.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#10B981' }, collegeProjects: [], education: [] } },
    { id: 'eng', title: 'Lab Deck', brand: 'LAB-WARE', subtitle: 'Industrial design and engineering documentation.', icon: Layers, color: 'from-cyan-600 to-blue-700', accent: '#06B6D4', data: { websiteType: 'college', user: { name: 'Engineer', role: 'Engineering Student', bio: 'Innovation through engineering.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#06B6D4' }, collegeProjects: [] } },
  ],
  business: [
    { id: 'agency', title: 'Nexus Agency', brand: 'NEXUS', subtitle: 'High-conversion business and service landing page.', icon: Building2, color: 'from-amber-600 to-orange-700', accent: '#F59E0B', data: { websiteType: 'business', user: { name: 'Agency Name', role: '', bio: 'We deliver results.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#F59E0B' }, services: [], stats: [] } },
    { id: 'startup', title: 'Vision Launch', brand: 'VISION', subtitle: 'Disrupting industries with a bold startup presence.', icon: Rocket, color: 'from-violet-600 to-purple-700', accent: '#8B5CF6', data: { websiteType: 'business', user: { name: 'Startup', role: '', bio: 'Disrupting the industry.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#8B5CF6' }, services: [] } },
  ],
  app: [
    { id: 'saas', title: 'SaaS Alpha', brand: 'ALPHA', subtitle: 'The definitive foundation for your software product.', icon: AppWindow, color: 'from-violet-600 to-purple-700', accent: '#8B5CF6', data: { websiteType: 'app', user: { name: 'App Name', role: '', bio: 'Your solution.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#8B5CF6' }, appFeatures: [], pricing: [] } },
    { id: 'mobile', title: 'App Store Pro', brand: 'STORE', subtitle: 'Mobile-first showcase for iOS and Android apps.', icon: Camera, color: 'from-emerald-600 to-teal-700', accent: '#10B981', data: { websiteType: 'app', user: { name: 'Mobile App', role: '', bio: 'On-the-go solution.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#10B981' }, appFeatures: [] } },
  ],
};
