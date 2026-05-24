export type Locale = 'ru' | 'en';

export interface LocalizedText {
  ru: string;
  en: string;
}

export type ProjectTier = 'work-led' | 'pet';

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  appType: LocalizedText;
  summary: LocalizedText;
  stack: string[];
  visibility: 'public' | 'private';
  githubRepo?: string;
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  placeholder?: boolean;
  tier?: ProjectTier;
  shipTime?: LocalizedText;
}

export interface AboutContent {
  intro: LocalizedText;
  skills: string[];
}
