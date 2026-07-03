export interface Stat {
  value: string;
  label: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  logo?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
  featured?: boolean;
  logo?: string;
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  period: string;
  details: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  profileImage?: string;
  stats: Stat[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  skills: SkillGroup[];
  certifications: string[];
  languages: LanguageItem[];
  interests: string[];
}
