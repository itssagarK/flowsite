import React, { useState, useCallback } from 'react';
import { EditorPanel } from './components/editor/EditorPanel';
import { Canvas } from './components/preview/Canvas';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { Moon, Sun, ChevronLeft, Sparkles, Code, Eye, Download, FileCode, X, Check } from 'lucide-react';
import { Home } from './components/home/Home';
import { motion, AnimatePresence } from 'motion/react';

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

function SaveStatusIndicator({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  return (
    <AnimatePresence mode="wait">
      {status !== 'idle' && (
        <motion.div
          key={status}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex items-center gap-2 px-1.5 py-1 rounded-full border border-border bg-muted/30 text-[12px] font-medium"
        >
          {status === 'saving' ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
              <span className="text-muted-foreground tracking-tight">Saving...</span>
            </>
          ) : (
            <>
              <Check size={12} className="text-emerald-500" />
              <span className="text-emerald-500 tracking-tight">Saved</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  const { data, toggleTheme, exportCode, saveStatus } = useBuilder();
  const { theme } = data.settings;
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showExport, setShowExport] = useState(false);

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
            className="flex items-center bg-muted rounded-xl p-1 gap-1"
          >
            {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
              <motion.button
                key={device}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDevice(device)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeDevice === device
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {device === 'desktop' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
                {device === 'tablet' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>}
                {device === 'mobile' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>}
                <span className="hidden sm:inline capitalize">{device}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
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

          <SaveStatusIndicator status={saveStatus} />

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
