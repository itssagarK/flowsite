import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultServices } from '../../context/BuilderContext';

export function Stats() {
  const { data } = useBuilder();
  const stats = data.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="py-16 px-8 md:px-20 bg-gradient-to-r from-primary/10 via-transparent to-violet-500/10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ delay: index * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}