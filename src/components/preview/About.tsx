import React from 'react';
import { motion } from 'motion/react';

export function About() {
  return (
    <section id="about" className="py-24 px-8 md:px-20 min-h-[500px] flex items-center relative z-0">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto md:mx-0"
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
      </motion.div>
    </section>
  );
}
