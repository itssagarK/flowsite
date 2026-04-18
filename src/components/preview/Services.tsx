import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, defaultServices } from '../../context/BuilderContext';
import { ArrowRight, Code, Smartphone, Palette, Zap, Shield, Cloud } from 'lucide-react';

const iconMap: Record<string, any> = { code: Code, smartphone: Smartphone, palette: Palette, zap: Zap, shield: Shield, cloud: Cloud };

export function Services() {
  const { data } = useBuilder();
  const services = data.services || defaultServices;

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-20 px-8 md:px-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="max-w-4xl mx-auto mb-12 text-center">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-4 block">What We Offer</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Services</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon] || Code;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-6 bg-card border border-border rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.desc}</p>
              <ul className="space-y-2 mb-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                Learn More <ArrowRight size={14} />
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}