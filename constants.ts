import React from 'react';
import { PainterStyle, Agent, ChartData } from './types';

// Palette helpers
const colors = {
  slate900: '#0f172a',
  slate50: '#f8fafc',
  amber400: '#fbbf24',
  blue600: '#2563eb',
  rose500: '#f43f5e',
  emerald500: '#10b981',
  violet600: '#7c3aed',
  paper: '#fdf6e3',
  ink: '#333333',
  charcoal: '#2c2c2c',
  canvas: '#f4f1ea',
  gold: '#d4af37',
  deepBlue: '#1a237e',
  neonPink: '#ff00ff',
  neonCyan: '#00ffff',
  pastelPink: '#ffd1dc',
  pastelBlue: '#aec6cf',
};

export const PAINTER_STYLES: Record<string, PainterStyle> = {
  Default: {
    name: 'Default',
    description: 'Clean, modern interface',
    fontClass: 'font-sans',
    css: {
      '--background': colors.slate50,
      '--foreground': colors.slate900,
      '--primary': colors.blue600,
      '--primary-foreground': '#ffffff',
      '--secondary': '#e2e8f0',
      '--secondary-foreground': colors.slate900,
      '--card': '#ffffff',
      '--card-foreground': colors.slate900,
      '--muted': '#f1f5f9',
      '--muted-foreground': '#64748b',
      '--border': '#e2e8f0',
      '--radius': '0.5rem',
    } as React.CSSProperties
  },
  'Van Gogh': {
    name: 'Van Gogh',
    description: 'Post-Impressionist turbulence',
    fontClass: 'font-serif',
    css: {
      '--background': '#eecfa1', // Wheat/Yellow tone
      '--foreground': '#1a237e', // Deep blue
      '--primary': '#fdd835', // Vibrant Yellow
      '--primary-foreground': '#1a237e',
      '--secondary': '#82b1ff',
      '--secondary-foreground': '#000000',
      '--card': 'rgba(255, 255, 255, 0.6)',
      '--card-foreground': '#1a237e',
      '--muted': '#ffecb3',
      '--muted-foreground': '#5c6bc0',
      '--border': '#fdd835',
      '--radius': '1.5rem',
    } as React.CSSProperties
  },
  'Picasso': {
    name: 'Picasso',
    description: 'Cubist geometry',
    fontClass: 'font-mono',
    css: {
      '--background': '#f0f0f0',
      '--foreground': '#000000',
      '--primary': '#e63946', // Red
      '--primary-foreground': '#ffffff',
      '--secondary': '#457b9d', // Blue
      '--secondary-foreground': '#ffffff',
      '--card': '#ffffff',
      '--card-foreground': '#000000',
      '--muted': '#a8dadc',
      '--muted-foreground': '#1d3557',
      '--border': '#000000',
      '--radius': '0px', // Sharp edges
    } as React.CSSProperties
  },
  'Da Vinci': {
    name: 'Da Vinci',
    description: 'Renaissance sketchbook',
    fontClass: 'font-artistic',
    css: {
      '--background': '#f4f1ea', // Parchment
      '--foreground': '#3e2723', // Sepia/Ink
      '--primary': '#8d6e63', // Bronze
      '--primary-foreground': '#ffffff',
      '--secondary': '#d7ccc8',
      '--secondary-foreground': '#3e2723',
      '--card': '#fffbf0',
      '--card-foreground': '#3e2723',
      '--muted': '#efebe9',
      '--muted-foreground': '#5d4037',
      '--border': '#8d6e63',
      '--radius': '0.25rem',
    } as React.CSSProperties
  },
  'Monet': {
    name: 'Monet',
    description: 'Impressionist softness',
    fontClass: 'font-serif',
    css: {
      '--background': '#e0f7fa', // Light blue water
      '--foreground': '#006064',
      '--primary': '#81d4fa',
      '--primary-foreground': '#004d40',
      '--secondary': '#b2dfdb',
      '--secondary-foreground': '#004d40',
      '--card': 'rgba(255, 255, 255, 0.7)',
      '--card-foreground': '#006064',
      '--muted': '#e0f2f1',
      '--muted-foreground': '#00838f',
      '--border': '#80deea',
      '--radius': '1rem',
    } as React.CSSProperties
  },
  'Rembrandt': {
    name: 'Rembrandt',
    description: 'Chiaroscuro depth',
    fontClass: 'font-serif',
    css: {
      '--background': '#211510', // Dark brown
      '--foreground': '#efebe9',
      '--primary': '#ffb300', // Golden light
      '--primary-foreground': '#211510',
      '--secondary': '#3e2723',
      '--secondary-foreground': '#efebe9',
      '--card': '#3e2723',
      '--card-foreground': '#efebe9',
      '--muted': '#4e342e',
      '--muted-foreground': '#a1887f',
      '--border': '#5d4037',
      '--radius': '0.5rem',
    } as React.CSSProperties
  },
  'Warhol': {
    name: 'Warhol',
    description: 'Pop Art explosion',
    fontClass: 'font-sans',
    css: {
      '--background': '#ffff00', // Yellow
      '--foreground': '#000000',
      '--primary': '#ff00ff', // Magenta
      '--primary-foreground': '#ffffff',
      '--secondary': '#00ffff', // Cyan
      '--secondary-foreground': '#000000',
      '--card': '#ffffff',
      '--card-foreground': '#000000',
      '--muted': '#00ff00',
      '--muted-foreground': '#000000',
      '--border': '#000000',
      '--radius': '1.5rem',
    } as React.CSSProperties
  },
  'Dali': {
    name: 'Dalí',
    description: 'Surrealist dreams',
    fontClass: 'font-artistic',
    css: {
      '--background': '#ffe0b2', // Desert sand
      '--foreground': '#3e2723',
      '--primary': '#ef6c00', // Melting clock orange
      '--primary-foreground': '#ffffff',
      '--secondary': '#81d4fa', // Sky blue
      '--secondary-foreground': '#01579b',
      '--card': 'rgba(255, 255, 255, 0.5)',
      '--card-foreground': '#3e2723',
      '--muted': '#ffcc80',
      '--muted-foreground': '#e65100',
      '--border': '#ff9800',
      '--radius': '2rem', // Very round
    } as React.CSSProperties
  },
  'Klimt': {
    name: 'Klimt',
    description: 'Gold leaf and patterns',
    fontClass: 'font-serif',
    css: {
      '--background': '#262626',
      '--foreground': '#d4af37', // Gold
      '--primary': '#d4af37',
      '--primary-foreground': '#000000',
      '--secondary': '#5d4037',
      '--secondary-foreground': '#d4af37',
      '--card': '#1a1a1a',
      '--card-foreground': '#d4af37',
      '--muted': '#333333',
      '--muted-foreground': '#bcaaa4',
      '--border': '#d4af37',
      '--radius': '0.25rem',
    } as React.CSSProperties
  },
  'Mondrian': {
    name: 'Mondrian',
    description: 'De Stijl grid',
    fontClass: 'font-sans',
    css: {
      '--background': '#ffffff',
      '--foreground': '#000000',
      '--primary': '#ff0000',
      '--primary-foreground': '#ffffff',
      '--secondary': '#0000ff',
      '--secondary-foreground': '#ffffff',
      '--card': '#ffffff',
      '--card-foreground': '#000000',
      '--muted': '#ffff00',
      '--muted-foreground': '#000000',
      '--border': '#000000', // Thick borders
      '--radius': '0px',
    } as React.CSSProperties
  },
  'Pollock': {
    name: 'Pollock',
    description: 'Abstract expressionist chaos',
    fontClass: 'font-mono',
    css: {
      '--background': '#f5f5f5',
      '--foreground': '#212121',
      '--primary': '#212121',
      '--primary-foreground': '#ffffff',
      '--secondary': '#9e9e9e',
      '--secondary-foreground': '#000000',
      '--card': '#eeeeee',
      '--card-foreground': '#000000',
      '--muted': '#e0e0e0',
      '--muted-foreground': '#616161',
      '--border': '#bdbdbd',
      '--radius': '0.75rem',
    } as React.CSSProperties
  },
  'Hokusai': {
    name: 'Hokusai',
    description: 'Ukiyo-e woodblock',
    fontClass: 'font-serif',
    css: {
      '--background': '#e3f2fd',
      '--foreground': '#0d47a1', // Prussian blue
      '--primary': '#1565c0',
      '--primary-foreground': '#ffffff',
      '--secondary': '#bbdefb',
      '--secondary-foreground': '#0d47a1',
      '--card': '#ffffff',
      '--card-foreground': '#0d47a1',
      '--muted': '#e1f5fe',
      '--muted-foreground': '#01579b',
      '--border': '#1565c0',
      '--radius': '0.5rem',
    } as React.CSSProperties
  },
  'Kahlo': {
    name: 'Kahlo',
    description: 'Mexican vivid symbolism',
    fontClass: 'font-sans',
    css: {
      '--background': '#e8f5e9',
      '--foreground': '#1b5e20',
      '--primary': '#c62828', // Red
      '--primary-foreground': '#ffffff',
      '--secondary': '#fbc02d', // Yellow
      '--secondary-foreground': '#1b5e20',
      '--card': '#ffffff',
      '--card-foreground': '#1b5e20',
      '--muted': '#c8e6c9',
      '--muted-foreground': '#2e7d32',
      '--border': '#c62828',
      '--radius': '1rem',
    } as React.CSSProperties
  },
  'Matisse': {
    name: 'Matisse',
    description: 'Fauvist cutouts',
    fontClass: 'font-sans',
    css: {
      '--background': '#fff9c4', // Light yellow
      '--foreground': '#b71c1c',
      '--primary': '#1a237e', // Blue
      '--primary-foreground': '#ffffff',
      '--secondary': '#f57f17', // Orange
      '--secondary-foreground': '#ffffff',
      '--card': '#ffffff',
      '--card-foreground': '#b71c1c',
      '--muted': '#ffecb3',
      '--muted-foreground': '#bf360c',
      '--border': '#1a237e',
      '--radius': '2.5rem', // Organic shapes
    } as React.CSSProperties
  },
  'O\'Keeffe': {
    name: 'O\'Keeffe',
    description: 'Modernist macro',
    fontClass: 'font-sans',
    css: {
      '--background': '#fce4ec',
      '--foreground': '#880e4f',
      '--primary': '#d81b60',
      '--primary-foreground': '#ffffff',
      '--secondary': '#f8bbd0',
      '--secondary-foreground': '#880e4f',
      '--card': '#ffffff',
      '--card-foreground': '#880e4f',
      '--muted': '#f48fb1',
      '--muted-foreground': '#ad1457',
      '--border': '#f06292',
      '--radius': '1.5rem',
    } as React.CSSProperties
  },
  'Basquiat': {
    name: 'Basquiat',
    description: 'Neo-expressionist street',
    fontClass: 'font-mono',
    css: {
      '--background': '#121212',
      '--foreground': '#ffffff',
      '--primary': '#ff3d00', // Graffiti orange
      '--primary-foreground': '#000000',
      '--secondary': '#ffff00',
      '--secondary-foreground': '#000000',
      '--card': '#212121',
      '--card-foreground': '#ffffff',
      '--muted': '#424242',
      '--muted-foreground': '#e0e0e0',
      '--border': '#ffffff', // Chalk-like
      '--radius': '0.2rem',
    } as React.CSSProperties
  },
  'Munch': {
    name: 'Munch',
    description: 'Expressionist angst',
    fontClass: 'font-serif',
    css: {
      '--background': '#37474f',
      '--foreground': '#eceff1',
      '--primary': '#ff7043', // Sunset red/orange
      '--primary-foreground': '#263238',
      '--secondary': '#546e7a',
      '--secondary-foreground': '#eceff1',
      '--card': '#455a64',
      '--card-foreground': '#eceff1',
      '--muted': '#78909c',
      '--muted-foreground': '#cfd8dc',
      '--border': '#ff7043',
      '--radius': '0.75rem',
    } as React.CSSProperties
  },
  'Hopper': {
    name: 'Hopper',
    description: 'Realist solitude',
    fontClass: 'font-sans',
    css: {
      '--background': '#263238',
      '--foreground': '#cfd8dc',
      '--primary': '#00897b', // Diner green
      '--primary-foreground': '#ffffff',
      '--secondary': '#455a64',
      '--secondary-foreground': '#ffffff',
      '--card': '#37474f',
      '--card-foreground': '#cfd8dc',
      '--muted': '#546e7a',
      '--muted-foreground': '#b0bec5',
      '--border': '#00897b',
      '--radius': '0.25rem',
    } as React.CSSProperties
  },
  'Kandinsky': {
    name: 'Kandinsky',
    description: 'Abstract spiritual',
    fontClass: 'font-sans',
    css: {
      '--background': '#fff3e0',
      '--foreground': '#212121',
      '--primary': '#304ffe', // Deep Blue
      '--primary-foreground': '#ffffff',
      '--secondary': '#d500f9', // Purple
      '--secondary-foreground': '#ffffff',
      '--card': '#ffffff',
      '--card-foreground': '#212121',
      '--muted': '#ffe0b2',
      '--muted-foreground': '#e65100',
      '--border': '#212121',
      '--radius': '1.25rem',
    } as React.CSSProperties
  },
  'Futurism': {
    name: 'Futurism',
    description: 'Dynamic speed',
    fontClass: 'font-sans',
    css: {
      '--background': '#eceff1',
      '--foreground': '#263238',
      '--primary': '#d50000', // Speed Red
      '--primary-foreground': '#ffffff',
      '--secondary': '#2962ff',
      '--secondary-foreground': '#ffffff',
      '--card': '#ffffff',
      '--card-foreground': '#263238',
      '--muted': '#cfd8dc',
      '--muted-foreground': '#455a64',
      '--border': '#d50000',
      '--radius': '0px', // Angular
    } as React.CSSProperties
  },
};

