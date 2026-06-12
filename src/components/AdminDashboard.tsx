import React, { useState } from 'react';
import { PortfolioCMSData, SkillCategory, ExperienceItem, ProjectItem, CertificationItem, AchievementItem, BlogItem } from '../types';
import { 
  Settings, User, Code, Calendar, Briefcase, Award, 
  BookOpen, Mail, ShieldAlert, Cpu, Palette, RefreshCw, 
  Download, Upload, Plus, Trash2, Edit3, ArrowLeft, Eye, CheckCircle, Save
} from 'lucide-react';

interface AdminDashboardProps {
  data: PortfolioCMSData;
  onUpdate: (newData: PortfolioCMSData) => void;
  onClose: () => void;
}

export default function AdminDashboard({ data, onUpdate, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'certs' | 'achievements' | 'ghlc' | 'blogs' | 'contact' | 'sakura' | 'spiderman' | 'theme' | 'raw'>('hero');
  const [localData, setLocalData] = useState<PortfolioCMSData>({ ...data });
  const [saveNotifier, setSaveNotifier] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Helper to trigger overall update state
  const handleSave = (tempData = localData) => {
    onUpdate(tempData);
    setSaveNotifier(true);
    setTimeout(() => setSaveNotifier(false), 2000);
  };

  const handleFieldChange = (section: keyof PortfolioCMSData, field: string, value: any) => {
    const updated = {
      ...localData,
      [section]: {
        ...(localData[section] as any),
        [field]: value
      }
    };
    setLocalData(updated);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all data to default? This will clear all transient edits.')) {
      localStorage.removeItem('harish_portfolio_data');
      window.location.reload();
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(localData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'harish_portfolio_cms_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Simple verification that parsed data matches PortfolioCMSData keys
        if (parsed.hero && parsed.about && parsed.skills && parsed.projects) {
          setLocalData(parsed);
          handleSave(parsed);
          alert('CMS Backup Imported Successfully!');
        } else {
          setImportError('Invalid backup file format. Core keys missing.');
        }
      } catch (err: any) {
        setImportError(`Parse Error: ${err.message}`);
      }
    };
    fileReader.readAsText(files[0]);
  };

  // CRUD HELPERS:
  // --- Skills Section CRUD ---
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `cat_${Date.now()}`,
      category: 'New Skills Group',
      skills: [{ name: 'Example Tool', rating: 80 }]
    };
    const updatedSkills = [...localData.skills, newCat];
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteSkillCategory = (catId: string) => {
    const updatedSkills = localData.skills.filter(c => c.id !== catId);
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateSkillCategoryName = (catId: string, newName: string) => {
    const updatedSkills = localData.skills.map(c => c.id === catId ? { ...c, category: newName } : c);
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
  };

  const addSkillToCategory = (catId: string) => {
    const updatedSkills = localData.skills.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          skills: [...c.skills, { name: 'New Skill', rating: 75 }]
        };
      }
      return c;
    });
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteSkillFromCategory = (catId: string, skillIndex: number) => {
    const updatedSkills = localData.skills.map(c => {
      if (c.id === catId) {
        const copy = [...c.skills];
        copy.splice(skillIndex, 1);
        return { ...c, skills: copy };
      }
      return c;
    });
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateSkillItem = (catId: string, skillIndex: number, field: 'name' | 'rating', val: any) => {
    const updatedSkills = localData.skills.map(c => {
      if (c.id === catId) {
        const copy = [...c.skills];
        copy[skillIndex] = { ...copy[skillIndex], [field]: val };
        return { ...c, skills: copy };
      }
      return c;
    });
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
  };

  // --- Experience CRUD ---
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: 'New Corporation',
      role: 'Full Stack Engineer Intern',
      duration: 'Summer 2026',
      description: ['Accomplished task indicators.', 'Enhanced platform layout efficiencies.']
    };
    const updatedExp = [newItem, ...localData.experience];
    const updated = { ...localData, experience: updatedExp };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteExperience = (id: string) => {
    const updatedExp = localData.experience.filter(e => e.id !== id);
    const updated = { ...localData, experience: updatedExp };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateExperienceItem = (id: string, field: keyof ExperienceItem, val: any) => {
    const updatedExp = localData.experience.map(e => e.id === id ? { ...e, [field]: val } : e);
    const updated = { ...localData, experience: updatedExp };
    setLocalData(updated);
  };

  // --- Projects CRUD ---
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: 'Distributed Analytics Machine',
      description: 'An AI-driven status logger leveraging Docker, Node, and Tailwind UI designs.',
      githubUrl: 'https://github.com/Harish171262',
      demoUrl: '#',
      techStack: ['React', 'Node.js', 'Express', 'Tailwind'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'
    };
    const updated = { ...localData, projects: [...localData.projects, newProj] };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteProject = (id: string) => {
    const updated = { ...localData, projects: localData.projects.filter(p => p.id !== id) };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateProjectItem = (id: string, field: keyof ProjectItem, val: any) => {
    const updated = {
      ...localData,
      projects: localData.projects.map(p => p.id === id ? { ...p, [field]: val } : p)
    };
    setLocalData(updated);
  };

  // --- Certs CRUD ---
  const addCert = () => {
    const newCert: CertificationItem = {
      id: `cert_${Date.now()}`,
      name: 'Google Professional Cloud Architect',
      issuer: 'Google Cloud Platform',
      date: '2026',
      badgeType: 'Gold'
    };
    const updated = { ...localData, certifications: [...localData.certifications, newCert] };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteCert = (id: string) => {
    const updated = { ...localData, certifications: localData.certifications.filter(c => c.id !== id) };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateCertItem = (id: string, field: keyof CertificationItem, val: any) => {
    const updated = {
      ...localData,
      certifications: localData.certifications.map(c => c.id === id ? { ...c, [field]: val } : c)
    };
    setLocalData(updated);
  };

  // --- Achievements CRUD ---
  const addAchievement = () => {
    const newAch: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: 'Outstanding Leader Award',
      detail: 'Recognized for excellent cross-functional teamwork in system-level hackathons.'
    };
    const updated = { ...localData, achievements: [...localData.achievements, newAch] };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteAchievement = (id: string) => {
    const updated = { ...localData, achievements: localData.achievements.filter(a => a.id !== id) };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateAchItem = (id: string, field: keyof AchievementItem, val: any) => {
    const updated = {
      ...localData,
      achievements: localData.achievements.map(a => a.id === id ? { ...a, [field]: val } : a)
    };
    setLocalData(updated);
  };

  // --- Blogs CRUD ---
  const addBlog = () => {
    const newBlog: BlogItem = {
      id: `blog_${Date.now()}`,
      title: 'Designing Apple-Level Micro-Animations',
      excerpt: 'Exploring vector curves and responsive coordinate transformations in HTML5 Canvas.',
      content: '# Micro-Animations in Modern Portfolios\n\nTo build award-winning websites, fine details hold absolute currency. Let us explore GSAP vectors...',
      date: 'June 12, 2026',
      category: 'UI/UX Design',
      readTime: '3 min read'
    };
    const updated = { ...localData, blogs: [newBlog, ...localData.blogs] };
    setLocalData(updated);
    handleSave(updated);
  };

  const deleteBlog = (id: string) => {
    const updated = { ...localData, blogs: localData.blogs.filter(b => b.id !== id) };
    setLocalData(updated);
    handleSave(updated);
  };

  const updateBlogItem = (id: string, field: keyof BlogItem, val: any) => {
    const updated = {
      ...localData,
      blogs: localData.blogs.map(b => b.id === id ? { ...b, [field]: val } : b)
    };
    setLocalData(updated);
  };


  const tabs = [
    { id: 'hero', name: 'Hero Banner', icon: Settings },
    { id: 'about', name: 'About & Uni', icon: User },
    { id: 'skills', name: 'Skills Grid', icon: Code },
    { id: 'experience', name: 'Experiences', icon: Briefcase },
    { id: 'projects', name: 'Project Logs', icon: Cpu },
    { id: 'certs', name: 'Certifications', icon: Award },
    { id: 'achievements', name: 'Achievements', icon: LicenseCheckIcon },
    { id: 'blogs', name: 'Blog Posts', icon: BookOpen },
    { id: 'contact', name: 'Contacts', icon: Mail },
    { id: 'sakura', name: 'Sakura Breeze', icon: Palette },
    { id: 'spiderman', name: 'Spidey Character', icon: Eye },
    { id: 'theme', name: 'Theme Palettes', icon: Palette },
    { id: 'raw', name: 'JSON Backup', icon: Download }
  ] as const;

  return (
    <div className="fixed inset-0 bg-[#0f0f11]/98 backdrop-blur-2xl text-[#FAF6F0] z-50 flex flex-col font-sans transition-all duration-300">
      
      {/* Header Bar */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FF9EB5]/10 rounded-lg text-[#FF9EB5] border border-[#FF9EB5]/25">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FAF6F0] via-[#FF9EB5] to-[#D4AF37]">
              SAKURA CMS CONSOLE v1.2
            </h1>
            <p className="text-xs text-zinc-400">Harish Yasvanth AV • Developer Workspace Portfolio CMS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveNotifier && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs">
              <CheckCircle className="w-3.5 h-3.5 animate-bounce" /> Saved changes!
            </div>
          )}

          <button
            onClick={() => handleSave()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF9EB5] to-[#FF7795] text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-transform shadow-lg shadow-[#FF9EB5]/10"
          >
            <Save className="w-4 h-4" /> Save Active Changes
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 border border-white/20 hover:bg-white/5 active:scale-95 transition-transform text-white/80 px-4 py-1.5 rounded-lg text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Exit CMS
          </button>
        </div>
      </header>

      {/* Workspace Inner */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-white/10 bg-black/20 p-4 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-3 mb-2">Portfolio Sections</p>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 transition-all duration-150 ${
                    activeTab === tab.id 
                    ? 'bg-[#FF9EB5]/10 text-[#FF9EB5] border-l-2 border-[#FF9EB5] font-medium' 
                    : 'text-zinc-400 hover:text-[#FAF6F0] hover:bg-white/5'
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
            <button
              onClick={handleResetToDefault}
              className="w-full py-1.5 border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Defaults
            </button>
          </div>
        </aside>

        {/* Dynamic Workspace Panel */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-transparent to-black/30">
          
          {/* --- HERO TABS --- */}
          {activeTab === 'hero' && (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-xl font-semibold text-[#FF9EB5]">Hero Dynamic Landing Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400">FullName Display</label>
                  <input
                    type="text"
                    value={localData.hero.name}
                    onChange={(e) => handleFieldChange('hero', 'name', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400">Resume Link Url (Google Drive or PDF)</label>
                  <input
                    type="text"
                    value={localData.hero.resumeUrl}
                    onChange={(e) => handleFieldChange('hero', 'resumeUrl', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Headline Tagline</label>
                <textarea
                  value={localData.hero.title}
                  rows={2}
                  onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Animated Subtitle</label>
                <input
                  type="text"
                  value={localData.hero.subtitle}
                  onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400">Projects button Text</label>
                  <input
                    type="text"
                    value={localData.hero.viewProjectsText}
                    onChange={(e) => handleFieldChange('hero', 'viewProjectsText', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400">Contact button Text</label>
                  <input
                    type="text"
                    value={localData.hero.contactText}
                    onChange={(e) => handleFieldChange('hero', 'contactText', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-zinc-400">Role badges: (Comma Separated)</p>
                <input
                  type="text"
                  value={localData.hero.roles.join(', ')}
                  onChange={(e) => handleFieldChange('hero', 'roles', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* --- ABOUT DATA TAB --- */}
          {activeTab === 'about' && (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-xl font-semibold text-[#FF9EB5]">Biography & Academic Details</h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Professional Narrative Summary</label>
                <textarea
                  value={localData.about.summary}
                  rows={4}
                  onChange={(e) => handleFieldChange('about', 'summary', e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Career Immediate Objective</label>
                <textarea
                  value={localData.about.objective}
                  rows={2}
                  onChange={(e) => handleFieldChange('about', 'objective', e.target.value)}
                  className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5] focus:outline-none"
                />
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Education Credentials (SNS College)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400">Institution Name</label>
                    <input
                      type="text"
                      value={localData.about.education.institution}
                      onChange={(e) => {
                        const updatedEdu = { ...localData.about.education, institution: e.target.value };
                        handleFieldChange('about', 'education', updatedEdu);
                      }}
                      className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400">Graduation Degree</label>
                    <input
                      type="text"
                      value={localData.about.education.degree}
                      onChange={(e) => {
                        const updatedEdu = { ...localData.about.education, degree: e.target.value };
                        handleFieldChange('about', 'education', updatedEdu);
                      }}
                      className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400">Cumulative CGPA score</label>
                    <input
                      type="text"
                      value={localData.about.education.cgpa}
                      onChange={(e) => {
                        const updatedEdu = { ...localData.about.education, cgpa: e.target.value };
                        handleFieldChange('about', 'education', updatedEdu);
                      }}
                      className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400">Expected Graduation Date</label>
                    <input
                      type="text"
                      value={localData.about.education.graduation}
                      onChange={(e) => {
                        const updatedEdu = { ...localData.about.education, graduation: e.target.value };
                        handleFieldChange('about', 'education', updatedEdu);
                      }}
                      className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-zinc-400">Key Highlights points: (Comma Separated)</p>
                <input
                  type="text"
                  value={localData.about.highlights.join(', ')}
                  onChange={(e) => handleFieldChange('about', 'highlights', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm focus:border-[#FF9EB5]"
                />
              </div>
            </div>
          )}

          {/* --- SKILLS TREE METRICS TAB --- */}
          {activeTab === 'skills' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Skills & Technical Radar Chart Node</h2>
                  <p className="text-xs text-zinc-400">Tweak technology ratings, rename skill nodes or categorize them dynamically</p>
                </div>
                <button
                  onClick={addSkillCategory}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded hover:bg-white/15 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF9EB5]" /> Add Skill Group
                </button>
              </div>

              <div className="space-y-6">
                {localData.skills.map((cat) => (
                  <div key={cat.id} className="p-5 bg-white/5 rounded-lg border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => updateSkillCategoryName(cat.id, e.target.value)}
                        className="bg-transparent border-b border-dashed border-white/20 focus:border-[#FF9EB5] focus:outline-none text-base font-bold text-[#D4AF37] px-1 py-0.5"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addSkillToCategory(cat.id)}
                          className="px-2 py-1 bg-[#FF9EB5]/10 text-[#FF9EB5] border border-[#FF9EB5]/25 rounded text-[10px] uppercase font-bold hover:bg-[#FF9EB5]/20 flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Skill
                        </button>
                        <button
                          onClick={() => deleteSkillCategory(cat.id)}
                          className="p-1 px-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded text-[10px] font-bold"
                          title="Delete custom group"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.skills.map((sk, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 bg-black/30 p-2.5 rounded border border-white/5">
                          <input
                            type="text"
                            value={sk.name}
                            onChange={(e) => updateSkillItem(cat.id, idx, 'name', e.target.value)}
                            className="bg-transparent border-none text-sm text-[#FAF6F0] focus:ring-0 focus:outline-none flex-1 font-mono"
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-400 font-mono">{sk.rating}%</span>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={sk.rating}
                              onChange={(e) => updateSkillItem(cat.id, idx, 'rating', parseInt(e.target.value))}
                              className="w-20 accent-[#FF9EB5]"
                            />
                            <button
                              onClick={() => deleteSkillFromCategory(cat.id, idx)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- EXPERIENCES TAB --- */}
          {activeTab === 'experience' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Interactive Career Milestones</h2>
                  <p className="text-xs text-zinc-400">Add, refine and position previous internship records</p>
                </div>
                <button
                  onClick={addExperience}
                  className="px-3 py-1.5 bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 rounded hover:bg-[#FF9EB5]/20 text-xs text-[#FF9EB5] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {localData.experience.map((exp) => (
                  <div key={exp.id} className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 mr-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-zinc-400 uppercase">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperienceItem(exp.id, 'company', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-zinc-400 uppercase">Role Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperienceItem(exp.id, 'role', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-sm font-semibold"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-zinc-400 uppercase">Duration Calendar</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => updateExperienceItem(exp.id, 'duration', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-sm font-mono text-[#D4AF37]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg transition-all"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-400 uppercase">Task Bullet Points (One per line)</label>
                      <textarea
                        rows={4}
                        value={exp.description.join('\n')}
                        onChange={(e) => updateExperienceItem(exp.id, 'description', e.target.value.split('\n'))}
                        className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- PROJECTS MANAGEMENT TAB --- */}
          {activeTab === 'projects' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Interactive Projects Vault</h2>
                  <p className="text-xs text-zinc-400">Configure cards, links, tech stacks, and background thumbnails</p>
                </div>
                <button
                  onClick={addProject}
                  className="px-3 py-1.5 bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 rounded hover:bg-[#FF9EB5]/20 text-xs text-[#FF9EB5] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Launch New Project
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {localData.projects.map((p) => (
                  <div key={p.id} className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-zinc-400">Project Title</label>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => updateProjectItem(p.id, 'title', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm font-bold text-[#D4AF37]"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-zinc-400">Background Thumbnail Image URL</label>
                          <input
                            type="text"
                            value={p.imageUrl || ''}
                            onChange={(e) => updateProjectItem(p.id, 'imageUrl', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-zinc-300 font-mono"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="p-1.5 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-400 font-mono">Summary Description</label>
                      <textarea
                        value={p.description}
                        rows={2}
                        onChange={(e) => updateProjectItem(p.id, 'description', e.target.value)}
                        className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 font-mono">GitHub Repository URL</label>
                        <input
                          type="text"
                          value={p.githubUrl}
                          onChange={(e) => updateProjectItem(p.id, 'githubUrl', e.target.value)}
                          className="bg-black/40 border border-white/10 rounded px-3 py-1 text-xs text-zinc-300 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 font-mono">Live Deployment / Demo Showcase URL</label>
                        <input
                          type="text"
                          value={p.demoUrl}
                          onChange={(e) => updateProjectItem(p.id, 'demoUrl', e.target.value)}
                          className="bg-black/40 border border-white/10 rounded px-3 py-1 text-xs text-zinc-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-400 font-mono">Tech Stack Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={p.techStack.join(', ')}
                        onChange={(e) => updateProjectItem(p.id, 'techStack', e.target.value.split(',').map(s => s.trim()))}
                        className="bg-black/40 border border-white/10 rounded px-3 py-1 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CERTIFICATIONS MANAGMENT TAB --- */}
          {activeTab === 'certs' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Professional Certifications</h2>
                  <p className="text-xs text-zinc-400">Manage credentials for Oracle OCI, Microsoft Azure, and external simulations</p>
                </div>
                <button
                  onClick={addCert}
                  className="px-3 py-1.5 bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 rounded hover:bg-[#FF9EB5]/20 text-xs text-[#FF9EB5] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Import Certificate
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localData.certifications.map((c) => (
                  <div key={c.id} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCertItem(c.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-white/10 text-xs font-bold text-[#FAF6F0] focus:border-[#FF9EB5] focus:outline-none flex-1 py-0.5"
                      />
                      <button
                        onClick={() => deleteCert(c.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-zinc-500 font-mono">Issuer</span>
                        <input
                          type="text"
                          value={c.issuer}
                          onChange={(e) => updateCertItem(c.id, 'issuer', e.target.value)}
                          className="bg-black/30 border border-white/15 rounded px-2 py-1 select-all"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] text-zinc-500 font-mono">Badge Type</span>
                        <input
                          type="text"
                          value={c.badgeType || ''}
                          onChange={(e) => updateCertItem(c.id, 'badgeType', e.target.value)}
                          className="bg-black/30 border border-white/15 rounded px-2 py-1 font-mono text-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- ACHIEVEMENTS TAB --- */}
          {activeTab === 'achievements' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Achievements & High Honors</h2>
                  <p className="text-xs text-zinc-400 font-mono">Manage hackathons placements, solved indices and volunteering credentials</p>
                </div>
                <button
                  onClick={addAchievement}
                  className="px-3 py-1.5 bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 rounded hover:bg-[#FF9EB5]/20 text-xs text-[#FF9EB5] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Register Honor
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">Dynamic Solved Counters Sync</span>
                    <p className="text-xs text-zinc-300">Synchronize the global LeetCode status number directly from usernames</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">Solved Count:</span>
                    <input
                      type="number"
                      value={localData.githubLeetcode.leetcodeSolvedCount}
                      onChange={(e) => {
                        const updated = {
                          ...localData,
                          githubLeetcode: {
                            ...localData.githubLeetcode,
                            leetcodeSolvedCount: parseInt(e.target.value) || 0
                          }
                        };
                        setLocalData(updated);
                        handleSave(updated);
                      }}
                      className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-center font-mono font-bold text-[#FF9EB5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {localData.achievements.map((ach) => (
                    <div key={ach.id} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => updateAchItem(ach.id, 'title', e.target.value)}
                          className="bg-transparent border-b border-white/10 text-sm font-bold text-[#D4AF37] focus:border-[#FF9EB5] focus:outline-none flex-1 py-0.5"
                        />
                        <button
                          onClick={() => deleteAchievement(ach.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-white/5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={ach.detail}
                        rows={2}
                        onChange={(e) => updateAchItem(ach.id, 'detail', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-zinc-400"
                        placeholder="Describe the context of achievement..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- BLOG CMS TAB --- */}
          {activeTab === 'blogs' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Blog CMS Core Platform</h2>
                  <p className="text-xs text-zinc-400 font-mono">Publish, edit, or delete markdown blogs instantly</p>
                </div>
                <button
                  onClick={addBlog}
                  className="px-3 py-1.5 bg-[#FF9EB5]/10 border border-[#FF9EB5]/25 rounded hover:bg-[#FF9EB5]/20 text-xs text-[#FF9EB5] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Blog Post
                </button>
              </div>

              <div className="space-y-6 animate-fade-in">
                {localData.blogs.map((b) => (
                  <div key={b.id} className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-zinc-400">Post Title</label>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => updateBlogItem(b.id, 'title', e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-bold text-[#D4AF37]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-zinc-400">Date</label>
                            <input
                              type="text"
                              value={b.date}
                              onChange={(e) => updateBlogItem(b.id, 'date', e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs font-mono"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-zinc-400 font-mono">Category</label>
                            <input
                              type="text"
                              value={b.category}
                              onChange={(e) => updateBlogItem(b.id, 'category', e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs text-neutral-300"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-zinc-400 font-mono">Read Duration</label>
                            <input
                              type="text"
                              value={b.readTime}
                              onChange={(e) => updateBlogItem(b.id, 'readTime', e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteBlog(b.id)}
                        className="p-1.5 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-400">Snippet Excerpt</label>
                      <input
                        type="text"
                        value={b.excerpt}
                        onChange={(e) => updateBlogItem(b.id, 'excerpt', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-zinc-300"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-400 font-mono">Article Content (Markdown Enabled)</label>
                      <textarea
                        value={b.content}
                        rows={6}
                        onChange={(e) => updateBlogItem(b.id, 'content', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs font-mono text-[#FAF6F0]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CONTACT & AVAILABILITY TAB --- */}
          {activeTab === 'contact' && (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-xl font-semibold text-[#FF9EB5]">Contact Credentials & Opportunities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 font-mono">Email Address</label>
                  <input
                    type="email"
                    value={localData.contact.email}
                    onChange={(e) => {
                      const updated = { ...localData.contact, email: e.target.value };
                      handleFieldChange('contact', 'email', e.target.value);
                    }}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 font-mono">Phone Number</label>
                  <input
                    type="text"
                    value={localData.contact.phone}
                    onChange={(e) => handleFieldChange('contact', 'phone', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 font-mono">Geographical Location</label>
                  <input
                    type="text"
                    value={localData.contact.location}
                    onChange={(e) => handleFieldChange('contact', 'location', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 font-mono">LinkedIn Profile Link</label>
                  <input
                    type="text"
                    value={localData.contact.linkedin}
                    onChange={(e) => handleFieldChange('contact', 'linkedin', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 font-mono">GitHub Profile Link</label>
                  <input
                    type="text"
                    value={localData.contact.github}
                    onChange={(e) => handleFieldChange('contact', 'github', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400 font-mono">LeetCode Profile Link</label>
                  <input
                    type="text"
                    value={localData.contact.leetcode}
                    onChange={(e) => handleFieldChange('contact', 'leetcode', e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-5 border border-white/10 space-y-4">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">🟢 Recruiter Status Indicator Toggles</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'internship', label: 'Available for Internships' },
                    { key: 'sde1', label: 'Available for SDE-1 Opportunities' },
                    { key: 'freelance', label: 'Available for Freelance Projects' },
                    { key: 'collaboration', label: 'Available for Collaborations' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={(localData.contact.availability as any)[item.key]}
                        onChange={(e) => {
                          const updatedAvailability = {
                            ...localData.contact.availability,
                            [item.key]: e.target.checked
                          };
                          const updatedContact = {
                            ...localData.contact,
                            availability: updatedAvailability
                          };
                          setLocalData({ ...localData, contact: updatedContact });
                        }}
                        className="w-4 h-4 rounded border-zinc-700 bg-black/40 text-[#FF9EB5] focus:ring-0"
                      />
                      <span className="text-xs text-zinc-300 font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- SAKURA WIND BREEZE TAB --- */}
          {activeTab === 'sakura' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-[#FF9EB5]">Sakura Particle Engine System</h2>
              <p className="text-xs text-zinc-400 font-mono">Control the rotation physics, quantity of falling petals, and draft parameters</p>

              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span>Petal Count ({localData.sakuraConfig.petalCount})</span>
                    <span className="text-zinc-500 font-mono">Ideal: 20 - 50</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={localData.sakuraConfig.petalCount}
                    onChange={(e) => {
                      const updated = {
                        ...localData.sakuraConfig,
                        petalCount: parseInt(e.target.value)
                      };
                      setLocalData({ ...localData, sakuraConfig: updated });
                    }}
                    className="accent-[#FF9EB5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span>Min Speed ({localData.sakuraConfig.minSpeed})</span>
                    <input
                      type="range"
                      min="0.2"
                      max="4"
                      step="0.1"
                      value={localData.sakuraConfig.minSpeed}
                      onChange={(e) => {
                        const updated = {
                          ...localData.sakuraConfig,
                          minSpeed: parseFloat(e.target.value)
                        };
                        setLocalData({ ...localData, sakuraConfig: updated });
                      }}
                      className="accent-[#FF9EB5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span>Max Speed ({localData.sakuraConfig.maxSpeed})</span>
                    <input
                      type="range"
                      min="1.0"
                      max="8"
                      step="0.2"
                      value={localData.sakuraConfig.maxSpeed}
                      onChange={(e) => {
                        const updated = {
                          ...localData.sakuraConfig,
                          maxSpeed: parseFloat(e.target.value)
                        };
                        setLocalData({ ...localData, sakuraConfig: updated });
                      }}
                      className="accent-[#FF9EB5]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <span>Wind Velocity Vector ({localData.sakuraConfig.windSpeed})</span>
                  <input
                    type="range"
                    min="-2.0"
                    max="4.0"
                    step="0.1"
                    value={localData.sakuraConfig.windSpeed}
                    onChange={(e) => {
                      const updated = {
                        ...localData.sakuraConfig,
                        windSpeed: parseFloat(e.target.value)
                      };
                      setLocalData({ ...localData, sakuraConfig: updated });
                    }}
                    className="accent-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <span>Turbulence / Sin Sway ({localData.sakuraConfig.turbulence})</span>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={localData.sakuraConfig.turbulence}
                    onChange={(e) => {
                      const updated = {
                        ...localData.sakuraConfig,
                        turbulence: parseFloat(e.target.value)
                      };
                      setLocalData({ ...localData, sakuraConfig: updated });
                    }}
                    className="accent-[#FF9EB5]"
                  />
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <span>Petal Bloom Color Hex</span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localData.sakuraConfig.colorHex}
                      onChange={(e) => {
                        const updated = {
                          ...localData.sakuraConfig,
                          colorHex: e.target.value
                        };
                        setLocalData({ ...localData, sakuraConfig: updated });
                      }}
                      className="w-10 h-8 rounded border bg-transparent"
                    />
                    <input
                      type="text"
                      value={localData.sakuraConfig.colorHex}
                      onChange={(e) => {
                        const updated = {
                          ...localData.sakuraConfig,
                          colorHex: e.target.value
                        };
                        setLocalData({ ...localData, sakuraConfig: updated });
                      }}
                      className="bg-black/40 border border-white/10 rounded px-3 text-xs text-zinc-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SPIDER MAN SETTINGS TAB --- */}
          {activeTab === 'spiderman' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-[#FF9EB5]">Spider-Man Aesthetic Customizer</h2>
              <p className="text-xs text-zinc-400 font-mono">Tweak outfit styles, opacity overlay levels, or toggles</p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={localData.spidermanConfig.isActive}
                    onChange={(e) => {
                      const updated = {
                        ...localData.spidermanConfig,
                        isActive: e.target.checked
                      };
                      setLocalData({ ...localData, spidermanConfig: updated });
                    }}
                    className="w-4 h-4 rounded border-zinc-700 bg-black/40 text-[#FF9EB5]"
                  />
                  <span className="text-xs text-zinc-300 font-medium">Render Spiderman on Viewports globally</span>
                </label>

                <div className="flex flex-col gap-1 text-xs">
                  <span>Opacity Overlay Level ({localData.spidermanConfig.opacity})</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={localData.spidermanConfig.opacity}
                    onChange={(e) => {
                      const updated = {
                        ...localData.spidermanConfig,
                        opacity: parseFloat(e.target.value)
                      };
                      setLocalData({ ...localData, spidermanConfig: updated });
                    }}
                    className="accent-[#FF9EB5]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400">Cyber Suit Apparel Style Selection</label>
                  <select
                    value={localData.spidermanConfig.suitStyle}
                    onChange={(e) => {
                      const updated = {
                        ...localData.spidermanConfig,
                        suitStyle: e.target.value as any
                      };
                      setLocalData({ ...localData, spidermanConfig: updated });
                    }}
                    className="w-full bg-black/45 border border-white/10 rounded px-3 py-2 text-xs focus:ring-0 focus:outline-none focus:border-[#FF9EB5]"
                  >
                    <option value="classic">Classic Scarlet & Blue (Original Peter Parker)</option>
                    <option value="miles">Brooklyn Strike Red & Carbon Black (Miles Morales)</option>
                    <option value="iron_spider">Nanotech Iron Spider Gold & Crimson (Tony Stark design)</option>
                    <option value="glowing_sakura">Blooming Sakura Soft Rose & White Gold (Premium Special)</option>
                  </select>
                </div>

                <div className="p-4 bg-white/5 rounded border border-white/10 text-xs text-zinc-400 space-y-1.5">
                  <p className="font-bold text-[#FF9EB5]">🕷️ Responsive Sandbox Interactions:</p>
                  <p>• Clicking Spidey triggers instant flips, waving sequences, or selfie poses.</p>
                  <p>• Clicking anywhere else on the screen fires a web line immediately and pulls him forward.</p>
                  <p>• The character automatically responds to scroll landmarks, anchoring on timeline tracks, cards, or hanging upside-down on Contacts.</p>
                </div>
              </div>
            </div>
          )}

          {/* --- THEME CUSTOMIZER ---- */}
          {activeTab === 'theme' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-[#FF9EB5]">Interactive Theme Palette Manager</h2>
              <p className="text-xs text-zinc-400 font-mono">Tweak color bindings instantly - modifications reflect live across CSS variables</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'primaryColor', label: 'Primary Brand Color (Sakura Pink)' },
                  { key: 'secondaryColor', label: 'Secondary Color (Rose Accent)' },
                  { key: 'accentColor', label: 'Insignia Accents (Soft Gold)' },
                  { key: 'backgroundColor', label: 'Luxury Canvas BG (Dark Surface)' },
                  { key: 'textColor', label: 'Readable Text (Warm Ivory)' }
                ].map((item) => (
                  <div key={item.key} className="flex flex-col p-3 bg-white/5 rounded border border-white/10 gap-1.5 text-xs">
                    <span>{item.label}</span>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={(localData.theme as any)[item.key]}
                        onChange={(e) => {
                          const updated = {
                            ...localData.theme,
                            [item.key]: e.target.value
                          };
                          setLocalData({ ...localData, theme: updated });
                        }}
                        className="w-8 h-8 bg-transparent border rounded"
                      />
                      <input
                        type="text"
                        value={(localData.theme as any)[item.key]}
                        onChange={(e) => {
                          const updated = {
                            ...localData.theme,
                            [item.key]: e.target.value
                          };
                          setLocalData({ ...localData, theme: updated });
                        }}
                        className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 font-mono text-zinc-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- RAW JSON BACKUPS --- */}
          {activeTab === 'raw' && (
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#FF9EB5]">Raw JSON Backups</h2>
                  <p className="text-xs text-zinc-400">Download, upload, or copy your complete portfolio CMS state securely</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-1.5 bg-[#FF9EB5]/10 hover:bg-[#FF9EB5]/20 border border-[#FF9EB5]/25 rounded text-xs font-semibold text-[#FF9EB5] flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download (.json)
                  </button>

                  <label className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/25 rounded text-xs font-semibold text-[#D4AF37] flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {importError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs font-mono">
                  {importError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400 font-mono">Raw State Database Representation</label>
                <textarea
                  value={JSON.stringify(localData, null, 2)}
                  readOnly
                  rows={14}
                  className="w-full bg-black/50 border border-white/10 rounded p-4 text-xs font-mono select-all text-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Simple custom component inline helper for LicenseCheckIcon to avoid strict dependency problems
function LicenseCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 2a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-5a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2h-5Z" />
    </svg>
  );
}
