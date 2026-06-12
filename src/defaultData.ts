import { PortfolioCMSData } from './types';

export const defaultPortfolioData: PortfolioCMSData = {
  hero: {
    name: 'Harish Yasvanth AV',
    title: 'Software Engineer | Full Stack Developer | AI Integration Engineer | Cloud & DevOps Enthusiast',
    subtitle: 'Building Intelligent Web Experiences with AI. Designing Impact. Engineering the Future.',
    roles: [
      'Software Engineer',
      'Full Stack Developer',
      'AI Integration Engineer',
      'Cloud & DevOps Enthusiast'
    ],
    resumeUrl: '#', // Can be downloaded/updated from CMS
    viewProjectsText: 'View Selected Projects',
    contactText: 'Get in Touch'
  },
  about: {
    summary: 'A highly driven Computer Science student and software engineer with expertise in full-stack development, modern AI integration, and cloud-native build systems. Passionate about creating responsive, beautiful, high-efficiency systems optimized for excellent user experience.',
    objective: 'Seeking SDE-1 opportunities and technical internships where I can contribute to production-grade applications, optimize microservice pipelines, and build feature-rich SaaS solutions.',
    education: {
      institution: 'SNS College of Technology (Autonomous Institution)',
      degree: 'Bachelor of Engineering – Computer Science and Engineering',
      cgpa: '8.00 / 10.0',
      graduation: 'June 2027 (Expected)'
    },
    highlights: [
      'Expertise in React, Node.js, Express, and MongoDB',
      'Integration of AI models (Google Gemini API, IBM NLP)',
      'Highly active coding solver - 172+ LeetCode problems',
      'Experience in DevOps workflows including CI/CD and Docker'
    ]
  },
  skills: [
    {
      id: 'prog',
      category: 'Programming Languages',
      skills: [
        { name: 'Java', rating: 85 },
        { name: 'Python', rating: 78 },
        { name: 'JavaScript', rating: 90 },
        { name: 'TypeScript', rating: 85 }
      ]
    },
    {
      id: 'frontend',
      category: 'Frontend Development',
      skills: [
        { name: 'React.js', rating: 92 },
        { name: 'HTML5 & CSS3', rating: 95 },
        { name: 'Tailwind CSS', rating: 95 },
        { name: 'Figma / UI Design', rating: 85 }
      ]
    },
    {
      id: 'backend',
      category: 'Backend & Databases',
      skills: [
        { name: 'Node.js', rating: 88 },
        { name: 'Express.js', rating: 90 },
        { name: 'REST APIs & JWT', rating: 92 },
        { name: 'MongoDB', rating: 85 }
      ]
    },
    {
      id: 'devops',
      category: 'Cloud & DevOps',
      skills: [
        { name: 'Docker', rating: 70 },
        { name: 'AWS Cloud', rating: 75 },
        { name: 'GitHub Actions (CI/CD)', rating: 80 },
        { name: 'Vercel, Netlify, Render', rating: 90 }
      ]
    },
    {
      id: 'ai',
      category: 'AI & Core Computer Science',
      skills: [
        { name: 'Google Gemini AI SDK', rating: 85 },
        { name: 'TensorFlow / NLP basics', rating: 65 },
        { name: 'Data Structures & Algorithms', rating: 82 },
        { name: 'DBMS / SQL', rating: 80 },
        { name: 'Operating Systems & Networks', rating: 75 }
      ]
    }
  ],
  experience: [
    {
      id: 'exp1',
      company: 'Emiglitz Technology',
      role: 'Web Development Intern',
      duration: 'June 2024 – July 2024',
      description: [
        'Assisted in building responsive web systems using modern frontend framework integrations.',
        'Collaborated on database query optimizations and state management handling in client projects.',
        'Participated in testing client web pages across mobile and web viewports, enhancing usability profiles.'
      ]
    },
    {
      id: 'exp2',
      company: 'V Net Technology',
      role: 'UI/UX Design Intern',
      duration: 'April 2024',
      description: [
        'Designed interactive digital wireframes, user journeys, and component models using Figma.',
        'Prototyped clean, accessible interfaces focused on soft neumorphism and modern SaaS color schemes.',
        'Presented responsive, user-tested visual flows to principal developers for deployment validation.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj1',
      title: 'CI/CD Status Dashboard',
      description: 'A premium developer dashboard for monitoring build pipelines, checking deployment logs, and analyzing execution times with modern telemetry aesthetics.',
      githubUrl: 'https://github.com/Harish171262',
      demoUrl: '#',
      techStack: ['React.js', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Docker'],
      imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj2',
      title: 'AI Chatbot Integration Node',
      description: 'A conversational interface leveraging the Google Gemini API, featuring speech-to-text, real-time contextual token awareness, and rich code snippet highlighting.',
      githubUrl: 'https://github.com/Harish171262',
      demoUrl: '#',
      techStack: ['React.js', '@google/genai', 'Express.js', 'Tailwind', 'Vector DB'],
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj3',
      title: 'India Job Portal (Smart Sourcing)',
      description: 'An advanced web portal that aggregates national technical opportunities, utilizing machine learning algorithms to recommend jobs match-tested to resume text.',
      githubUrl: 'https://github.com/Harish171262',
      demoUrl: '#',
      techStack: ['MERN Stack', 'Redux Toolkit', 'Rest APIs', 'Tailwind CSS', 'JWT'],
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj4',
      title: 'Responsive Blog Platform',
      description: 'A high-speed blogging application built with fully dynamic search engine capabilities, integrated reading time calculators and recursive markdown rendering.',
      githubUrl: 'https://github.com/Harish171262',
      demoUrl: '#',
      techStack: ['React.js', 'MongoDB', 'Vite', 'Express.js', 'Tailwind CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
    }
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'Oracle OCI Generative AI Professional',
      issuer: 'Oracle Cloud',
      date: '2024',
      badgeType: 'Gold'
    },
    {
      id: 'cert2',
      name: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
      issuer: 'Microsoft',
      date: '2024',
      badgeType: 'Academic'
    },
    {
      id: 'cert3',
      name: 'Microsoft Certified: Azure Data Fundamentals (DP-900)',
      issuer: 'Microsoft',
      date: '2024',
      badgeType: 'Academic'
    },
    {
      id: 'cert4',
      name: 'AWS Cloud Fundamentals Practice Badge',
      issuer: 'Amazon Web Services',
      date: '2024',
      badgeType: 'Standard'
    },
    {
      id: 'cert5',
      name: 'Datacom Software Simulation',
      issuer: 'Datacom (Forage)',
      date: '2024',
      badgeType: 'Hands-on'
    },
    {
      id: 'cert6',
      name: 'Skyscanner Front-End Simulation',
      issuer: 'Skyscanner (Forage)',
      date: '2024',
      badgeType: 'Hands-on'
    }
  ],
  achievements: [
    {
      id: 'ach1',
      title: '172+ LeetCode Problems Solved',
      detail: 'Consistent daily problem solver specializing in dynamic programming, recursion, depth-first search, and array optimizations.',
      isLeetCodeCount: true
    },
    {
      id: 'ach2',
      title: 'Codecure AI Hackathon Winner',
      detail: 'Pioneered an AI-driven environment status and analytics model addressing real-time containerized logging systems.'
    },
    {
      id: 'ach3',
      title: 'INNOV8E Hackathon Finalist',
      detail: 'Built an interactive, lightweight education microservice framework focused on distributed mobile edge structures.'
    },
    {
      id: 'ach4',
      title: 'TechTriad Hackathon Special Recognition',
      detail: 'Honored for exceptional user interface craftsmanship, typography scoring, and mobile responsive execution indices.'
    },
    {
      id: 'ach5',
      title: 'Decision Arena Placement',
      detail: 'Ranked in the top echelon of rapid logic strategy solvers evaluating performance-scaled graph networks.'
    },
    {
      id: 'ach6',
      title: 'Youth Red Cross (YRC) Volunteer',
      detail: 'Active peer organizer for college community blood donation nodes and disaster awareness campaigns.'
    }
  ],
  githubLeetcode: {
    githubUsername: 'Harish171262',
    leetcodeUsername: 'user9722Wx',
    githubContributionCountSimulated: 512,
    leetcodeSolvedCount: 172
  },
  blogs: [
    {
      id: 'blog1',
      title: 'Navigating AWS Cloud Foundations: What Recruiters Look For',
      excerpt: 'An inside look at AWS global infrastructure, core services (EC2, S3, RDS), and why passing AWS Cloud Practitioner signals enterprise-critical readiness.',
      content: '# Navigating AWS Cloud Foundations\n\nCloud solutions have transformed from optional advancements to mandatory infrastructure requirements. Recruiters looking for SDE-1 hires prioritizing modular design value basic cloud diagnostics. Here is an overview of AWS mechanics and core security principles...',
      date: 'June 02, 2026',
      category: 'Cloud & DevOps',
      readTime: '4 min read'
    },
    {
      id: 'blog2',
      title: 'Under the Hood: Connecting Google Gemini API safely in production Node apps',
      excerpt: 'Protecting server secrets, parsing stream arrays, and constructing clear contextual prompts to elevate React user experience without visual latency.',
      content: '# Node + Gemini API Best Practices\n\nExposing your API keys in frontend bundles is the fastest way to invite severe abuse. By implementing lightweight node endpoint proxies, you can handle chat sequences, function schemas, and multi-turn dialogues securely...',
      date: 'May 14, 2026',
      category: 'Artificial Intelligence',
      readTime: '5 min read'
    },
    {
      id: 'blog3',
      title: 'Optimizing MERN Database Queries: A Practical MongoDB Study',
      excerpt: 'How indexing arrays, utilizing compound structures, and managing persistent connections boosted data delivery rates by 40% in our job portal project.',
      content: '# MongoDB Indexing Optimization\n\nWhen scaling database search fields, collection scans become incredibly expensive. Harness the predictive querying indices in MongoDB through native aggregation pipelines...',
      date: 'April 28, 2026',
      category: 'Databases',
      readTime: '6 min read'
    }
  ],
  contact: {
    email: 'yasvanth172005@gmail.com',
    phone: '+91 8438272049',
    location: 'Avinashi, Tamil Nadu, India',
    linkedin: 'https://linkedin.com/in/harishyasvanth',
    github: 'https://github.com/Harish171262',
    leetcode: 'https://leetcode.com/u/user9722Wx/',
    availability: {
      internship: true,
      sde1: true,
      freelance: true,
      collaboration: true
    }
  },
  sakuraConfig: {
    petalCount: 30,
    minSpeed: 1.0,
    maxSpeed: 2.2,
    windSpeed: 0.8,
    turbulence: 0.5,
    colorHex: '#F8B6C1'
  },
  spidermanConfig: {
    isActive: true,
    opacity: 0.9,
    interactionStrength: 1.5,
    idlePose: 'swinging',
    webColor: '#ffffff',
    suitStyle: 'glowing_sakura'
  },
  theme: {
    primaryColor: '#F8B6C1', // Sakura Pink
    secondaryColor: '#FF9EB5', // Rose Accent
    backgroundColor: '#121212', // Dark Surface (luxury ambient)
    accentColor: '#D4AF37', // Soft Gold
    textColor: '#FAF6F0', // Warm Ivory text
    cardBg: 'rgba(28, 28, 28, 0.75)' // Glass dark
  }
};
