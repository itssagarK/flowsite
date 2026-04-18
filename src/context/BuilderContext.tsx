import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SectionLayout = 'modern' | 'minimal' | 'brutalist';
export type WebsiteType = 'portfolio' | 'college' | 'business' | 'app';

// Project item for portfolios
export interface ProjectItem {
  id: number;
  title: string;
  desc: string;
  color: string;
  tags: string[];
  image?: string;
  link?: string;
  featured?: boolean;
}

// For college projects
export interface CollegeProjectItem {
  id: number;
  title: string;
  course: string;
  semester: string;
  desc: string;
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
  award?: string;
}

// For business websites
export interface ServiceItem {
  id: number;
  title: string;
  desc: string;
  icon: string;
  features: string[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  email?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image?: string;
}

// For web apps
export interface FeatureItem {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
}

// Skill item
export interface SkillItem {
  id: number;
  name: string;
  level: number;
  category?: string;
}

// Experience item
export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  current?: boolean;
}

// Social links
export interface SocialLink {
  platform: 'github' | 'twitter' | 'linkedin' | 'email' | 'website' | 'instagram';
  url: string;
}

// Portfolio Data
export interface PortfolioData {
  websiteType: WebsiteType;
  user: {
    name: string;
    role: string;
    bio: string;
    email?: string;
    location?: string;
    avatar?: string;
    tagline?: string;
  };
  settings: {
    theme: 'light' | 'dark';
    layout: SectionLayout;
    accentColor: string;
  };
  // Portfolio specific
  projects?: ProjectItem[];
  skills?: SkillItem[];
  experience?: ExperienceItem[];
  socialLinks?: SocialLink[];
  hero?: {
    tagline?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  // College specific
  collegeProjects?: CollegeProjectItem[];
  education?: {
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }[];
  // Business specific
  services?: ServiceItem[];
  team?: TeamMember[];
  testimonials?: Testimonial[];
  stats?: { label: string; value: string }[];
  // App specific
  appFeatures?: FeatureItem[];
  pricing?: PricingPlan[];
  faqs?: { question: string; answer: string }[];
}

// Default portfolio projects
export const defaultProjects: ProjectItem[] = [
  { id: 1, title: 'Campus Event App', desc: 'A full-stack mobile app built for organizing and ticketing college fests.', color: 'bg-indigo-50 dark:bg-indigo-900/20', tags: ['Mobile', 'Full Stack'], featured: true },
  { id: 2, title: 'HackMIT Winner 2025', desc: 'AI-powered study assistant built in 48 hours using Gemini API and React.', color: 'bg-amber-50 dark:bg-amber-900/20', tags: ['AI', 'Hackathon'] },
  { id: 3, title: 'React UI Library', desc: 'An open-source accessible component library with 1k+ stars on GitHub.', color: 'bg-blue-50 dark:bg-blue-900/20', tags: ['Frontend', 'Open Source'] },
];

// Default college projects
export const defaultSkills: SkillItem[] = [
  { id: 1, name: 'React', level: 90, category: 'Frontend' },
  { id: 2, name: 'TypeScript', level: 85, category: 'Languages' },
  { id: 3, name: 'Node.js', level: 80, category: 'Backend' },
  { id: 4, name: 'Python', level: 75, category: 'Backend' },
  { id: 5, name: 'UI/UX Design', level: 70, category: 'Design' },
];

export const defaultExperience: ExperienceItem[] = [
  { id: 1, title: 'Frontend Developer', company: 'Tech Corp', period: '2023 - Present', description: 'Building scalable web applications.', current: true },
  { id: 2, title: 'Intern', company: 'StartupXYZ', period: '2022 - 2023', description: 'Full-stack development.', current: false },
];

export const defaultCollegeProjects: CollegeProjectItem[] = [
  { id: 1, title: 'Smart Attendance System', course: 'Computer Networks', semester: 'Fall 2024', desc: 'IoT-based attendance tracking using RFID and cloud storage.', technologies: ['Python', 'Arduino', 'Cloud'] },
  { id: 2, title: 'Health Monitoring App', course: 'Mobile Development', semester: 'Spring 2024', desc: 'Real-time health vitals monitoring with Flutter and Firebase.', technologies: ['Flutter', 'Firebase'], award: 'Best Project' },
];

// Default services
export const defaultServices: ServiceItem[] = [
  { id: 1, title: 'Web Development', desc: 'Custom websites built with modern technologies', icon: 'code', features: ['Responsive Design', 'SEO Optimized', 'Fast Loading'] },
  { id: 2, title: 'App Development', desc: 'Native and cross-platform mobile applications', icon: 'smartphone', features: ['iOS & Android', 'API Integration', 'App Store Submit'] },
  { id: 3, title: 'UI/UX Design', desc: 'User-centered design solutions', icon: 'palette', features: ['Wireframes', 'Prototypes', 'Design Systems'] },
];

// Default app features
export const defaultAppFeatures: FeatureItem[] = [
  { id: 1, title: 'Real-time Sync', desc: 'Data synchronization across all devices', icon: 'sync' },
  { id: 2, title: 'Analytics Dashboard', desc: 'Comprehensive insights and reporting', icon: 'chart' },
  { id: 3, title: 'Cloud Storage', desc: 'Secure cloud backup and storage', icon: 'cloud' },
];

const getDefaultData = (websiteType: WebsiteType): PortfolioData => {
  const baseData = {
    settings: {
      theme: 'dark' as const,
      layout: 'modern' as SectionLayout,
      accentColor: '#6366F1',
    },
    user: {
      name: '',
      role: '',
      bio: '',
      email: '',
      location: '',
    },
  };

  switch (websiteType) {
    case 'portfolio':
      return {
        ...baseData,
        websiteType: 'portfolio',
        projects: defaultProjects,
        skills: [
          { id: 1, name: 'React', level: 90, category: 'Frontend' },
          { id: 2, name: 'TypeScript', level: 85, category: 'Languages' },
          { id: 3, name: 'Node.js', level: 80, category: 'Backend' },
        ],
        experience: [
          { id: 1, title: 'Developer', company: 'Tech Corp', period: '2023 - Present', description: 'Building amazing products', current: true },
        ],
      };
    case 'college':
      return {
        ...baseData,
        websiteType: 'college',
        collegeProjects: defaultCollegeProjects,
        education: [
          { institution: 'Your University', degree: 'Computer Science', year: '2024-2028', gpa: '3.8' },
        ],
        projects: defaultProjects,
      };
    case 'business':
      return {
        ...baseData,
        websiteType: 'business',
        user: { name: 'Your Business', role: '', bio: 'We provide excellent services to our customers', tagline: 'Your Trusted Partner' },
        services: defaultServices,
        stats: [
          { label: 'Clients', value: '100+' },
          { label: 'Projects', value: '200+' },
          { label: 'Years', value: '5+' },
        ],
      };
    case 'app':
      return {
        ...baseData,
        websiteType: 'app',
        user: { name: 'App Name', role: 'Your App', bio: 'The best solution for your needs', tagline: 'Simple. Powerful. Fast.' },
        appFeatures: defaultAppFeatures,
        pricing: [
          { id: 1, name: 'Free', price: '$0', period: 'forever', features: ['Basic features', '1 user', 'Community support'] },
          { id: 2, name: 'Pro', price: '$19', period: 'month', features: ['All features', '10 users', 'Priority support'], featured: true },
        ],
      };
    default:
      return { ...baseData, websiteType: 'portfolio' };
  }
};

interface BuilderContextType {
  data: PortfolioData;
  websiteType: WebsiteType;
  setWebsiteType: (type: WebsiteType) => void;
  updateData: (newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
  updateUser: (userUpdates: Partial<PortfolioData['user']>) => void;
  updateProject: (id: number, projectUpdates: Partial<ProjectItem>) => void;
  updateCollegeProject: (id: number, projectUpdates: Partial<CollegeProjectItem>) => void;
  updateService: (id: number, serviceUpdates: Partial<ServiceItem>) => void;
  updateSkill: (id: number, skillUpdates: Partial<SkillItem>) => void;
  updateExperience: (id: number, expUpdates: Partial<ExperienceItem>) => void;
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  removeProject: (id: number) => void;
  addCollegeProject: (project: Omit<CollegeProjectItem, 'id'>) => void;
  removeCollegeProject: (id: number) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  removeService: (id: number) => void;
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  removeSkill: (id: number) => void;
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  removeExperience: (id: number) => void;
  toggleTheme: () => void;
  scanImage: (imageUrl: string) => Promise<void>;
  exportCode: () => string;
  resetToBlank: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(getDefaultData('portfolio'));
  const [websiteType, setWebsiteTypeState] = useState<WebsiteType>('portfolio');

  // Apply theme and color to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (data.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.setProperty('--primary', data.settings.accentColor);
  }, [data.settings.theme, data.settings.accentColor]);

