import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultServices } from '../../context/BuilderContext';
import { Check } from 'lucide-react';

export function Pricing() {
  const { data } = useBuilder();
  const pricing = data.pricing || [];

  if (pricing.length === 0) return null;

  return (
    <section id="pricing" className="py-20 px-8 md:px-20 bg-muted/30">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto mb-12 text-center">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Pricing</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple Pricing</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Choose the plan that works for you</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {pricing.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 bg-card border rounded-2xl ${plan.featured ? 'border-primary shadow-xl shadow-primary/10' : 'border-border'}`}
          >
            {plan.featured && (
              <div className="text-center mb-4">
                <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">Most Popular</span>
              </div>
            )}
            <h3 className="font-bold text-xl text-foreground mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-emerald-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.featured ? 'bg-gradient-to-r from-primary to-violet-500 text-white' : 'bg-muted text-foreground hover:bg-primary/10'}`}
            >
              Choose Plan
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}