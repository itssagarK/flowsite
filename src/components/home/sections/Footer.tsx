import React from 'react';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-20 border-t border-white/5">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">FLOWSITE</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Build beautiful websites visually. Export clean, production-ready code.</p>
            <p className="text-xs text-white/20">© 2026 FlowSite. All rights reserved.</p>
          </div>
          {[
            { title: 'Product', items: ['Features', 'Templates', 'Pricing', 'Demo'] },
            { title: 'Resources', items: ['Documentation', 'Blog', 'Community', 'Support'] },
            { title: 'Company', items: ['About', 'Careers', 'Contact', 'Press'] },
          ].map((col) => (
            <div key={col.title} className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white/60">{col.title}</h5>
              <ul className="space-y-3">
                {col.items.map(item => (
                  <li key={item}><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