  const setWebsiteType = useCallback((type: WebsiteType) => {
    setWebsiteTypeState(type);
    setData(getDefaultData(type));
  }, []);

  const updateData = useCallback((newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => {
    setData((prev) => {
      const merged = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      return merged;
    });
  }, []);

  const updateUser = useCallback((userUpdates: Partial<PortfolioData['user']>) => {
    setData((prev) => ({
      ...prev,
      user: { ...prev.user, ...userUpdates },
    }));
  }, []);

  const updateProject = useCallback((id: number, projectUpdates: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects?.map(p => p.id === id ? { ...p, ...projectUpdates } : p) || []
    }));
  }, []);

  const updateCollegeProject = useCallback((id: number, projectUpdates: Partial<CollegeProjectItem>) => {
    setData((prev) => ({
      ...prev,
      collegeProjects: prev.collegeProjects?.map(p => p.id === id ? { ...p, ...projectUpdates } : p) || []
    }));
  }, []);

  const updateService = useCallback((id: number, serviceUpdates: Partial<ServiceItem>) => {
    setData((prev) => ({
      ...prev,
      services: prev.services?.map(s => s.id === id ? { ...s, ...serviceUpdates } : s) || []
    }));
  }, []);

  const updateSkill = useCallback((id: number, skillUpdates: Partial<SkillItem>) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills?.map(s => s.id === id ? { ...s, ...skillUpdates } : s) || []
    }));
  }, []);

  const updateExperience = useCallback((id: number, expUpdates: Partial<ExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience?.map(e => e.id === id ? { ...e, ...expUpdates } : e) || []
    }));
  }, []);

  const addProject = useCallback((project: Omit<ProjectItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      projects: [{ ...project, id: Date.now() }, ...(prev.projects || [])],
    }));
  }, []);

  const removeProject = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects?.filter(p => p.id !== id) || [],
    }));
  }, []);

  const addCollegeProject = useCallback((project: Omit<CollegeProjectItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      collegeProjects: [{ ...project, id: Date.now() }, ...(prev.collegeProjects || [])],
    }));
  }, []);

  const removeCollegeProject = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      collegeProjects: prev.collegeProjects?.filter(p => p.id !== id) || [],
    }));
  }, []);

  const addService = useCallback((service: Omit<ServiceItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      services: [{ ...service, id: Date.now() }, ...(prev.services || [])],
    }));
  }, []);

  const removeService = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      services: prev.services?.filter(s => s.id !== id) || [],
    }));
  }, []);

  const addSkill = useCallback((skill: Omit<SkillItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      skills: [{ ...skill, id: Date.now() }, ...(prev.skills || [])],
    }));
  }, []);

  const removeSkill = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills?.filter(s => s.id !== id) || [],
    }));
  }, []);

  const addExperience = useCallback((exp: Omit<ExperienceItem, 'id'>) => {
    setData((prev) => ({
      ...prev,
      experience: [{ ...exp, id: Date.now() }, ...(prev.experience || [])],
    }));
  }, []);

  const removeExperience = useCallback((id: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience?.filter(e => e.id !== id) || [],
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  }, []);

  const scanImage = useCallback(async (imageUrl: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setData((prev) => ({
          ...prev,
          user: { ...prev.user, avatar: imageUrl },
        }));
        resolve();
      }, 1500);
    });
  }, []);

  const exportCode = useCallback(() => {
    const { user, settings, projects, skills, experience, collegeProjects, services, stats, appFeatures, pricing, websiteType } = data;
    const isDark = settings.theme === 'dark';

    // Generate code based on website type
    let sections = '';

    if (websiteType === 'portfolio' || websiteType === 'college') {
      sections = `
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>${user.name}</h1>
      <h2>${user.role}</h2>
      <p>${user.bio}</p>
      <a href="#projects" class="btn">View Work</a>
    </div>
  </section>

  <!-- Projects Section -->
  <section id="projects" class="projects">
    <div class="container">
      <h2>${websiteType === 'college' ? 'Academic Projects' : 'Selected Projects'}</h2>
      <div class="projects-grid">
        ${(projects || []).map(p => `
        <div class="project-card">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    } else if (websiteType === 'business') {
      sections = `
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>${user.tagline || user.name}</h1>
      <p>${user.bio}</p>
      <a href="#services" class="btn">Our Services</a>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        ${(stats || []).map(s => `
        <div class="stat-item">
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="services">
    <div class="container">
      <h2>Services</h2>
      <div class="services-grid">
        ${(services || []).map(s => `
        <div class="service-card">
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <ul>${s.features.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    } else if (websiteType === 'app') {
      sections = `
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>${user.name}</h1>
      <p>${user.tagline}</p>
      <p>${user.bio}</p>
      <div class="cta-buttons">
        <a href="#features" class="btn">Get Started</a>
        <a href="#pricing" class="btn btn-outline">View Pricing</a>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="features">
    <div class="container">
      <h2>Features</h2>
      <div class="features-grid">
        ${(appFeatures || []).map(f => `
        <div class="feature-card">
          <h3>${f.title}</h3>
          <p>${f.desc}</p>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="pricing">
    <div class="container">
      <h2>Pricing</h2>
      <div class="pricing-grid">
        ${(pricing || []).map(p => `
        <div class="pricing-card${p.featured ? ' featured' : ''}">
          <h3>${p.name}</h3>
          <div class="price">${p.price}<span>/${p.period}</span></div>
          <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <a href="#" class="btn">Choose Plan</a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.name} - ${websiteType.charAt(0).toUpperCase() + websiteType.slice(1)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${settings.accentColor};
      --background: ${isDark ? '#030712' : '#FAFBFC'};
      --foreground: ${isDark ? '#F8FAFC' : '#0F172A'};
      --muted: ${isDark ? 'rgba(248, 250, 252, 0.04)' : 'rgba(15, 23, 42, 0.04)'};
      --muted-foreground: ${isDark ? '#94A3B8' : '#64748B'};
      --border: ${isDark ? 'rgba(248, 250, 252, 0.1)' : 'rgba(15, 23, 42, 0.1)'};
      --card: ${isDark ? '#111827' : '#FFFFFF'};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; background: var(--background); color: var(--foreground); line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    section { padding: 6rem 0; }
    h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1rem; }
    h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 2rem; }
    .hero { min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; background: ${isDark ? 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)' : 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)'}; }
    .hero h2 { color: var(--primary); font-weight: 500; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; color: var(--muted-foreground); max-width: 600px; margin: 0 auto 2rem; }
    .btn { display: inline-block; padding: 1rem 2rem; background: var(--primary); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: transform 0.2s; }
    .btn:hover { transform: translateY(-2px); }
    .btn-outline { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
    .projects-grid, .services-grid, .features-grid, .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .project-card, .service-card, .feature-card, .pricing-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; }
    .pricing-card.featured { border-color: var(--primary); }
    .stats { background: var(--muted); }
    .stats-grid { display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap; }
    .stat-value { font-size: 3rem; font-weight: 800; color: var(--primary); }
    .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; }
    .tag { font-size: 0.75rem; padding: 0.25rem 0.75rem; background: var(--muted); border-radius: 20px; }
    .price { font-size: 2.5rem; font-weight: 700; }
    .price span { font-size: 1rem; font-weight: 400; }
    .pricing-card ul { list-style: none; margin: 1.5rem 0; }
    .pricing-card li { padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
    .cta-buttons { display: flex; gap: 1rem; justify-content: center; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: fadeIn 0.6s ease-out forwards; }
  </style>
</head>
<body>${sections}
</body>
</html>`;
  }, [data]);

  const resetToBlank = useCallback(() => {
    setData({
      ...getDefaultData(websiteType),
      websiteType,
    });
  }, [websiteType]);

  return (
    <BuilderContext.Provider value={{
      data,
      websiteType,
      setWebsiteType,
      updateData,
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
      toggleTheme,
      scanImage,
      exportCode,
      resetToBlank,
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
