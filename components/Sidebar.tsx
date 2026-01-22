import React, { useState } from 'react';
import { AppSettings, Language, Theme, PainterStyle } from '../types';
import { PAINTER_STYLES } from '../constants';
import { Button, Select, Switch, Input } from './ui/Components';
import { LayoutDashboard, Bot, FileSearch, Shuffle, Palette, Globe, Sun, Moon, Key, PanelLeftClose, PanelLeftOpen, NotebookPen } from 'lucide-react';

interface SidebarProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
  labels: Record<string, string>;
  activeView: string;
  onNavigate: (view: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, onSettingsChange, labels, activeView, onNavigate, apiKey, onApiKeyChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  // Only show input if env key is missing
  const isEnvKeyMissing = !process.env.API_KEY;

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
      } ${collapsed ? 'justify-center px-2' : ''}`}
      title={collapsed ? label : undefined}
    >
      <Icon className={`w-5 h-5 ${activeView === view ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{label}</span>}
    </button>
  );

  return (
    <div className={`h-full flex flex-col bg-card/50 backdrop-blur-xl border-r border-border shadow-2xl transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      
      {/* Header & Toggle */}
      <div className={`flex items-center p-4 border-b border-border/50 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
            <div>
                 <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-artistic whitespace-nowrap">
                  Artistic AI
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-wider">STUDIO v2.0</p>
            </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-primary">
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 p-2 mt-2">
        <NavItem view="dashboard" icon={LayoutDashboard} label={labels.dashboard} />
        <NavItem view="agent" icon={Bot} label={labels.agentStudio} />
        <NavItem view="doc" icon={FileSearch} label={labels.docIntelligence} />
        <NavItem view="note" icon={NotebookPen} label={labels.noteKeeper} />
      </nav>

      {/* Footer Controls */}
      <div className="mt-auto space-y-4 pt-4 border-t border-border/50 p-4">
        
        {/* API Key (Only if needed) */}
        {!collapsed && isEnvKeyMissing && (
            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                    <Key className="w-3 h-3 mr-1" /> {labels.apiKey}
                </label>
                <Input 
                    type="password" 
                    value={apiKey} 
                    onChange={(e) => onApiKeyChange(e.target.value)} 
                    placeholder={labels.apiKeyPlaceholder}
                    className="h-8 text-xs"
                />
            </div>
        )}

        {/* Painter Style */}
        {!collapsed ? (
            <div className="space-y-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                <Palette className="w-3 h-3 mr-1" /> {labels.style}
            </label>
            <div className="flex space-x-1">
                <Select 
                value={settings.painterStyle} 
                onChange={(e) => handlePainterChange(e.target.value)}
                className="flex-1 bg-background/50 h-8 text-xs"
                >
                {Object.keys(PAINTER_STYLES).map(style => (
                    <option key={style} value={style}>{style}</option>
                ))}
                </Select>
                <Button variant="outline" className="px-2 h-8" onClick={handleJackpot} title={labels.jackpot}>
                <Shuffle className="w-3 h-3 text-primary" />
                </Button>
            </div>
            </div>
        ) : (
             <div className="flex justify-center" title={labels.style}>
                 <Button variant="ghost" size="sm" onClick={handleJackpot}><Shuffle className="w-4 h-4" /></Button>
             </div>
        )}

        {/* Theme & Language */}
        {!collapsed && (
            <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                <Sun className="w-3 h-3 mr-1" /> {labels.theme}
                </label>
                <div className="flex items-center space-x-2">
                <Switch 
                    checked={settings.theme === 'dark'} 
                    onCheckedChange={(c) => onSettingsChange({...settings, theme: c ? 'dark' : 'light'})} 
                />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                <Globe className="w-3 h-3 mr-1" /> {labels.language}
                </label>
                <div className="flex items-center space-x-2">
                <Switch 
                    checked={settings.language === 'tc'} 
                    onCheckedChange={(c) => onSettingsChange({...settings, language: c ? 'tc' : 'en'})} 
                />
                </div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
