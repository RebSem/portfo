import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'zvonobot-ai',
    title: {
      ru: 'Zvonobot AI',
      en: 'Zvonobot AI',
    },
    appType: {
      ru: 'Платформа voice AI-агентов для B2B (Prof-IT)',
      en: 'Voice AI-agent platform for B2B (Prof-IT)',
    },
    summary: {
      ru: 'Новый продукт группы Prof-IT, который я запустил в 2026-м и веду end-to-end: продукт, UX и инженерию. Multi-tenant SaaS-кабинет поверх telephony-инфраструктуры, в котором клиенты собирают и публикуют голосовых AI-агентов для исходящих звонков — продажи, онбординг, реактивация, опросы.',
      en: 'A new Prof-IT product I launched in 2026 and run end-to-end — product, UX, and engineering. A multi-tenant SaaS console built on top of telephony infrastructure: clients assemble and publish voice AI agents for outbound use cases — sales, onboarding, reactivation, surveys.',
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Flask', 'PostgreSQL', 'Redis', 'LLM orchestration'],
    visibility: 'private',
    featured: true,
    tier: 'work-led',
  },
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
    tier: 'work-led',
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
    tier: 'work-led',
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
    tier: 'pet',
    shipTime: { ru: '~2 дня', en: '~2 days' },
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
    tier: 'pet',
    shipTime: { ru: '3 дня', en: '3 days' },
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
    stack: ['SwiftUI', 'iOS', 'Weather', 'AI Assistant'],
    visibility: 'private',
    tier: 'pet',
    shipTime: { ru: '~7 дней', en: '~7 days' },
  },
  {
    id: 'tubedrop',
    title: {
      ru: 'tubedrop',
      en: 'tubedrop',
    },
    appType: {
      ru: 'macOS-обёртка над YouTube-конвертером',
      en: 'macOS wrapper over a YouTube converter',
    },
    summary: {
      ru: 'Двухкликовая локальная веб-обёртка над kaifcodec/ytconverter: drop ссылки — получи файл. Личный пет-проект, чтобы перестать мучиться со сайтами-конвертерами. Собран на коленке за вечер с Claude Code.',
      en: 'Two-click local web wrapper around kaifcodec/ytconverter: drop a link, get the file. Personal pet project to stop fighting sketchy converter sites. Hacked together in an evening with Claude Code.',
    },
    stack: ['Python', 'yt-dlp', 'ffmpeg', 'macOS'],
    visibility: 'public',
    githubRepo: 'tubedrop',
    repoUrl: 'https://github.com/RebSem/tubedrop',
    tier: 'pet',
    shipTime: { ru: '1 вечер', en: '1 evening' },
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
    stack: ['Astro 5', 'TypeScript', 'MDX', 'GitHub Actions'],
    visibility: 'public',
    githubRepo: 'portfo',
    repoUrl: 'https://github.com/RebSem/portfo',
    demoUrl: 'https://rebsem.ru',
    featured: true,
    tier: 'pet',
    shipTime: { ru: '~2 дня', en: '~2 days' },
  },
];
