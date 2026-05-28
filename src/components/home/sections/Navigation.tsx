import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface NavigationProps {
  onGetStarted: () => void;
}

export function Navigation({ onGetStarted }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlowSite</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Templates', href: '#templates' },
            { name: 'Demo', href: '#demo' },
            { name: 'Pricing', href: '#pricing' },
          ].map(item => (
            <a key={item.name} href={item.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">{item.name}</a>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGetStarted();
          }}
          className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:scale-105 transition-all cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