export const LABELS = {
  en: {
    dashboard: 'Dashboard',
    agentStudio: 'Agent Studio',
    docIntelligence: 'Doc Intelligence',
    noteKeeper: 'AI Note Keeper',
    totalRuns: 'Total Runs',
    activeAgents: 'Active Agents',
    latency: 'Latency',
    run: 'Run',
    manage: 'Manage',
    selectAgent: 'Select Agent',
    prompt: 'Enter your prompt...',
    execute: 'Execute',
    processing: 'Processing...',
    upload: 'Upload File',
    pasteText: 'Paste Text',
    process: 'Process',
    repair: 'AI Repair',
    save: 'Save',
    download: 'Download',
    settings: 'Settings',
    style: 'Artistic Style',
    theme: 'Theme',
    language: 'Language',
    jackpot: 'Jackpot',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter Gemini API Key',
    keywords: 'Keywords',
    entities: 'Entities',
    summary: 'Summary',
    chat: 'Chat',
    magic: 'Magic',
    format: 'Format',
    skillMd: 'SKILL.md',
    preview: 'Preview',
    edit: 'Edit',
  },
  tc: {
    dashboard: '儀表板',
    agentStudio: '代理工作室',
    docIntelligence: '文檔智能',
    noteKeeper: 'AI 筆記助手',
    totalRuns: '總運行次數',
    activeAgents: '活躍代理',
    latency: '延遲',
    run: '運行',
    manage: '管理',
    selectAgent: '選擇代理',
    prompt: '輸入提示...',
    execute: '執行',
    processing: '處理中...',
    upload: '上傳文件',
    pasteText: '貼上文字',
    process: '處理',
    repair: 'AI 修復',
    save: '儲存',
    download: '下載',
    settings: '設定',
    style: '藝術風格',
    theme: '主題',
    language: '語言',
    jackpot: '手氣不錯',
    apiKey: 'API 金鑰',
    apiKeyPlaceholder: '輸入 Gemini API 金鑰',
    keywords: '關鍵字',
    entities: '實體',
    summary: '摘要',
    chat: '聊天',
    magic: '魔法',
    format: '格式化',
    skillMd: 'SKILL.md',
    preview: '預覽',
    edit: '編輯',
  }
};

