import React from 'react';
import { motion } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { ArrowRight, Download, Star } from 'lucide-react';

export function AppHero() {
  const { data } = useBuilder();
  const { name, tagline, bio } = data.user;

  return (
    <section id="hero" className="relative w-full flex flex-col justify-center px-8 md:px-20 py-20 md:py-32 min-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-violet-500/20 pointer-events-none" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="space-y-6">
          {tagline && (
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Star size={14} className="text-amber-400" fill="currentColor" />
              {tagline}
            </motion.span>
          )}

          {data.user.avatar && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="flex justify-center pb-4">
              <img src={data.user.avatar} className="w-24 h-24 rounded-3xl object-cover border-2 border-primary/20 shadow-xl" alt={name} />
            </motion.div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            {name || 'Your App'}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {bio || 'The best solution for your needs. Simple, powerful, and fast.'}
          </p>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.a href="#features" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 rounded-xl text-[16px] font-semibold bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg h-[52px] px-8">
              Get Started Free
              <ArrowRight size={18} />
            </motion.a>
            <motion.a href="#pricing" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 rounded-xl text-[16px] font-semibold border border-border bg-card h-[52px] px-8">
              <Download size={18} />
              Download App
            </motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} className="flex items-center justify-center gap-4 pt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 border-2 border-card" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Join 10,000+ happy users</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}