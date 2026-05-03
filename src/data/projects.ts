import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'cursivo',
    title: {
      ru: 'cursivo',
      en: 'cursivo',
    },
    appType: {
      ru: 'AI-CRM для автопроката',
      en: 'AI-powered car rental CRM',
    },
    summary: {
      ru: 'CRM для автопрокатов: управление автопарком, скоринг клиентов и анализ документов через AI. Личный продукт, который веду от продуктовой логики до релиза.',
      en: 'CRM for car rental businesses: fleet management, AI client scoring, and document analysis. A personal product I lead from product logic to release.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI', 'Linear'],
    visibility: 'private',
    githubRepo: 'cursivo-site',
    repoUrl: 'https://github.com/RebSem/cursivo-site',
    featured: true,
    demoUrl: 'https://cursivo.xyz',
  },
  {
    id: 'obrabot',
    title: {
      ru: 'obrabot',
      en: 'obrabot',
    },
    appType: {
      ru: 'Внутренний кабинет аналитики voice AI в Prof-IT',
      en: 'Internal voice AI analytics dashboard at Prof-IT',
    },
    summary: {
      ru: 'Внутренний продукт Prof-IT: личный кабинет с аналитикой и дашбордами по работе голосовых AI-агентов. AI сегментирует звонки и подсвечивает то, что требует внимания. Я веду продукт.',
      en: 'Internal Prof-IT product: a personal cabinet with analytics and dashboards for voice AI agents. AI segments calls and surfaces what needs human attention. I run the product.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI API', 'Google Sheets API'],
    visibility: 'private',
    featured: true,
  },
  {
    id: 'bazabot',
    title: {
      ru: 'bazabot',
      en: 'bazabot',
    },
    appType: {
      ru: 'Telegram-бот для очистки клиентских баз',
      en: 'Telegram bot for cleaning client bases',
    },
    summary: {
      ru: 'Бот принимает CSV/XLSX, нормализует номера, фильтрует операторов и возвращает готовую базу без дублей. Внутренний инструмент, ускоряющий подготовку данных для обзвонов.',
      en: 'Bot that accepts CSV/XLSX files, normalizes numbers, filters operators, and returns a deduplicated clean base. Internal tool that speeds up call-list preparation.',
    },
    stack: ['Python', 'Telegram Bot API', 'CSV/XLSX', 'p1sms API'],
    visibility: 'private',
  },
  {
    id: 'Zodial',
    title: {
      ru: 'Zodial',
      en: 'Zodial',
    },
    appType: {
      ru: 'Платформа персональных PDF-отчётов',
      en: 'Personalized PDF report platform',
    },
    summary: {
      ru: 'Next.js приложение для генерации персональных PDF-отчётов с оплатой, email-доставкой и аналитикой. Собрано за 3 дня — пример быстрой проверки гипотезы.',
      en: 'Next.js app for generating personalized PDF reports with payments, email delivery, and analytics. Built in 3 days — example of a fast hypothesis test.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'YooKassa', 'Resend'],
    visibility: 'private',
  },
  {
    id: 'Slopiq',
    title: {
      ru: 'Slopiq',
      en: 'Slopiq',
    },
    appType: {
      ru: 'iOS-приложение для ski/snowboard сессий',
      en: 'iOS app for ski and snowboard sessions',
    },
    summary: {
      ru: 'iOS-приложение для трекинга катаний, погоды и AI-помощника по зимним видам спорта. Личный пет-проект на SwiftUI — собран за неделю от идеи до working build.',
      en: 'iOS app for tracking rides, weather, and an AI assistant for winter sports. Personal SwiftUI project — went from idea to a working build in a week.',
    },
    stack: ['SwiftUI', 'iOS', 'Weather', 'Session History', 'AI Assistant'],
    visibility: 'private',
  },
  {
    id: 'portfo',
    title: {
      ru: 'portfo',
      en: 'portfo',
    },
    appType: {
      ru: 'Этот сайт',
      en: 'This site',
    },
    summary: {
      ru: 'Сам собрал hiring-сайт на Astro: RU/EN на физических роутах, GitHub-heatmap из API, structured data для индексации. Открытый код — единственный публичный репозиторий из показанных.',
      en: 'Hiring-facing site I built end-to-end on Astro: RU/EN on physical routes, GitHub heatmap from the API, structured data for indexing. Open source — the only public repo among the projects shown.',
    },
    stack: ['Astro 5', 'TypeScript', 'MDX', 'GitHub Actions', 'GitHub Pages'],
    visibility: 'public',
    githubRepo: 'portfo',
    repoUrl: 'https://github.com/RebSem/portfo',
    demoUrl: 'https://rebsem.ru',
    featured: true,
  },
];
