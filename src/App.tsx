import React, { useState } from 'react';
import { EditorPanel } from './components/editor/EditorPanel';
import { Canvas } from './components/preview/Canvas';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { Moon, Sun, Download, Monitor, Smartphone, Tablet, ChevronLeft } from 'lucide-react';
import { Home } from './components/home/Home';

function TopBar({ onBack }: { onBack: () => void }) {
  const { data, toggleTheme } = useBuilder();
  const { theme } = data.settings;

  return (
    <header className="h-16 border-b border-border bg-glass backdrop-blur-[20px] flex items-center justify-between px-6 z-50 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Back to home"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 font-extrabold text-[20px] tracking-tight">
          <div className="w-6 h-6 rounded-md bg-primary shadow-sm" />
          FlowSite
        </div>
      </div>
      
      <div className="flex flex-1 justify-center max-w-sm px-4">
        {/* Device simulation toggles (visual only for now) */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-1 gap-1">
          <button className="px-3 py-1.5 rounded-md bg-white dark:bg-black shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-xs font-semibold text-foreground">
            Desktop
          </button>
          <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none">
            Tablet
          </button>
          <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none">
            Mobile
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-glass border border-border hover:bg-white/50 dark:hover:bg-black/50 transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-border bg-glass shadow-sm hover:bg-white/50 dark:hover:bg-black/50 h-[34px] px-4 py-2"
        >
          Preview
        </button>
        <button 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#1C1C1E] dark:bg-white text-white dark:text-[#1C1C1E] shadow hover:opacity-90 h-[34px] px-4 py-2"
        >
          Export Code
        </button>
      </div>
    </header>
  );
}

function MainLayout({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-transparent">
      <TopBar onBack={onBack} />
      <main className="flex-1 flex overflow-hidden">
        <EditorPanel />
        <Canvas />
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'editor'>('home');

  return (
    <BuilderProvider>
      {view === 'home' ? (
        <Home onNavigate={() => setView('editor')} />
      ) : (
        <MainLayout onBack={() => setView('home')} />
      )}
    </BuilderProvider>
  );
}
