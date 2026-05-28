import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { model, isGeminiConfigured } from '../lib/gemini';

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
  featured?: boolean;
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
    heroVariant?: 'centered' | 'split' | 'minimal';
    skillsVariant?: 'tags' | 'bars' | 'grid';
    accentColor: string;
    sectionOrder?: string[];
    visibleSections?: Record<string, boolean>;
    animationSpeed?: 'slow' | 'normal' | 'fast';
    canvasLayout?: 'full' | 'boxed' | 'centered';
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
      heroVariant: 'centered' as const,
      skillsVariant: 'tags' as const,
      accentColor: '#6366F1',
      sectionOrder: ['hero', 'projects', 'skills', 'experience', 'services', 'contact', 'stats', 'team', 'pricing', 'education', 'about'],
      visibleSections: {
        hero: true,
        projects: true,
        skills: true,
        experience: true,
        services: true,
        contact: true,
        stats: true,
        features: true,
        pricing: true,
        education: true,
        about: true,
        team: true,
      }
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
        skills: defaultSkills,
        experience: defaultExperience,
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
  scanImage: (file: File) => Promise<void>;
  exportCode: (options?: { 
    includeShapes?: boolean; 
    includeAnimations?: boolean; 
    minify?: boolean; 
  }) => string;
  resetToBlank: (type?: WebsiteType) => void;
  clearSavedData: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  scanStatus: 'idle' | 'scanning' | 'done' | 'error';
  scanError: string | null;
  activeDevice: 'mobile' | 'tablet' | 'desktop';
  setActiveDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Default data exported for reuse
