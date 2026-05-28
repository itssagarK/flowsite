import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, Upload, FileText, X, Sparkles, Loader2, Check, AlertCircle, 
  User, Briefcase, Edit3, Mail, MapPin, Layout 
} from 'lucide-react';
import { useBuilder } from '../../../context/BuilderContext';
import { AvatarEditor } from '../AvatarEditor';
import { isGeminiConfigured } from '../../../lib/gemini';
import { toast } from 'sonner';

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

const statusMessages = ["Reading your profile…", "Extracting skills…", "Parsing experience…", "Writing bio…"];

export function ProfileTab() {
  const { data, websiteType, updateUser, updateData, scanImage, scanStatus, scanError } = useBuilder();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cyclingStatusIndex, setCyclingStatusIndex] = useState(0);

  const isScanning = scanStatus === 'scanning';

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
      toast.success('AI Scanner complete!', {
        description: 'Your profile has been successfully parsed and filled.',
      });
    } else if (scanStatus === 'error') {
      toast.error('AI Scanner failed', {
        description: scanError || 'Please try again with a clearer image.',
      });
    }
  }, [scanStatus, scanError]);

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
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      {/* Avatar Editor Upgrade (Part 6C) */}
      <div className="p-4 bg-muted/30 rounded-xl border border-border">
        <AvatarEditor />
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
  );
}
