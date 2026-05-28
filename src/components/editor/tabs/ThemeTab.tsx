import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Palette, Check, Zap, Layout, Layers, Dices, Sparkles, Code } from 'lucide-react';
import { useBuilder } from '../../../context/BuilderContext';

const animationSpeeds = [
  { id: 'slow', label: 'Slow', desc: 'Gentle transitions' },
  { id: 'normal', label: 'Normal', desc: 'Balanced feel' },
  { id: 'fast', label: 'Fast', desc: 'Snappy & responsive' },
];

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

const layoutOptions = [
  { id: 'modern', label: 'Modern', desc: 'Clean with animations', icon: Sparkles },
  { id: 'minimal', label: 'Minimal', desc: 'Simple & elegant', icon: Layers },
  { id: 'brutalist', label: 'Bold', desc: 'Strong & distinctive', icon: Code },
];

export function ThemeTab() {
  const { data, updateData } = useBuilder();
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

  return (
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
  );
}
