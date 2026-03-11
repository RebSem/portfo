export type Locale = 'ru' | 'en';

export interface LocalizedText {
  ru: string;
  en: string;
}

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  appType: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  proof: LocalizedText;
  stack: string[];
  visibility: 'public' | 'private';
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface AboutContent {
  intro: LocalizedText;
  skills: string[];
}
