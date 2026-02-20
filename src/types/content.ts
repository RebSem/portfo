export type Locale = 'ru' | 'en';

export interface LocalizedText {
  ru: string;
  en: string;
}

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface AboutContent {
  intro: LocalizedText;
  skills: string[];
}
