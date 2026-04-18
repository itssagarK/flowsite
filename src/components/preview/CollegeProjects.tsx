import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultCollegeProjects } from '../../context/BuilderContext';
import { Calendar, Award, Github, ExternalLink } from 'lucide-react';

export function CollegeProjects() {
  const { data } = useBuilder();
  const projects = data.collegeProjects || defaultCollegeProjects;

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 px-8 md:px-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto mb-12">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Academic Work</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Projects</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>{project.semester}</span>
              </div>
              {project.award && (
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 text-xs font-medium rounded-full">
                  <Award size={12} />
                  {project.award}
                </span>
              )}
            </div>

            <h3 className="font-bold text-xl text-foreground mb-1">{project.title}</h3>
            <p className="text-primary text-sm mb-3">{project.course}</p>
            <p className="text-muted-foreground mb-4">{project.desc}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-muted rounded-md">{tech}</span>
              ))}
            </div>

            <div className="flex gap-3">
              {project.github && (
                <a href={project.github} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Github size={14} />
                  Code
                </a>
              )}
              {project.demo && (
                <a href={project.demo} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={14} />
                  Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}