import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Check } from 'lucide-react';

function RevealOnScroll({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' | 'center' }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
        x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
        scale: direction === 'center' ? 0.95 : 1
      }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface PricingSectionProps {
  onStartFree: () => void;
}

export function PricingSection({ onStartFree }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-40 relative bg-black">
      <div className="section-wrapper">
        <RevealOnScroll direction="center">
          <div className="text-center space-y-6 mb-24 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <CreditCard size={12} className="text-white/70" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Predictable pricing, <br className="hidden md:block" />
              <span className="text-white/40">designed to scale.</span>
            </h2>
            <p className="text-lg text-white/50">
              Start for free, upgrade when you need team collaboration and advanced AI capabilities.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Hobby Tier */}
          <RevealOnScroll delay={0.1} direction="up">
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 flex flex-col h-full hover:border-white/30 transition-colors">
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-bold text-white">Hobby</h3>
                <p className="text-sm text-white/50 h-10">For personal projects and experiments.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-sm text-white/50">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited local projects', 'Standard templates', 'Export HTML/CSS', 'Community support'].map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                    <Check size={16} className="text-white/30 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={onStartFree} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors border border-white/10">
                Start for free
              </button>
            </div>
          </RevealOnScroll>

          {/* Pro Tier */}
          <RevealOnScroll delay={0.2} direction="up">
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-primary/50 relative shadow-2xl shadow-primary/10 flex flex-col h-full transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="text-sm text-white/50 h-10">For freelancers and professional developers.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$20</span>
                  <span className="text-sm text-white/50">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Everything in Hobby', 'Unlimited AI Generations', 'Premium templates', 'One-click Vercel deploy', 'Remove branding'].map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={onStartFree} className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-white/10">
                Upgrade to Pro
              </button>
            </div>
          </RevealOnScroll>

          {/* Enterprise Tier */}
          <RevealOnScroll delay={0.3} direction="up">
            <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 flex flex-col h-full hover:border-white/30 transition-colors">
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-sm text-white/50 h-10">Custom solutions for scaling teams.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Everything in Pro', 'Custom AI models', 'SSO & Advanced Security', 'Dedicated success manager', 'SLA 99.99%'].map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                    <Check size={16} className="text-white/30 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-colors border border-white/10">
                Contact Sales
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
