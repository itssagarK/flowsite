import React from 'react';
import { motion } from 'motion/react';
<<<<<<< HEAD
import { useBuilder } from '../../context/BuilderContext';
import { Send, Mail, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export function Contact() {
  const { data } = useBuilder();
  const { layout } = data.settings;

  if (layout === 'brutalist') {
    return (
      <section id="contact" className="py-24 px-6 md:px-12 min-h-[400px] flex items-center bg-foreground text-white relative z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto md:mx-0 w-full"
        >
          <div className="border-4 border-white p-10 md:p-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
              Let's Work Together
            </h2>
            <p className="text-xl font-mono font-bold mb-10 text-white/80 max-w-lg">
              I'm currently available for freelance work and full-time opportunities.
            </p>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[16px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white bg-primary text-white shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] h-[56px] px-8 py-3">
              <Mail size={20} className="mr-2" />
              Send Message
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  if (layout === 'minimal') {
    return (
      <section id="contact" className="py-24 px-8 md:px-20 min-h-[400px] flex items-center bg-black/5 dark:bg-white/5 relative z-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center w-full"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Get in touch</h2>
          <p className="text-base text-muted-foreground mb-10">
            Available for opportunities and collaborations.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Mail size={20} className="text-foreground" />
            </a>
            <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Github size={20} className="text-foreground" />
            </a>
            <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Twitter size={20} className="text-foreground" />
            </a>
            <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <Linkedin size={20} className="text-foreground" />
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  // Modern (Default) Layout
  return (
    <section id="contact" className="py-24 px-8 md:px-20 min-h-[400px] flex items-center relative z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
      <motion.div
=======

export function Contact() {
  return (
    <section id="contact" className="py-24 px-8 md:px-20 min-h-[400px] flex items-center bg-black/5 dark:bg-white/5 relative z-0">
      <motion.div 
>>>>>>> 20493c00627f2efebfae0ea823fca073172b044f
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
<<<<<<< HEAD
        className="max-w-4xl mx-auto md:mx-0 w-full relative"
      >
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-10 md:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-border">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Let's work together</h2>
              <p className="text-lg text-muted-foreground mb-8">
                I'm currently available for freelance work and full-time opportunities. Let's build something great.
              </p>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <span className="text-sm">hello@example.com</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <span className="text-sm">San Francisco, CA</span>
                </motion.div>
              </div>

              <div className="flex gap-3 mt-8">
                {[
                  { icon: Github, label: 'GitHub' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Linkedin, label: 'LinkedIn' }
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-border bg-black/5 dark:bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border border-border bg-black/5 dark:bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full rounded-xl border border-border bg-black/5 dark:bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[16px] font-semibold transition-colors bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 h-[56px] px-8 py-3 gap-2"
              >
                <Send size={18} />
                Send Message
              </motion.button>
            </div>
          </div>
=======
        className="max-w-4xl mx-auto md:mx-0 w-full"
      >
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-10 md:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-border">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Let's work together</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg">
            I'm currently available for freelance work and full-time opportunities. Let's build something great.
          </p>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-[16px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow-sm hover:opacity-90 h-[56px] px-8 py-3">
            Say Hello
          </button>
>>>>>>> 20493c00627f2efebfae0ea823fca073172b044f
        </div>
      </motion.div>
    </section>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20493c00627f2efebfae0ea823fca073172b044f
