import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, Layout, Sidebar as SidebarIcon, Square, Circle } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

// --- Visual Sub-components ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[110] opacity-[0.015] mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const MockUI = ({ stage }: { stage: number }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden container max-w-6xl mx-auto px-10 py-20 flex flex-col gap-6">
      {/* Navbar Simulation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={stage >= 2 ? { y: 0, opacity: 0.1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-16 border border-white/20 rounded-2xl bg-white/5 flex items-center px-6 justify-between"
      >
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/10" />
          <div className="w-24 h-4 rounded-full bg-white/10 mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="w-12 h-6 rounded-full bg-white/10" />
          <div className="w-12 h-6 rounded-full bg-white/10" />
        </div>
      </motion.div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar Simulation */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={stage >= 2 ? { x: 0, opacity: 0.1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-64 border border-white/20 rounded-2xl bg-white/5 p-6 space-y-4"
        >
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded bg-white/10" />
              <div className="w-3/4 h-3 rounded-full bg-white/10" />
            </div>
          ))}
        </motion.div>

        {/* Content Simulation */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={stage >= 2 ? { scale: 1, opacity: 0.1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                className="h-40 border border-white/20 rounded-2xl bg-white/5 p-6"
              >
                <div className="w-1/2 h-4 rounded-full bg-white/10 mb-4" />
                <div className="w-full h-2 rounded-full bg-white/10 mb-2" />
                <div className="w-3/4 h-2 rounded-full bg-white/10" />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={stage >= 2 ? { y: 0, opacity: 0.1 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 border border-white/20 rounded-2xl bg-white/5 p-6 h-full"
          >
             <div className="w-1/4 h-4 rounded-full bg-white/10 mb-6" />
             <div className="space-y-3">
               {[1,2,3].map(i => <div key={i} className="w-full h-2 rounded-full bg-white/5" />)}
             </div>
          </motion.div>

          {/* Buttons Simulation */}
          <div className="flex justify-end gap-4 pt-4">
             {[1,2].map(i => (
               <motion.div
                 key={i}
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={stage >= 2 ? { scale: 1, opacity: 0.15 } : {}}
                 transition={{ duration: 0.5, delay: 0.9 + (i * 0.1), type: 'spring' }}
                 className="w-32 h-12 rounded-xl bg-white/10"
               />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(1); // 1: Entry, 2: Build, 3: Transition
  const [textIndex, setTextIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const messages = [
    "Initializing engine...",
    "Loading components...",
    "Rendering layout...",
    "Finalizing experience..."
  ];

  // Mouse parallax
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const gridX = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
  const gridY = useTransform(mouseY, [0, window.innerHeight], [-15, 15]);

  // Staged Easing Logic
  useEffect(() => {
    let startTimestamp: number;
    const duration = 3200; // Total 3.2s simulation

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const p = Math.min(elapsed / duration, 1);

      // Map linear p to staged easing
      let displayP = 0;
      if (p < 0.4) {
        // Slow start (0-40%)
        displayP = p * 100;
      } else if (p < 0.8) {
        // Fast middle (40-80%)
        displayP = 40 + ((p - 0.4) / 0.4) * 40;
      } else {
        // Slow end (80-100%)
        displayP = 80 + ((p - 0.8) / 0.2) * 20;
      }

      setProgress(displayP);

      if (displayP > 30 && stage === 1) setStage(2);
      if (displayP > 90 && stage === 2) setStage(3);

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        // Pulse at 100% then finish
        setTimeout(onComplete, 600);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  // Text Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % messages.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ backgroundColor: "#000000" }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden font-sans"
    >
      <NoiseOverlay />

      {/* Grid Background (Entry Sequence Step 2) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.15, duration: 1 }}
        style={{ x: gridX, y: gridY }}
        className="absolute inset-[-5%] z-0 pointer-events-none"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      {/* Mock UI Building */}
      <MockUI stage={stage} />

      <div className="relative z-10 w-full max-w-xl px-10 flex flex-col items-center">
        {/* Logo (Entry Sequence Step 3) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-[0.25em] uppercase leading-none select-none relative">
            FLOWSITE
            {/* Subtle glow for logo */}
            <div className="absolute inset-0 blur-2xl bg-primary/10 -z-10" />
          </h1>
        </motion.div>

        {/* Progress System */}
        <div className="w-full space-y-6">
          <div className="relative h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <motion.div 
              className="absolute inset-y-0 left-0 bg-primary z-10"
              style={{ width: `${progress}%` }}
              animate={progress === 100 ? { scaleY: [1, 2, 1], opacity: [1, 0.5, 1] } : {}}
            />
            {/* Glowing Trail */}
            <motion.div 
              className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm z-20"
              style={{ left: `calc(${progress}% - 96px)` }}
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <div className="h-4 overflow-hidden relative w-48">
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 whitespace-nowrap"
                >
                  {messages[textIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] font-black font-mono text-primary tracking-widest">{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Cinematic Black Bars */}
      <div className="fixed top-0 left-0 right-0 h-[8vh] bg-black/40 backdrop-blur-sm z-[150]" />
      <div className="fixed bottom-0 left-0 right-0 h-[8vh] bg-black/40 backdrop-blur-sm z-[150]" />
    </motion.div>
  );
}
