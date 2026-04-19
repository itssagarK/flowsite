import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { ArrowRight, MapPin, Mail, Sparkles } from 'lucide-react';

export function Hero() {
  const { data } = useBuilder();
  const { name, role, bio, email, location } = data.user;
  const { layout } = data.settings;
  const { hero } = data;

  if (layout === 'minimal') {
    return (
      <section id="hero" className="relative w-full flex flex-col justify-center items-center text-center px-8 py-32 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl space-y-6"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">{role}</p>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground leading-tight">
            {name || 'Your Name'}
          </h1>
          <div className="w-12 h-[1px] bg-border mx-auto my-6" />
          <p className="text-lg text-muted-foreground leading-relaxed font-serif italic">
            {bio || 'Tell your story...'}
          </p>
        </motion.div>
      </section>
    );
  }

  if (layout === 'brutalist') {
    return (
      <section id="hero" className="relative w-full flex flex-col justify-center px-6 md:px-12 py-24 min-h-[600px] border-b-8 border-foreground bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGciPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBoMnYyaC0yeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-30" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 flex flex-col gap-8 w-full max-w-5xl mx-auto"
        >
          <div className="w-fit border-4 border-foreground px-4 py-2 bg-primary text-white font-mono font-bold uppercase text-xl shadow-[8px_8px_0_0_var(--foreground)]">
            SYSTEM ROLE: {role || 'YOUR ROLE'}
          </div>

          <div className="relative">
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black uppercase leading-[0.85] tracking-tighter text-foreground break-words">
              {name || 'YOUR NAME'}
            </h1>
            <div className="mt-8 border-t-4 border-foreground pt-4 w-full max-w-xl">
              <p className="text-xl md:text-2xl font-mono font-bold text-foreground bg-primary/20 p-4">
                {bio || 'Your bio goes here...'}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Modern (Default) Layout
  return (
    <section id="hero" className="relative w-full flex flex-col justify-center px-8 md:px-20 py-20 md:py-32 min-h-[700px] overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Available for Projects</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground flex items-center gap-2">
                Hi, I'm <span className="text-foreground">{name || 'Your Name'}</span>
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >👋</motion.span>
              </h2>
              
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-foreground">
                {role?.split(' ')[0] || 'Creative'}<br />
                <span className="gradient-text">{role?.split(' ').slice(1).join(' ') || 'Developer'}</span>
              </h1>
            </div>

            {/* Bio */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {bio || 'I build high-performance digital experiences that merge elegant design with technical excellence.'}
            </p>

            {/* CTA & Socials */}
            <div className="flex flex-wrap items-center gap-6">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl text-base font-bold bg-foreground text-background h-[56px] px-8 transition-shadow hover:shadow-xl hover:shadow-primary/20"
              >
                Explore Work
                <ArrowRight size={20} />
              </motion.a>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                {email && (
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                    <Mail size={24} />
                  </a>
                )}
                {location && (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin size={18} />
                    {location}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Floating Visual Elements */}
          <div className="hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative w-[400px] h-[400px]"
            >
              {/* Main Floating Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {data.user.avatar ? (
                  <img src={data.user.avatar} alt={name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="p-8 h-full flex flex-col justify-between relative z-10">
                    <Sparkles size={40} className="text-primary" />
                    <div>
                      <div className="text-4xl font-bold mb-2">100%</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Performance Driven</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Pill */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 px-6 py-3 bg-violet-500 text-white rounded-2xl font-bold shadow-xl shadow-violet-500/30"
              >
                Innovation
              </motion.div>

              {/* Glass Tag */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-8 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-bold uppercase">Uptime</div>
                    <div className="text-sm font-bold">99.9% Ready</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

