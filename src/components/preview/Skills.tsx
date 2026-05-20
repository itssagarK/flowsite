import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder, defaultSkills } from '../../context/BuilderContext';

export function Skills() {
  const { data } = useBuilder();
  const skills = data.skills || defaultSkills;
  const { skillsVariant = 'tags', theme } = data.settings;

  if (skills.length === 0) return null;

  const variants = {
    tags: (
      <motion.div
        key="tags"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-wrap gap-3"
      >
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className="px-6 py-3 bg-card border-2 border-primary/20 rounded-2xl text-sm font-bold shadow-lg hover:shadow-primary/20 hover:border-primary transition-all cursor-default"
          >
            {skill.name}
          </motion.div>
        ))}
      </motion.div>
    ),
    bars: (
      <motion.div
        key="bars"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid md:grid-cols-2 gap-x-12 gap-y-8"
      >
        {skills.map((skill, i) => (
          <div key={skill.id} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-base font-bold text-foreground">{skill.name}</span>
              <span className="text-xs font-black text-primary uppercase tracking-tighter">{skill.level}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: false }}
                transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
              />
            </div>
          </div>
        ))}
      </motion.div>
    ),
    grid: (
      <motion.div
        key="grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="group p-6 bg-card border border-border rounded-3xl text-center space-y-4 hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              {skill.name.charAt(0)}
            </div>
            <h3 className="font-bold text-base truncate">{skill.name}</h3>
            <div className="pt-2">
              <div className="h-1 w-12 mx-auto bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  };

  return (
    <section id="skills" className="py-24 px-8 md:px-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase">
            Technical <span className="text-primary">Arsenal</span>
          </h2>
          <div className="h-1.5 w-24 bg-primary rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {variants[skillsVariant as keyof typeof variants]}
        </AnimatePresence>
      </div>
    </section>
  );
}
