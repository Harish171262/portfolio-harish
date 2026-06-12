import React, { useState, useEffect } from 'react';
import { PortfolioCMSData, SkillCategory, ProjectItem, BlogItem } from '../types';
import { 
  Github, Linkedin, Mail, Phone, MapPin, 
  ExternalLink, Code2, Award, Briefcase, BookOpen, 
  FileText, Copy, Check, Search, Calendar, Clock, 
  ChevronRight, Trophy, Heart, Coffee, ShieldAlert, Key, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioHomeProps {
  data: PortfolioCMSData;
  onEnterAdmin: () => void;
  activeSectionSetter: (section: string) => void;
}

export default function PortfolioHome({ data, onEnterAdmin, activeSectionSetter }: PortfolioHomeProps) {
  const [copyEmailSuccess, setCopyEmailSuccess] = useState(false);
  const [copyPhoneSuccess, setCopyPhoneSuccess] = useState(false);
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Interactive local states for custom metrics
  const [typedRole, setTypedRole] = useState(data.hero.roles[0]);
  const [roleIdx, setRoleIdx] = useState(0);

  // Typewriter effect simulation for the hero subtitle badges
  useEffect(() => {
    let charIdx = 0;
    let currentRole = data.hero.roles[roleIdx] || '';
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (isDeleting) {
        setTypedRole(currentRole.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setTypedRole(currentRole.substring(0, charIdx + 1));
        charIdx++;
      }

      let speed = isDeleting ? 40 : 100;

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 2200; // Hold at full words
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        setRoleIdx((prev) => (prev + 1) % data.hero.roles.length);
        speed = 500;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, [roleIdx, data.hero.roles]);

  // Track scroll position to update Spiderman's active section targeting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'certifications', 'achievements', 'github-leetcode', 'blog', 'contact'];
      let currentSection = 'home';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45) {
            currentSection = section;
            break;
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
        activeSectionSetter(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, activeSectionSetter]);

  const copyEmail = () => {
    navigator.clipboard.writeText(data.contact.email);
    setCopyEmailSuccess(true);
    setTimeout(() => setCopyEmailSuccess(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(data.contact.phone);
    setCopyPhoneSuccess(true);
    setTimeout(() => setCopyPhoneSuccess(false), 2000);
  };

  // Filter Blogs based on search & tags
  const blogCategories = ['All', ...Array.from(new Set(data.blogs.map(b => b.category)))];
  const filteredBlogs = data.blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Render simulated Github contribution blocks
  const renderGithubGrid = () => {
    const blocks = [];
    const totalBlocks = 120; // 12 cols x 10 rows
    const colors = [
      'bg-zinc-800/40', // none
      'bg-rose-950/40', // low
      'bg-rose-900/60', // low-mid
      'bg-[#FF9EB5]/50', // mid
      'bg-[#F8B6C1]', // high (signature pink)
      'bg-[#D4AF37]' // peak commits (gold!)
    ];

    for (let i = 0; i < totalBlocks; i++) {
      // Create some organic looking peak waves
      const distanceToCenter = Math.sin(i * 0.15) * Math.cos(i * 0.08);
      let weight = Math.floor(Math.abs(distanceToCenter * 4)) + (i % 3 === 0 ? 1 : 0);
      if (weight > 5) weight = 5;

      blocks.push(
        <div 
          key={i} 
          className={`h-2.5 w-2.5 rounded-sm transition-all duration-300 hover:scale-130 hover:ring-1 hover:ring-white/40 ${colors[weight]}`}
          title={`Simulation Day ${i}: ${weight * 2 + 1} commit nodes`}
        />
      );
    }
    return blocks;
  };

  return (
    <div className="relative min-h-screen bg-[#121212] py-2">
      
      {/* Dynamic Ambient Background Elements - Japanese Mountains Overlay */}
      <div className="absolute top-0 left-0 right-0 h-screen pointer-events-none overflow-hidden z-1 bg-gradient-to-b from-[#1c1417] via-[#121212] to-transparent">
        
        {/* Soft Mount Fuji Silhouette */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[180%] max-w-[1400px] aspect-[2/1] opacity-6 blur-[1px]">
          <svg viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FF9EB5]">
            <path d="M500 50 L100 500 L900 500 Z" fill="currentColor"/>
            {/* Snowy cap */}
            <path d="M500 50 L420 180 L460 200 L500 170 L540 210 L585 180 Z" fill="#FAF6F0" opacity="0.3"/>
          </svg>
        </div>

        {/* Ambient Warm Golden Sunrise Ray */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-b from-[#D4AF37]/5 to-transparent blur-[120px]" />
      </div>

      {/* Floating Header UI */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl mx-auto bg-black/40 backdrop-blur-md rounded-full border border-white/5 px-6 py-2.5 flex items-center justify-between z-40 shadow-xl shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#F8B6C1] to-[#FF9EB5] animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-[#FAF6F0] font-bold uppercase select-none">
            HARISH.AV
          </span>
        </div>

        {/* Mini Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-wider text-zinc-300">
          {[
            { id: 'about', label: 'ABOUT' },
            { id: 'skills', label: 'SKILLS' },
            { id: 'experience', label: 'EXPERIENCE' },
            { id: 'projects', label: 'PROJECTS' },
            { id: 'certifications', label: 'CERTS' },
            { id: 'github-leetcode', label: 'ANALYTICS' },
            { id: 'blog', label: 'BLOG' },
            { id: 'contact', label: 'CONTACT' }
          ].map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              className={`hover:text-[#FF9EB5] transition-colors relative ${activeSection === item.id ? 'text-[#FF9EB5] font-bold' : ''}`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#FF9EB5] rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* Admin Gateway Button */}
        <button
          onClick={onEnterAdmin}
          className="flex items-center gap-1.5 px-3.5 py-1 bg-[#FF9EB5]/10 border border-[#FF9EB5]/30 hover:bg-[#FF9EB5]/25 hover:border-[#FF9EB5]/50 hover:scale-105 active:scale-95 transition-all text-[#FF9EB5] font-semibold text-[10px] font-mono rounded-full uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Admin CMS
        </button>
      </nav>

      {/* --- HERO / LANDING SECTION --- */}
      <section 
        id="home" 
        className="min-h-screen flex flex-col justify-center items-center px-6 relative z-10 select-none pb-12 pt-24"
      >
        <div className="text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9EB5]/5 border border-[#FF9EB5]/15 rounded-full text-xs text-[#FF9EB5] font-mono shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for SDE-1 & Internships
          </div>

          <h2 className="text-[13px] tracking-widest text-[#D4AF37] font-mono uppercase font-bold">
            WELCOME TO AN INTERACTIVE SAKURA PORTFOLIO
          </h2>

          <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-[#FAF6F0] leading-tight">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF6F0] via-[#FF9EB5] to-[#D4AF37] select-text">
              {data.hero.name}
            </span>
          </h1>

          <div className="h-10 flex items-center justify-center">
            <span className="font-mono text-xs md:text-sm text-zinc-400 tracking-wider flex items-center gap-1.5">
              <span>⚡</span>
              <span className="min-w-[12rem] text-transparent bg-clip-text bg-[#FAF6F0] font-bold">
                {typedRole}
              </span>
              <span className="w-1.5 h-4 bg-[#FF9EB5] animate-blink inline-block" />
            </span>
          </div>

          <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {data.hero.subtitle}
          </p>

          {/* Quick interactive Badges */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto pt-2">
            {data.hero.roles.map((r, i) => (
              <span 
                key={i} 
                className="text-[10px] uppercase tracking-wide px-3 py-1 bg-white/5 border border-white/15 rounded text-zinc-300 font-medium hover:border-[#FF9EB5]/40 hover:text-white transition-all cursor-default"
              >
                {r}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-6">
            <a
              href="#projects"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FF9EB5] to-[#FF7795] text-[#121212] font-semibold text-xs tracking-wider uppercase rounded-xl hover:opacity-90 active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#FF9EB5]/10 font-bold border border-white/20"
            >
              <span>{data.hero.viewProjectsText}</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-neutral-200 hover:text-[#FAF6F0] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>{data.hero.contactText}</span>
            </a>

            {data.hero.resumeUrl && data.hero.resumeUrl !== '#' && (
              <a
                href={data.hero.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 active:scale-95 text-[#D4AF37] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all text-center flex items-center justify-center gap-1.5 font-mono"
              >
                <FileText className="w-3.5 h-3.5" /> RESUME
              </a>
            )}
          </div>
        </div>

        {/* Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
          <span className="text-[9px] font-mono tracking-widest uppercase">SWIPE DOWN</span>
          <div className="w-1.5 h-6 bg-zinc-800 rounded-full flex justify-center p-0.5">
            <div className="w-0.5 h-1.5 bg-[#FF9EB5] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* --- ABOUT BIOGRAPHY SECTION --- */}
      <section id="about" className="py-24 px-6 max-w-5xl mx-auto space-y-12 relative z-10 scroll-mt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Summary / Column 1 */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">01. BIOGRAPHY</span>
              <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">The Professional Saga</h2>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {data.about.summary}
            </p>

            <div className="p-5 bg-gradient-to-br from-white/5 to-white/0 border border-white/5 rounded-xl space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl group-hover:bg-[#D4AF37]/10 transition-all duration-500" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">Career Objective</p>
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                "{data.about.objective}"
              </p>
            </div>
          </div>

          {/* Academic Profile / Column 2 */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-6 bg-[#1a191d]/85 border border-white/10 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF9EB5]/5 rounded-full blur-lg" />
              <div className="flex items-center gap-2 text-[#FF9EB5]">
                <Award className="w-5 h-5 shrink-0" />
                <span className="text-xs font-mono tracking-wider uppercase font-bold">Academic Node</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-[#D4AF37] uppercase font-mono font-bold">School / College</p>
                  <p className="text-xs font-semibold text-zinc-200">{data.about.education.institution}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[10px] text-[#D4AF37] uppercase font-mono font-bold">Degree Program</p>
                  <p className="text-xs text-zinc-300">{data.about.education.degree}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-zinc-500 font-mono">CUMULATIVE CGPA</p>
                    <p className="text-xs font-bold text-[#FF9EB5] font-mono">{data.about.education.cgpa}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-zinc-500 font-mono">EXPECTED GRAD</p>
                    <p className="text-xs font-semibold text-zinc-300 font-mono">{data.about.education.graduation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border border-white/5 rounded-xl space-y-3">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Journey Spotlights</span>
              <ul className="space-y-2 text-xs text-zinc-400">
                {data.about.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#FF9EB5] shrink-0 font-mono mt-0.5">🌸</span>
                    <span className="select-text">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS GRID & RADAR CHARTS --- */}
      <section id="skills" className="py-24 px-6 bg-gradient-to-b from-[#121212] via-black/40 to-[#121212] relative z-10 scroll-mt-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">02. TECHNOLOGY MATRIX</span>
            <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Stack Architecture & Mastery</h2>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">Dynamic percentages and classifications. Tap skill metrics for diagnostic readings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.skills.map((category) => (
              <div 
                key={category.id} 
                className="p-6 bg-[#161619]/65 hover:bg-[#1a1a1e]/85 border border-white/10 rounded-2xl space-y-5 transition-all duration-300 hover:border-[#FF9EB5]/35 hover:-translate-y-1 shadow-lg group relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9EB5]/2 rounded-full blur-xl" />
                
                <h3 className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold border-b border-white/10 pb-2.5 flex items-center justify-between">
                  <span>{category.category}</span>
                  <Code2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#FF9EB5] transition-colors" />
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-200 font-mono select-text">{skill.name}</span>
                        <span className="text-[#FF9EB5] font-mono text-[10px]">{skill.rating}%</span>
                      </div>
                      
                      {/* Interactive Progress Indicators */}
                      <div className="w-full h-1.5 bg-zinc-800/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF9EB5] to-[#D4AF37] rounded-full group-hover:scale-x-105 origin-left transition-transform duration-500"
                          style={{ width: `${skill.rating}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE WORKPLACE TIMELINE --- */}
      <section id="experience" className="py-24 px-6 max-w-5xl mx-auto space-y-12 relative z-10 scroll-mt-12">
        
        <div className="text-center space-y-2">
          <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">03. PROFESSIONAL MILESTONES</span>
          <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Interactive Career Chronicle</h2>
          <p className="text-xs text-zinc-400">Verifiably proven developer internships</p>
        </div>

        <div className="relative pt-8 max-w-3xl mx-auto">
          {/* Vertical core line */}
          <div className="absolute top-0 bottom-0 left-4 md:left-[50%] w-[1px] bg-gradient-to-b from-[#FF9EB5] via-[#D4AF37] to-transparent opacity-40" />

          <div className="space-y-12">
            {data.experience.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={exp.id} 
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } transition-all duration-300`}
                >
                  {/* Central Node Dot */}
                  <div className="absolute left-4 md:left-[50%] -translate-x-[7px] w-3.5 h-3.5 rounded-full bg-[#121212] border-2 border-[#FF9EB5] z-20 flex justify-center items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  </div>

                  {/* Left Side (Spacing placeholder for staggered items) */}
                  <div className="hidden md:block w-1/2" />

                  {/* Right Side / Content Card */}
                  <div className="w-full md:w-1/2 pl-10 md:px-8">
                    <div className="p-6 bg-[#161619]/90 border border-white/10 hover:border-[#FF9EB5]/25 rounded-2xl space-y-3.5 transition-all shadow-xl group relative overflow-hidden hover:-translate-y-1">
                      {/* Hover card flash effect */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#FF9EB5] group-hover:bg-[#D4AF37] transition-all" />
                      
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
                          {exp.duration}
                        </span>
                        <Briefcase className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#FF9EB5] transition-colors" />
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-[#FAF6F0] select-text">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-medium text-zinc-400 select-text font-mono">
                          {exp.company}
                        </p>
                      </div>

                      <ul className="space-y-1.5 text-xs text-zinc-400 font-normal">
                        {exp.description.map((bullet, bidx) => (
                          <li key={bidx} className="flex items-start gap-1.5 leading-relaxed select-text">
                            <span className="text-[#FF9EB5]">⚡</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SELECTED BUILD DASHBOARD (PROJECTS) --- */}
      <section id="projects" className="py-24 px-6 bg-gradient-to-b from-[#121212] via-black/40 to-[#121212] relative z-10 scroll-mt-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 md:text-left text-center">
              <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">04. SELECTED CREATIVE BUILDS</span>
              <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Interactive Systems & Microservices</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((project) => (
              <div 
                key={project.id} 
                className="group relative bg-[#151515] hover:bg-[#18181d] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#FF9EB5]/40 hover:-translate-y-1.5 shadow-2xl"
              >
                <div className="space-y-4">
                  {/* Aspect Thumbnail Container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900 border-b border-white/5">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-6">
                        <Code2 className="w-12 h-12 text-[#FF9EB5]/20 animate-pulse" />
                      </div>
                    )}
                    
                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent/10 opacity-80" />

                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9px] uppercase tracking-wide font-mono bg-black/80 backdrop-blur-sm border border-white/10 text-neutral-200 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body textuals */}
                  <div className="px-6 space-y-2">
                    <h3 className="text-lg font-bold text-[#FAF6F0] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0] to-[#D4AF37]/80 group-hover:text-white transition-colors select-text">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed select-text font-normal">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Micro Actions Footer */}
                <div className="px-6 pb-6 pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" /> REPOSITORY
                  </a>

                  {project.demoUrl && project.demoUrl !== '#' ? (
                    <a 
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-[#FF9EB5] hover:text-[#FF7795] font-bold"
                    >
                      LIVE PREVIEW <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[9px] font-mono uppercase text-zinc-600">Local Sandbox</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CREDENTIAL CERTIFICATIONS SECTION --- */}
      <section id="certifications" className="py-24 px-6 max-w-5xl mx-auto space-y-12 relative z-10 scroll-mt-12">
        
        <div className="text-center space-y-2">
          <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">05. CREDENTIAL VERIFICATIONS</span>
          <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Verified Badges & Industry Certifications</h2>
          <p className="text-xs text-zinc-400">Verifiably proven qualifications in Cloud computing, Generative AI nodes and simulations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.certifications.map((cert) => (
            <div 
              key={cert.id} 
              className="p-5 bg-gradient-to-b from-[#18181b] to-[#121214] border border-white/10 rounded-2xl hover:border-[#D4AF37]/45 transition-all text-left flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/2 rounded-full blur-xl" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded">
                    {cert.badgeType || 'Professional'}
                  </span>
                  <Award className="w-4 h-4 text-zinc-600 group-hover:text-[#D4AF37] transition-all" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-neutral-100 select-text leading-relaxed tracking-tight min-h-[2.25rem]">
                    {cert.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono select-text font-normal">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              {cert.date && (
                <div className="border-t border-white/5 pt-3.5 mt-3.5 text-[9px] font-mono text-zinc-500 flex justify-between select-none">
                  <span>REGISTRY RECORD: VERIFIED</span>
                  <span className="text-zinc-400 font-medium">{cert.date}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- CODES & RECRUITMENT ANALYTICS (LEETCODE / GITHUB MATRIX) --- */}
      <section id="github-leetcode" className="py-24 px-6 bg-[#161619]/65 border-y border-white/5 relative z-10 scroll-mt-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">06. CODING INTENSITY ENGINE</span>
            <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Developer Heatmaps & Progress Indicators</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">Live tracked metrics from GitHub contributions and solved algorithm indexes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Leetcode metric Card */}
            <div className="md:col-span-4 p-6 bg-gradient-to-b from-zinc-900 to-[#121214] border border-white/10 rounded-2xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9EB5]/4 rounded-full blur-xl group-hover:scale-130 transition-all" />
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-[#FF9EB5] uppercase font-bold tracking-widest bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 px-2.5 py-0.5 rounded">
                  LeetCode Node
                </span>
                <p className="text-xs text-zinc-400">
                  Algorithmic metrics synced. Highly active in Graph recursion, DP, array parsing models.
                </p>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FAF6F0] via-[#FF9EB5] to-[#D4AF37] select-text">
                  {data.githubLeetcode.leetcodeSolvedCount}+
                </h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] font-bold">Solved Exercises Completed</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <a 
                  href={data.contact.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-center rounded-lg block uppercase tracking-wider text-zinc-300"
                >
                  Inspect Profile ➔
                </a>
              </div>
            </div>

            {/* Github Heatmap Simulation Map */}
            <div className="md:col-span-8 p-6 bg-[#121213] border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#D4AF37] font-mono uppercase font-bold">Interactive Sandbox Heatmap</span>
                  <h3 className="text-sm font-semibold text-neutral-100">Simulated Contribution Index</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#FF9EB5] font-bold">{data.githubLeetcode.githubContributionCountSimulated} Commits</span>
                  <p className="text-[9px] text-zinc-500 font-mono">This fiscal term</p>
                </div>
              </div>

              {/* Grid of cubes block */}
              <div className="flex flex-wrap gap-1.5 py-2 justify-center">
                {renderGithubGrid()}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>Leaning: SAKURA LUXURY COLORS</span>
                <span>Active Handle: @{data.githubLeetcode.githubUsername}</span>
              </div>
            </div>

          </div>

          {/* Achievements Ribbon list */}
          <div className="pt-6">
            <h3 className="text-xs font-mono text-[#FAF6F0] uppercase tracking-wider mb-4 text-center">🏆 RECENT ACHIEVEMENTS & HACKATHONS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.achievements.map((item) => (
                <div key={item.id} className="p-4 bg-white/5 border border-white/5 hover:border-white/15 rounded-xl flex items-start gap-3 transition-all">
                  <Trophy className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#FAF6F0] select-text">{item.title}</h4>
                    <p className="text-[10px] text-zinc-400 leading-normal select-text">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- CMS ARTICLES & LECTURES (BLOG SECTION) --- */}
      <section id="blog" className="py-24 px-6 max-w-5xl mx-auto space-y-12 relative z-10 scroll-mt-12">
        
        <div className="text-center space-y-2">
          <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">07. KNOWLEDGE BASE</span>
          <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Blogging & Technical Insights</h2>
          <p className="text-xs text-zinc-400">Searchable repository of system evaluations, cloud structures and design tips</p>
        </div>

        {/* Searching & Categories filter bars */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
          {/* Seek box */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search concepts, tools, stacks..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full bg-black/45 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#FF9EB5]"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          </div>

          {/* Categoric rails */}
          <div className="flex flex-wrap gap-1.5 max-w-full justify-center">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[10px] font-mono rounded uppercase tracking-wider transition-all ${
                  selectedCategory === cat 
                  ? 'bg-[#FF9EB5] text-black font-semibold' 
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Catalog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedBlog(post)}
              className="p-5 bg-[#151517]/80 hover:bg-[#19191d] border border-white/5 hover:border-[#FF9EB5]/25 rounded-2xl flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-300 group"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span className="text-[#D4AF37] tracking-wider uppercase font-bold">{post.category}</span>
                  <div className="flex items-center gap-1.5 select-none">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#FAF6F0] tracking-tight group-hover:text-[#FF9EB5] transition-colors leading-relaxed select-text min-h-[2.5rem]">
                  {post.title}
                </h3>

                <p className="text-zinc-400 text-xs font-normal leading-relaxed select-text line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500 font-mono select-none">
                <span>{post.date}</span>
                <span className="text-[#FF9EB5] group-hover:translate-x-1 transition-transform">Read post →</span>
              </div>
            </div>
          ))}

          {filteredBlogs.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 font-mono text-xs">
              🔒 No blog matches discovered in the index. Use CMS Admin to compose new articles.
            </div>
          )}
        </div>
      </section>

      {/* --- EXPLICIT SECURE CONTACTS SECTION --- */}
      <section id="contact" className="py-24 px-6 max-w-3xl mx-auto space-y-12 relative z-10 scroll-mt-12">
        
        <div className="text-center space-y-2">
          <span className="text-xs text-[#FF9EB5] font-mono uppercase tracking-widest font-bold">08. GET IN TOUCH</span>
          <h2 className="text-3xl font-sans font-bold text-[#FAF6F0]">Let's Connect For Opportunities</h2>
          <p className="text-xs text-zinc-400 font-mono">No forms, no bots. Reach out directly via encrypted credentials below</p>
        </div>

        {/* Verified Recruiter Availability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-[#1a1a1d]/90 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-[#D4AF37] uppercase tracking-wider border-b border-white/5 pb-2">
              🟢 ACTIVE RECRUITMENT STATUS
            </h3>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data.contact.availability.internship ? 'bg-emerald-400 shadow-md shadow-emerald-400' : 'bg-zinc-700'}`} />
                <span className={data.contact.availability.internship ? 'text-zinc-200' : 'text-zinc-500 font-normal line-through'}>Available for Internships</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data.contact.availability.sde1 ? 'bg-emerald-400 shadow-md shadow-emerald-400' : 'bg-zinc-700'}`} />
                <span className={data.contact.availability.sde1 ? 'text-zinc-200 font-bold' : 'text-zinc-500 font-normal line-through'}>Available for SDE-1 Roles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data.contact.availability.freelance ? 'bg-emerald-400 shadow-md shadow-emerald-400' : 'bg-zinc-700'}`} />
                <span className={data.contact.availability.freelance ? 'text-zinc-200' : 'text-zinc-500 font-normal line-through'}>Available for Freelance Builds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${data.contact.availability.collaboration ? 'bg-emerald-400 shadow-md shadow-emerald-400' : 'bg-zinc-700'}`} />
                <span className={data.contact.availability.collaboration ? 'text-zinc-200' : 'text-zinc-500 font-normal line-through'}>Open for Project Collaborations</span>
              </div>
            </div>
          </div>

          {/* Core copy items */}
          <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono text-[#FF9EB5] uppercase font-bold tracking-widest">Encrypted Direct Actions</h4>
              <p className="text-xs text-zinc-400 select-none">Click badges below to securely copy parameters directly to your local clipboard buffer.</p>
            </div>

            <div className="space-y-2.5">
              {/* Copy Email */}
              <button 
                onClick={copyEmail}
                className="w-full p-2.5 bg-black/40 border border-white/5 hover:border-[#FF9EB5]/25 rounded-lg flex items-center justify-between text-xs transition-all text-left"
              >
                <div className="flex items-center gap-2 select-text">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-zinc-200 text-[11px]">{data.contact.email}</span>
                </div>
                <div className="p-1 text-[#FF9EB5] hover:bg-white/5 rounded shrink-0">
                  {copyEmailSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Copy Phone */}
              <button 
                onClick={copyPhone}
                className="w-full p-2.5 bg-black/40 border border-white/5 hover:border-[#FF9EB5]/25 rounded-lg flex items-center justify-between text-xs transition-all text-left"
              >
                <div className="flex items-center gap-2 select-text">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-zinc-200 text-[11px]">{data.contact.phone}</span>
                </div>
                <div className="p-1 text-[#FF9EB5] hover:bg-white/5 rounded shrink-0">
                  {copyPhoneSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Global verified Social Network Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
          {[
            { href: data.contact.linkedin, label: 'LinkedIn', icon: Linkedin, color: 'text-indigo-400' },
            { href: data.contact.github, label: 'GitHub', icon: Github, color: 'text-zinc-200' },
            { href: data.contact.leetcode, label: 'LeetCode', icon: Award, color: 'text-yellow-500' },
            { href: `mailto:${data.contact.email}`, label: 'Direct Mail', icon: Mail, color: 'text-[#FF9EB5]' }
          ].map((soc, idx) => {
            const Icon = soc.icon;
            return (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-gradient-to-b from-transparent to-white/5 border border-white/5 hover:border-[#FF9EB5]/20 rounded-xl flex flex-col items-center gap-1.5 group transition-all duration-300"
              >
                <Icon className={`w-5 h-5 ${soc.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-white uppercase font-bold">{soc.label}</span>
              </a>
            );
          })}
        </div>

        {/* Physical Address locator */}
        <div className="flex items-center justify-center gap-1.5 text-zinc-500 font-mono text-[10px] uppercase select-text font-bold">
          <MapPin className="w-3.5 h-3.5 text-[#FF9EB5]" /> Local Node: {data.contact.location}
        </div>
      </section>

      {/* --- FOOTER W/ SILHOUETTED PAGODA & LANTERNS --- */}
      <footer className="relative pt-32 pb-16 bg-gradient-to-t from-black via-[#161619] to-transparent border-t border-white/5 overflow-hidden z-10 select-none">
        
        {/* Floating lanterns background simulation */}
        <div className="absolute inset-x-0 top-0 bottom-16 pointer-events-none opacity-30">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-3.5 h-4 bg-amber-500/80 rounded shadow-lg shadow-amber-500/50 animate-lantern-float"
              style={{
                left: `${15 + i * 16}%`,
                bottom: `${20 + (i % 3) * 15}%`,
                animationDelay: `${i * 1.5}s`
              }}
            >
              {/* Little dangling rope */}
              <div className="w-0.5 h-1.5 bg-zinc-800 mx-auto mt-full" />
            </div>
          ))}
        </div>

        {/* Minimal Pagoda Shrine silhouette (gorgeous vector shape in bottom right corner) */}
        <div className="absolute bottom-0 right-10 w-44 h-44 opacity-20 pointer-events-none text-[#F8B6C1]">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M50 15 L52 20 L48 20 Z M38 20 C42 22 58 22 62 20 L58 35 C53 37 47 37 42 35 Z M25 35 C35 38 65 38 75 35 L70 52 C60 55 40 55 30 52 Z M10 52 C25 56 75 56 90 52 L82 85 C65 88 35 88 18 85 Z M42 85 L42 100 L58 100 L58 85 Z" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center">
          
          <div className="space-y-1">
            <p className="text-xs font-mono tracking-widest text-[#FAF6F0] font-bold uppercase">
              HARISH YASVANTH AV
            </p>
            <p className="text-[10px] text-zinc-500 font-normal">
              Designed with 🌸 Japanese Sakura Theme & 🕷️ Spider-Man vectors
            </p>
          </div>

          <div className="flex gap-4 text-zinc-400">
            <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#FF9EB5] transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href={data.contact.github} target="_blank" rel="noreferrer" className="hover:text-[#FF9EB5] transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href={data.contact.leetcode} target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-colors">
              <Award className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[10px] text-zinc-600">
            © 2026 • Harish Yasvanth. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* --- MODAL FOR READING CHOSEN BLOG CMS POST --- */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-[#151517] border border-[#FF9EB5]/20 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 space-y-6 relative text-left"
            >
              {/* Close Button top corner */}
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 text-zinc-400 hover:text-white rounded-full transition-colors font-mono text-xs font-bold"
              >
                ✕ CLOSE
              </button>

              <div className="space-y-2 border-b border-white/5 pb-4">
                <div className="flex justify-between text-xs font-mono text-[#D4AF37]">
                  <span className="uppercase font-bold">{selectedBlog.category}</span>
                  <span>{selectedBlog.date}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#FAF6F0] leading-snug select-text">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px]">
                  <Clock className="w-3.5 h-3.5" /> {selectedBlog.readTime}
                </div>
              </div>

              {/* Body */}
              <div className="text-zinc-300 space-y-4 text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text selection:bg-[#FF9EB5]/30">
                {selectedBlog.content}
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Composed by @{data.hero.name}</span>
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="px-4 py-2 bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 rounded-lg text-[#FF9EB5] hover:bg-[#FF9EB5]/20"
                >
                  Finished Reading
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
