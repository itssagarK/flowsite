import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, Trash2, Plus, Layout, Zap, User, GraduationCap, 
  Mail, Briefcase, Building2, Sparkles, ChevronDown, Eye, EyeOff, GripVertical, Palette, Sliders, Check
} from 'lucide-react';
import { useBuilder } from '../../../context/BuilderContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

export function ContentTab() {
  const {
    data,
    websiteType,
    updateUser,
    updateProject,
    updateService,
    updateSkill,
    updateExperience,
    addProject,
    removeProject,
    addService,
    removeService,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    updateData,
  } = useBuilder();

  const [sectionExpand, setSectionExpand] = useState<string | null>('hero');

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

  const sectionOrder = data.settings.sectionOrder || ['hero', 'projects', 'skills', 'experience', 'services', 'contact', 'stats', 'team', 'pricing', 'education', 'about'];
  const orderedSections = [...sections].sort((a, b) => sectionOrder.indexOf(a.id) - sectionOrder.indexOf(b.id));

  return (
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
  );
}
