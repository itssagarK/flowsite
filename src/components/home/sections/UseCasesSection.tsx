import React from 'react';
import { motion } from 'motion/react';
import { Code, Rocket, Building2, AppWindow, Plus, ArrowRight } from 'lucide-react';
import { WebsiteType } from '../../../context/BuilderContext';

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

interface UseCasesSectionProps {
  activeWebsiteType: WebsiteType;
  setActiveWebsiteType: (type: WebsiteType) => void;
  templates: any[];
  onStartBlank: () => void;
  onSelectTemplate: (templateData: any) => void;
}

export function UseCasesSection({ activeWebsiteType, setActiveWebsiteType, templates, onStartBlank, onSelectTemplate }: UseCasesSectionProps) {
  return (
    <section id="templates" className="py-40 relative bg-[#050505] border-t border-white/5">
      <div className="section-wrapper">
        <RevealOnScroll direction="left">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Foundations</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Production-Grade Use Cases</h2>
              <p className="text-lg text-white/50 max-w-xl">Don't start from scratch. Choose a highly-optimized starting point tailored to your exact needs.</p>
            </div>
            
            {/* Vercel-style segmented control */}
            <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
              {[
                { id: 'portfolio', title: 'Developer', icon: Code },
                { id: 'college', title: 'Student', icon: Rocket },
                { id: 'business', title: 'Startup', icon: Building2 },
                { id: 'app', title: 'SaaS', icon: AppWindow },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveWebsiteType(type.id as WebsiteType)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeWebsiteType === type.id
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <type.icon size={14} />
                  {type.title}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20">
          {/* Initialize Empty Project */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { e.stopPropagation(); onStartBlank(); }}
            className="bg-[#0a0a0a] p-8 h-full flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-white/40 cursor-pointer group gap-4 min-h-[280px] rounded-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
              <Plus size={24} className="text-white/50 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white tracking-tight">Initialize Empty Project</h3>
              <p className="text-sm text-white/40 mt-1 font-medium">Start with a blank canvas</p>
            </div>
          </motion.div>

          {/* Pre-built Templates */}
          {templates.slice(0, 2).map((template: any, i: number) => (
            <RevealOnScroll key={i} delay={i * 0.1} direction="center">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => { e.stopPropagation(); onSelectTemplate(template.data); }}
                className="bg-[#0a0a0a] p-8 h-full flex flex-col justify-between border border-white/10 hover:border-white/30 cursor-pointer group min-h-[280px] rounded-2xl shadow-xl shadow-black/50"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${template.color} shadow-lg`}>
                      <template.icon size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Template</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">{template.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-medium">{template.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                  <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">Deploy Template</span>
                  <ArrowRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
