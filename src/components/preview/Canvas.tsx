import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Hero } from './Hero';
import { About } from './About';
import { Projects } from './Projects';
import { Contact } from './Contact';

export function Canvas() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element && containerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 bg-canvas-bg w-full flex items-start lg:items-center justify-center p-6 lg:p-10 relative transition-colors duration-300">
      {/* 
        This is the inner "device" or "window" frame for the website.
      */}
      <div className="w-full max-w-5xl bg-white dark:bg-black shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden min-h-[700px] lg:h-[85vh] flex flex-col transition-all duration-300 relative">
        
        {/* Scroll Progress Bar */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left z-50" 
          style={{ scaleX }} 
        />

        {/* Live Website Content */}
        <div ref={containerRef} className="flex-1 relative overflow-y-auto bg-white dark:bg-[#09090b] scroll-smooth">
          <nav className="p-6 md:px-10 flex justify-between items-center bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md sticky top-0 z-40 border-b border-border/10">
            <button className="font-bold text-foreground text-lg cursor-pointer" onClick={() => scrollTo('hero')}>SG.</button>
            <div className="flex gap-6 text-sm font-medium text-foreground">
              <button onClick={() => scrollTo('projects')} className="hover:text-primary transition-colors cursor-pointer">Work</button>
              <button onClick={() => scrollTo('about')} className="hover:text-primary transition-colors cursor-pointer">About</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-primary transition-colors cursor-pointer">Contact</button>
            </div>
          </nav>

          <div className="flex flex-col gap-12">
            <Hero />
            <Projects />
            <About />
            <Contact />
          </div>
        </div>
      </div>
      
      <div className="absolute top-[100px] right-[40px] md:right-[80px] bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold shadow-[0_10px_20px_rgba(0,122,255,0.3)] flex items-center gap-2 z-50 pointer-events-none hidden md:flex">
        <div className="w-3 h-3 bg-white rounded-full border-2 border-primary"></div>
        Preview Mode
      </div>
    </div>
  );
}
