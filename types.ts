import type { CSSProperties } from 'react';

export type Language = 'en' | 'tc';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  language: Language;
  theme: Theme;
  painterStyle: string;
}

export type AppStatus = 'ready' | 'loading' | 'error';

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  avatar?: string;
}

export interface PainterStyle {
  name: string;
  css: CSSProperties;
  fontClass: string;
  description: string;
}

export interface ChartData {
  name: string;
  value: number;
  mobile?: number;
  desktop?: number;
}
