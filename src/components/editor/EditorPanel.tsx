import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuilder, WebsiteType } from '../../context/BuilderContext';
import { User, FolderOpen, Palette, Scan, Image, Plus, Trash2, GraduationCap, Building2, AppWindow, Code, Layers, Sparkles, Mail, MapPin, Settings2, X, ChevronDown, GripVertical, Edit3, Zap, Moon, Sun, Upload, Video, Type, Layout, Move, Sliders, Eye, Clock, Wand2, ChevronRight, Check, Briefcase, RefreshCcw, AlertCircle, FileText, Loader2, EyeOff, Dices } from 'lucide-react';
import { User, FolderOpen, Palette, Scan, Image, Plus, Trash2, GraduationCap, Building2, AppWindow, Code, Layers, Sparkles, Mail, MapPin, Settings2, X, ChevronDown, GripVertical, Edit3, Zap, Moon, Sun, Upload, Video, Type, Layout, Move, Sliders, Eye, Clock, Wand2, ChevronRight, Check, Briefcase, RefreshCcw, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useBuilder, WebsiteType } from '../../context/BuilderContext';
import { User, FolderOpen, Palette, Scan, Image, Plus, Trash2, GraduationCap, Building2, AppWindow, Code, Layers, Sparkles, Mail, MapPin, Settings2, X, ChevronDown, GripVertical, Edit3, Zap, Moon, Sun, Upload, Video, Type, Layout, Move, Sliders, Eye, Clock, Wand2, ChevronRight, Check, Briefcase, RefreshCcw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isGeminiConfigured } from '../../lib/gemini';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type EditorTab = 'profile' | 'content' | 'theme';

