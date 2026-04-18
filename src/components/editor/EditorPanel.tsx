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
