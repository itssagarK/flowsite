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
  scanStatus: 'idle' | 'scanning' | 'done' | 'error';
  scanError: string | null;
  exportCode: () => string;
  resetToBlank: () => void;
  activeDevice: 'mobile' | 'tablet' | 'desktop';
  setActiveDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  clearSavedData: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Default data exported for reuse
export const DEFAULT_DATA = getDefaultData('portfolio');
const STORAGE_KEY = 'flowsite_data';

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(getDefaultData('portfolio'));
  const [websiteType, setWebsiteTypeState] = useState<WebsiteType>('portfolio');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
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
    setData(getDefaultData(type));
  }, []);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_DATA);
    setWebsiteTypeState(DEFAULT_DATA.websiteType);
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

  const exportCode = useCallback(() => {
    const { user, settings, projects, skills, experience, collegeProjects, services, stats, appFeatures, pricing, websiteType } = data;
    const isDark = settings.theme === 'dark';
    const visible = settings.visibleSections || {};

    // Generate sections dynamically based on visibility
    let sectionsHtml = '';

    if (visible.hero !== false) {
      if (websiteType === 'app') {
        sectionsHtml += `
  <section class="hero app-hero">
    <div class="container">
      <h1>${user.name || 'Your App Name'}</h1>
      <p class="tagline">${user.tagline || 'Your catchy tagline'}</p>
      <p class="bio">${user.bio || 'The best solution for your needs.'}</p>
      <div class="cta-buttons">
        <a href="#features" class="btn">Get Started</a>
        <a href="#pricing" class="btn btn-outline">View Pricing</a>
      </div>
    </div>
  </section>`;
      } else {
        sectionsHtml += `
  <section class="hero">
    <div class="container">
      ${user.avatar ? `<img src="${user.avatar}" class="avatar" alt="${user.name}">` : ''}
      <h1>${user.name || 'Your Name'}</h1>
      <h2 class="role">${user.role || 'Professional Title'}</h2>
      <p class="bio">${user.bio || 'Tell your story here...'}</p>
      <a href="#projects" class="btn">View My Work</a>
    </div>
  </section>`;
      }
    }

    if (visible.projects !== false && (projects?.length || collegeProjects?.length)) {
      const items = websiteType === 'college' ? collegeProjects : projects;
      sectionsHtml += `
  <section id="projects" class="projects">
    <div class="container">
      <h2>${websiteType === 'college' ? 'Academic Projects' : 'Featured Projects'}</h2>
      <div class="grid">
        ${(items || []).map(p => `
        <div class="card project-card">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="tags">${(p as any).tags?.map((t: string) => `<span class="tag">${t}</span>`).join('') || ''}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    }

    if (visible.skills !== false && skills?.length) {
      sectionsHtml += `
  <section id="skills" class="skills">
    <div class="container">
      <h2>Skills & Expertise</h2>
      <div class="skills-grid">
        ${skills.map(s => `
        <div class="skill-item">
          <div class="skill-info">
            <span>${s.name}</span>
            <span>${s.level}%</span>
          </div>
          <div class="skill-bar"><div class="skill-progress" style="width: ${s.level}%"></div></div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    }

    if (visible.experience !== false && experience?.length) {
      sectionsHtml += `
  <section id="experience" class="experience">
    <div class="container">
      <h2>Experience</h2>
      <div class="timeline">
        ${experience.map(e => `
        <div class="timeline-item">
          <div class="time">${e.period}</div>
          <div class="content">
            <h3>${e.title}</h3>
            <h4>${e.company}</h4>
            <p>${e.description}</p>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    }

    if (visible.services !== false && services?.length) {
      sectionsHtml += `
  <section id="services" class="services">
    <div class="container">
      <h2>Our Services</h2>
      <div class="grid">
        ${services.map(s => `
        <div class="card service-card">
          <div class="icon">${s.icon}</div>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
        </div>
        `).join('')}
      </div>
    </div>
  </section>`;
    }

    if (visible.contact !== false) {
      sectionsHtml += `
  <section id="contact" class="contact">
    <div class="container">
      <h2>Get In Touch</h2>
      <p>Interested in working together? Let's talk!</p>
      <div class="contact-links">
        ${user.email ? `<a href="mailto:${user.email}" class="btn">${user.email}</a>` : ''}
        ${user.location ? `<p class="location" style="margin-top: 1.5rem; color: var(--muted);">📍 ${user.location}</p>` : ''}
      </div>
    </div>
  </section>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.name || 'My Website'} | FlowSite</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${settings.accentColor};
      --bg: ${isDark ? '#0F172A' : '#FAFBFC'};
      --fg: ${isDark ? '#FFFFFF' : '#0F172A'};
      --card-bg: ${isDark ? '#1E293B' : '#FFFFFF'};
      --border: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
      --muted: ${isDark ? '#94A3B8' : '#64748B'};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', 'Inter', sans-serif; background: var(--bg); color: var(--fg); line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
    section { padding: 8rem 0; border-bottom: 1px solid var(--border); }
    h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1rem; }
    h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; text-align: center; }
    .hero { text-align: center; min-height: 90vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at center, var(--primary)05, transparent 70%); }
    .avatar { width: 150px; height: 150px; border-radius: 50%; object-cover: cover; mb-6; border: 4px solid var(--primary); margin: 0 auto 2rem; display: block; }
    .role { color: var(--primary); font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 600; }
    .bio { max-width: 600px; margin: 0 auto 2rem; font-size: 1.2rem; color: var(--muted); }
    .btn { display: inline-block; padding: 1rem 2.5rem; background: var(--primary); color: white; text-decoration: none; border-radius: 100px; font-weight: 600; transition: 0.3s; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -5px var(--primary); }
    .btn-outline { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .card { background: var(--card-bg); padding: 2.5rem; border-radius: 24px; border: 1px solid var(--border); transition: 0.3s; }
    .card:hover { border-color: var(--primary); transform: translateY(-5px); }
    .tag { display: inline-block; font-size: 0.8rem; padding: 0.3rem 0.8rem; background: var(--primary)15; color: var(--primary); border-radius: 6px; margin: 0.5rem 0.5rem 0 0; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .skill-info { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600; }
    .skill-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .skill-progress { height: 100%; background: var(--primary); }
    .timeline { position: relative; max-width: 800px; margin: 0 auto; }
    .timeline-item { display: flex; gap: 2rem; margin-bottom: 3rem; }
    .time { font-weight: 700; color: var(--primary); min-width: 120px; }
    .contact { text-align: center; }
    @media (max-width: 768px) { h1 { font-size: 2.5rem; } section { padding: 5rem 0; } .hero { min-height: 70vh; } }
  </style>
</head>
<body>${sectionsHtml}</body>
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
      scanStatus,
      scanError,
      exportCode,
      resetToBlank,
      activeDevice,
      setActiveDevice,
      clearSavedData,
      saveStatus,
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
