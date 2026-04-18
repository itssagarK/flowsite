import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultSkills } from '../../context/BuilderContext';

export function Skills() {
  const { data } = useBuilder();
  const skills = data.skills || defaultSkills;
  const { layout } = data.settings;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  if (skills.length === 0) return null;

  if (layout === 'brutalist') {
    return (
      <section id="skills" className="py-20 px-6 md:px-12 bg-primary/5 border-y-4 border-foreground">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="border-4 border-foreground p-4 text-center">
                <div className="text-2xl font-black uppercase">{skill.name}</div>
                <div className="mt-2 h-4 bg-foreground">
                  <div className="h-full bg-primary" style={{ width: `${skill.level}%` }} />
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
      <section id="skills" className="py-20 px-8 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Expertise</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">What I work with</h2>

          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{category}</h3>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-muted/50 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
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
    <section id="skills" className="py-20 px-8 md:px-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-violet-500/5" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        className="max-w-4xl mx-auto relative"
      >
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Skills & Expertise</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">What I bring to the table</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: catIndex * 0.1 }}
              className="p-6 bg-card border border-border rounded-2xl"
            >
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <div className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}