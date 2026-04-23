import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MousePointer2, Layout, Palette, Type, 
  Rocket, Check, Globe, Shield, Zap, Layers, 
  Smartphone, Monitor, Code2, Wand2, Info, Play, Pause, HandMetal
} from 'lucide-react';

interface DemoStep {
  action: 'move' | 'click' | 'type' | 'wait';
  target: string;
  value?: string;
  duration: number;
  label: string;
  insight: string;
}

const DEMO_STEPS: DemoStep[] = [
  { action: 'wait', target: 'init', duration: 1500, label: 'Initializing...', insight: 'Booting up the Weightless Design Engine and AI Core.' },
  { action: 'move', target: 'template-select', duration: 1200, label: 'Architecture', insight: 'Selecting a pre-optimized digital foundation.' },
  { action: 'click', target: 'template-select', value: 'Nexus Studio', duration: 800, label: 'Architecture', insight: 'Nexus Studio foundation injected successfully.' },
  { action: 'move', target: 'edit-name', duration: 1000, label: 'Personalization', insight: 'Mapping user identity to the global DOM structure.' },
  { action: 'type', target: 'edit-name', value: 'Jordan Vance', duration: 1800, label: 'Personalization', insight: 'Real-time synchronization of variable data.' },
  { action: 'move', target: 'theme-toggle', duration: 900, label: 'Visual Engine', insight: 'Optimizing color contrast ratios for high-end displays.' },
  { action: 'click', target: 'theme-toggle', value: 'Midnight', duration: 800, label: 'Visual Engine', insight: 'Midnight Mode shaders applied.' },
  { action: 'move', target: 'accent-picker', duration: 800, label: 'Styling', insight: 'Synthesizing the brand accent spectrum.' },
  { action: 'click', target: 'accent-picker', value: '#A855F7', duration: 800, label: 'Styling', insight: 'A855F7 accent nodes broadcast to all components.' },
  { action: 'move', target: 'device-mobile', duration: 1000, label: 'Responsiveness', insight: 'Calculating fluid grid layouts for mobile viewports.' },
  { action: 'click', target: 'device-mobile', duration: 1000, label: 'Responsiveness', insight: 'Fluid layout confirmed on 375px breakpoint.' },
  { action: 'move', target: 'device-desktop', duration: 800, label: 'Responsiveness', insight: 'Restoring standard grid matrix.' },
  { action: 'click', target: 'device-desktop', duration: 800, label: 'Responsiveness', insight: 'Desktop grid restored.' },
  { action: 'move', target: 'ai-generate', duration: 1200, label: 'AI Synthesis', insight: 'AI is analyzing content to generate custom logic.' },
  { action: 'click', target: 'ai-generate', duration: 2500, label: 'AI Synthesis', insight: 'Custom React hooks and TS types generated.' },
  { action: 'move', target: 'export-btn', duration: 1200, label: 'Deployment', insight: 'Packaging assets for global CDN distribution.' },
  { action: 'click', target: 'export-btn', duration: 3000, label: 'Deployment', insight: 'System live on the edge. Global propagation 100%.' },
];

