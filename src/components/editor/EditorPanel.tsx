import React, { useState, useRef } from 'react';
import { useBuilder, WebsiteType } from '../../context/BuilderContext';
import { User, FolderOpen, Palette, Scan, Image, Plus, Trash2, GraduationCap, Building2, AppWindow, Code, Layers, Sparkles, Mail, MapPin, Settings2, X, ChevronDown, GripVertical, Edit3, Zap, Moon, Sun, Upload, Video, Type, Layout, Move, Sliders, Eye, Clock, Wand2, ChevronRight, Check, Briefcase } from 'lucide-react';
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
  const [sectionExpand, setSectionExpand] = useState<string | null>('hero');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const TypeIcon = typeIcons[websiteType];

  // Avatar upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateUser({ avatar: imageUrl });
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
              {/* Website Sections Toggle */}
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-blue-500" />
                  <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">Website Sections</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Toggle sections to show/hide on your site</p>
                <div className="space-y-2">
                  {[
                    { id: 'hero', label: 'Hero Section', icon: Layout },
                    { id: 'projects', label: 'Projects', icon: FolderOpen },
                    { id: 'skills', label: 'Skills', icon: Sparkles },
                    { id: 'experience', label: 'Experience', icon: Briefcase },
                    { id: 'services', label: 'Services', icon: Building2 },
                    { id: 'contact', label: 'Contact', icon: Mail },
                  ].map((section) => {
                    const Icon = section.icon;
                    const isEnabled = (data.settings as any).visibleSections?.[section.id] !== false;
                    return (
                      <motion.div
                        key={section.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const currentSections = (data.settings as any).visibleSections || {};
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
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                          isEnabled ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-muted/40 border border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={isEnabled ? 'text-emerald-500' : 'text-muted-foreground'} />
                          <span className={`text-sm ${isEnabled ? 'text-foreground' : 'text-muted-foreground'}`}>{section.label}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${isEnabled ? 'bg-emerald-500' : 'bg-muted'}`}>
                          <motion.div
                            animate={{ x: isEnabled ? 20 : 2 }}
                            className="absolute top-1 w-3 h-3 rounded-full bg-white"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

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
    </div>
  );
}
