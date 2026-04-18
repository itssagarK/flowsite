import React from 'react';
import { motion } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function BusinessHero() {
  const { data } = useBuilder();
  const { name, tagline, bio } = data.user;
  const { layout } = data.settings;

  return (
    <section id="hero" className="relative w-full flex flex-col justify-center px-8 md:px-20 py-20 md:py-32 min-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="space-y-6 text-center">
          {tagline && (
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {tagline}
            </motion.span>
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            {name || 'Your Business'}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {bio || 'We provide excellent services to help your business grow.'}
          </p>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.a href="#services" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 rounded-xl text-[16px] font-semibold bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg h-[52px] px-8">
              Our Services
              <ArrowRight size={18} />
            </motion.a>
            <motion.a href="#contact" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center justify-center rounded-xl text-[16px] font-semibold border border-border bg-card h-[52px] px-8">
              Contact Us
            </motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>Money Back Guarantee</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}