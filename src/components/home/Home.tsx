import React from 'react';
import { motion } from 'motion/react';
import { useBuilder, PortfolioData, ProjectItem, defaultProjects } from '../../context/BuilderContext';
import { Plus, Code, Palette, Laptop, Trophy, Users, BookOpen, Camera, LayoutGrid, Blocks, Cpu, ShoppingCart, Shield } from 'lucide-react';

const templates: { id: string; title: string; icon: any; color: string; data: PortfolioData }[] = [
  {
    id: 'dev-modern',
    title: 'Software Engineer',
    icon: Code,
    color: 'from-blue-500 to-indigo-500',
    data: {
      user: { 
        name: 'Alex Chen', 
        role: 'Full Stack Engineer', 
        bio: 'Building scalable systems and creating intuitive web experiences.' 
      },
      settings: { theme: 'dark', layout: 'modern' }
    }
  },
  {
    id: 'designer',
    title: 'UX/UI Designer',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    data: {
      user: { 
        name: 'Sarah Miller', 
        role: 'Product Designer', 
        bio: 'Crafting human-centric interfaces with a focus on motion design and accessibility.' 
      },
      settings: { theme: 'light', layout: 'minimal' }
    }
  },
  {
    id: 'minimalist',
    title: 'Minimalist Creator',
    icon: Laptop,
    color: 'from-emerald-500 to-teal-500',
    data: {
      user: { 
        name: 'Jordan Lee', 
        role: 'Digital Creator', 
        bio: 'Documenting my journey through code and design. Exploring minimalism in tech.' 
      },
      settings: { theme: 'dark', layout: 'brutalist' }
    }
  },
  {
    id: 'hackathon',
    title: 'Hackathon Project',
    icon: Trophy,
    color: 'from-amber-400 to-orange-500',
    data: {
      user: { 
        name: 'EcoSync Team', 
        role: 'Winner @ GlobalHack', 
        bio: 'An AI-powered IoT solution built in 48 hours to optimize campus energy consumption.' 
      },
      settings: { theme: 'dark', layout: 'modern' }
    }
  },
  {
    id: 'club',
    title: 'College Club',
    icon: Users,
    color: 'from-violet-500 to-fuchsia-500',
    data: {
      user: { 
        name: 'Robotics Society', 
        role: 'University Tech Org', 
        bio: 'Building autonomous rovers and fostering a community of hardware enthusiasts since 2021.' 
      },
      settings: { theme: 'light', layout: 'modern' }
    }
  },
  {
    id: 'academic',
    title: 'Academic / Research',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-600',
    data: {
      user: { 
        name: 'Elena Rostova', 
        role: 'ML Researcher', 
        bio: 'Publishing research on neuro-symbolic AI and exploring real-world impact applications.' 
      },
      settings: { theme: 'light', layout: 'minimal' }
    }
  },
  {
    id: 'photography',
    title: 'Photography / Arts',
    icon: Camera,
    color: 'from-stone-500 to-neutral-800',
    data: {
      user: { 
        name: 'Marcus Lens', 
        role: 'Event Photographer', 
        bio: 'Capturing candid moments on campus. Available for graduation shoots and local events.' 
      },
      settings: { theme: 'dark', layout: 'minimal' }
    }
  }
];

const prebuiltProjects: { id: string; project: Omit<ProjectItem, 'id'>, icon: any }[] = [
  {
    id: 'proj-saas',
    icon: LayoutGrid,
    project: {
      title: 'B2B SaaS Dashboard',
      desc: 'A full-featured analytics dashboard featuring real-time charts, user management, and dark mode toggles.',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      tags: ['React', 'Full Stack', 'Dashboard']
    }
  },
  {
    id: 'proj-ecommerce',
    icon: ShoppingCart,
    project: {
      title: 'E-Commerce Storefront',
      desc: 'High-conversion shopping experience with Next.js, Stripe checkout, and headless CMS integration.',
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      tags: ['Next.js', 'E-Commerce']
    }
  },
  {
    id: 'proj-ai',
    icon: Cpu,
    project: {
      title: 'AI Image Generator',
      desc: 'Prompt-based image generation tool wired into the DALL-E API with a custom Pinterest-style masonry grid.',
      color: 'bg-purple-50 dark:bg-purple-900/20',
      tags: ['AI', 'API', 'Frontend']
    }
  },
  {
    id: 'proj-social',
    icon: Shield,
    project: {
      title: 'Blockchain Auth Service',
      desc: 'A secure Web3 authentication flow using MetaMask and Ethereum smart contracts.',
      color: 'bg-orange-50 dark:bg-orange-900/20',
      tags: ['Web3', 'Security']
    }
  }
];

