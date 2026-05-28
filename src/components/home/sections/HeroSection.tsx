import React, { useState, useRef } from 'react';
import { motion, MotionValue } from 'motion/react';
import { ArrowRight, Check, Code, Layout, Type, Palette, Layers } from 'lucide-react';

interface HeroSectionProps {
  onStartBuilding: () => void;
  onViewDemo: () => void;
  gridSpringX: MotionValue<number>;
  gridSpringY: MotionValue<number>;
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

export function HeroSection({ onStartBuilding, onViewDemo, gridSpringX, gridSpringY }: HeroSectionProps) {
  return (
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
                    onClick={onStartBuilding}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-white text-black rounded-lg font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2 group cursor-pointer shadow-lg shadow-white/10"
                  >
                    Start Building <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                <motion.button
                  onClick={onViewDemo}
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
  );
}
