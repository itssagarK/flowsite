import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultAppFeatures } from '../../context/BuilderContext';
import { Zap, BarChart3, Cloud, Shield, Smartphone, Wifi } from 'lucide-react';

const iconMap: Record<string, any> = { sync: Zap, chart: BarChart3, cloud: Cloud, shield: Shield, smartphone: Smartphone, wifi: Wifi };

export function Features() {
  const { data } = useBuilder();
  const features = data.appFeatures || defaultAppFeatures;

  if (features.length === 0) return null;

  return (
    <section id="features" className="py-20 px-8 md:px-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto mb-12 text-center">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">Features</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything You Need</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Powerful features to help you succeed</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon] || Zap;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card border border-border rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-4">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}