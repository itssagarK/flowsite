import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, Layout, Sidebar as SidebarIcon, Square, Circle, Wand2, Code, Eye, Download, Layers, Palette, Zap, Rocket, Scan } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

const features = [
  { icon: Wand2, name: 'AI Scanner', desc: 'Auto-generate from image' },
  { icon: Code, name: 'Export Code', desc: 'Clean HTML/CSS/JS' },
  { icon: Eye, name: 'Live Preview', desc: 'Real-time edits' },
  { icon: Layers, name: '4 Website Types', desc: 'Portfolio, College, Business, App' },
  { icon: Palette, name: 'Theme Customizer', desc: 'Colors & layouts' },
  { icon: Zap, name: 'Instant Templates', desc: 'Start in seconds' },
];

const LoadingFeatureCard = ({ feature, index, progress }: { feature: typeof features[0], index: number, progress: number }) => {
  const isActive = progress > (index * 15) && progress < (index * 15 + 20);
  const isComplete = progress >= (index * 15 + 15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : isComplete ? 0.6 : 0.2,
        y: isActive ? 0 : 0,
        scale: isActive ? 1 : isComplete ? 0.95 : 0.9,
        backgroundColor: isActive ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.02)',
        borderColor: isActive ? 'rgba(124, 58, 237, 0.5)' : 'rgba(255, 255, 255, 0.1)',
      }}
      transition={{ duration: 0.5 }}
      className="p-4 rounded-2xl border backdrop-blur-sm"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isActive ? 'bg-primary' : 'bg-white/10'}`}>
        <feature.icon size={20} className={isActive ? 'text-white' : 'text-white/40'} />
      </div>
      <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-white/40'}`}>
        {feature.name}
      </div>
      <div className="text-[10px] text-white/30 mt-1">{feature.desc}</div>
      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

const BuildingAnimation = ({ progress }: { progress: number }) => {
  const stage = Math.floor(progress / 25);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Stage 1: Logo appears */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 1 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
            <Sparkles size={32} className="text-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-white uppercase tracking-wider">FlowSite</div>
            <div className="text-sm text-white/40">Build. Export. No Code.</div>
          </div>
        </div>
      </motion.div>

      {/* Stage 2: Website type cards appear */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 50 }}
        transition={{ duration: 0.8 }}
        className="absolute top-[65%] left-1/2 -translate-x-1/2 flex gap-4"
      >
        {[
          { icon: Code, label: 'Portfolio', color: 'from-blue-500' },
          { icon: Rocket, label: 'College', color: 'from-emerald-500' },
          { icon: Layers, label: 'Business', color: 'from-amber-500' },
          { icon: Square, label: 'App', color: 'from-violet-500' },
        ].map((type, i) => (
          <motion.div
            key={type.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: stage >= 2 ? 0.8 : 0, scale: stage >= 2 ? 1 : 0.8 }}
            transition={{ delay: i * 0.1 }}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <type.icon size={20} className={`text-transparent bg-gradient-to-r ${type.color} bg-clip-text`} />
            <div className="text-xs text-white/60 mt-1">{type.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stage 3: Editor preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 0.6 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-8 left-8 right-8 h-32 rounded-xl border border-white/10 bg-white/5 overflow-hidden"
      >
        <div className="flex h-full">
          <div className="w-32 border-r border-white/10 p-3 space-y-2">
            <div className="w-16 h-2 rounded-full bg-white/20" />
            <div className="w-20 h-2 rounded-full bg-white/10" />
            <div className="w-24 h-2 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 p-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/5" />
            <div className="rounded-lg bg-white/5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(1);
  const [textIndex, setTextIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const messages = [
    "Initializing FlowSite...",
    "Loading AI Scanner module...",
    "Building template engine...",
    "Preparing export system...",
    "Finalizing your workspace...",
    "Ready to create! 🚀"
  ];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const gridX = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const gridY = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);

  useEffect(() => {
    let startTimestamp: number;
    const duration = 3500;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const p = Math.min(elapsed / duration, 1);

      // Smooth easing
      const easedP = p < 0.5
        ? 4 * p * p * p
        : 1 - Math.pow(-2 * p + 2, 3) / 2;

      setProgress(easedP * 100);

      if (easedP > 0.2 && stage === 1) setStage(2);
      if (easedP > 0.5 && stage === 2) setStage(3);
      if (easedP > 0.8 && stage === 3) setStage(4);

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 800);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prev => Math.min(prev + 1, messages.length - 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ backgroundColor: "#000000" }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#030712]"
    >
      {/* Animated Grid Background */}
      <motion.div
        style={{ x: gridX, y: gridY }}
        className="absolute inset-0 opacity-20"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px]" />

      {/* Building Animation */}
      <BuildingAnimation progress={progress} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Sparkles size={28} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">FlowSite</h1>
              <p className="text-sm text-white/50 font-medium">Build beautiful websites without code</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-4">
          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-violet-500 to-primary"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg shadow-primary/50" />
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <motion.span
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-white/60"
            >
              {messages[textIndex]}
            </motion.span>
            <span className="text-sm font-bold text-primary">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3 mt-12"
        >
          {features.map((feature, i) => (
            <LoadingFeatureCard
              key={feature.name}
              feature={feature}
              index={i}
              progress={progress}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 80 ? 1 : 0 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-white/30 text-sm">Export clean HTML • CSS • JS • No dependencies</p>
      </motion.div>
    </motion.div>
  );
}