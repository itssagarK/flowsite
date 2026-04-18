import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder, defaultProjects } from '../../context/BuilderContext';

export function Projects() {
  const { data } = useBuilder();
  const [activeFilter, setActiveFilter] = useState('All');

  const projects = data.projects || defaultProjects;
  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <section id="projects" className="py-24 px-8 md:px-20 min-h-[600px] relative z-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto md:mx-0 mb-8"
      >
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Selected Work</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Recent Projects</h2>
      </motion.div>

      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-10 max-w-4xl mx-auto md:mx-0"
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === tag 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div 
              layout
              key={project.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`p-6 rounded-2xl ${project.color} border border-border/40 hover:shadow-lg transition-shadow duration-300 flex flex-col`}
              whileHover={{ y: -5 }}
            >
              <div className="h-40 rounded-xl mb-6 border border-border/30 overflow-hidden bg-white/60 dark:bg-black/30 relative">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-30">
                    <span className="font-semibold text-lg">{project.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{project.desc}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-semibold tracking-wide uppercase px-2 py-1 bg-white/50 dark:bg-black/40 rounded-md text-foreground/70">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