export const MOCK_DASHBOARD_DATA = {
  usage: [
    { name: 'Mon', value: 400, mobile: 120, desktop: 280 },
    { name: 'Tue', value: 300, mobile: 150, desktop: 150 },
    { name: 'Wed', value: 300, mobile: 180, desktop: 120 },
    { name: 'Thu', value: 200, mobile: 80, desktop: 120 },
    { name: 'Fri', value: 278, mobile: 130, desktop: 148 },
    { name: 'Sat', value: 189, mobile: 90, desktop: 99 },
    { name: 'Sun', value: 239, mobile: 100, desktop: 139 },
  ],
  models: [
    { name: 'Flash', value: 65, fill: 'var(--primary)' },
    { name: 'Pro', value: 25, fill: 'var(--secondary)' },
    { name: 'Image', value: 10, fill: 'var(--muted-foreground)' },
  ],
  metrics: {
    totalRuns: '12,453',
    activeAgents: '8',
    latency: '42ms'
  }
};

export const DEFAULT_AGENTS_YAML = `
- id: "writer"
  name: "Creative Writer"
  description: "Helps with creative writing tasks."
  model: "gemini-3-flash-preview"
  systemPrompt: "You are an expert creative writer. Your tone is imaginative and engaging."
- id: "coder"
  name: "Code Expert"
  description: "Assists with programming and debugging."
  model: "gemini-3-pro-preview"
  systemPrompt: "You are a senior software engineer. Provide clean, efficient, and well-commented code."
- id: "analyst"
  name: "Data Analyst"
  description: "Analyzes data and provides insights."
  model: "gemini-3-flash-preview"
  systemPrompt: "You are a data analyst. Be precise, objective, and use bullet points for clarity."
`;
