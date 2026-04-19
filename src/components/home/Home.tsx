import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder, PortfolioData, WebsiteType } from '../../context/BuilderContext';
import { BackgroundScene, MiniScene } from '../three/Background3D';
import {
  Plus, Code, Palette, Rocket, GraduationCap, Building2, AppWindow, Layers, Camera,
  Sparkles, ArrowRight, Wand2, Code2, Layers as LayersIcon, RefreshCw, Heart, Star, Zap,
  Play, Check
} from 'lucide-react';

// Website type definitions
const websiteTypes: { id: WebsiteType; title: string; subtitle: string; icon: any; color: string; accent: string; features: string[] }[] = [
  { id: 'portfolio', title: 'Personal Portfolio', subtitle: 'Showcase your work & skills', icon: Code, color: 'from-blue-500 to-indigo-600', accent: '#6366F1', features: ['Projects', 'Skills', 'Experience'] },
  { id: 'college', title: 'College Projects', subtitle: 'Academic work & achievements', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', accent: '#10B981', features: ['Projects', 'Education', 'Awards'] },
  { id: 'business', title: 'Business Website', subtitle: 'Landing pages & services', icon: Building2, color: 'from-amber-500 to-orange-600', accent: '#F97316', features: ['Services', 'Stats', 'Team'] },
  { id: 'app', title: 'App Landing Page', subtitle: 'Products & pricing', icon: AppWindow, color: 'from-violet-500 to-purple-600', accent: '#8B5CF6', features: ['Features', 'Pricing', 'FAQ'] },
];

// Templates
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

function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9999] hidden lg:block"
      animate={{ x: position.x - 16, y: position.y - 16 }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
}

function TemplateCard({ template, index, accentColor }: { template: any; index: number; accentColor: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = template.icon;

  return (
    <motion.div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex flex-col text-left bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-[400px] cursor-pointer group"
        whileHover={{ y: -8 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 opacity-80">
                  <MiniScene color={template.accent} />
                </div>
              </div>
              <motion.div
                className="absolute bottom-6 left-6 right-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex items-center gap-2 text-white font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <Play size={16} className="fill-white" />
                  Try this template
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`h-[220px] bg-gradient-to-br ${template.color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
          <Icon size={120} className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
            {template.title}
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between bg-card relative z-10">
          <div>
            <h3 className="font-bold text-xl text-foreground mb-2">{template.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{template.subtitle}</p>
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/10">
              {template.data.settings.layout}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-muted rounded-lg border border-border">
              {template.data.settings.theme}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WebsiteTypeCard({ type, isActive, onClick, index }: { type: typeof websiteTypes[0]; isActive: boolean; onClick: () => void; index: number }) {
  const Icon = type.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-6 rounded-3xl text-left transition-all ${
        isActive
          ? 'bg-card border-2 shadow-2xl shadow-primary/10'
          : 'bg-card/40 border border-border/50 hover:bg-card hover:border-primary/30'
      }`}
      style={{ borderColor: isActive ? type.accent : undefined }}
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="font-bold text-foreground mb-1">{type.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{type.subtitle}</p>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full"
          style={{ backgroundColor: type.accent }}
        />
      )}
    </motion.button>
  );
}

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { updateData, setWebsiteType, resetToBlank } = useBuilder();
  const [activeWebsiteType, setActiveWebsiteType] = useState<WebsiteType>('portfolio');

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
    <div className="min-h-screen w-full overflow-x-hidden relative bg-background selection:bg-primary/30">
      <CursorFollower />

      {/* 3D Background - Adjusted for less visual noise */}
      <div className="fixed inset-0 z-0 opacity-40">
        <BackgroundScene variant="default" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 w-full px-6 py-4 lg:px-12 backdrop-blur-md border-b border-border/50 bg-background/50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-foreground hidden sm:block">FlowSite</span>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 text-sm font-semibold rounded-full border border-border hover:bg-muted transition-colors"
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBlank}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-foreground text-background transition-shadow hover:shadow-lg"
              >
                Start Free
              </motion.button>
            </div>
          </div>
        </motion.nav>

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 space-y-24">
          {/* Hero Section */}
          <section className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20"
            >
              <Zap size={14} className="text-primary" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-primary">v2.0 is now live</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.1] md:leading-[1]">
              Build your <span className="gradient-text">digital world</span><br />
              in minutes.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The professional website builder for creators, students, and startups. 
              No code, just pure creativity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBlank}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
              >
                Create Website Now
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-muted text-foreground font-bold rounded-2xl transition-colors hover:bg-muted/80"
              >
                Watch Demo
              </motion.button>
            </div>
          </section>

          {/* Website Type Selector */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">What are you building?</h2>
              <p className="text-muted-foreground">Choose a path to get specialized templates</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Templates Grid */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold capitalize">{currentType?.title} Templates</h2>
                <p className="text-muted-foreground">Select a starter or begin with a blank canvas</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                <LayersIcon size={16} />
                {templates.length + 1} Options available
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Blank Template */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleBlank}
                className="group relative flex flex-col items-center justify-center h-[400px] rounded-3xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold">Start Blank</h3>
                  <p className="text-sm text-muted-foreground mt-1">Full creative control</p>
                </div>
              </motion.div>

              {/* Template Cards */}
              <AnimatePresence mode="popLayout">
                {templates.map((template, i) => (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSelectTemplate(template.data)}
                  >
                    <TemplateCard template={template} index={i} accentColor={template.accent} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-12 px-8 rounded-[40px] bg-gradient-to-br from-card to-background border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need<br />to <span className="text-primary">launch.</span></h2>
                <p className="text-lg text-muted-foreground">
                  FlowSite provides a professional suite of tools to take your idea from concept to a live website in record time.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  {[
                    { icon: Check, text: 'No setup required' },
                    { icon: Check, text: 'Clean HTML export' },
                    { icon: Check, text: 'Mobile responsive' },
                    { icon: Check, text: '3D Animations' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check size={12} className="text-emerald-500" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wand2, title: 'AI Content', desc: 'Auto-populate fields', color: 'bg-violet-500' },
                  { icon: Code2, title: 'Clean Code', desc: 'Ready to deploy', color: 'bg-blue-500' },
                  { icon: LayersIcon, title: 'Layouts', desc: 'Modern & Minimal', color: 'bg-emerald-500' },
                  { icon: RefreshCw, title: 'Live Sync', desc: 'Instant feedback', color: 'bg-orange-500' },
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-background rounded-3xl border border-border hover:shadow-xl transition-all">
                    <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                      <feature.icon size={24} />
                    </div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full py-12 px-6 lg:px-12 border-t border-border/50 text-center space-y-4">
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground/60">© 2026 FlowSite. Built for creators.</p>
        </footer>
      </div>
    </div>
  );
}
