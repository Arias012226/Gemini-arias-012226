import React, { useState, useEffect } from 'react';
import { AppSettings, PainterStyle } from './types';
import { PAINTER_STYLES, LABELS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AgentStudio from './components/AgentStudio';
import DocIntelligence from './components/DocIntelligence';

const App: React.FC = () => {
  // State
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    theme: 'light',
    painterStyle: 'Default',
  });
  const [activeView, setActiveView] = useState('dashboard');

  // Effects for styling
  useEffect(() => {
    // 1. Theme (Light/Dark)
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Painter Style Injection
    const style = PAINTER_STYLES[settings.painterStyle] || PAINTER_STYLES['Default'];
    const body = document.body;
    
    // Apply CSS Variables
    Object.entries(style.css).forEach(([key, value]) => {
      body.style.setProperty(key, value as string);
    });

    // Apply Font Class to Main Container
    // We handle font class in the render output by applying it to the main wrapper
  }, [settings]);

  const currentLabels = LABELS[settings.language];
  const currentPainter = PAINTER_STYLES[settings.painterStyle] || PAINTER_STYLES['Default'];

  // View Routing
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard labels={currentLabels} isDark={settings.theme === 'dark'} />;
      case 'agent':
        return <AgentStudio labels={currentLabels} />;
      case 'doc':
        return <DocIntelligence labels={currentLabels} />;
      default:
        return <Dashboard labels={currentLabels} isDark={settings.theme === 'dark'} />;
    }
  };

  return (
    // The Font Class from the painter style is applied here
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-500 ${currentPainter.fontClass}`}>
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 h-full z-20">
        <Sidebar 
          settings={settings} 
          onSettingsChange={setSettings} 
          labels={currentLabels} 
          activeView={activeView}
          onNavigate={setActiveView}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b bg-card flex justify-between items-center z-20">
          <span className="font-bold text-primary font-artistic">Artistic AI</span>
          <button 
             className="p-2 border rounded"
             onClick={() => { /* Simple toggle for mobile nav could go here */ }}
          >
             ☰
          </button>
        </div>
        
        {/* Mobile Nav Overlay (Simplified) */}
        <div className="md:hidden">
            {/* Ideally would use a drawer component here. For simplicity, sticking to desktop-first with responsive grid layout in content */}
            <div className="p-2 flex justify-around bg-muted/50 text-xs">
                <button onClick={() => setActiveView('dashboard')} className={activeView === 'dashboard' ? 'text-primary font-bold' : ''}>Dashboard</button>
                <button onClick={() => setActiveView('agent')} className={activeView === 'agent' ? 'text-primary font-bold' : ''}>Agent</button>
                <button onClick={() => setActiveView('doc')} className={activeView === 'doc' ? 'text-primary font-bold' : ''}>Doc</button>
            </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
           {/* Background Elements for certain styles */}
           {settings.painterStyle === 'Pollock' && (
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/splatter.png')] mix-blend-multiply z-0" />
           )}
           {settings.painterStyle === 'Mondrian' && (
              <div className="absolute inset-0 pointer-events-none border-[20px] border-black z-50 opacity-10" />
           )}

           <div className="relative z-10 max-w-7xl mx-auto h-full">
            {renderView()}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
