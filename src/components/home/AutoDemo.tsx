import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MousePointer2, Layout, Palette, Type, Rocket, Check } from 'lucide-react';

interface DemoStep {
  action: string;
  target: string;
  value?: string;
  duration: number;
}

const DEMO_STEPS: DemoStep[] = [
  { action: 'move', target: 'template-card', duration: 1000 },
  { action: 'click', target: 'template-card', value: 'Portfolio', duration: 500 },
  { action: 'move', target: 'edit-name', duration: 800 },
  { action: 'type', target: 'edit-name', value: 'Alex River', duration: 1200 },
  { action: 'move', target: 'theme-toggle', duration: 800 },
  { action: 'click', target: 'theme-toggle', value: 'Dark Mode', duration: 500 },
  { action: 'move', target: 'accent-color', duration: 600 },
  { action: 'click', target: 'accent-color', value: '#7C3AED', duration: 500 },
  { action: 'move', target: 'export-btn', duration: 1000 },
  { action: 'click', target: 'export-btn', value: 'Ready!', duration: 2000 },
];

export function AutoDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [userName, setUserName] = useState('New User');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [isTyping, setIsTyping] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    let timeout: any;
    
    const runStep = () => {
      const step = DEMO_STEPS[stepIndex];
      
      // Update Cursor Position based on target
      const targets: any = {
        'template-card': { x: 30, y: 40 },
        'edit-name': { x: 20, y: 25 },
        'theme-toggle': { x: 85, y: 15 },
        'accent-color': { x: 85, y: 45 },
        'export-btn': { x: 85, y: 85 },
      };

      if (step.action === 'move' || step.action === 'click') {
        setCursorPos(targets[step.target] || { x: 50, y: 50 });
      }

      // Execute Action
      timeout = setTimeout(() => {
        if (step.action === 'click') {
          if (step.target === 'theme-toggle') setTheme(t => t === 'light' ? 'dark' : 'light');
          if (step.target === 'accent-color') setAccentColor('#7C3AED');
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

        // Move to next step
        setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
        if (stepIndex === DEMO_STEPS.length - 1) {
          // Reset after export
          setTimeout(() => {
            setUserName('New User');
            setTheme('light');
            setAccentColor('#3B82F6');
            setShowExport(false);
          }, 3000);
        }
      }, step.duration);
    };

    runStep();
    return () => clearTimeout(timeout);
  }, [stepIndex]);

  return (
    <div className={`w-full aspect-video rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      {/* Mock Editor Sidebar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[25%] border-r border-white/5 p-6 space-y-8 z-10 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/50'}`}>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        
        <div className="space-y-4">
          <div className="h-2 w-12 bg-primary/20 rounded" />
          <div className={`h-10 w-full rounded-xl border flex items-center px-4 gap-3 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
             <Type size={14} className="text-primary" />
             <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{userName}</span>
             {isTyping && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 h-4 bg-primary" />}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-2 w-16 bg-primary/20 rounded" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-8 w-8 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Mock Canvas */}
      <div className="absolute left-[25%] right-0 top-0 bottom-0 p-12 overflow-hidden">
        <div className="max-w-md mx-auto space-y-12">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="space-y-4 text-center"
          >
            <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
              Available for Hire
            </div>
            <h1 className={`text-5xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              I'm <span style={{ color: accentColor }}>{userName}</span>
            </h1>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
              Building digital products that balance <br /> beauty and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className={`aspect-square rounded-2xl border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating UI Elements */}
      <div className={`absolute top-6 right-6 px-4 py-2 rounded-xl border flex items-center gap-3 backdrop-blur-md ${theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}>
          <motion.div 
            animate={{ x: theme === 'dark' ? 16 : 2 }}
            className="absolute top-1 w-2 h-2 rounded-full bg-white" 
          />
        </div>
        <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Theme</span>
      </div>

      <div className={`absolute bottom-6 right-6 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-xl`}>
        <Rocket size={14} />
        Export Project
      </div>

      {/* Ghost Cursor */}
      <motion.div
        animate={{ 
          x: `${cursorPos.x}%`, 
          y: `${cursorPos.y}%`,
          scale: cursorPos.x === 85 && cursorPos.y === 85 ? [1, 0.8, 1] : 1
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="absolute z-50 pointer-events-none text-primary"
      >
        <MousePointer2 size={32} fill="currentColor" stroke="white" strokeWidth={2} />
        <motion.div 
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 bg-primary/30 rounded-full"
        />
      </motion.div>

      {/* Export Success Overlay */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_#22C55E80]">
                <Check size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase">Site Published!</h3>
              <p className="text-white/40 text-sm">Your vision is now live on the edge.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
