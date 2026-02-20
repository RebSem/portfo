import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'placeholder-01',
    title: {
      ru: 'Проект 01',
      en: 'Project 01',
    },
    summary: {
      ru: 'Карточка-заглушка для будущего кейса. Здесь будет описание реального проекта и результатов.',
      en: 'Placeholder card for an upcoming case study. Real project details and outcomes will be added soon.',
    },
    stack: ['Astro', 'TypeScript', 'TBD'],
    featured: true,
    placeholder: true,
  },
  {
    id: 'placeholder-02',
    title: {
      ru: 'Проект 02',
      en: 'Project 02',
    },
    summary: {
      ru: 'Временная секция под второй проект. Контент будет заменен после подготовки финального описания.',
      en: 'Temporary entry for the second project. Content will be replaced after final project write-up.',
    },
    stack: ['Frontend', 'UI', 'TBD'],
    featured: true,
    placeholder: true,
  },
  {
    id: 'placeholder-03',
    title: {
      ru: 'Проект 03',
      en: 'Project 03',
    },
    summary: {
      ru: 'Третья заглушка для будущего проекта. Подойдет для демонстрации следующего продуктового кейса.',
      en: 'Third placeholder for a future project. Intended for the next product case showcase.',
    },
    stack: ['Backend', 'API', 'TBD'],
    placeholder: true,
  },
];
