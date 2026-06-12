export interface HeroSection {
  name: string;
  title: string;
  subtitle: string;
  roles: string[];
  resumeUrl: string;
  viewProjectsText: string;
  contactText: string;
}

export interface AboutSection {
  summary: string;
  objective: string;
  education: {
    institution: string;
    degree: string;
    cgpa: string;
    graduation: string;
  };
  highlights: string[];
}

export interface SkillItem {
  name: string;
  rating: number; // 1-100 for radar charts or progress bars
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string[];
  imageUrl?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  badgeType?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  detail: string;
  isLeetCodeCount?: boolean;
}

export interface GitHubLeetCodeSettings {
  githubUsername: string;
  leetcodeUsername: string;
  githubContributionCountSimulated: number;
  leetcodeSolvedCount: number;
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  leetcode: string;
  availability: {
    internship: boolean;
    sde1: boolean;
    freelance: boolean;
    collaboration: boolean;
  };
}

export interface SakuraSystemConfig {
  petalCount: number;
  minSpeed: number;
  maxSpeed: number;
  windSpeed: number;
  turbulence: number;
  colorHex: string;
}

export interface SpidermanSystemConfig {
  isActive: boolean;
  opacity: number;
  interactionStrength: number; // For shooting webs or jumping towards mouse
  idlePose: 'sitting' | 'hanging' | 'climbing' | 'swinging';
  webColor: string;
  suitStyle: 'classic' | 'miles' | 'iron_spider' | 'glowing_sakura';
}

export interface ThemeSettings {
  primaryColor: string; // Sakura Pink
  secondaryColor: string; // Rose Accent
  backgroundColor: string; // Dark Surface or warm ivory
  accentColor: string; // Soft Gold
  textColor: string;
  cardBg: string;
}

export interface PortfolioCMSData {
  hero: HeroSection;
  about: AboutSection;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  githubLeetcode: GitHubLeetCodeSettings;
  blogs: BlogItem[];
  contact: ContactSettings;
  sakuraConfig: SakuraSystemConfig;
  spidermanConfig: SpidermanSystemConfig;
  theme: ThemeSettings;
}
