import React, { useState, useEffect } from 'react';
import { defaultPortfolioData } from './defaultData';
import { PortfolioCMSData } from './types';
import SakuraCanvas from './components/SakuraCanvas';
import SpidermanCanvas from './components/SpidermanCanvas';
import PortfolioHome from './components/PortfolioHome';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioCMSData>(defaultPortfolioData);
  const [currentSection, setCurrentSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync with localStorage on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem('harish_portfolio_data');
      if (stored) {
        setPortfolioData(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading stored CMS data:', err);
    }
  }, []);

  const handleUpdateCMS = (newData: PortfolioCMSData) => {
    setPortfolioData(newData);
    try {
      localStorage.setItem('harish_portfolio_data', JSON.stringify(newData));
    } catch (err) {
      console.error('Error saving CMS data to localStorage:', err);
    }
  };

  // Dynamically update CSS theme variables based on CMS selections
  useEffect(() => {
    const root = document.documentElement;
    const theme = portfolioData.theme;
    
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
  }, [portfolioData.theme]);

  return (
    <div 
      className="relative min-h-screen text-[#FAF6F0] selection:bg-[#FF9EB5]/30 overflow-x-hidden"
      style={{
        backgroundColor: portfolioData.theme.backgroundColor,
        color: portfolioData.theme.textColor,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* 🌸 1. FALLING SAKURA BACKGROUND PETALS (Canvas 60fps) */}
      <SakuraCanvas config={portfolioData.sakuraConfig} />

      {/* 🕷️ 2. CINEMATIC SPIDER-MAN AMBIENT INTERACTIVE ENGINE (GSAP Canvas) */}
      <SpidermanCanvas 
        config={portfolioData.spidermanConfig} 
        activeSection={currentSection} 
      />

      {/* 🏡 3. LIVING PUBLIC PORTFOLIO CONTAINER */}
      <PortfolioHome 
        data={portfolioData} 
        onEnterAdmin={() => setIsAdminOpen(true)}
        activeSectionSetter={(section) => setCurrentSection(section)}
      />

      {/* ⚙️ 4. FULLY EDITABLE ADMINISTRATOR CMS WORKSTATION OVERLAY */}
      {isAdminOpen && (
        <AdminDashboard 
          data={portfolioData}
          onUpdate={handleUpdateCMS}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
