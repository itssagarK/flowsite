import React, { RefObject } from 'react';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { AutoDemo } from '../AutoDemo';

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

interface LiveDemoSectionProps {
  demoRef: RefObject<HTMLElement>;
  onTryYourself: () => void;
}

export function LiveDemoSection({ demoRef, onTryYourself }: LiveDemoSectionProps) {
  return (
    <section ref={demoRef} id="demo" className="py-40 relative border-t border-white/5 bg-[#020202]">
      <div className="section-wrapper space-y-16">
        <RevealOnScroll direction="center">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Live Demo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Experience the workflow</h2>
            <p className="text-lg text-white/50">Watch how FlowSite transforms your ideas into production-ready websites in seconds.</p>
          </div>
        </RevealOnScroll>

        <div className="relative group">
          {/* Badge */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-4 z-30 px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hidden md:block border border-primary/20"
          >
            Fully Interactive
          </motion.div>
          <div className="absolute -inset-4 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-2xl opacity-40 transition-opacity" />
          <div className="relative p-2 md:p-3 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#111] rounded-t-xl border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-red-500/80 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-yellow-500/80 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-green-500/80 transition-colors" />
              </div>
              <div className="flex-1 mx-4 px-4 py-1.5 bg-black/50 rounded-md text-[11px] font-medium text-white/40 text-center flex items-center justify-center gap-2">
                <Globe size={10} className="opacity-50" /> flowsite.studio/preview
              </div>
            </div>
            <AutoDemo onTryYourself={onTryYourself} />
          </div>
        </div>
      </div>
    </section>
  );
}
