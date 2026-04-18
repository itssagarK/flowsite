import React from 'react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <section id="contact" className="py-24 px-8 md:px-20 min-h-[400px] flex items-center bg-black/5 dark:bg-white/5 relative z-0">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto md:mx-0 w-full"
      >
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-10 md:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-border">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Let's work together</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg">
            I'm currently available for freelance work and full-time opportunities. Let's build something great.
          </p>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[16px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow-sm hover:opacity-90 h-[56px] px-8 py-3">
            Say Hello
          </button>
        </div>
      </motion.div>
    </section>
  );
}