export function AutoDemo({ onTryYourself }: { onTryYourself: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [userName, setUserName] = useState('Jordan Vance');
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#7C3AED');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isTyping, setIsTyping] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    let timeout: any;
    
    const runStep = () => {
      const step = DEMO_STEPS[stepIndex];
      
      const targets: any = {
        'template-select': { x: 12, y: 35 },
        'edit-name': { x: 12, y: 55 },
        'theme-toggle': { x: 90, y: 15 },
        'accent-picker': { x: 12, y: 75 },
        'device-mobile': { x: 55, y: 15 },
        'device-desktop': { x: 45, y: 15 },
        'ai-generate': { x: 90, y: 85 },
        'export-btn': { x: 90, y: 65 },
      };

      if (step.action === 'move' || step.action === 'click') {
        setCursorPos(targets[step.target] || { x: 50, y: 50 });
      }

      timeout = setTimeout(() => {
        if (step.action === 'click') {
          if (step.target === 'theme-toggle') setTheme(t => t === 'light' ? 'dark' : 'light');
          if (step.target === 'accent-picker') setAccentColor(step.value || '#A855F7');
          if (step.target === 'device-mobile') setDevice('mobile');
          if (step.target === 'device-desktop') setDevice('desktop');
          if (step.target === 'ai-generate') {
            setIsGenerating(true);
            setTimeout(() => setIsGenerating(false), 1800);
          }
          if (step.target === 'export-btn') setShowExport(true);
        } else if (step.action === 'type') {
          setIsTyping(true);
          let currentText = '';
          const fullText = step.value || '';
          let charIndex = 0;
          const typingInterval = setInterval(() => {
            currentText += fullText[charIndex];
            setUserName(currentText);
            charIndex++;
            if (charIndex >= fullText.length) {
              clearInterval(typingInterval);
              setIsTyping(false);
            }
          }, 100);
        }

        setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
        if (stepIndex === DEMO_STEPS.length - 1) {
          setTimeout(() => {
            setShowExport(false);
            setStepIndex(0);
          }, 5000);
        }
      }, step.duration);
    };

    runStep();
    return () => clearTimeout(timeout);
  }, [stepIndex, isPaused]);

  const currentStep = DEMO_STEPS[stepIndex];

  return (
    <div className={`w-full aspect-video rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.6)] transition-all duration-1000 ${theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      {/* High-Tech Grid Overlay */}
      <div className="absolute inset-0 wireframe-grid opacity-[0.03] pointer-events-none" />

      {/* Insight Overlay: Explain what is happening */}
      <motion.div 
        key={stepIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
      >
        <div className="glass-premium p-4 border-primary/30 bg-primary/5 backdrop-blur-xl flex items-start gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
           <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
             <Info size={18} className="text-white" />
           </div>
           <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{currentStep.label}</div>
              <div className="text-sm font-medium text-white/80 leading-relaxed">{currentStep.insight}</div>
           </div>
        </div>
      </motion.div>

      {/* Editor Header Bar */}
      <div className={`absolute top-0 left-0 right-0 h-20 border-b border-white/5 flex items-center justify-between px-10 z-30 ${theme === 'dark' ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-xl`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_#7C3AED80]">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="hidden md:block">
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>Live Simulation</div>
            <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Jordan_Nexus_Studio.fsite</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <div className={`p-2 rounded-xl transition-colors ${device === 'desktop' ? 'bg-primary text-white shadow-lg' : 'text-white/40'}`}><Monitor size={16} /></div>
          <div className={`p-2 rounded-xl transition-colors ${device === 'mobile' ? 'bg-primary text-white shadow-lg' : 'text-white/40'}`}><Smartphone size={16} /></div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white transition-colors"
          >
            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
          </button>
          <button 
            onClick={onTryYourself}
            className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            Try Yourself
          </button>
        </div>
      </div>

      {/* Sidebar: Control Panel */}
      <div className={`absolute left-0 top-20 bottom-0 w-[22%] border-r border-white/5 p-8 space-y-10 z-20 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'}`}>
        <div className={`space-y-4 transition-all ${currentStep.target === 'template-select' ? 'scale-105' : 'opacity-60'}`}>
          <div className="flex items-center gap-2 text-primary">
            <Layers size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Base Layout</span>
          </div>
          <div className={`h-12 w-full rounded-2xl border border-white/10 flex items-center px-4 gap-3 bg-white/5`}>
             <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
             <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>Nexus Studio</span>
          </div>
        </div>

        <div className={`space-y-4 transition-all ${currentStep.target === 'edit-name' ? 'scale-105' : 'opacity-60'}`}>
          <div className="flex items-center gap-2 text-primary">
            <Type size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Content Core</span>
          </div>
          <div className={`h-12 w-full rounded-2xl border border-white/10 flex items-center px-4 gap-3 bg-white/5 relative`}>
             <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{userName}</span>
             {isTyping && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 h-4 bg-primary" />}
          </div>
        </div>

        <div className={`space-y-4 transition-all ${currentStep.target === 'accent-picker' ? 'scale-105' : 'opacity-60'}`}>
          <div className="flex items-center gap-2 text-primary">
            <Palette size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Accent</span>
          </div>
          <div className="flex gap-2.5">
            {['#7C3AED', '#A855F7', '#EC4899', '#3B82F6'].map(color => (
              <div key={color} className={`h-8 w-8 rounded-full border-2 transition-all ${accentColor === color ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent'}`} style={{ background: color }} />
            ))}
          </div>
        </div>

        <div className="pt-10 space-y-4">
           <div className={`p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-primary/10 to-transparent`}>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Shield size={12} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Security Protocol</span>
              </div>
              <div className="text-[10px] text-white/40 font-medium leading-relaxed">Enterprise encryption active. Deployment ready.</div>
           </div>
        </div>
      </div>

      {/* Main Preview: Interactive Canvas */}
      <div className={`absolute left-[22%] right-0 top-20 bottom-0 flex items-center justify-center p-12 transition-all duration-700 ${theme === 'dark' ? 'bg-[#030712]' : 'bg-white'}`}>
        <motion.div 
          animate={{ 
            width: device === 'desktop' ? '100%' : '375px',
            height: device === 'desktop' ? '100%' : '667px',
            scale: device === 'desktop' ? 1 : 0.8
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className={`relative rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'} border border-white/5`}
        >
          {/* Mock Website Content */}
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-8">
            <motion.div 
               animate={{ scale: isGenerating ? [1, 1.05, 1] : 1 }}
               className="space-y-6"
            >
              <div className={`inline-block px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border ${theme === 'dark' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-primary/20 bg-primary/5 text-primary'}`}>
                Digital Architecture
              </div>
              <h1 className={`text-6xl font-black tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Portfolio <br />Design. <br />
                <span style={{ color: accentColor }} className="transition-colors duration-500">{userName.split(' ')[0]}</span>
              </h1>
              <p className={`text-sm leading-relaxed max-w-[280px] mx-auto ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
                Synthesizing high-end digital logic with cinematic design principles.
              </p>
            </motion.div>

            <div className="flex gap-4">
               <div className={`w-32 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white shadow-xl`} style={{ background: accentColor }}>View Works</div>
               <div className={`w-32 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest border border-white/10 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Contact</div>
            </div>
          </div>

          {/* AI Generation Sparkle Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                    <Wand2 size={40} className="text-white" />
                  </motion.div>
                  <span className="text-xs font-black text-white uppercase tracking-[0.5em]">Synthesizing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Action Elements (Buttons) */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-4 z-40">
        <div className={`px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-4 group transition-all hover:scale-105 ${currentStep.target === 'ai-generate' ? 'scale-110 shadow-[0_0_30px_#6366F180]' : 'opacity-60'}`}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500"><Code2 size={20} /></div>
          <div>
            <div className="text-[10px] font-black text-white uppercase tracking-widest">Logic Engine</div>
            <div className="text-[9px] text-white/30">Auto-injecting React/TS</div>
          </div>
        </div>

        <div className={`px-8 py-5 rounded-2xl bg-primary text-white font-black text-xs flex items-center gap-3 shadow-[0_20px_50px_#7C3AED80] transition-all hover:translate-y-[-5px] ${currentStep.target === 'export-btn' ? 'scale-105' : 'opacity-60'}`}>
          <Rocket size={18} />
          <span>DEPOY TO PRODUCTION</span>
        </div>
      </div>

      {/* Ghost Cursor */}
      <motion.div
        animate={{ 
          x: `${cursorPos.x}%`, 
          y: `${cursorPos.y}%`,
          scale: cursorPos.x > 80 && cursorPos.y > 60 ? [1, 0.8, 1] : 1
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        className="absolute z-50 pointer-events-none text-primary"
      >
        <MousePointer2 size={36} fill="currentColor" stroke="white" strokeWidth={2.5} className="drop-shadow-2xl" />
        <motion.div 
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-primary/40 rounded-full blur-md"
        />
      </motion.div>

      {/* Deployment Success Overlay */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <div className="text-center space-y-10">
              <motion.div 
                initial={{ scale: 0.5, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_100px_#10B981A0]"
              >
                <Check size={60} className="text-white" />
              </motion.div>
              <div className="space-y-6">
                <h3 className="text-6xl font-black text-white uppercase tracking-tighter">System Live.</h3>
                <div className="flex items-center justify-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-bold uppercase tracking-[0.4em]">
                  <Globe size={18} /> jordan-vance.flowsite.studio
                </div>
              </div>
              <button 
                onClick={onTryYourself}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Launch Your Own Site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
