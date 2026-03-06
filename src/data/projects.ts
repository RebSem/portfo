import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'portfo',
    title: {
      ru: 'portfo',
      en: 'portfo',
    },
    summary: {
      ru: 'Личный сайт и двуязычный блог на Astro с SEO-метаданными, GitHub activity и деплоем через GitHub Pages.',
      en: 'Personal site and bilingual Astro blog with SEO metadata, GitHub activity, and GitHub Pages deployment.',
    },
    stack: ['Astro 5', 'TypeScript', 'MDX', 'GitHub Actions', 'GitHub Pages'],
    repoUrl: 'https://github.com/RebSem/portfo',
    demoUrl: 'https://rebsem.ru',
    featured: true,
  },
];
