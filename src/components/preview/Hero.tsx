import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';

export function Hero() {
  const { data } = useBuilder();
  const { name, role, bio } = data.user;
  const { layout } = data.settings;

  if (layout === 'minimal') {
    return (
      <section id="hero" className="relative w-full flex flex-col justify-center items-center text-center px-8 py-32 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl space-y-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">{role}</p>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground leading-tight">
            {name}
          </h1>
          <div className="w-12 h-[1px] bg-border mx-auto my-8"></div>
          <p className="text-xl text-muted-foreground leading-relaxed font-serif italic">
            {bio}
          </p>
        </motion.div>
      </section>
    );
  }

  if (layout === 'brutalist') {
    return (
      <section id="hero" className="relative w-full flex flex-col justify-center px-6 md:px-12 py-24 min-h-[600px] border-b-8 border-foreground overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-12 w-full max-w-5xl mx-auto md:mx-0"
        >
          <div className="w-fit border-4 border-foreground px-4 py-2 bg-primary text-white font-mono font-bold uppercase text-xl shadow-[8px_8px_0_0_#1C1C1E] dark:shadow-[8px_8px_0_0_#FFFFFF]">
            SYSTEM ROLE: {role}
          </div>
          
          <div className="relative">
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase leading-[0.85] tracking-tighter text-foreground break-words">
              {name}
            </h1>
            <div className="mt-8 border-t-4 border-foreground pt-4 w-full max-w-xl">
              <p className="text-xl md:text-2xl font-mono font-bold text-foreground bg-primary/20 p-4">
                {bio}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Modern (Default) Layout
  return (
    <section id="hero" className="relative w-full flex flex-col justify-center px-8 md:px-20 py-24 min-h-[500px]">
      <div className="container max-w-4xl mx-auto md:mx-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-4"
        >
          {/* Animated Name */}
          <div className="overflow-hidden py-2 inline-flex flex-wrap lg:block">
            <span className="inline-block px-3 py-1.5 bg-[#F2F2F7] dark:bg-white/10 text-primary rounded-full text-xs font-semibold mb-6">
              Available for projects
            </span>
            <br />
            <AnimatePresence mode="popLayout">
              {name.split('').map((char, i) => (
                <motion.span
                  key={`${i}-${char}`}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.03,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-6xl md:text-[72px] font-[800] leading-none tracking-[-2px] inline-block whitespace-pre text-foreground"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Role */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-medium tracking-tight text-primary">
              {role || 'Your Role Here'}
            </h2>
          </motion.div>

          {/* Bio */}
          <motion.div
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[480px]"
          >
            <p className="text-[18px] text-muted-foreground leading-[1.6]">
              {bio || 'Write a short description about yourself...'}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4 pt-8"
          >
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[16px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow-sm hover:opacity-90 h-[50px] px-7 py-3">
              View Portfolio
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
