import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';

export function Hero() {
  const { data } = useBuilder();
  const { name, role, bio } = data.user;

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
