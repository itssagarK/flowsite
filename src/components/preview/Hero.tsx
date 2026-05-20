import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { ArrowRight, MapPin, Mail, Sparkles } from 'lucide-react';

export function Hero() {
  const { data } = useBuilder();
  const { name, role, bio, email, location, avatar } = data.user;
  const { heroVariant = 'centered', theme } = data.settings;

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 50]);

  const variants = {
    centered: (
      <motion.div
        key="centered"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center text-center space-y-8"
      >
        {avatar && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden shadow-2xl"
          >
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </motion.div>
        )}
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-primary font-bold">{role}</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
            {name || 'Your Name'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {bio || 'Tell your professional story here...'}
          </p>
        </div>
        <div className="flex gap-4">
          <a href="#projects" className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/25 hover:-translate-y-1 transition-transform">
            View Work
          </a>
          <a href="#contact" className="px-8 py-3 bg-muted text-foreground rounded-full font-bold hover:-translate-y-1 transition-transform">
            Get in Touch
          </a>
        </div>
      </motion.div>
    ),
    split: (
      <motion.div
        key="split"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        <div className="order-2 md:order-1 flex flex-col md:items-end text-center md:text-right space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-primary">{role}</h2>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tight leading-none">
              {name?.split(' ')[0]}<br />
              <span className="text-muted-foreground">{name?.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-md md:ml-auto">
            {bio}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <a href="#projects" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold flex items-center gap-2 group">
              Explore Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
        <motion.div style={{ y }} className="order-1 md:order-2 relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden group">
          {avatar ? (
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              src={avatar}
              alt={name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Sparkles size={60} className="text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem]" />
        </motion.div>
      </motion.div>
    ),
    minimal: (
      <motion.div
        key="minimal"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-full space-y-8"
      >
        <div className="space-y-4">
          <span className="px-3 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-tighter">
            {role || 'Role'}
          </span>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.85] tracking-tighter uppercase gradient-text">
            {name || 'YOUR NAME'}
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-4xl border-l-4 border-primary pl-6">
          {bio}
        </p>
        <div className="h-[1px] w-full bg-border" />
        <div className="flex gap-8">
          <a href="#projects" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
            Selected Work <ArrowRight size={16} />
          </a>
          <a href="#contact" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
            Contact <ArrowRight size={16} />
          </a>
        </div>
      </motion.div>
    )
  };

  return (
    <section id="hero" className="relative w-full flex flex-col justify-center px-8 md:px-20 py-20 md:py-32 min-h-[700px] overflow-hidden">
      <div className="container max-w-6xl mx-auto relative">
        <AnimatePresence mode="wait">
          {variants[heroVariant as keyof typeof variants]}
        </AnimatePresence>
      </div>
    </section>
  );
}
