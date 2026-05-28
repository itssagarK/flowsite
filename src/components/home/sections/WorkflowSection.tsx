import React from 'react';
import { motion } from 'motion/react';
import { Scan, Sparkles, Layout, Rocket, Layers } from 'lucide-react';

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

export function WorkflowSection() {
  return (
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
  );
}
