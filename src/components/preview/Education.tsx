import React from 'react';
import { motion } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { GraduationCap, Calendar, Award } from 'lucide-react';

export function Education() {
  const { data } = useBuilder();
  const education = data.education || [];

  if (education.length === 0) return null;

  return (
    <section id="education" className="py-20 px-8 md:px-20 bg-muted/30">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto mb-12">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Background</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Education</h2>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-6 pb-8 border-l-2 border-primary/20 pl-8 relative"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />

            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar size={14} />
                <span>{edu.year}</span>
              </div>
              <h3 className="font-bold text-xl text-foreground mb-1">{edu.degree}</h3>
              <p className="text-primary mb-2">{edu.institution}</p>
              {edu.gpa && (
                <div className="flex items-center gap-2 text-sm">
                  <Award size={14} className="text-amber-500" />
                  <span className="text-muted-foreground">GPA: {edu.gpa}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}