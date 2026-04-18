import React, { createContext, useContext, useState, useEffect } from 'react';

export type SectionLayout = 'modern' | 'minimal' | 'brutalist';

export interface ProjectItem {
  id: number;
  title: string;
  desc: string;
  color: string;
  tags: string[];
  image?: string;
}

export interface PortfolioData {
  user: {
    name: string;
    role: string;
    bio: string;
  };
  settings: {
    theme: 'light' | 'dark';
    layout: SectionLayout;
  };
  projects?: ProjectItem[];
}

export const defaultProjects: ProjectItem[] = [
  { id: 1, title: 'Campus Event App', desc: 'A full-stack mobile app built for organizing and ticketing college fests.', color: 'bg-indigo-50 dark:bg-indigo-900/20', tags: ['Mobile', 'Full Stack'] },
  { id: 2, title: 'HackMIT Winner 2025', desc: 'AI-powered study assistant built in 48 hours using Gemini API and React.', color: 'bg-amber-50 dark:bg-amber-900/20', tags: ['AI', 'Hackathon'] },
  { id: 3, title: 'React UI Library', desc: 'An open-source accessible component library with 1k+ stars on GitHub.', color: 'bg-blue-50 dark:bg-blue-900/20', tags: ['Frontend', 'Open Source'] },
  { id: 4, title: 'Robotics Club Website', desc: 'High-performance animated landing page for the university robotics society.', color: 'bg-emerald-50 dark:bg-emerald-900/20', tags: ['Frontend', 'Design'] },
  { id: 5, title: 'Capstone: Smart IoT Grid', desc: 'Final year research project optimizing energy distribution with real-time analytics.', color: 'bg-purple-50 dark:bg-purple-900/20', tags: ['Research', 'Full Stack'] },
  { id: 6, title: 'Finance Tracker', desc: 'Personal finance dashboard for students to manage budgets and expenses.', color: 'bg-rose-50 dark:bg-rose-900/20', tags: ['React', 'Full Stack'] },
];

const defaultData: PortfolioData = {
  user: {
    name: 'Sagar',
    role: 'Frontend Developer',
    bio: 'Building fast performant web applications with a focus on human centered design.',
  },
  settings: {
    theme: 'dark',
    layout: 'modern',
  },
  projects: defaultProjects,
};

interface BuilderContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
  updateUser: (userUpdates: Partial<PortfolioData['user']>) => void;
  updateProject: (id: number, projectUpdates: Partial<ProjectItem>) => void;
  toggleTheme: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (data.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [data.settings.theme]);

  const updateData = (newData: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => {
    setData((prev) => {
      const merged = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      if (!merged.projects) {
        merged.projects = defaultProjects;
      }
      return merged;
    });
  };

  const updateUser = (userUpdates: Partial<PortfolioData['user']>) => {
    setData((prev) => ({
      ...prev,
      user: { ...prev.user, ...userUpdates },
    }));
  };

  const updateProject = (id: number, projectUpdates: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects?.map(p => p.id === id ? { ...p, ...projectUpdates } : p) || defaultProjects
    }));
  };

  const toggleTheme = () => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  };

  return (
    <BuilderContext.Provider value={{ data, updateData, updateUser, updateProject, toggleTheme }}>
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
