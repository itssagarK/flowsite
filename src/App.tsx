import React, { useState, useCallback } from 'react';
import { EditorPanel } from './components/editor/EditorPanel';
import { Canvas } from './components/preview/Canvas';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { Moon, Sun, ChevronLeft, Sparkles, Code, Eye, Download, FileCode, X, Check, Smartphone, Tablet, Monitor, Info, Loader2, Cloud } from 'lucide-react';
import { Home } from './components/home/Home';
import { motion, AnimatePresence } from 'motion/react';

function DeviceTooltip({ label, size, shortcut, isInfo = false }: { label: string; size?: string; shortcut?: string; isInfo?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] whitespace-nowrap z-[100] shadow-xl border border-white/10 pointer-events-none"
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-bold flex items-center gap-1">
          {isInfo && <Info size={10} className="text-amber-400" />}
          {label}
        </span>
        {!isInfo && (
          <div className="flex items-center gap-2 opacity-70">
            <span>{size}</span>
            <span className="px-1 bg-white/10 rounded tracking-tighter">{shortcut}</span>
          </div>
        )}
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-white/10 rotate-45" />
    </motion.div>
  );
}

function ExportModal({ isOpen, onClose, onExport }: { isOpen: boolean; onClose: () => void; onExport: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCode size={24} className="text-primary" />
              Export Your Portfolio
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
              <h4 className="font-semibold text-foreground mb-2">What's included:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Complete HTML/CSS/JS</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Responsive design</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> All your projects & skills</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> No dependencies required</li>
              </ul>
            </div>

            <button
              onClick={onExport}
              className="w-full py-4 bg-gradient-to-r from-primary to-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Download size={20} />
              Download HTML File
            </button>

            <p className="text-xs text-center text-muted-foreground">
              The exported file can be opened directly in any browser or deployed to any hosting service.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  const { data, toggleTheme, exportCode, activeDevice, setActiveDevice, saveStatus } = useBuilder();
  const { theme } = data.settings;
  const [showExport, setShowExport] = useState(false);
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveDevice('mobile');
        } else if (e.key === '2') {
          e.preventDefault();
          setActiveDevice('tablet');
        } else if (e.key === '3') {
          e.preventDefault();
          setActiveDevice('desktop');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveDevice]);

  const handleExport = useCallback(() => {
    const code = exportCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.user.name || 'portfolio'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExport(false);
  }, [exportCode, data.user.name]);

  const deviceData = {
    mobile: { icon: Smartphone, size: '375px', shortcut: '⌘1' },
    tablet: { icon: Tablet, size: '768px', shortcut: '⌘2' },
    desktop: { icon: Monitor, size: '100%', shortcut: '⌘3' },
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-glass backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
            aria-label="Back to home"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">Exit</span>
          </motion.button>

          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center"
            >
              <Sparkles size={16} className="text-white" />
            </motion.div>
            <span className="hidden sm:inline">FlowSite</span>
          </div>
        </div>

        <div className="flex flex-1 justify-center max-w-xs px-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center bg-muted/50 rounded-xl p-1 gap-1 relative border border-border/50"
            onMouseEnter={() => {
              if (window.innerWidth < 768) setHoveredDevice('info');
            }}
            onMouseLeave={() => setHoveredDevice(null)}
          >
            <AnimatePresence>
              {hoveredDevice === 'info' && (
                <DeviceTooltip label="Device preview works best on larger screens" isInfo />
              )}
            </AnimatePresence>

            {(['mobile', 'tablet', 'desktop'] as const).map((device) => {
              const Icon = deviceData[device].icon;
              const isActive = activeDevice === device;
              const isHiddenOnSmall = (device === 'tablet' || device === 'desktop');

              return (
                <motion.button
                  key={device}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveDevice(device)}
                  onMouseEnter={() => setHoveredDevice(device)}
                  onMouseLeave={() => setHoveredDevice(null)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 z-10
                    ${isHiddenOnSmall ? 'hidden md:flex' : 'flex'}
                    ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  `}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline capitalize">{device}</span>

                  {isActive && (
                    <motion.div
                      layoutId="device-indicator"
                      className="absolute inset-0 bg-card shadow-sm rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <AnimatePresence>
                    {hoveredDevice === device && (
                      <DeviceTooltip
                        label={device.charAt(0).toUpperCase() + device.slice(1)}
                        size={deviceData[device].size}
                        shortcut={deviceData[device].shortcut}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50 mr-2">
            <AnimatePresence mode="wait">
              {saveStatus === 'saving' ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-primary"
                >
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-[11px] font-bold">Saving...</span>
                </motion.div>
              ) : saveStatus === 'saved' ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-emerald-500"
                >
                  <Check size={14} />
                  <span className="text-[11px] font-bold">Saved</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-muted-foreground/50"
                >
                  <Cloud size={14} />
                  <span className="text-[11px] font-medium">Auto-saving</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] font-semibold transition-colors border border-border bg-muted hover:bg-muted/80 h-[38px] px-4 py-2 gap-2"
          >
            <Eye size={14} />
            Preview
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExport(true)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] font-semibold bg-gradient-to-r from-primary to-violet-500 text-white h-[38px] px-4 py-2 gap-2"
          >
            <Code size={14} />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </header>

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} onExport={handleExport} />
    </>
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
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Home onNavigate={() => setView('editor')} />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MainLayout onBack={() => setView('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </BuilderProvider>
  );
}