export function Home({ onNavigate }: { onNavigate: () => void }) {
  const { data, updateData } = useBuilder();

  const handleSelectTemplate = (templateData?: PortfolioData) => {
    if (templateData) {
      updateData(templateData);
    }
    onNavigate();
  };

  const handleAddPrebuiltProject = (project: Omit<ProjectItem, 'id'>) => {
    // Merge the new project with the current portfolio data
    const currentProjects = data.projects || defaultProjects;
    const newProject: ProjectItem = { ...project, id: Date.now() }; // ensuring unique ID
    
    // Add it to the front of the list
    updateData({ projects: [newProject, ...currentProjects] });
    onNavigate();
  };

  return (
    <div className="min-h-screen bg-transparent w-full p-6 md:p-12 overflow-y-auto z-10 relative">
      <div className="max-w-6xl mx-auto space-y-16 pb-20">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-[20px] tracking-tight text-foreground">
            <div className="w-6 h-6 rounded-md bg-primary shadow-sm" />
            FlowSite
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-glass border border-border flex items-center justify-center font-bold text-sm text-foreground shadow-sm backdrop-blur-md">
              SG
            </div>
          </div>
        </header>

        {/* Templates Section */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Start creating</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose a pre-built template to jumpstart your portfolio, or start with a blank canvas to build from scratch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blank Canvas */}
            <motion.button 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              onClick={() => handleSelectTemplate()}
              className="group flex flex-col items-center justify-center bg-glass backdrop-blur-[30px] border border-border rounded-2xl p-8 aspect-[4/3] sm:aspect-square hover:bg-white/50 dark:hover:bg-black/50 transition-all text-center h-full shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1C1C1E] flex items-center justify-center mb-6 border border-border shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <Plus size={24} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Blank Canvas</h3>
              <p className="text-sm text-muted-foreground mt-2">Start fresh with default settings</p>
            </motion.button>

            {/* Templates */}
            {templates.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <motion.button
                  key={tpl.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 * (i + 2) }}
                  onClick={() => handleSelectTemplate(tpl.data)}
                  className="group relative flex flex-col text-left bg-glass backdrop-blur-[30px] border border-border rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 h-full shadow-sm"
                >
                  <div className={`h-36 sm:h-40 xl:h-44 bg-gradient-to-br ${tpl.color} relative overflow-hidden w-full flex-shrink-0`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <Icon size={80} className="absolute -bottom-4 -right-4 text-white/20 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col bg-white/50 dark:bg-[#1C1C1E]/50">
                    <h3 className="font-bold text-lg text-foreground">{tpl.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{tpl.data.user.bio}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Pre-built Projects Section */}
        <div className="pt-8 border-t border-border/50">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Pre-built Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Need inspiration? Add a diverse, pre-configured project directly to your portfolio. It's fully editable once inside the builder.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prebuiltProjects.map((pProj, i) => {
              const Icon = pProj.icon;
              return (
                <motion.button
                  key={pProj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => handleAddPrebuiltProject(pProj.project)}
                  className={`group relative flex flex-col text-left ${pProj.project.color} border border-border/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 shadow-sm p-6`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-black/40 flex items-center justify-center mb-6 border border-border/30 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{pProj.project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">
                    {pProj.project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {pProj.project.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold tracking-wide uppercase px-2 py-1 bg-white/50 dark:bg-black/40 rounded-md text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
