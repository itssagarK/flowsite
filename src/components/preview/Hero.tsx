import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { ArrowRight, MapPin, Mail, Sparkles } from 'lucide-react';

export function Hero() {
  const { data } = useBuilder();
  const { name, role, bio, email, location } = data.user;
  const { layout } = data.settings;
  const { hero } = data;

  if (layout === 'minimal') {
    return (
      <section id="hero" className="relative w-full flex flex-col justify-center items-center text-center px-8 py-32 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl space-y-6"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">{role}</p>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground leading-tight">
            {name || 'Your Name'}
          </h1>
          <div className="w-12 h-[1px] bg-border mx-auto my-6" />
          <p className="text-lg text-muted-foreground leading-relaxed font-serif italic">
            {bio || 'Tell your story...'}
          </p>
        </motion.div>
      </section>
    );
  }

  if (layout === 'brutalist') {
    return (
      <section id="hero" className="relative w-full flex flex-col justify-center px-6 md:px-12 py-24 min-h-[600px] border-b-8 border-foreground bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGciPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBoMnYyaC0yeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-30" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 flex flex-col gap-8 w-full max-w-5xl mx-auto"
        >
          <div className="w-fit border-4 border-foreground px-4 py-2 bg-primary text-white font-mono font-bold uppercase text-xl shadow-[8px_8px_0_0_var(--foreground)]">
            SYSTEM ROLE: {role || 'YOUR ROLE'}
          </div>

          <div className="relative">
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase leading-[0.85] tracking-tighter text-foreground break-words">
              {name || 'YOUR NAME'}
            </h1>
            <div className="mt-8 border-t-4 border-foreground pt-4 w-full max-w-xl">
              <p className="text-xl md:text-2xl font-mono font-bold text-foreground bg-primary/20 p-4">
                {bio || 'Your bio goes here...'}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Modern (Default) Layout
  return (
    <section id="hero" className="relative w-full flex flex-col justify-center px-8 md:px-20 py-20 md:py-32 min-h-[500px]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 pointer-events-none" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-violet-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Animated Name */}
          <div className="overflow-hidden">
            <AnimatePresence mode="popLayout">
              {(name || 'Your Name').split('').map((char, i) => (
                <motion.span
                  key={`${i}-${char}`}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.02,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight inline-block whitespace-pre text-foreground"
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
            <h2 className="text-xl md:text-2xl font-medium text-primary flex items-center gap-2">
              <Sparkles size={20} />
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
            className="max-w-xl"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {bio || 'Write a short description about yourself...'}
            </p>
          </motion.div>

          {/* Contact Info */}
          {(email || location) && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            >
              {email && (
                <motion.a
                  href={`mailto:${email}`}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:border-primary/50 transition-colors"
                >
                  <Mail size={14} className="text-primary" />
                  {email}
                </motion.a>
              )}
              {location && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full"
                >
                  <MapPin size={14} className="text-violet-500" />
                  {location}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4 pt-4"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-[16px] font-semibold bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/25 h-[52px] px-8"
            >
              {hero?.ctaText || 'View My Work'}
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}