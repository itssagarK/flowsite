<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import { useBuilder, WebsiteType } from '../../context/BuilderContext';
import { User, FolderOpen, Palette, Scan, Image, Plus, Trash2, GraduationCap, Building2, AppWindow, Code, Layers, Sparkles, Mail, MapPin, Settings2, X, ChevronDown, GripVertical, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

export function EditorPanel() {
  const {
    data,
    websiteType,
    updateUser,
    updateProject,
    updateCollegeProject,
    updateService,
    addProject,
    removeProject,
    addCollegeProject,
    removeCollegeProject,
    addService,
    removeService,
    updateData,
    scanImage
  } = useBuilder();

  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [isScanning, setIsScanning] = useState(false);
  const [projectExpand, setProjectExpand] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TypeIcon = typeIcons[websiteType];

  const colorOptions = [
    { color: '#6366F1', name: 'Indigo' },
    { color: '#8B5CF6', name: 'Violet' },
    { color: '#EC4899', name: 'Pink' },
    { color: '#F97316', name: 'Orange' },
    { color: '#10B981', name: 'Emerald' },
    { color: '#06B6D4', name: 'Cyan' },
    { color: '#F59E0B', name: 'Amber' },
    { color: '#EF4444', name: 'Red' },
  ];

  const layoutOptions = [
    { id: 'modern', label: 'Modern', desc: 'Clean with animations', icon: Sparkles },
    { id: 'minimal', label: 'Minimal', desc: 'Simple & elegant', icon: Layers },
    { id: 'brutalist', label: 'Bold', desc: 'Strong & distinctive', icon: Code },
  ];

  const handleScanImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const imageUrl = URL.createObjectURL(file);
    try {
      await scanImage(imageUrl);
    } finally {
      setIsScanning(false);
    }
  };

  const projects = data.projects || [];
  const collegeProjects = data.collegeProjects || [];
  const services = data.services || [];

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
              {/* AI Scanner */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Scan size={14} className="text-primary" />
                  <h4 className="font-semibold text-xs text-foreground">AI Image Scanner</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Upload an image to auto-generate content</p>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleScanImage} className="hidden" />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isScanning ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Scan size={16} />
                    </motion.div>
                  ) : (
                    <Image size={16} />
                  )}
                  {isScanning ? 'Analyzing...' : 'Upload Image'}
                </motion.button>
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

              {/* Tagline */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-500" />
                  Tagline
                </label>
                <input
                  type="text"
                  value={data.user.tagline || ''}
                  onChange={(e) => updateUser({ tagline: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your tagline (optional)"
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
            </motion.div>
          )}

          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              {/* Projects (Portfolio/College) */}
              {(websiteType === 'portfolio' || websiteType === 'college') && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={14} className="text-emerald-500" />
                      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                        {websiteType === 'college' ? 'College Projects' : 'Projects'}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full">
                        {projects.length}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addProject({ title: 'New Project', desc: 'Description', color: 'bg-muted', tags: ['New'] })}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-muted/40 border border-border rounded-xl overflow-hidden"
                        >
                          {/* Project Header */}
                          <div
                            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/60 transition-colors"
                            onClick={() => setProjectExpand(projectExpand === project.id ? null : project.id)}
                          >
                            <GripVertical size={14} className="text-muted-foreground/50" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{project.title || 'Untitled Project'}</p>
                              <p className="text-xs text-muted-foreground truncate">{project.desc || 'No description'}</p>
                            </div>
                            <motion.div animate={{ rotate: projectExpand === project.id ? 180 : 0 }}>
                              <ChevronDown size={14} className="text-muted-foreground" />
                            </motion.div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {projectExpand === project.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-3 pb-3 space-y-2"
                              >
                                <input
                                  type="text"
                                  value={project.title}
                                  onChange={(e) => updateProject(project.id, { title: e.target.value })}
                                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                  placeholder="Project title"
                                />
                                <textarea
                                  value={project.desc}
                                  onChange={(e) => updateProject(project.id, { desc: e.target.value })}
                                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs resize-none"
                                  rows={2}
                                  placeholder="Description"
                                />
                                <input
                                  type="text"
                                  value={project.tags.join(', ')}
                                  onChange={(e) => updateProject(project.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
                                  placeholder="Tags (comma separated)"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => removeProject(project.id)}
                                  className="w-full py-2 bg-red-500/10 text-red-600 text-xs font-medium rounded-lg flex items-center justify-center gap-1 hover:bg-red-500/20"
                                >
                                  <Trash2 size={12} />
                                  Remove Project
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {projects.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <FolderOpen size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No projects yet</p>
                        <p className="text-xs">Click + to add your first project</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Services (Business) */}
              {websiteType === 'business' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-amber-500" />
                      <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Services</h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 rounded-full">{services.length}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addService({ title: 'New Service', desc: 'Description', icon: 'code', features: ['Feature'] })}
                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {services.map((service) => (
                      <motion.div
                        key={service.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-muted/40 border border-border rounded-xl mb-2 group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => updateService(service.id, { title: e.target.value })}
                            className="flex-1 bg-transparent font-medium text-sm focus:outline-none"
                            placeholder="Service name"
                          />
                          <button onClick={() => removeService(service.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <textarea
                          value={service.desc}
                          onChange={(e) => updateService(service.id, { desc: e.target.value })}
                          className="w-full bg-transparent text-xs resize-none focus:outline-none"
                          rows={2}
                          placeholder="Service description"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Features (App) */}
              {websiteType === 'app' && (
                <div className="p-4 bg-muted/40 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AppWindow size={14} className="text-violet-500" />
                    <h4 className="font-semibold text-xs text-foreground">App Features</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Features are automatically populated based on your website data.</p>
                </div>
              )}
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
              {/* Accent Colors */}
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Palette size={14} className="text-violet-500" />
                  Accent Color
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map(({ color, name }) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateData({ settings: { ...data.settings, accentColor: color } })}
                      style={{ backgroundColor: color }}
                      className={`w-full aspect-square rounded-xl border-2 cursor-pointer transition-all ${
                        data.settings.accentColor === color ? 'border-foreground scale-105 shadow-lg' : 'border-transparent hover:border-white/50'
                      }`}
                      title={name}
                    />
                  ))}
                </div>
              </div>

              {/* Layout Styles */}
              <div>
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-violet-500" />
                  Layout Style
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
    </div>
  );
}
=======
import React from 'react';
import { useBuilder, defaultProjects } from '../../context/BuilderContext';
import { Settings2, Layout, Type, Palette, FolderOpen, Upload } from 'lucide-react';

export function EditorPanel() {
  const { data, updateUser, updateProject } = useBuilder();
  const { name, role, bio } = data.user;
  const projects = data.projects || defaultProjects;

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use URL.createObjectURL to preview the image without needing a backend
    const imageUrl = URL.createObjectURL(file);
    updateProject(id, { image: imageUrl });
  };

  return (
    <div className="w-[300px] border-r border-border bg-glass backdrop-blur-[30px] shrink-0 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-[11px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-4">Identity</h3>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-medium">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => updateUser({ name: e.target.value })}
              className="flex w-full rounded-lg border border-border bg-white/50 dark:bg-black/50 px-3 py-2.5 text-[14px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role" className="block text-xs font-medium">Current Role</label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => updateUser({ role: e.target.value })}
              className="flex w-full rounded-lg border border-border bg-white/50 dark:bg-black/50 px-3 py-2.5 text-[14px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
              placeholder="E.g. Frontend Developer"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-xs font-medium">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => updateUser({ bio: e.target.value })}
              className="flex min-h-[80px] w-full rounded-lg border border-border bg-white/50 dark:bg-black/50 px-3 py-2.5 text-[14px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y shadow-sm"
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] uppercase tracking-[1px] text-muted-foreground font-semibold">Projects</h3>
        </div>
        
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="p-3 bg-white/30 dark:bg-black/30 border border-border rounded-lg space-y-3">
              <div className="space-y-2">
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject(project.id, { title: e.target.value })}
                  className="flex w-full rounded-md border border-border bg-white/50 dark:bg-black/50 px-2.5 py-1.5 text-[13px] font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-sm"
                  placeholder="Project Title"
                />
                <textarea
                  value={project.desc}
                  onChange={(e) => updateProject(project.id, { desc: e.target.value })}
                  className="flex w-full rounded-md border border-border bg-white/50 dark:bg-black/50 px-2.5 py-1.5 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y min-h-[50px] shadow-sm"
                  placeholder="Short description of the project"
                />
              </div>
              
              <div className="relative mt-2">
                {project.image ? (
                  <div className="h-20 w-full rounded-md overflow-hidden relative group border border-border/30">
                    <img src={project.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer text-xs text-white  bg-black/50 px-2 py-1 rounded">
                        Change Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(project.id, e)} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="h-10 w-full rounded-md border border-dashed border-border/70 flex items-center justify-center bg-white/10 dark:bg-black/10 hover:bg-white/30 transition-colors">
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 w-full h-full text-xs text-muted-foreground">
                      <Upload size={12} />
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(project.id, e)} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 border-b border-border/50">
        <h3 className="text-[11px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-4">Visual Theme</h3>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium">Accent Color</label>
            <div className="flex gap-2">
              {['#007AFF', '#FF2D55', '#34C759', '#AF52DE', '#FF9500'].map(color => (
                <div 
                  key={color}
                  onClick={() => updateData({ settings: { ...data.settings, accentColor: color } })}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${data.settings.accentColor === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-110'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-[11px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-4">Layout Style</h3>
        <div className="flex flex-col gap-2">
          {['modern', 'minimal', 'brutalist'].map(l => (
            <button 
              key={l}
              onClick={() => updateData({ settings: { ...data.settings, layout: l as any } })}
              className={`p-3 rounded-lg text-[13px] font-semibold border shadow-sm transition-all text-left capitalize ${data.settings.layout === l ? 'bg-white dark:bg-black border-border text-foreground' : 'bg-white/30 dark:bg-black/30 border-transparent text-muted-foreground hover:bg-white/50 dark:hover:bg-black/50'}`}
            >
              {l} Layout
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
>>>>>>> 20493c00627f2efebfae0ea823fca073172b044f
