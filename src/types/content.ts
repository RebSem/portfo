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
  /** One line on what shipping this project proves (product taste, speed, AI-in-workflow). */
  proof?: LocalizedText;
  /** Lower sorts first within the pet tier; AI/product-relevant projects lead. */
  petOrder?: number;
}

