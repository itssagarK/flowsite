import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultExperience } from '../../context/BuilderContext';
import { Briefcase, Calendar, ArrowRight } from 'lucide-react';

export function Experience() {
  const { data } = useBuilder();
  const experience = data.experience || defaultExperience;
  const { layout } = data.settings;

  if (experience.length === 0) return null;

  if (layout === 'brutalist') {
    return (
      <section id="experience" className="py-20 px-6 md:px-12 border-t-8 border-foreground">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">Experience</h2>
          <div className="space-y-0">
            {experience.map((exp, index) => (
              <div key={exp.id} className="border-4 border-foreground p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xl font-black uppercase">{exp.title}</div>
                  <div className="text-lg font-bold">{exp.company}</div>
                  <div className="text-sm opacity-70">{exp.period}</div>
                </div>
                <div className="max-w-md">
                  <p className="font-mono">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  if (layout === 'minimal') {
    return (
      <section id="experience" className="py-20 px-8 md:px-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Background</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Work history</h2>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                <div className="pb-6 border-b border-border/50 last:border-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    {exp.current && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{exp.company} • {exp.period}</p>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  // Modern Layout
  return (
    <section id="experience" className="py-20 px-8 md:px-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        className="max-w-4xl mx-auto"
      >
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Journey</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">Work Experience</h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[22px] md:left-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-violet-500 to-primary/20" />

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[18px] md:left-[50%] w-3 h-3 rounded-full bg-primary border-4 border-card z-10 -translate-x-1/2" />

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-[45%] p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="flex items-center gap-2 text-sm text-primary mb-2 justify-start">
                    <Calendar size={14} />
                    <span>{exp.period}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{exp.title}</h3>
                  <p className="text-muted-foreground mb-3">{exp.company}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                  {exp.current && (
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Current
                      </span>
                    </div>
                  )}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}