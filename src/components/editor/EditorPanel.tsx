import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuilder, WebsiteType } from '../../context/BuilderContext';
import { User, FolderOpen, Palette, Scan, AlertCircle, RefreshCcw, Code, GraduationCap, Building2, AppWindow } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { CommandPalette } from './CommandPalette';

import { ProfileTab } from './tabs/ProfileTab';
import { ContentTab } from './tabs/ContentTab';
import { ThemeTab } from './tabs/ThemeTab';

type EditorTab = 'profile' | 'content' | 'theme';

// Tab configuration with icons and labels
const tabConfig = {
  profile: { icon: User, label: 'Profile', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  content: { icon: FolderOpen, label: 'Content', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  theme: { icon: Palette, label: 'Theme', color: 'text-violet-500', bg: 'bg-violet-500/10' },
};

// Website type icons
const typeIcons: Record<WebsiteType, any> = {
  portfolio: Code,
  college: GraduationCap,
  business: Building2,
  app: AppWindow,
};

function ResetModal({ isOpen, onClose, onReset }: { isOpen: boolean; onClose: () => void; onReset: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll('button');
        if (focusableElements && focusableElements.length > 0) {
          const first = focusableElements[0] as HTMLElement;
          const last = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reset-title"
          aria-describedby="reset-desc"
        >
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <h3 id="reset-title" className="text-lg font-bold text-foreground">Start over?</h3>
          </div>

          <p id="reset-desc" className="text-sm text-muted-foreground mb-6 leading-relaxed">
            This will erase all your content and reset to the default template. This action cannot be undone.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onReset();
                onClose();
                toast.success('All content reset to default.');
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
            >
              Reset
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function EditorPanel() {
  const { data, websiteType, clearSavedData } = useBuilder();

  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const TypeIcon = typeIcons[websiteType];

  return (
    <div className="w-[360px] border-r border-border bg-card shrink-0 flex flex-col h-full overflow-hidden">
      <CommandPalette isOpen={showCommandPalette} setOpen={setShowCommandPalette} />
      {/* Vercel-style Project Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border border-border flex items-center justify-center bg-muted/50 text-foreground">
                <TypeIcon size={12} />
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Team</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="font-semibold text-foreground truncate max-w-[120px] capitalize">{data.user.name || 'Untitled Project'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 flex items-center gap-1 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>
          </div>
          
          {/* Mock Command Palette Search */}
          <button 
            className="w-full h-9 bg-muted/50 hover:bg-muted border border-border rounded-lg flex items-center justify-between px-3 transition-colors text-muted-foreground group"
            onClick={() => setShowCommandPalette(true)}
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <Scan size={14} className="group-hover:text-foreground transition-colors" />
              <span>Search commands...</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] opacity-70">
              <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-sans">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-sans">K</kbd>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-3 border-b border-border">
        <div className="flex gap-1 bg-muted/40 p-1.5 rounded-2xl">
          {(Object.entries(tabConfig) as [EditorTab, typeof tabConfig.profile][]).map(([id, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all relative overflow-hidden ${
                  isActive ? config.bg : 'hover:bg-muted/50'
                }`}
              >
                <Icon size={18} className={isActive ? config.color : 'text-muted-foreground'} />
                <span className={`text-[11px] font-medium ${isActive ? config.color : 'text-muted-foreground'}`}>{config.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ backgroundColor: data.settings.accentColor }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'theme' && <ThemeTab />}
        </AnimatePresence>
      </div>

      {/* Reset Button (Bottom Fixed) */}
      <div className="p-4 border-t border-border bg-muted/20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowResetModal(true)}
          className="w-full py-2.5 rounded-xl text-xs font-semibold border border-red-500/30 text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCcw size={14} />
          Reset all content
        </motion.button>
      </div>

      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={clearSavedData}
      />
    </div>
  );
}
