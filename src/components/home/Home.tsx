<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
import { BackgroundScene, MiniScene } from '../three/Background3D';
import {
  Plus, Code, Palette, Rocket, GraduationCap, Building2, AppWindow, Layers, Camera, Gamepad2,
  Sparkles, ArrowRight, Wand2, Code2, Layers as LayersIcon, RefreshCw, Heart, Star, Zap,
  ChevronRight, Check, Play, MousePointer2
} from 'lucide-react';

// Website type definitions with detailed info
const websiteTypes: { id: WebsiteType; title: string; subtitle: string; icon: any; color: string; accent: string; features: string[] }[] = [
  { id: 'portfolio', title: 'Personal Portfolio', subtitle: 'Showcase your work & skills', icon: Code, color: 'from-blue-500 to-indigo-600', accent: '#6366F1', features: ['Projects', 'Skills', 'Experience', 'About'] },
  { id: 'college', title: 'College Projects', subtitle: 'Academic work & achievements', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', accent: '#10B981', features: ['Projects', 'Education', 'Awards', 'Skills'] },
  { id: 'business', title: 'Business Website', subtitle: 'Landing pages & services', icon: Building2, color: 'from-amber-500 to-orange-600', accent: '#F97316', features: ['Services', 'Stats', 'Team', 'Testimonials'] },
  { id: 'app', title: 'App Landing Page', subtitle: 'Products & pricing', icon: AppWindow, color: 'from-violet-500 to-purple-600', accent: '#8B5CF6', features: ['Features', 'Pricing', 'FAQ', 'Download'] },
];

// All templates
const allTemplates: Record<WebsiteType, { id: string; title: string; subtitle: string; icon: any; color: string; accent: string; data: PortfolioData }[]> = {
  portfolio: [
    { id: 'dev', title: 'Software Engineer', subtitle: 'Clean & professional', icon: Code, color: 'from-blue-500 to-indigo-600', accent: '#6366F1', data: { websiteType: 'portfolio', user: { name: 'Alex Chen', role: 'Full Stack Developer', bio: 'Building amazing web experiences.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#6366F1' }, projects: [], skills: [], experience: [] } },
    { id: 'designer', title: 'UX/UI Designer', subtitle: 'Elegant & creative', icon: Palette, color: 'from-pink-500 to-rose-600', accent: '#EC4899', data: { websiteType: 'portfolio', user: { name: 'Sarah Miller', role: 'Product Designer', bio: 'Crafting beautiful interfaces.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#EC4899' }, projects: [], skills: [] } },
    { id: 'student', title: 'CS Student', subtitle: 'Perfect for students', icon: GraduationCap, color: 'from-cyan-500 to-blue-600', accent: '#06B6D4', data: { websiteType: 'portfolio', user: { name: 'Mike Johnson', role: 'CS Student', bio: 'Passionate about code.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#06B6D4' }, projects: [], skills: [] } },
  ],
  college: [
    { id: 'cs', title: 'CS Major', subtitle: 'For CS students', icon: Code, color: 'from-emerald-500 to-teal-600', accent: '#10B981', data: { websiteType: 'college', user: { name: 'Student Name', role: 'CS Student', bio: 'Building the future with code.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#10B981' }, collegeProjects: [], education: [] } },
    { id: 'eng', title: 'Engineering', subtitle: 'For engineers', icon: Layers, color: 'from-cyan-500 to-blue-600', accent: '#06B6D4', data: { websiteType: 'college', user: { name: 'Engineer', role: 'Engineering Student', bio: 'Innovation through engineering.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#06B6D4' }, collegeProjects: [] } },
  ],
  business: [
    { id: 'agency', title: 'Agency', subtitle: 'For agencies', icon: Building2, color: 'from-amber-500 to-orange-600', accent: '#F97316', data: { websiteType: 'business', user: { name: 'Agency Name', role: '', bio: 'We deliver results.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#F97316' }, services: [], stats: [] } },
    { id: 'startup', title: 'Startup', subtitle: 'For startups', icon: Rocket, color: 'from-violet-500 to-purple-600', accent: '#8B5CF6', data: { websiteType: 'business', user: { name: 'Startup', role: '', bio: 'Disrupting the industry.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#8B5CF6' }, services: [] } },
  ],
  app: [
    { id: 'saas', title: 'SaaS Product', subtitle: 'For software', icon: AppWindow, color: 'from-violet-500 to-purple-600', accent: '#8B5CF6', data: { websiteType: 'app', user: { name: 'App Name', role: '', bio: 'Your solution.' }, settings: { theme: 'dark', layout: 'modern', accentColor: '#8B5CF6' }, appFeatures: [], pricing: [] } },
    { id: 'mobile', title: 'Mobile App', subtitle: 'For mobile apps', icon: Camera, color: 'from-emerald-500 to-teal-600', accent: '#10B981', data: { websiteType: 'app', user: { name: 'Mobile App', role: '', bio: 'On-the-go solution.' }, settings: { theme: 'light', layout: 'modern', accentColor: '#10B981' }, appFeatures: [] } },
  ],
};

// Mouse cursor follower
function CursorFollower() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const X = useSpring(mouseX, springConfig);
  const Y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 20);
      mouseY.set(e.clientY - 20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{ x: X, y: Y, background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' }}
    />
  );
}

