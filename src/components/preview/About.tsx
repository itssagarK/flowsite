import React from 'react';
import { motion } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';

export function About() {
  const { data } = useBuilder();
  const { layout } = data.settings;

  if (layout === 'brutalist') {
    return (
      <section id="about" className="py-24 px-6 md:px-12 min-h-[500px] flex items-center bg-primary/10 relative z-0 border-t-8 border-foreground">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto md:mx-0 w-full"
        >
          <div className="border-l-8 border-foreground pl-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
              About Me
            </h2>
            <p className="text-xl md:text-2xl font-mono font-bold text-foreground leading-relaxed">
              With a foundation in both design and engineering, I bridge the gap between aesthetics and functionality. I enjoy creating pixel-perfect interfaces that run efficiently under the hood.
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Design', 'Code', 'Create', 'Ship'].map((item, i) => (
                <div key={item} className="border-4 border-foreground p-4 text-center font-black uppercase text-xl bg-white dark:bg-black">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  if (layout === 'minimal') {
    return (
      <section id="about" className="py-24 px-8 md:px-20 min-h-[500px] flex items-center relative z-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">About</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-8 leading-tight">
            Building digital products with intention and care.
          </h2>
          <div className="text-base text-muted-foreground leading-relaxed space-y-6 max-w-xl mx-auto">
            <p>
              I bridge the gap between aesthetics and functionality, creating interfaces that are both beautiful and efficient.
            </p>
            <p>
              When not coding, I explore new technologies and contribute to open source.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  // Modern (Default) Layout
  return (
    <section id="about" className="py-24 px-8 md:px-20 min-h-[500px] flex items-center relative z-0">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto md:mx-0 relative"
      >
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">About Me</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          Passionate about building scalable digital products.
        </h2>
        <div className="text-lg text-muted-foreground leading-relaxed space-y-4 max-w-2xl">
          <p>
            With a foundation in both design and engineering, I bridge the gap between aesthetics and functionality. I enjoy creating pixel-perfect interfaces that run efficiently under the hood.
          </p>
          <p>
            When I'm not coding, you'll find me exploring new technologies, contributing to open source, or writing technical articles.
          </p>
        </div>

        {/* Stats/Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-8 mt-10"
        >
          {[
            { value: '5+', label: 'Years Exp.' },
            { value: '50+', label: 'Projects' },
            { value: '30+', label: 'Clients' },
            { value: '100%', label: 'Satisfaction' }
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-3xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
