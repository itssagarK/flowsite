import React, { useState, useCallback } from 'react';
import { EditorPanel } from './components/editor/EditorPanel';
import { Canvas } from './components/preview/Canvas';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import { Moon, Sun, ChevronLeft, Sparkles, Code, Eye, EyeOff, Download, FileCode, X, Check, Smartphone, Tablet, Monitor, Info, Loader2, Cloud } from 'lucide-react';
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

function ExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data, exportCode } = useBuilder();
  const [step, setStep] = useState(1);
  const [filename, setFilename] = useState(data.user.name || 'my-portfolio');
  const [options, setOptions] = useState({
    includeShapes: true,
    includeAnimations: true,
    minify: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      const code = exportCode({
        includeShapes: options.includeShapes,
        includeAnimations: options.includeAnimations,
        minify: options.minify,
      });
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStep(2);
      setIsExporting(false);
    }, 800);
  };

  const hostingOptions = [
    { name: 'GitHub Pages', icon: Github, desc: 'Free hosting for developers.', link: 'https://pages.github.com/' },
    { name: 'Netlify Drop', icon: Cloud, desc: 'Drag and drop your file to deploy.', link: 'https://app.netlify.com/drop' },
    { name: 'Vercel', icon: Globe, desc: 'Fast, secure hosting.', link: 'https://vercel.com/new' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-card border border-border rounded-[2rem] p-0 max-w-2xl w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col md:flex-row">
            {/* Sidebar / Info Area */}
            <div className="w-full md:w-1/3 bg-primary/5 p-8 border-b md:border-b-0 md:border-r border-border">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <FileCode size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Export Site</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ready to go live?</p>
                </div>
                
                <div className="space-y-3 pt-4">
                  {[
                    { icon: Check, label: 'Single HTML file' },
                    { icon: Check, label: 'Zero dependencies' },
                    { icon: Check, label: 'SEO optimized' },
                    { icon: Check, label: 'Asset included' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <item.icon size={10} />
                      </div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Filename</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                            placeholder="my-portfolio"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">.html</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Options</label>
                        {[
                          { id: 'includeShapes', label: 'Floating Background Shapes', desc: 'Add subtle animated shapes' },
                          { id: 'includeAnimations', label: 'Scroll Reveal Animations', desc: 'Smooth entrance effects' },
                          { id: 'minify', label: 'Minify HTML', desc: 'Reduces file size for speed' },
                        ].map((opt) => (
                          <div
                            key={opt.id}
                            onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof options] }))}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              options[opt.id as keyof typeof options] ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'
                            }`}>
                              {options[opt.id as keyof typeof options] && <Check size={12} className="text-white" />}
                            </div>
                            <div>
                              <div className="text-sm font-bold">{opt.label}</div>
                              <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDownload}
                      disabled={isExporting}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Preparing...
                        </>
                      ) : (
                        <>
                          <Download size={20} />
                          Download HTML File
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-4">
                        <Check size={32} />
                      </div>
                      <h4 className="text-xl font-bold">Download Complete!</h4>
                      <p className="text-sm text-muted-foreground">Your site is ready to be hosted.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Where to host?</label>
                      <div className="grid grid-cols-1 gap-3">
                        {hostingOptions.map((host) => (
                          <a
                            key={host.name}
                            href={host.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-3 border border-border rounded-2xl hover:bg-muted transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                              <host.icon size={20} className="group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold flex items-center gap-1">
                                {host.name}
                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-[10px] text-muted-foreground">{host.desc}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-4 bg-muted hover:bg-muted/80 rounded-2xl font-bold text-sm transition-all"
                    >
                      Back to Editor
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

function TopBar({ onBack, onToggleEditor, isEditorVisible }: { onBack: () => void; onToggleEditor: () => void; isEditorVisible: boolean }) {
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
        } else if (e.key === 'p') {
          e.preventDefault();
          onToggleEditor();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveDevice, onToggleEditor]);

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
            onClick={onToggleEditor}
            className={`hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] font-semibold transition-colors border border-border h-[38px] px-4 py-2 gap-2 ${
              !isEditorVisible ? 'bg-primary text-white border-primary' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {isEditorVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            {isEditorVisible ? 'Preview' : 'Show Editor'}
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

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </>
  );
}

function MainLayout({ onBack }: { onBack: () => void }) {
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-transparent">
      <TopBar onBack={onBack} onToggleEditor={() => setIsEditorVisible(!isEditorVisible)} isEditorVisible={isEditorVisible} />
      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {isEditorVisible && (
            <motion.div
              initial={{ x: -360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -360, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <EditorPanel />
            </motion.div>
          )}
        </AnimatePresence>
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