// --- Accordion Item Component ---
function SortableSection({ 
  id, 
  label, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children,
  isVisible,
  onVisibilityToggle
}: { 
  id: string; 
  label: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
  isVisible: boolean;
  onVisibilityToggle: (e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
  };

  const { data } = useBuilder();

  return (
    <div
      ref={setNodeRef}
      className={`bg-card border-b border-border transition-all ${
        isDragging ? 'opacity-50 scale-[1.02] shadow-2xl relative z-[100]' : ''
      } ${isOpen ? 'border-l-4' : 'border-l-0'}`}
      style={{ ...style, borderLeftColor: isOpen ? data.settings.accentColor : undefined, zIndex: isDragging ? 100 : 'auto' }}
    >
      <div className="flex items-center">
        <button
          {...attributes}
          {...listeners}
          className="p-3 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        
        <div 
          className="flex-1 flex items-center justify-between py-3 pr-4 cursor-pointer select-none"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <Icon size={16} />
            </div>
            <span className={`text-sm font-bold ${isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onVisibilityToggle}
              className={`p-1.5 rounded-md hover:bg-muted transition-colors ${isVisible ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
            >
              {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} className="text-muted-foreground" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 pt-2 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const {
    data,
    websiteType,
    updateUser,
    updateProject,
    updateCollegeProject,
    updateService,
    updateSkill,
    updateExperience,
    addProject,
    removeProject,
    addCollegeProject,
    removeCollegeProject,
    addService,
    removeService,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    updateData,
    scanImage,
    clearSavedData,
    scanStatus,
    scanError
    clearSavedData
  } = useBuilder();

  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [projectExpand, setProjectExpand] = useState<number | null>(null);
  const [sectionExpand, setSectionExpand] = useState<string | null>('hero');
  const [showResetModal, setShowResetModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // New AI Scanner State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cyclingStatusIndex, setCyclingStatusIndex] = useState(0);

  const isScanning = scanStatus === 'scanning';
  const statusMessages = ["Reading your profile…", "Extracting skills…", "Parsing experience…", "Writing bio…"];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setCyclingStatusIndex((prev) => (prev + 1) % statusMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  useEffect(() => {
    if (scanStatus === 'done') {
      // Keep results but allow new scan
    }
  }, [scanStatus]);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max 10MB.");
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleScannerReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // We don't reset scanStatus here, it's managed by context, but we might want a 'resetScan' in context
  };

  const TypeIcon = typeIcons[websiteType];

  // Avatar upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Animation speed options
  const animationSpeeds = [
    { id: 'slow', label: 'Slow', desc: 'Gentle transitions' },
    { id: 'normal', label: 'Normal', desc: 'Balanced feel' },
    { id: 'fast', label: 'Fast', desc: 'Snappy & responsive' },
  ];

  // Canvas layout options
  const canvasLayouts = [
    { id: 'full', label: 'Full Width', desc: 'Edge to edge content' },
    { id: 'boxed', label: 'Boxed', desc: 'Contained layout' },
    { id: 'centered', label: 'Centered', desc: 'Focused single column' },
  ];

  const colorPresets = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#1d4ed8', '#7c3aed',
    '#db2777', '#dc2626', '#ea580c', '#000000'
  ];

  const [hexInput, setHexInput] = useState(data.settings.accentColor);
  const [isRandomizing, setIsRandomizing] = useState(false);

  useEffect(() => {
    setHexInput(data.settings.accentColor);
  }, [data.settings.accentColor]);

  const handleColorChange = (newColor: string) => {
    updateData({ settings: { ...data.settings, accentColor: newColor } });
  };

  const validateAndSetHex = (value: string) => {
    const isValid = /^#[0-9A-F]{6}$/i.test(value);
    if (isValid) {
      handleColorChange(value);
    } else {
      setHexInput(data.settings.accentColor);
    }
  };

  const handleRandomColor = () => {
    setIsRandomizing(true);
    const randomColor = colorPresets[Math.floor(Math.random() * colorPresets.length)];
    handleColorChange(randomColor);
    setTimeout(() => setIsRandomizing(false), 500);
  };

  const layoutOptions = [
    { id: 'modern', label: 'Modern', desc: 'Clean with animations', icon: Sparkles },
    { id: 'minimal', label: 'Minimal', desc: 'Simple & elegant', icon: Layers },
    { id: 'brutalist', label: 'Bold', desc: 'Strong & distinctive', icon: Code },
  ];

  const heroVariants = [
    { 
      id: 'centered', 
      label: 'Centered', 
      icon: (
        <svg viewBox="0 0 40 24" className="w-full h-full">
          <rect x="14" y="4" width="12" height="4" rx="1" className="fill-current opacity-20" />
          <rect x="10" y="10" width="20" height="2" rx="1" className="fill-current" />
          <rect x="15" y="14" width="10" height="1" rx="0.5" className="fill-current opacity-50" />
          <rect x="12" y="18" width="16" height="2" rx="1" className="fill-current opacity-30" />
        </svg>
      )
    },
    { 
      id: 'split', 
      label: 'Split', 
      icon: (
        <svg viewBox="0 0 40 24" className="w-full h-full">
          <rect x="4" y="6" width="14" height="2" rx="1" className="fill-current" />
          <rect x="4" y="10" width="10" height="1" rx="0.5" className="fill-current opacity-50" />
          <rect x="4" y="14" width="12" height="2" rx="1" className="fill-current opacity-30" />
          <rect x="22" y="4" width="14" height="16" rx="2" className="fill-current opacity-20" />
        </svg>
      )
    },
    { id: 'minimal', label: 'Minimal', icon: (
        <svg viewBox="0 0 40 24" className="w-full h-full">
          <rect x="4" y="4" width="6" height="2" rx="1" className="fill-current opacity-40" />
          <rect x="4" y="8" width="32" height="4" rx="1" className="fill-current" />
          <rect x="4" y="14" width="24" height="1" rx="0.5" className="fill-current opacity-50" />
          <rect x="4" y="18" width="32" height="0.5" className="fill-current opacity-20" />
        </svg>
      )
    },
    ];

    const skillVariants = [
    { id: 'tags', label: 'Tags', icon: Palette },
    { id: 'bars', label: 'Bars', icon: Sliders },
    { id: 'grid', label: 'Grid', icon: Layout },
    ];


  const handleScanImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await scanImage(file);
    // Clear input so same file can be scanned again if needed
    e.target.value = '';
  };

  const projects = data.projects || [];
  const collegeProjects = data.collegeProjects || [];
  const services = data.services || [];

  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldOrder = data.settings.sectionOrder || ['hero', 'projects', 'skills', 'experience', 'services', 'contact'];
      const oldIndex = oldOrder.indexOf(active.id as string);
      const newIndex = oldOrder.indexOf(over?.id as string);
      const newOrder = arrayMove(oldOrder, oldIndex, newIndex);
      updateData({ settings: { ...data.settings, sectionOrder: newOrder } });
    }
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'projects', label: websiteType === 'college' ? 'Academic Projects' : 'Projects', icon: FolderOpen },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Building2 },
    { id: 'stats', label: 'Stats', icon: Zap },
    { id: 'team', label: 'Team', icon: User },
    { id: 'pricing', label: 'Pricing', icon: AppWindow },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'about', label: 'About', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  // Persistence for open section
  useEffect(() => {
    const lastOpen = localStorage.getItem('flowsite_open_section');
    if (lastOpen) setSectionExpand(lastOpen);
  }, []);

  const toggleSection = (id: string) => {
    const nextId = sectionExpand === id ? null : id;
    setSectionExpand(nextId);
    if (nextId) localStorage.setItem('flowsite_open_section', nextId);
  };

  const sectionOrder = data.settings.sectionOrder || ['hero', 'projects', 'skills', 'experience', 'services', 'contact', 'stats', 'team', 'pricing', 'education', 'about'];
  const orderedSections = [...sections].sort((a, b) => sectionOrder.indexOf(a.id) - sectionOrder.indexOf(b.id));

  return (
    <div className="w-[360px] border-r border-border bg-card shrink-0 flex flex-col h-full overflow-hidden">
      {/* Website Type Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-violet-500/5">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center"
          >
            <TypeIcon size={18} className="text-white" />
          </motion.div>
          <div className="flex-1">
            <h2 className="font-bold text-sm text-foreground capitalize">{websiteType}</h2>
            <p className="text-xs text-muted-foreground">Editor Panel</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Avatar Upload */}
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <User size={14} className="text-blue-500" />
                  <h4 className="font-semibold text-xs text-foreground">Profile Picture</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 border-2 border-dashed border-border overflow-hidden flex items-center justify-center">
                      {data.user.avatar ? (
                        <img src={data.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-muted-foreground" />
                      )}
                    </div>
                    <input type="file" ref={avatarInputRef} accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Upload size={14} className="text-white" />
                    </motion.button>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Upload your photo</p>
                    <p className="text-[10px] text-muted-foreground">JPG, PNG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* AI Scanner */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-xl border border-primary/20 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <Scan size={14} className="text-primary" />
                  <h4 className="font-semibold text-xs text-foreground">AI Profile Scanner</h4>
                </div>

                <AnimatePresence mode="wait">
                  {scanStatus === 'idle' && !selectedFile && (
                    <motion.div
                      key="dropzone"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group
                        ${isDragging ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/50 bg-card/50'}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".png,.jpg,.jpeg,.webp,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-primary" />
                        </div>
                        <p className="text-[13px] font-medium text-foreground leading-tight">
                          Drop your resume or LinkedIn screenshot
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          PNG, JPG, PDF up to 10MB
                        </p>
                        <p className="text-[10px] text-primary font-semibold mt-1">
                          or <span className="underline">browse files</span>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {selectedFile && !isScanning && scanStatus !== 'done' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted/20 flex items-center justify-center">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <FileText size={40} className="text-muted-foreground/50" />
                            <p className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                          </div>
                        )}
                        <button 
                          onClick={handleScannerReset}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => scanImage(selectedFile)}
                        disabled={!isGeminiConfigured}
                        className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                      >
                        <Sparkles size={16} />
                        Scan with AI
                      </motion.button>
                    </motion.div>
                  )}

                  {isScanning && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-6 space-y-4 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <Loader2 size={32} className="text-primary animate-spin" />
                          <Scan size={14} className="absolute inset-0 m-auto text-primary" />
                        </div>
                        <div className="space-y-1">
                          <motion.p
                            key={cyclingStatusIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm font-semibold text-foreground"
                          >
                            {statusMessages[cyclingStatusIndex]}
                          </motion.p>
                          <p className="text-[10px] text-muted-foreground">This usually takes 10-15 seconds</p>
                        </div>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="w-1/2 h-full bg-primary"
                        />
                      </div>
                    </motion.div>
                  )}

                  {scanStatus === 'done' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <Check size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-emerald-600 leading-none mb-1">Profile filled!</p>
                          <p className="text-[11px] text-emerald-600/80">Review and edit your details below.</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleScannerReset}
                        className="w-full py-2 text-xs font-semibold text-primary hover:underline"
                      >
                        Scan another file
                      </button>
                    </motion.div>
                  )}

                  {scanStatus === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                          <AlertCircle size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-red-600 leading-none mb-1">Scanning Failed</p>
                          <p className="text-[11px] text-red-600/80 truncate">{scanError || 'Something went wrong'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="w-full py-2 text-xs font-semibold text-red-500 hover:underline"
                      >
                        Try again
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isGeminiConfigured && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                    <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-600 leading-tight">
                      VITE_GEMINI_API_KEY is missing. Check your .env.local file to enable scanning.
                    </p>
                  </div>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <User size={12} className="text-blue-500" />
                  {websiteType === 'business' || websiteType === 'app' ? 'Business/App Name' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={data.user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder={websiteType === 'business' ? 'My Company' : 'John Doe'}
                />
              </div>

              {/* Role/Title */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Briefcase size={12} className="text-violet-500" />
                  {websiteType === 'business' || websiteType === 'app' ? 'Tagline' : 'Professional Title'}
                </label>
                <input
                  type="text"
                  value={data.user.role}
                  onChange={(e) => updateUser({ role: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder={websiteType === 'business' ? 'Your tagline' : 'Full Stack Developer'}
                />
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-500" />
                  Headline
                </label>
                <input
                  type="text"
                  value={data.user.tagline || ''}
                  onChange={(e) => updateUser({ tagline: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="A catchy headline (optional)"
                />
              </div>

              {/* Bio/Description */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Edit3 size={12} className="text-pink-500" />
                  {websiteType === 'business' ? 'Business Description' : 'Bio'}
                </label>
                <textarea
                  value={data.user.bio}
                  onChange={(e) => updateUser({ bio: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Contact Info (for portfolio/business) */}
              {(websiteType === 'portfolio' || websiteType === 'business') && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1.5">
                      <Mail size={12} className="text-emerald-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.user.email || ''}
                      onChange={(e) => updateUser({ email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1.5">
                      <MapPin size={12} className="text-amber-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.user.location || ''}
                      onChange={(e) => updateUser({ location: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              )}

              {/* Hero Layout Variant Picker */}
              <div className="pt-4 border-t border-border mt-4">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layout size={14} className="text-primary" />
                  Hero Layout
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {heroVariants.map((variant) => (
                    <motion.button
                      key={variant.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateData({ settings: { ...data.settings, heroVariant: variant.id as any } })}
                      className={`relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all overflow-hidden ${
                        (data.settings.heroVariant || 'centered') === variant.id
                          ? 'border-primary bg-primary/5 shadow-inner'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-full aspect-[4/3] rounded-lg mb-1 flex items-center justify-center p-2 ${
                        (data.settings.heroVariant || 'centered') === variant.id ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {variant.icon}
                      </div>
                      <span className={`text-[10px] font-bold ${(data.settings.heroVariant || 'centered') === variant.id ? 'text-primary' : 'text-muted-foreground'}`}>
                        {variant.label}
                      </span>
                      {(data.settings.heroVariant || 'centered') === variant.id && (
                        <div className="absolute top-1 right-1">
                          <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                            <Check size={8} className="text-white" />
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="-mx-4 -mt-4 border-t border-border"
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedSections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedSections.map((section) => {
                    const isEnabled = (data.settings.visibleSections as any)?.[section.id] !== false;
                    const isOpen = sectionExpand === section.id;

                    return (
                      <SortableSection
                        key={section.id}
                        id={section.id}
                        label={section.label}
                        icon={section.icon}
                        isOpen={isOpen}
                        onToggle={() => toggleSection(section.id)}
                        isVisible={isEnabled}
                        onVisibilityToggle={(e) => {
                          e.stopPropagation();
                          const currentSections = (data.settings.visibleSections as any) || {};
                          updateData({
                            settings: {
                              ...data.settings,
                              visibleSections: {
                                ...currentSections,
                                [section.id]: !isEnabled
                              }
                            }
                          });
                        }}
                      >
                        {/* Section Fields */}
                        {section.id === 'hero' && (
                          <div className="space-y-4">
                            <p className="text-xs text-muted-foreground">Customize your website's first impression.</p>
                            <div className="grid grid-cols-3 gap-2">
                              {heroVariants.map((variant) => (
                                <motion.button
                                  key={variant.id}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateData({ settings: { ...data.settings, heroVariant: variant.id as any } })}
                                  className={`relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                                    (data.settings.heroVariant || 'centered') === variant.id ? 'border-primary bg-primary/5' : 'border-border'
                                  }`}
                                >
                                  <div className="w-full aspect-[4/3] rounded-lg flex items-center justify-center text-muted-foreground">
                                    {variant.icon}
                                  </div>
                                  <span className="text-[10px] font-bold">{variant.label}</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.id === 'projects' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Project List</h5>
                              <button onClick={() => addProject({ title: 'New Project', desc: 'Description...', color: 'bg-muted', tags: ['React'] })} className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                                <Plus size={10} /> Add Project
                              </button>
                            </div>
                            <div className="space-y-2">
                              {(data.projects || []).map((project) => (
                                <div key={project.id} className="bg-muted/30 border border-border rounded-xl p-3 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <input type="text" value={project.title} onChange={(e) => updateProject(project.id, { title: e.target.value })} className="flex-1 bg-transparent border-none p-0 text-sm font-bold focus:ring-0" placeholder="Project Title" />
                                    <button onClick={() => removeProject(project.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                                  </div>
                                  <textarea value={project.desc} onChange={(e) => updateProject(project.id, { desc: e.target.value })} className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs resize-none" rows={2} placeholder="Brief description..." />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.id === 'skills' && (
                          <div className="space-y-4">
                            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                              {skillVariants.map((variant) => {
                                const Icon = variant.icon;
                                const isActive = (data.settings.skillsVariant || 'tags') === variant.id;
                                return (
                                  <button key={variant.id} onClick={() => updateData({ settings: { ...data.settings, skillsVariant: variant.id as any } })} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${isActive ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}>
                                    <Icon size={12} /> {variant.label}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="space-y-2">
                              {(data.skills || []).map((skill) => (
                                <div key={skill.id} className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, { name: e.target.value })} className="flex-1 bg-transparent border-none p-0 text-sm font-bold focus:ring-0" />
                                    <button onClick={() => removeSkill(skill.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                                  </div>
                                  <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) })} className="w-full h-1 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary" />
                                </div>
                              ))}
                              <button onClick={() => addSkill({ name: 'New Skill', level: 80 })} className="w-full py-2 border-2 border-dashed border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                                <Plus size={12} /> Add New Skill
                              </button>
                            </div>
                          </div>
                        )}

                        {section.id === 'experience' && (
                          <div className="space-y-4">
                            {(data.experience || []).map((exp) => (
                              <div key={exp.id} className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
                                <input type="text" value={exp.title} onChange={(e) => updateExperience(exp.id, { title: e.target.value })} className="w-full bg-transparent border-none p-0 font-bold text-sm" placeholder="Role" />
                                <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} className="w-full bg-transparent border-none p-0 text-xs text-primary" placeholder="Company" />
                                <button onClick={() => removeExperience(exp.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                              </div>
                            ))}
                            <button onClick={() => addExperience({ title: 'New Role', company: 'New Company', period: '2024', description: '' })} className="w-full py-2 border-2 border-dashed border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                              <Plus size={12} /> Add Experience
                            </button>
                          </div>
                        )}

                        {section.id === 'education' && (
                          <div className="space-y-4">
                            {(data.education || []).map((edu, i) => (
                              <div key={i} className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
                                <input type="text" value={edu.institution} onChange={(e) => {
                                  const next = [...(data.education || [])];
                                  next[i].institution = e.target.value;
                                  updateData({ education: next });
                                }} className="w-full bg-transparent border-none p-0 font-bold text-sm" placeholder="University" />
                                <input type="text" value={edu.degree} onChange={(e) => {
                                  const next = [...(data.education || [])];
                                  next[i].degree = e.target.value;
                                  updateData({ education: next });
                                }} className="w-full bg-transparent border-none p-0 text-xs text-primary" placeholder="Degree" />
                                <button onClick={() => updateData({ education: data.education?.filter((_, idx) => idx !== i) })} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                              </div>
                            ))}
                            <button onClick={() => updateData({ education: [...(data.education || []), { institution: 'University', degree: 'Degree', year: '2024' }] })} className="w-full py-2 border-2 border-dashed border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                              <Plus size={12} /> Add Education
                            </button>
                          </div>
                        )}

                        {section.id === 'about' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">About Me / Professional Bio</label>
                              <textarea
                                value={data.user.bio}
                                onChange={(e) => updateUser({ bio: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:ring-2 focus:ring-primary/30 resize-none min-h-[120px]"
                                placeholder="Describe your background and goals..."
                              />
                            </div>
                          </div>
                        )}

                        {section.id === 'contact' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Public Email</label>
                              <input type="email" value={data.user.email} onChange={(e) => updateUser({ email: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30" placeholder="hello@example.com" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Location</label>
                              <input type="text" value={data.user.location} onChange={(e) => updateUser({ location: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30" placeholder="New York, USA" />
                            </div>
                          </div>
                        )}

                        {section.id === 'services' && (
                          <div className="space-y-4">
                            {(data.services || []).map((service) => (
                              <div key={service.id} className="bg-muted/30 border border-border rounded-xl p-3 space-y-2">
                                <input type="text" value={service.title} onChange={(e) => updateService(service.id, { title: e.target.value })} className="w-full bg-transparent border-none p-0 font-bold text-sm" placeholder="Service Name" />
                                <button onClick={() => removeService(service.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                              </div>
                            ))}
                            <button onClick={() => addService({ title: 'New Service', desc: '', icon: 'code', features: [] })} className="w-full py-2 border-2 border-dashed border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                              <Plus size={12} /> Add Service
                            </button>
                          </div>
                        )}

                        {section.id === 'stats' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                              {(data.stats || []).map((stat, i) => (
                                <div key={i} className="bg-muted/30 border border-border rounded-xl p-2 space-y-1">
                                  <input type="text" value={stat.value} onChange={(e) => {
                                    const newStats = [...(data.stats || [])];
                                    newStats[i].value = e.target.value;
                                    updateData({ stats: newStats });
                                  }} className="w-full font-bold text-primary bg-transparent text-sm" />
                                  <input type="text" value={stat.label} onChange={(e) => {
                                    const newStats = [...(data.stats || [])];
                                    newStats[i].label = e.target.value;
                                    updateData({ stats: newStats });
                                  }} className="w-full bg-transparent text-[10px] text-muted-foreground" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </SortableSection>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </motion.div>
          )}

          {/* THEME TAB */}
          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Theme Mode */}
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sun size={14} className="text-amber-500" />
                  Appearance
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ settings: { ...data.settings, theme: 'light' } })}
                    className={`p-4 rounded-xl text-center transition-all ${
                      data.settings.theme === 'light'
                        ? 'bg-amber-500/20 border-2 border-amber-500'
                        : 'bg-muted/40 border border-border hover:border-amber-500/50'
                    }`}
                  >
                    <Sun size={24} className={`mx-auto mb-2 ${data.settings.theme === 'light' ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    <div className="font-semibold text-sm text-foreground">Light</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ settings: { ...data.settings, theme: 'dark' } })}
                    className={`p-4 rounded-xl text-center transition-all ${
                      data.settings.theme === 'dark'
                        ? 'bg-violet-500/20 border-2 border-violet-500'
                        : 'bg-muted/40 border border-border hover:border-violet-500/50'
                    }`}
                  >
                    <Moon size={24} className={`mx-auto mb-2 ${data.settings.theme === 'dark' ? 'text-violet-500' : 'text-muted-foreground'}`} />
                    <div className="font-semibold text-sm text-foreground">Dark</div>
                  </motion.button>
                </div>
              </div>

              {/* Accent Color Picker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Palette size={14} className="text-violet-500" />
                    Brand Color
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRandomColor}
                    className="p-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                    title="Random color"
                  >
                    <motion.div animate={{ rotate: isRandomizing ? 360 : 0 }}>
                      <Dices size={14} />
                    </motion.div>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* Preset Grid */}
                  <div className="grid grid-cols-8 gap-1.5">
                    {colorPresets.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleColorChange(color)}
                        className="aspect-square rounded-md border border-white/10 shadow-sm relative group"
                        style={{ backgroundColor: color }}
                      >
                        {data.settings.accentColor.toLowerCase() === color.toLowerCase() && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Color Input */}
                  <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-xl border border-border">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0">
                      <input
                        type="color"
                        value={data.settings.accentColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">#</span>
                      <input
                        type="text"
                        value={hexInput.replace('#', '')}
                        onChange={(e) => setHexInput('#' + e.target.value)}
                        onBlur={(e) => validateAndSetHex('#' + e.target.value)}
                        className="w-full bg-background border border-border rounded-lg pl-6 pr-3 py-2 text-xs font-mono focus:ring-2 focus:ring-primary/30 uppercase"
                        placeholder="FFFFFF"
                      />
                    </div>
                  </div>

                  {/* Design System Preview */}
                  <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Preview</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm" style={{ backgroundColor: data.settings.accentColor }}>
                          Primary Button
                        </button>
                        <span className="text-xs font-semibold underline decoration-2 underline-offset-4 cursor-pointer" style={{ color: data.settings.accentColor, textDecorationColor: data.settings.accentColor }}>
                          Text Link
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold" style={{ backgroundColor: `${data.settings.accentColor}15`, color: data.settings.accentColor }}>
                          Tag Badge
                        </span>
                        <h3 className="text-sm font-black tracking-tight" style={{ color: data.settings.accentColor }}>
                          Section Heading
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animation Speed */}
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-emerald-500" />
                  Animation Speed
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {animationSpeeds.map(({ id, label }) => (
                    <motion.button
                      key={id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => updateData({ settings: { ...data.settings, animationSpeed: id as any } })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        (data.settings as any).animationSpeed === id || !(data.settings as any).animationSpeed
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : 'bg-muted/40 border border-border hover:border-emerald-500/50'
                      }`}
                    >
                      <div className={`font-semibold text-xs ${(data.settings as any).animationSpeed === id ? 'text-emerald-600' : 'text-foreground'}`}>{label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Canvas Layout */}
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layout size={14} className="text-blue-500" />
                  Canvas Layout
                </h4>
                <div className="space-y-2">
                  {canvasLayouts.map(({ id, label, desc }) => (
                    <motion.button
                      key={id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => updateData({ settings: { ...data.settings, canvasLayout: id as any } })}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                        (data.settings as any).canvasLayout === id
                          ? 'bg-blue-500/20 border-2 border-blue-500'
                          : 'bg-muted/40 border border-border hover:border-blue-500/50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-foreground">{label}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                      {(data.settings as any).canvasLayout === id && (
                        <Check size={16} className="text-blue-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Layout Styles */}
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-violet-500" />
                  Section Style
                </h4>
                <div className="space-y-2">
                  {layoutOptions.map(({ id, label, desc, icon: Icon }) => (
                    <motion.button
                      key={id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => updateData({ settings: { ...data.settings, layout: id as any } })}
                      className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                        data.settings.layout === id
                          ? 'bg-gradient-to-r from-primary/10 to-violet-500/10 border-2'
                          : 'bg-muted/40 border border-border hover:border-primary/30'
                      }`}
                      style={{ borderColor: data.settings.layout === id ? data.settings.accentColor : undefined }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        data.settings.layout === id ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <Icon size={18} className={data.settings.layout === id ? 'text-white' : 'text-muted-foreground'} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{label}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                      {data.settings.layout === id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: data.settings.accentColor }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
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
