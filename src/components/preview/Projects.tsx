import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder, defaultProjects } from '../../context/BuilderContext';

export function Projects() {
  const { data } = useBuilder();
  const [activeFilter, setActiveFilter] = useState('All');

  const projects = data.projects || defaultProjects;
  const layout = data.settings.layout;
  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.tags.includes(activeFilter));

  const renderProjectCard = (project: any) => {
    if (layout === 'minimal') {
      return (
        <motion.div 
          layout
          key={project.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="border-b border-border py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:px-4 transition-all"
        >
          <div className="flex items-center gap-6 flex-1">
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-16 h-16 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-border/20 flex items-center justify-center font-serif text-xl">{project.title.charAt(0)}</div>
            )}
            <div>
              <h3 className="text-2xl font-light text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">{project.desc}</p>
            </div>
          </div>
          <div className="flex gap-3">
             {project.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{tag}</span>
             ))}
          </div>
        </motion.div>
      );
    }

    if (layout === 'brutalist') {
      return (
        <motion.div 
          layout
          key={project.id} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="border-4 border-foreground p-6 bg-white dark:bg-black shadow-[8px_8px_0_0_#primary] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_#primary] transition-all flex flex-col"
        >
          <div className="h-40 border-b-4 border-foreground -mx-6 -mt-6 mb-6 overflow-hidden bg-primary/20 relative">
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover mix-blend-luminosity filter contrast-125" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-black text-6xl opacity-20">{project.title.substring(0,2).toUpperCase()}</span>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-black uppercase text-foreground mb-2">{project.title}</h3>
          <p className="text-sm font-mono font-bold text-foreground/80 mb-6">{project.desc}</p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-bold uppercase px-2 py-1 bg-primary text-white border-2 border-foreground">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      );
    }

    // Default Modern Layout
    return (
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
          {project.tags.map((tag: string) => (
            <span key={tag} className="text-[11px] font-semibold tracking-wide uppercase px-2 py-1 bg-white/50 dark:bg-black/40 rounded-md text-foreground/70">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <section id="projects" className="py-24 px-8 md:px-20 min-h-[600px] relative z-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className={`max-w-4xl mx-auto md:mx-0 mb-8 ${layout === 'minimal' ? 'text-center md:text-left' : ''}`}
      >
        {layout !== 'brutalist' && <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Selected Work</span>}
        <h2 className={`${layout === 'brutalist' ? 'text-5xl md:text-7xl font-black uppercase' : 'text-4xl md:text-5xl font-bold tracking-tight'}`}>
          Recent Projects
        </h2>
      </motion.div>

      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`flex flex-wrap gap-2 mb-10 max-w-4xl mx-auto md:mx-0 ${layout === 'minimal' ? 'justify-center md:justify-start' : ''}`}
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={`px-4 py-2 text-sm transition-all duration-300 ${
              layout === 'brutalist' 
                ? `border-2 border-foreground font-bold uppercase ${activeFilter === tag ? 'bg-primary text-white shadow-[4px_4px_0_0_#1C1C1E] dark:shadow-[4px_4px_0_0_#FFFFFF]' : 'bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`
                : `rounded-full font-medium ${activeFilter === tag ? 'bg-primary text-white shadow-md' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-black/10 dark:hover:bg-white/10'}`
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      <motion.div layout className={`w-full ${layout === 'minimal' ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => renderProjectCard(project))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