// Interactive card with tilt effect
function InteractiveCard({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        scale: isHovered ? 1.02 : 1,
        rotateX: isHovered ? 2 : 0,
        rotateY: isHovered ? -2 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Website type card with glow effect
function WebsiteTypeCard({ type, isActive, onClick, index }: { type: typeof websiteTypes[0]; isActive: boolean; onClick: () => void; index: number }) {
  const Icon = type.icon;

  return (
    <InteractiveCard onClick={onClick} className="relative">
      <motion.div
        className={`relative p-5 rounded-2xl text-left transition-all overflow-hidden ${
          isActive
            ? 'bg-card border-2 shadow-2xl'
            : 'bg-card/60 border border-border/50 hover:border-primary/30'
        }`}
        style={{ borderColor: isActive ? type.accent : undefined }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {/* Glow effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(circle at 50% 0%, ${type.accent}40 0%, transparent 70%)` }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative z-10">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Icon size={24} className="text-white" />
          </motion.div>

          <h3 className="font-bold text-base text-foreground mb-1">{type.title}</h3>
          <p className="text-sm text-muted-foreground">{type.subtitle}</p>

          {/* Features inside */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {type.features.map((feature, i) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="text-[10px] px-2 py-0.5 bg-muted/60 rounded-full text-muted-foreground"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full"
            style={{ backgroundColor: type.accent }}
          />
        )}
      </motion.div>
    </InteractiveCard>
  );
}

// Template card with preview
function TemplateCard({ template, index, accentColor }: { template: any; index: number; accentColor: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = template.icon;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex flex-col text-left bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 aspect-[4/5] cursor-pointer group"
        whileHover={{ y: -8 }}
        onClick={() => {}}
      >
        {/* Preview overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-black/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 opacity-80">
                  <MiniScene color={template.accent} />
                </div>
              </div>
              <motion.div
                className="absolute bottom-6 left-6 right-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 text-white font-medium">
                  <Play size={16} className="fill-white" />
                  Click to use
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className={`h-1/2 bg-gradient-to-br ${template.color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          <Icon size={110} className="absolute -bottom-4 -right-4 text-white/15 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white">
            {template.title}
          </div>
        </div>

        {/* Content */}
        <div className="h-1/2 p-5 flex flex-col justify-between bg-white dark:bg-[#111827] relative z-10">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-1">{template.title}</h3>
            <p className="text-sm text-muted-foreground">{template.subtitle}</p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-semibold uppercase px-2 py-1 bg-primary/10 text-primary rounded-md">
              {template.data.settings.layout}
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-1 bg-muted rounded-md">
              {template.data.settings.theme}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleSelectType = (type: WebsiteType) => {
    setActiveWebsiteType(type);
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

  const templates = allTemplates[activeWebsiteType];
  const currentType = websiteTypes.find(t => t.id === activeWebsiteType);

  return (
    <div className="min-h-screen w-full overflow-hidden relative cursor-none">
      <CursorFollower />

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <BackgroundScene variant="default" />
      </div>

      <div className="relative z-10 min-h-screen overflow-y-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-6 py-4 lg:px-12 lg:py-6"
        >
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg">
                <Sparkles size={20} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">FlowSite</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center font-bold text-sm text-white shadow-lg"
            >
              SG
            </motion.button>
          </motion.div>
        </motion.header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="px-6 pt-8 lg:px-12 lg:pt-16 pb-10 text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-glass backdrop-blur-xl rounded-full border border-border/50 mb-8"
          >
            <Zap size={14} className="text-amber-400" />
            <span className="text-sm font-medium text-foreground">Build any website in seconds</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Create <span className="gradient-text">stunning</span> websites
            <br />without coding
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Choose your website type, pick a template, customize - and export ready-to-use code.
          </p>
        </motion.section>

        {/* Website Type Selector */}
        <section className="px-6 lg:px-12 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {websiteTypes.map((type, index) => (
              <WebsiteTypeCard
                key={type.id}
                type={type}
                isActive={activeWebsiteType === type.id}
                onClick={() => handleSelectType(type.id)}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Templates */}
        <section className="px-6 lg:px-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{currentType?.title} Templates</h2>
              <p className="text-muted-foreground mt-1">{templates.length} templates available</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBlank}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-violet-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/25"
            >
              <Plus size={16} />
              Start Blank
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Blank card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center bg-card/60 border-2 border-dashed border-border/50 rounded-2xl p-8 aspect-[4/5] cursor-pointer hover:border-primary/50 transition-all group"
              onClick={handleBlank}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 border border-border group-hover:border-primary transition-colors"
                whileHover={{ rotate: 90 }}
              >
                <Plus size={28} className="text-primary" />
              </motion.div>
              <h3 className="font-bold text-lg text-foreground">Start from Scratch</h3>
              <p className="text-sm text-muted-foreground mt-1">Full creative freedom</p>
            </motion.div>

            {/* Template cards */}
            {templates.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={i}
                accentColor={template.accent}
              />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 lg:px-12 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Wand2, title: 'AI Scanner', desc: 'Upload & auto-generate', color: 'from-violet-500' },
              { icon: Code2, title: 'Export Code', desc: 'Download HTML/CSS/JS', color: 'from-blue-500' },
              { icon: LayersIcon, title: 'Rich Sections', desc: 'Projects, pricing & more', color: 'from-emerald-500' },
              { icon: RefreshCw, title: 'Real-time Edit', desc: 'See changes instantly', color: 'from-orange-500' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-5 bg-card border border-border rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} to-transparent flex items-center justify-center mb-3`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 lg:px-12 py-8 border-t border-border/50 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart size={14} className="text-pink-500" fill="currentColor" />
            <span className="text-sm">Made for creators</span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
=======
import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, PortfolioData, ProjectItem, defaultProjects } from '../../context/BuilderContext';
import { Plus, Code, Palette, Laptop, Trophy, Users, BookOpen, Camera, LayoutGrid, Blocks, Cpu, ShoppingCart, Shield } from 'lucide-react';

const templates: { id: string; title: string; icon: any; color: string; data: PortfolioData }[] = [
  {
    id: 'dev-modern',
    title: 'Software Engineer',
    icon: Code,
    color: 'from-blue-500 to-indigo-500',
    data: {
      user: { 
        name: 'Alex Chen', 
        role: 'Full Stack Engineer', 
        bio: 'Building scalable systems and creating intuitive web experiences.' 
      },
      settings: { theme: 'dark', layout: 'modern', accentColor: '#007AFF' },
      projects: [
        { id: 101, title: 'AWS Server Migration', desc: 'Migrated legacy monolith to AWS Lambda microservices, reducing costs by 40%.', color: 'bg-blue-50 dark:bg-blue-900/20', tags: ['Backend', 'AWS', 'Node.js'] },
        { id: 102, title: 'Fintech Dashboard', desc: 'Real-time financial analytics dashboard handling thousands of websocket events.', color: 'bg-indigo-50 dark:bg-indigo-900/20', tags: ['React', 'Websockets'] },
        { id: 103, title: 'Open Source CLI', desc: 'A developer tool for scaffolding React projects, boasting 5k+ weekly downloads.', color: 'bg-slate-50 dark:bg-slate-900/20', tags: ['CLI', 'TypeScript'] }
      ]
    }
  },
  {
    id: 'designer',
    title: 'UX/UI Designer',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    data: {
      user: { 
        name: 'Sarah Miller', 
        role: 'Product Designer', 
        bio: 'Crafting human-centric interfaces with a focus on motion design and accessibility.' 
      },
      settings: { theme: 'light', layout: 'minimal', accentColor: '#FF2D55' },
      projects: [
        { id: 201, title: 'Lumina Brand Guidelines', desc: 'Comprehensive brand identity and UI kit for a clean energy startup.', color: 'bg-rose-50', tags: ['Branding', 'Figma'] },
        { id: 202, title: 'Healthcare App Redesign', desc: 'A total UX overhaul increasing user retention by 25% among elderly users.', color: 'bg-pink-50', tags: ['UX Research', 'Mobile'] },
        { id: 203, title: 'Typography System', desc: 'A custom web font and layout system designed for editorial focus.', color: 'bg-stone-50', tags: ['Typography', 'Web'] }
      ]
    }
  },
  {
    id: 'minimalist',
    title: 'Minimalist Creator',
    icon: Laptop,
    color: 'from-emerald-500 to-teal-500',
    data: {
      user: { 
        name: 'Jordan Lee', 
        role: 'Digital Creator', 
        bio: 'Documenting my journey through code and design. Exploring minimalism in tech.' 
      },
      settings: { theme: 'dark', layout: 'brutalist', accentColor: '#34C759' },
      projects: [
        { id: 301, title: 'Void Engine', desc: 'A lightweight 2D rendering engine built in pure C++ and OpenGL.', color: 'bg-zinc-900', tags: ['C++', 'Graphics'] },
        { id: 302, title: 'Vim Configurations', desc: 'My stark, distraction-free Neovim setup optimized for speed.', color: 'bg-zinc-800', tags: ['Tools', 'Lua'] },
        { id: 303, title: 'Personal Manifesto', desc: 'A brutalist web essay on the state of modern software bloat.', color: 'bg-black', tags: ['Writing', 'HTML/CSS'] }
      ]
    }
  },
  {
    id: 'hackathon',
    title: 'Hackathon Project',
    icon: Trophy,
    color: 'from-amber-400 to-orange-500',
    data: {
      user: { 
        name: 'EcoSync Team', 
        role: 'Winner @ GlobalHack', 
        bio: 'An AI-powered IoT solution built in 48 hours to optimize campus energy consumption.' 
      },
      settings: { theme: 'dark', layout: 'modern', accentColor: '#FF9500' },
      projects: [
        { id: 401, title: 'The 48h Build', desc: 'How we wired together Raspberry Pis, React, and Gemini AI in one weekend.', color: 'bg-orange-900/20', tags: ['Story', 'IoT'] },
        { id: 402, title: 'Architecture Diagram', desc: 'Technical breakdown of our scalable serverless event architecture.', color: 'bg-amber-900/20', tags: ['Docs', 'Cloud'] },
        { id: 403, title: 'Live Demo Video', desc: 'Pitch presentation for the judges that secured us 1st place.', color: 'bg-yellow-900/20', tags: ['Media', 'Pitch'] }
      ]
    }
  },
  {
    id: 'club',
    title: 'College Club',
    icon: Users,
    color: 'from-violet-500 to-fuchsia-500',
    data: {
      user: { 
        name: 'Robotics Society', 
        role: 'University Tech Org', 
        bio: 'Building autonomous rovers and fostering a community of hardware enthusiasts since 2021.' 
      },
      settings: { theme: 'light', layout: 'modern', accentColor: '#AF52DE' },
      projects: [
        { id: 501, title: 'Mars Rover Prototype', desc: 'Our entry for the University Rover Challenge featuring a 6-DOF robotic arm.', color: 'bg-violet-50', tags: ['Hardware', 'C++'] },
        { id: 502, title: 'Line Follower Bots', desc: 'Introductory project for freshman members learning basic circuitry.', color: 'bg-fuchsia-50', tags: ['Education', 'Arduino'] },
        { id: 503, title: 'Annual Tech Fest', desc: 'Hosting over 500 students for collaborative building and competitions.', color: 'bg-purple-50', tags: ['Events'] }
      ]
    }
  },
  {
    id: 'academic',
    title: 'Academic / Research',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-600',
    data: {
      user: { 
        name: 'Elena Rostova', 
        role: 'ML Researcher', 
        bio: 'Publishing research on neuro-symbolic AI and exploring real-world impact applications.' 
      },
      settings: { theme: 'light', layout: 'minimal', accentColor: '#007AFF' },
      projects: [
        { id: 601, title: 'NeurIPS 2024 Paper', desc: 'Published research on efficient attention mechanisms in transformer models.', color: 'bg-cyan-50', tags: ['Publication', 'AI'] },
        { id: 602, title: 'PyTorch Implementations', desc: 'Open source repository containing reproducible model setups.', color: 'bg-sky-50', tags: ['Code', 'Python'] },
        { id: 603, title: 'Grant Proposal Data', desc: 'Visualizations and metrics used for our recent grant acquisition.', color: 'bg-blue-50', tags: ['Data Viz'] }
      ]
    }
  },
  {
    id: 'photography',
    title: 'Photography / Arts',
    icon: Camera,
    color: 'from-stone-500 to-neutral-800',
    data: {
      user: { 
        name: 'Marcus Lens', 
        role: 'Event Photographer', 
        bio: 'Capturing candid moments on campus. Available for graduation shoots and local events.' 
      },
      settings: { theme: 'dark', layout: 'minimal', accentColor: '#FF9500' },
      projects: [
        { id: 701, title: 'Class of 2025', desc: 'Senior portraits exploring lighting and campus environments.', color: 'bg-stone-900/40', tags: ['Portrait', 'Gallery'] },
        { id: 702, title: 'Midnight Concerts', desc: 'Low-light photography series covering local indie bands.', color: 'bg-neutral-900/60', tags: ['Live', 'Music'] },
        { id: 703, title: 'Film Archives', desc: 'Scans from my 35mm experiments and darkroom prints.', color: 'bg-zinc-900/50', tags: ['Analog', 'Film'] }
      ]
    }
  }
];

const prebuiltProjects: { id: string; project: Omit<ProjectItem, 'id'>, icon: any }[] = [
  {
    id: 'proj-saas',
    icon: LayoutGrid,
    project: {
      title: 'B2B SaaS Dashboard',
      desc: 'A full-featured analytics dashboard featuring real-time charts, user management, and dark mode toggles.',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      tags: ['React', 'Full Stack', 'Dashboard']
    }
  },
  {
    id: 'proj-ecommerce',
    icon: ShoppingCart,
    project: {
      title: 'E-Commerce Storefront',
      desc: 'High-conversion shopping experience with Next.js, Stripe checkout, and headless CMS integration.',
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      tags: ['Next.js', 'E-Commerce']
    }
  },
  {
    id: 'proj-ai',
    icon: Cpu,
    project: {
      title: 'AI Image Generator',
      desc: 'Prompt-based image generation tool wired into the DALL-E API with a custom Pinterest-style masonry grid.',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      tags: ['AI', 'API', 'Frontend']
    }
  },
  {
    id: 'proj-social',
    icon: Shield,
    project: {
      title: 'Blockchain Auth Service',
      desc: 'A secure Web3 authentication flow using MetaMask and Ethereum smart contracts.',
      color: 'bg-orange-50 dark:bg-orange-900/20',
      tags: ['Web3', 'Security']
    }
  }
];

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { data, updateData } = useBuilder();

  const handleSelectTemplate = (templateData?: PortfolioData) => {
    if (templateData) {
      updateData(templateData);
    }
    onNavigate();
  };

  const handleAddPrebuiltProject = (project: Omit<ProjectItem, 'id'>) => {
    // Merge the new project with the current portfolio data
    const currentProjects = data.projects || defaultProjects;
    const newProject: ProjectItem = { ...project, id: Date.now() }; // ensuring unique ID
    
    // Add it to the front of the list
    updateData({ projects: [newProject, ...currentProjects] });
    onNavigate();
  };

  return (
    <div className="min-h-screen bg-transparent w-full p-6 md:p-12 overflow-y-auto z-10 relative">
      <div className="max-w-6xl mx-auto space-y-16 pb-20">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-[20px] tracking-tight text-foreground">
            <div className="w-6 h-6 rounded-md bg-primary shadow-sm" />
            FlowSite
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-glass border border-border flex items-center justify-center font-bold text-sm text-foreground shadow-sm backdrop-blur-md">
              SG
            </div>
          </div>
        </header>

        {/* Templates Section */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Start creating</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose a pre-built template to jumpstart your portfolio, or start with a blank canvas to build from scratch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blank Canvas */}
            <motion.button 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              onClick={() => handleSelectTemplate()}
              className="group flex flex-col items-center justify-center bg-glass backdrop-blur-[30px] border border-border rounded-2xl p-8 aspect-[4/3] sm:aspect-square hover:bg-white/50 dark:hover:bg-black/50 transition-all text-center h-full shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center mb-6 border border-border shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Plus size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Blank Canvas</h3>
              <p className="text-sm text-muted-foreground mt-2">Start fresh with default settings</p>
            </motion.button>

            {/* Templates */}
            {templates.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <motion.button
                  key={tpl.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 * (i + 2) }}
                  onClick={() => handleSelectTemplate(tpl.data)}
                  className="group relative flex flex-col text-left bg-glass backdrop-blur-[30px] border border-border rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 h-full shadow-sm"
                >
                  <div className={`h-36 sm:h-40 xl:h-44 bg-gradient-to-br ${tpl.color} relative overflow-hidden w-full flex-shrink-0`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <Icon size={80} className="absolute -bottom-4 -right-4 text-white/20 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col bg-white/50 dark:bg-[#1C1C1E]/50">
                    <h3 className="font-bold text-lg text-foreground">{tpl.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{tpl.data.user.bio}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Pre-built Projects Section */}
        <div className="pt-8 border-t border-border/50">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Pre-built Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Need inspiration? Add a diverse, pre-configured project directly to your portfolio. It's fully editable once inside the builder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prebuiltProjects.map((pProj, i) => {
              const Icon = pProj.icon;
              return (
                <motion.button
                  key={pProj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => handleAddPrebuiltProject(pProj.project)}
                  className={`group relative flex flex-col text-left ${pProj.project.color} border border-border/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 shadow-sm p-6`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-black/40 flex items-center justify-center mb-6 border border-border/30 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{pProj.project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                    {pProj.project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {pProj.project.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold tracking-wide uppercase px-2 py-1 bg-white/50 dark:bg-black/40 rounded-md text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
>>>>>>> 20493c00627f2efebfae0ea823fca073172b044f
