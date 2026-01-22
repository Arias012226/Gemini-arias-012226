import React from 'react';
import { AppSettings, Language, Theme, PainterStyle } from '../types';
import { PAINTER_STYLES } from '../constants';
import { Button, Select, Switch } from './ui/Components';
import { LayoutDashboard, Bot, FileSearch, Shuffle, Palette, Globe, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
  labels: Record<string, string>;
  activeView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, onSettingsChange, labels, activeView, onNavigate }) => {

  const handlePainterChange = (name: string) => {
    onSettingsChange({ ...settings, painterStyle: name });
  };

  const handleJackpot = () => {
    const keys = Object.keys(PAINTER_STYLES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    handlePainterChange(randomKey);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
        activeView === view 
          ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
          : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeView === view ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col bg-card/50 backdrop-blur-xl border-r border-border p-4 shadow-2xl">
      <div className="mb-8 px-4 py-4 border-b border-border/50">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-artistic">
          Artistic AI
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider">STUDIO v1.0</p>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem view="dashboard" icon={LayoutDashboard} label={labels.dashboard} />
        <NavItem view="agent" icon={Bot} label={labels.agentStudio} />
        <NavItem view="doc" icon={FileSearch} label={labels.docIntelligence} />
      </nav>

      <div className="mt-auto space-y-6 pt-6 border-t border-border/50">
        
        {/* Painter Style */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
            <Palette className="w-3 h-3 mr-1" /> {labels.style}
          </label>
          <div className="flex space-x-2">
            <Select 
              value={settings.painterStyle} 
              onChange={(e) => handlePainterChange(e.target.value)}
              className="flex-1 bg-background/50"
            >
              {Object.keys(PAINTER_STYLES).map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </Select>
            <Button variant="outline" className="px-3" onClick={handleJackpot} title={labels.jackpot}>
              <Shuffle className="w-4 h-4 text-primary" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground italic h-4 overflow-hidden text-ellipsis whitespace-nowrap">
            {PAINTER_STYLES[settings.painterStyle]?.description}
          </p>
        </div>

        {/* Theme & Language */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
               <Sun className="w-3 h-3 mr-1" /> {labels.theme}
             </label>
             <div className="flex items-center space-x-2">
               <Switch 
                  checked={settings.theme === 'dark'} 
                  onCheckedChange={(c) => onSettingsChange({...settings, theme: c ? 'dark' : 'light'})} 
               />
               <span className="text-xs">{settings.theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}</span>
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
               <Globe className="w-3 h-3 mr-1" /> {labels.language}
             </label>
              <div className="flex items-center space-x-2">
               <Switch 
                  checked={settings.language === 'tc'} 
                  onCheckedChange={(c) => onSettingsChange({...settings, language: c ? 'tc' : 'en'})} 
               />
               <span className="text-xs">{settings.language === 'en' ? 'EN' : 'TC'}</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