export const DEFAULT_DATA = getDefaultData('portfolio');
const STORAGE_KEY = 'flowsite_data';

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or default
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DATA;
    } catch (e) {
      console.error('Failed to load saved data:', e);
      return DEFAULT_DATA;
    }
  });
  const [websiteType, setWebsiteTypeState] = useState<WebsiteType>(data.websiteType);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = React.useRef(true);

  // Persistence logic with debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveStatus('saved');
        // Reset to idle after 2 seconds to fade out the indicator
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Failed to save data to localStorage:', e);
        setSaveStatus('idle');
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data]);

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
    setData(prev => ({ ...prev, websiteType: type }));
  }, []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_DATA);
    setWebsiteTypeState(DEFAULT_DATA.websiteType);
  }, []);

  const updateData = useCallback((newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => {
    setData((prev) => {
      if (typeof newData === 'function') return newData(prev);
      
      const merged = { ...prev, ...newData };
      
      // Deep merge settings and user if they exist in newData
      if (newData.settings) {
        merged.settings = { ...prev.settings, ...newData.settings };
      }
      if (newData.user) {
        merged.user = { ...prev.user, ...newData.user };
      }
      
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

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  });

  const scanImage = useCallback(async (file: File) => {
    if (!isGeminiConfigured || !model) {
      setScanStatus('error');
      setScanError('Gemini API is not configured. Please check your .env.local file.');
      return;
    }

    setScanStatus('scanning');
    setScanError(null);

    try {
      const base64 = await toBase64(file);
      
      const prompt = `
You are a resume and LinkedIn profile parser. Analyze this image and extract all available information.

Return ONLY a valid JSON object with this exact structure (use empty string "" for missing fields, empty array [] for missing lists):
{
  "name": "full name",
  "role": "current job title or desired role",
  "bio": "2-3 sentence professional summary written in first person",
  "email": "email address if visible",
  "phone": "phone number if visible",
  "location": "city, country if visible",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    { "company": "", "role": "", "duration": "", "description": "" }
  ],
  "projects": [
    { "title": "", "description": "", "tech": "" }
  ],
  "education": "degree and institution if visible"
}

Return ONLY the JSON. No markdown, no explanation, no code fences.
`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: file.type
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      const parsed = JSON.parse(text);

      setData(prev => {
        const updates: any = {
          user: { ...prev.user }
        };

        if (parsed.name) updates.user.name = parsed.name;
        if (parsed.role) updates.user.role = parsed.role;
        if (parsed.bio) updates.user.bio = parsed.bio;
        if (parsed.email) updates.user.email = parsed.email;
        if (parsed.location) updates.user.location = parsed.location;

        if (parsed.skills && parsed.skills.length > 0) {
          updates.skills = parsed.skills.map((s: string, i: number) => ({
            id: Date.now() + i,
            name: s,
            level: 80
          }));
        }

        if (parsed.experience && parsed.experience.length > 0) {
          updates.experience = parsed.experience.map((e: any, i: number) => ({
            id: Date.now() + 100 + i,
            title: e.role || '',
            company: e.company || '',
            period: e.duration || '',
            description: e.description || ''
          }));
        }

        if (parsed.projects && parsed.projects.length > 0) {
          updates.projects = parsed.projects.map((p: any, i: number) => ({
            id: Date.now() + 200 + i,
            title: p.title || '',
            desc: p.description || '',
            tags: p.tech ? [p.tech] : [],
            color: 'bg-muted'
          }));
        }

        return { ...prev, ...updates };
      });

      setScanStatus('done');
    } catch (error: any) {
      console.error('Gemini scanning error:', error);
      setScanStatus('error');
      setScanError(error.message || 'Failed to scan image. Please try again.');
    }
  }, []);

  const exportCode = useCallback((options?: { 
    includeShapes?: boolean; 
    includeAnimations?: boolean; 
    minify?: boolean; 
  }) => {
    const { user, settings, projects, skills, experience, collegeProjects, services, stats, appFeatures, pricing, websiteType } = data;
    const isDark = settings.theme === 'dark';
    const layout = settings.layout || 'modern';
    const visible = settings.visibleSections || {};

    const includeShapes = options?.includeShapes !== false;
    const includeAnimations = options?.includeAnimations !== false;
    const minify = options?.minify === true;

    // Helper to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };

    const accentRgb = hexToRgb(settings.accentColor);
    const cardClass = layout === 'brutalist' ? 'brutalist-card' : layout === 'minimal' ? 'minimal-card' : 'glass-card';

    const sectionOrder = settings.sectionOrder || ['hero', 'projects', 'skills', 'experience', 'services', 'contact', 'stats', 'team', 'pricing', 'education', 'about'];

    // Generate sections dynamically based on visibility and order
    let sectionsHtml = '';

    sectionOrder.forEach(id => {
      if (visible[id] === false) return;

      if (id === 'hero') {
        const variant = settings.heroVariant || 'centered';
        if (websiteType === 'app') {
          sectionsHtml += `
  <section class="hero app-hero">
    <div class="container">
      <h1 class="gradient-heading">${user.name || 'Your App Name'}</h1>
      <p class="tagline">${user.tagline || 'Your catchy tagline'}</p>
      <p class="bio">${user.bio || 'The best solution for your needs.'}</p>
      <div class="cta-group">
        <a href="#features" class="btn">Get Started</a>
        <a href="#pricing" class="btn btn-outline">View Pricing</a>
      </div>
    </div>
  </section>`;
        } else if (variant === 'split') {
          sectionsHtml += `
  <section class="hero hero-split">
    <div class="container split-container">
      <div class="hero-content">
        <h2 class="role">${user.role || 'Professional Title'}</h2>
        <h1 class="split-name">${user.name || 'Your Name'}</h1>
        <p class="bio">${user.bio || 'Tell your story here...'}</p>
        <div class="cta-group">
          <a href="#projects" class="btn">Explore Projects</a>
        </div>
      </div>
      <div class="hero-image-wrapper">
        ${user.avatar ? `<img src="${user.avatar}" class="split-avatar" alt="${user.name}">` : `<div class="avatar-placeholder"></div>`}
      </div>
    </div>
  </section>`;
        } else if (variant === 'minimal') {
          sectionsHtml += `
  <section class="hero hero-minimal">
    <div class="container">
      <span class="label">${user.role || 'YOUR ROLE'}</span>
      <h1 class="gradient-heading minimal-name">${user.name || 'YOUR NAME'}</h1>
      <p class="minimal-bio">${user.bio || 'Tell your story here...'}</p>
      <div class="minimal-divider"></div>
      <div class="minimal-links">
        <a href="#projects">Selected Work &rarr;</a>
        <a href="#contact">Contact &rarr;</a>
      </div>
    </div>
  </section>`;
        } else {
          sectionsHtml += `
  <section class="hero hero-centered">
    <div class="container">
      ${user.avatar ? `<img src="${user.avatar}" class="avatar" alt="${user.name}">` : ''}
      <p class="label">${user.role || 'YOUR ROLE'}</p>
      <h1 class="gradient-heading">${user.name || 'Your Name'}</h1>
      <p class="bio">${user.bio || 'Tell your story here...'}</p>
      <div class="cta-group">
        <a href="#projects" class="btn">View My Work</a>
        <a href="#contact" class="btn btn-outline">Get in Touch</a>
      </div>
    </div>
  </section>`;
        }
      }

      if (id === 'projects' && (projects?.length || collegeProjects?.length)) {
        const items = websiteType === 'college' ? collegeProjects : projects;
        sectionsHtml += `
  <section id="projects" class="projects">
    <div class="container">
      <h2>${websiteType === 'college' ? 'Academic Projects' : 'Featured Projects'}</h2>
      <div class="grid">
        ${(items || []).map(p => `
        <div class="card ${cardClass} project-card">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="tags">${(p as any).tags?.map((t: string) => `<span class="tag">${t}</span>`).join('') || ''}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
      }

      if (id === 'skills' && skills?.length) {
        const variant = settings.skillsVariant || 'tags';
        let skillsHtml = '';
        if (variant === 'bars') {
          skillsHtml = `<div class="skills-bars">${skills.map(s => `<div class="skill-bar-item"><div class="skill-info"><span>${s.name}</span><span>${s.level}%</span></div><div class="skill-bar"><div class="skill-progress ${includeAnimations ? 'animate-bar' : ''}" style="--target-width: ${s.level}%${!includeAnimations ? '; width: ' + s.level + '%' : ''}"></div></div></div>`).join('')}</div>`;
        } else if (variant === 'grid') {
          skillsHtml = `<div class="skills-grid">${skills.map(s => `<div class="card ${cardClass} skill-card"><div class="skill-letter">${s.name.charAt(0)}</div><div class="skill-name">${s.name}</div><div class="skill-mini-bar"><div style="width: ${s.level}%"></div></div></div>`).join('')}</div>`;
        } else {
          skillsHtml = `<div class="skills-tags">${skills.map(s => `<span class="skill-tag">${s.name}</span>`).join('')}</div>`;
        }
        sectionsHtml += `<section id="skills" class="skills"><div class="container"><h2>Skills & Expertise</h2>${skillsHtml}</div></section>`;
      }

      if (id === 'experience' && experience?.length) {
        sectionsHtml += `
  <section id="experience" class="experience">
    <div class="container">
      <h2>Experience</h2>
      <div class="timeline">
        ${experience.map(e => `<div class="card ${cardClass} timeline-item"><div class="time">${e.period}</div><div class="content"><h3>${e.title}</h3><h4>${e.company}</h4><p>${e.description}</p></div></div>`).join('')}
      </div>
    </div>
  </section>`;
      }

      if (id === 'services' && services?.length) {
        sectionsHtml += `
  <section id="services" class="services">
    <div class="container">
      <h2>Our Services</h2>
      <div class="grid">
        ${services.map(s => `<div class="card ${cardClass} service-card"><div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p></div>`).join('')}
      </div>
    </div>
  </section>`;
      }

      if (id === 'contact') {
        sectionsHtml += `
  <section id="contact" class="contact">
    <div class="container text-center">
      <h2>Get In Touch</h2>
      <div class="card ${cardClass}" style="max-width: 600px; margin: 0 auto; padding: 4rem 2rem;">
        <p style="margin-bottom: 2rem; font-size: 1.1rem;">Interested in working together? Let's talk!</p>
        <div class="contact-links">
          ${user.email ? `<a href="mailto:${user.email}" class="btn">${user.email}</a>` : ''}
          ${user.location ? `<p class="location" style="margin-top: 1.5rem; color: var(--text-muted);">📍 ${user.location}</p>` : ''}
        </div>
      </div>
    </div>
  </section>`;
      }
    });

    const siteTitle = `${user.name || 'My Website'} | FlowSite`;
    const siteDesc = (user.bio || user.tagline || 'Created with FlowSite website builder.').replace(/"/g, '&quot;');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  <meta name="description" content="${siteDesc}">
  
  <!-- SEO & Social Meta -->
  <meta property="og:title" content="${siteTitle}">
  <meta property="og:description" content="${siteDesc}">
  <meta property="og:type" content="website">
  ${user.avatar ? `<meta property="og:image" content="${user.avatar}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${siteTitle}">
  <meta name="twitter:description" content="${siteDesc}">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${websiteType === 'business' || websiteType === 'app' ? 'Organization' : 'Person'}",
    "name": "${user.name}",
    "jobTitle": "${user.role}",
    "description": "${siteDesc}",
    "image": "${user.avatar || ''}"
  }
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: ${settings.accentColor};
      --accent-rgb: ${accentRgb};
      --bg: ${isDark ? '#0F172A' : '#FAFBFC'};
      --surface: ${isDark ? '#1E293B' : '#FFFFFF'};
      --text: ${isDark ? '#FFFFFF' : '#0F172A'};
      --text-muted: ${isDark ? '#94A3B8' : '#64748B'};
      --radius: ${layout === 'brutalist' ? '0px' : '24px'};
      --border: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
    .text-center { text-align: center; }
    section { padding: 8rem 0; position: relative; z-index: 10; ${includeAnimations ? 'opacity: 0;' : ''} }
    h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1rem; }
    h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; text-align: center; }
    
    .gradient-heading {
      background: linear-gradient(135deg, var(--accent), var(--text));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero { min-height: 90vh; display: flex; align-items: center; justify-content: center; position: relative; }
    
    /* Centered Variant */
    .hero-centered { text-align: center; background: radial-gradient(circle at center, rgba(var(--accent-rgb), 0.05), transparent 70%); }
    
    /* Split Variant */
    .hero-split .split-container { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; text-align: right; }
    .hero-split .hero-content { display: flex; flex-direction: column; gap: 1.5rem; }
    .hero-split .split-name { font-size: 5rem; line-height: 0.9; }
    .hero-split .hero-image-wrapper { aspect-ratio: 4/5; border-radius: 2rem; overflow: hidden; background: rgba(var(--accent-rgb), 0.05); }
    .hero-split .split-avatar { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: 0.5s; }
    .hero-split .split-avatar:hover { filter: grayscale(0); }
    
    /* Minimal Variant */
    .hero-minimal { text-align: left; }
    .hero-minimal .minimal-name { font-size: clamp(3rem, 8vw, 7rem); line-height: 0.85; margin: 1rem 0; text-transform: uppercase; }
    .hero-minimal .minimal-bio { font-size: 1.5rem; border-left: 4px solid var(--accent); padding-left: 2rem; max-width: 800px; }
    .hero-minimal .minimal-divider { height: 1px; background: var(--border); margin: 3rem 0; }
    .hero-minimal .minimal-links { display: flex; gap: 3rem; }
    .hero-minimal .minimal-links a { text-decoration: none; color: var(--text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.3s; }
    .hero-minimal .minimal-links a:hover { color: var(--accent); }

    .avatar { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid var(--accent); margin: 0 auto 2rem; display: block; }
    .label { color: var(--accent); font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; }
    .role { color: var(--accent); font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 600; }
    .bio { max-width: 600px; margin: 0 auto 2rem; font-size: 1.2rem; color: var(--text-muted); }
    
    .cta-group { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
    .hero-split .cta-group { justify-content: flex-end; }
    
    .btn { display: inline-block; padding: 1rem 2.5rem; background: var(--accent); color: white; text-decoration: none; border-radius: 100px; font-weight: 600; transition: 0.3s; border: 2px solid var(--accent); }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(var(--accent-rgb), 0.4); }
    .btn-outline { background: transparent; color: var(--accent); }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    
    /* Card Themes */
    .card { transition: 0.3s; }
    
    .glass-card {
      background: rgba(var(--accent-rgb), 0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(var(--accent-rgb), 0.15);
      border-radius: var(--radius);
      padding: 2.5rem;
    }
    .glass-card:hover { border-color: var(--accent); transform: translateY(-5px); background: rgba(var(--accent-rgb), 0.07); }

    .brutalist-card {
      background: var(--surface);
      border: 3px solid var(--text);
      border-radius: 0;
      box-shadow: 8px 8px 0 var(--text);
      padding: 2.5rem;
    }
    .brutalist-card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0 var(--text); }

    .minimal-card {
      background: transparent;
      border-bottom: 1px solid var(--border);
      border-radius: 0;
      padding: 2rem 0;
    }
    .minimal-card:hover { border-bottom-color: var(--accent); }

    .tag { display: inline-block; font-size: 0.8rem; padding: 0.3rem 0.8rem; background: rgba(var(--accent-rgb), 0.1); color: var(--accent); border-radius: 6px; margin: 0.5rem 0.5rem 0 0; }
    
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .skill-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; }
    .skill-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .skill-progress { height: 100%; background: var(--accent); }
    
    .timeline { position: relative; max-width: 800px; margin: 0 auto; }
    .timeline-item { margin-bottom: 2rem; }
    .time { font-weight: 700; color: var(--accent); margin-bottom: 0.5rem; display: block; }
    
    /* Skills Variants */
    .skills-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
    .skill-tag { padding: 0.75rem 1.5rem; background: var(--surface); border: 2px solid rgba(var(--accent-rgb), 0.2); border-radius: 12px; font-weight: 700; transition: 0.3s; }
    .skill-tag:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.1); }

    .skills-bars { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem 4rem; }
    .skill-bar-item { margin-bottom: 1rem; }
    .skill-progress { height: 100%; background: linear-gradient(90deg, var(--accent), rgba(var(--accent-rgb), 0.6)); border-radius: 4px; ${includeAnimations ? 'width: 0;' : ''} }
    ${includeAnimations ? `
    .animate-bar.fade-in-up { animation: growBar 1s ease-out forwards 0.3s; }
    @keyframes growBar { from { width: 0; } to { width: var(--target-width); } }
    ` : ''}

    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .skill-card { text-align: center; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .skill-letter { width: 60px; height: 60px; background: rgba(var(--accent-rgb), 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 900; color: var(--accent); transition: 0.3s; }
    .skill-card:hover .skill-letter { background: var(--accent); color: white; transform: scale(1.1); }
    .skill-name { font-weight: 700; }
    .skill-mini-bar { width: 40px; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .skill-mini-bar div { height: 100%; background: var(--accent); }

    /* Animations */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-12px) rotate(2deg); }
      66%       { transform: translateY(-6px) rotate(-1deg); }
    }

    ${includeAnimations ? `
    .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
    .section-animate { animation-delay: calc(var(--i, 0) * 0.15s); }
    ` : ''}

    ${includeShapes ? `
    .bg-shape { position: fixed; z-index: 1; background: var(--accent); opacity: 0.08; filter: blur(40px); pointer-events: none; animation: float 10s infinite ease-in-out; }
    .shape-1 { width: 400px; height: 400px; top: -100px; left: -100px; border-radius: 45% 55% 70% 30% / 30% 40% 60% 70%; animation-duration: 12s; }
    .shape-2 { width: 300px; height: 300px; bottom: 10%; right: -50px; border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%; animation-duration: 15s; }
    ` : ''}

    @media (max-width: 768px) { 
      h1 { font-size: 2.5rem; } 
      section { padding: 5rem 0; } 
      .hero { min-height: 70vh; }
      .hero-split .split-container { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
      .hero-split .hero-image-wrapper { order: -1; aspect-ratio: 1; width: 200px; margin: 0 auto; }
      .hero-split .cta-group { justify-content: center; }
      .hero-minimal .minimal-bio { font-size: 1.2rem; }
      .brutalist-card { box-shadow: 4px 4px 0 var(--text); }
      .brutalist-card:hover { box-shadow: 6px 6px 0 var(--text); }
    }
  </style>
</head>
<body>
  ${includeShapes ? `
  <div class="bg-shape shape-1"></div>
  <div class="bg-shape shape-2"></div>
  ` : ''}
  ${sectionsHtml}
  
  ${includeAnimations ? `
  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.setProperty('--i', i % 5);
          e.target.classList.add('fade-in-up');
          e.target.classList.add('section-animate');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
  </script>
  ` : ''}
</body>
</html>`;

    if (minify) {
      return html
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .replace(/<!--.*?-->/g, '');
    }

    return html;
  }, [data]);

  const resetToBlank = useCallback((type?: WebsiteType) => {
    const targetType = type || websiteType;
    setData(getDefaultData(targetType));
    setWebsiteTypeState(targetType);
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
      clearSavedData,
      saveStatus,
      scanStatus,
      scanError,
      activeDevice,
      setActiveDevice,
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
