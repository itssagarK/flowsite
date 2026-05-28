import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilder } from '../../context/BuilderContext';
import { 
  Monitor, Smartphone, Tablet, Moon, Sun, Code, 
  Palette, Building2, AppWindow, Rocket, Trash2, 
  Layout, Search
} from 'lucide-react';
import './cmdk.css';

export function CommandPalette({ isOpen, setOpen }: { isOpen: boolean; setOpen: (open: boolean) => void }) {
  const { toggleTheme, setActiveDevice, resetToBlank, data } = useBuilder();
  const theme = data.settings.theme;

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setOpen]);

  const runCommand = (command: () => void) => {
    command();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl mx-4"
          >
            <Command
              className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white"
              loop
              onKeyDown={(e) => {
                // Close on escape
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-center px-4 border-b border-white/5" cmdk-input-wrapper="">
                <Search size={18} className="text-white/40 mr-2" />
                <Command.Input 
                  autoFocus 
                  placeholder="Type a command or search..." 
                  className="w-full h-14 bg-transparent outline-none text-sm placeholder:text-white/30"
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 overscroll-contain">
                <Command.Empty className="py-6 text-center text-sm text-white/40">No results found.</Command.Empty>

                <Command.Group heading="Actions" className="px-2 py-3 text-xs font-semibold text-white/40">
                  <Command.Item 
                    onSelect={() => runCommand(() => document.getElementById('export-btn')?.click())}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <Code size={16} /> Deploy & Export
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(toggleTheme)}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} 
                    Toggle Theme
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => {
                      if(confirm('Are you sure you want to reset everything?')) {
                        resetToBlank('portfolio');
                      }
                    })}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-red-500/20 aria-selected:text-red-400 text-red-500/70 transition-colors"
                  >
                    <Trash2 size={16} /> Reset Project
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Device Preview" className="px-2 py-3 text-xs font-semibold text-white/40 border-t border-white/5">
                  <Command.Item 
                    onSelect={() => runCommand(() => setActiveDevice('desktop'))}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <Monitor size={16} /> Desktop View
                    <div className="ml-auto flex gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-sans">⌘</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-sans">3</kbd></div>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setActiveDevice('tablet'))}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <Tablet size={16} /> Tablet View
                    <div className="ml-auto flex gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-sans">⌘</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-sans">2</kbd></div>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setActiveDevice('mobile'))}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <Smartphone size={16} /> Mobile View
                    <div className="ml-auto flex gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-sans">⌘</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-sans">1</kbd></div>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Foundations (New Project)" className="px-2 py-3 text-xs font-semibold text-white/40 border-t border-white/5">
                  <Command.Item 
                    onSelect={() => runCommand(() => resetToBlank('portfolio'))}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <Code size={16} /> Initialize Developer Portfolio
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => resetToBlank('app'))}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <AppWindow size={16} /> Initialize SaaS App
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => resetToBlank('business'))}
                    className="flex items-center gap-3 px-3 py-3 text-sm rounded-lg cursor-pointer aria-selected:bg-white/10 aria-selected:text-white text-white/70 transition-colors"
                  >
                    <Building2 size={16} /> Initialize Startup Landing
                  </Command.Item>
                </Command.Group>

              </Command.List>
            </Command>
          </motion.div>
          {/* Invisible overlay for clicking outside */}
          <div className="absolute inset-0 z-[-1]" onClick={() => setOpen(false)} />
        </div>
      )}
    </AnimatePresence>
  );
}
