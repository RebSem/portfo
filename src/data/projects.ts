import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'portfo',
    title: {
      ru: 'portfo',
      en: 'portfo',
    },
    eyebrow: {
      ru: 'Личный продукт / кейс',
      en: 'Personal product / case study',
    },
    highlight: {
      ru: 'Сайт-портфолио, который показывает не только стек, но и способ мышления и delivery end-to-end.',
      en: 'A portfolio site designed to show not only the stack, but also how I frame and ship work end-to-end.',
    },
    summary: {
      ru: 'Пересобрал личный сайт в hiring-first витрину: двуязычный контент, прозрачная структура кейсов, SEO и статический деплой без лишней сложности.',
      en: 'Rebuilt my personal site as a hiring-first portfolio with bilingual content, a clear case-study structure, SEO coverage, and a simple static deployment flow.',
    },
    role: {
      ru: 'Product strategy, IA, UX, frontend implementation, content system, release setup',
      en: 'Product strategy, IA, UX, frontend implementation, content system, and release setup',
    },
    scope: {
      ru: 'Позиционирование, контентная модель RU/EN, архитектура фронтенда, GitHub data integration, CI/CD',
      en: 'Positioning, RU/EN content model, frontend architecture, GitHub data integration, and CI/CD',
    },
    timeline: {
      ru: 'Итеративная сборка и доработка в 2026',
      en: 'Iterative build and refinement during 2026',
    },
    challenge: {
      ru: 'Нужно было упаковать себя как исполнителя, которого можно понять за минуту: кто я, какие задачи веду end-to-end, и где увидеть доказательства в проектах, а не только набор технологий.',
      en: 'I needed to package myself as someone a hiring manager can understand in under a minute: who I am, what work I can own end-to-end, and where to inspect evidence beyond a list of technologies.',
    },
    responsibilities: [
      {
        ru: 'Сформулировал positioning сайта и структуру маршрутов под hiring-сценарий.',
        en: 'Defined the site positioning and route structure around a hiring-first journey.',
      },
      {
        ru: 'Спроектировал двуязычную контентную модель для страниц и постов без дублирования логики.',
        en: 'Designed a bilingual content model for pages and posts without duplicating logic.',
      },
      {
        ru: 'Собрал интерфейс, метаданные, structured data и статические GitHub endpoints.',
        en: 'Implemented the UI, metadata, structured data, and static GitHub endpoints.',
      },
      {
        ru: 'Настроил рабочий release-процесс: checks, build, deploy и вспомогательные docs.',
        en: 'Set up the release workflow with checks, build, deploy, and supporting docs.',
      },
    ],
    decisions: [
      {
        ru: 'Вынес тексты и большую часть UI copy в централизованную локализованную структуру, чтобы быстрее править narrative и не разводить строки по шаблонам.',
        en: 'Moved the main UI copy into centralized localized structures so I can adjust the narrative quickly without scattering strings across templates.',
      },
      {
        ru: 'Оставил сайт статическим на Astro, чтобы деплой был предсказуемым, а контент и SEO не зависели от runtime-бэкенда.',
        en: 'Kept the site fully static on Astro so deployment stays predictable and the content and SEO layer do not depend on a runtime backend.',
      },
      {
        ru: 'Сделал GitHub-данные build-time артефактами, а не клиентской интеграцией, чтобы убрать хрупкость и лишние внешние зависимости.',
        en: 'Turned GitHub data into build-time artifacts instead of a client-side integration to reduce fragility and unnecessary external dependencies.',
      },
    ],
    outcomes: [
      {
        ru: 'Получился живой портфельный сайт с RU/EN контентом, блогом и отдельной зоной для детального разбора проектов.',
        en: 'The result is a live portfolio with RU/EN content, a blog, and a dedicated space for deeper project breakdowns.',
      },
      {
        ru: 'Сайт теперь проще расширять новыми кейсами и писать под него материалы без изменения базовой архитектуры.',
        en: 'The site is now easier to expand with new case studies and supporting write-ups without changing the underlying architecture.',
      },
      {
        ru: 'Этот проект сам по себе стал примером того, как я совмещаю продуктовую упаковку, UX и инженерную реализацию.',
        en: 'The project itself became an example of how I combine product packaging, UX, and implementation in one delivery stream.',
      },
    ],
    metrics: [
      {
        label: {
          ru: 'Формат работы',
          en: 'Delivery mode',
        },
        value: {
          ru: 'End-to-end',
          en: 'End-to-end',
        },
      },
      {
        label: {
          ru: 'Контентная модель',
          en: 'Content model',
        },
        value: {
          ru: 'RU / EN',
          en: 'RU / EN',
        },
      },
      {
        label: {
          ru: 'Платформа',
          en: 'Platform',
        },
        value: {
          ru: 'Static Astro',
          en: 'Static Astro',
        },
      },
      {
        label: {
          ru: 'Релиз',
          en: 'Release',
        },
        value: {
          ru: 'GitHub Actions + Pages',
          en: 'GitHub Actions + Pages',
        },
      },
    ],
    stack: ['Astro 5', 'TypeScript', 'MDX', 'GitHub Actions', 'GitHub Pages'],
    repoUrl: 'https://github.com/RebSem/portfo',
    demoUrl: 'https://rebsem.ru',
    featured: true,
  },
];

export const visibleProjects = projects.filter((project) => !project.placeholder);

export const getProjectById = (id: string) => visibleProjects.find((project) => project.id === id);
