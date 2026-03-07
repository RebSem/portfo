export type Locale = 'ru' | 'en';

export interface LocalizedText {
  ru: string;
  en: string;
}

export interface ProjectMetric {
  label: LocalizedText;
  value: LocalizedText;
}

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  eyebrow: LocalizedText;
  highlight: LocalizedText;
  summary: LocalizedText;
  role: LocalizedText;
  scope: LocalizedText;
  timeline: LocalizedText;
  challenge: LocalizedText;
  responsibilities: LocalizedText[];
  decisions: LocalizedText[];
  outcomes: LocalizedText[];
  metrics: ProjectMetric[];
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
