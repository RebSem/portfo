import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'zvonobot-ai',
    title: {
      ru: 'Zvonobot AI',
      en: 'Zvonobot AI',
    },
    appType: {
      ru: 'Платформа голосовых AI-агентов для B2B (Prof-IT)',
      en: 'Voice AI-agent platform for B2B (Prof-IT)',
    },
    summary: {
      ru: 'Голосовые AI-агенты для исходящих звонков: клиент сам собирает агента, загружает базу и запускает обзвон.',
      en: 'Voice AI agents for outbound calls: a client builds the agent, uploads a contact base and starts the campaign.',
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Flask', 'PostgreSQL', 'Redis', 'LLM orchestration'],
    visibility: 'private',
    demoUrl: 'https://lk2.ai-zvonki.ru',
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
      ru: 'AI-CRM для автопрокатов',
      en: 'AI-powered car rental CRM',
    },
    summary: {
      ru: 'CRM для автопрокатов: AI читает документы клиента, считает риск по сделке и подсказывает менеджеру следующий шаг. Мой собственный продукт.',
      en: 'A CRM for car rental: AI reads client documents, scores deal risk and suggests the manager’s next step. My own product.',
    },
    // Product tags, not the framework list: technologies live on the case
    // page, where they prove a decision.
    stack: ['AI CRM', 'Car rental', 'In development'],
    visibility: 'private',
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
      ru: 'Аналитика звонков голосовых AI-агентов: LLM разбирает разговоры и подсвечивает те, что требуют внимания. Вёл продукт до октября 2026.',
      en: 'Call analytics for voice AI agents: an LLM sorts the conversations and flags the ones that need a human. I ran the product until October 2026.',
    },
    stack: ['LLM call analytics', 'Internal product', 'Prof-IT'],
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
    shipTime: { ru: '1 день', en: '1 day' },
    petOrder: 1,
    proof: {
      ru: 'AI/ops в реальном workflow: убирает ручную чистку баз перед обзвонами, ускоряет подготовку данных для команды.',
      en: 'AI/ops in a real workflow: kills the manual base cleanup before call campaigns and speeds up data prep for the team.',
    },
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
      ru: 'Next.js приложение для генерации персональных PDF-отчётов с оплатой, email-доставкой и аналитикой. Собрано за 3 дня, пример быстрой проверки гипотезы.',
      en: 'Next.js app for generating personalized PDF reports with payments, email delivery, and analytics. Built in 3 days as a fast hypothesis test.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'YooKassa', 'Resend'],
    visibility: 'private',
    tier: 'pet',
    shipTime: { ru: '3 дня', en: '3 days' },
    petOrder: 2,
    proof: {
      ru: 'Полный продукт за 3 дня: оплата, доставка и аналитика end-to-end. Доказательство, что довожу гипотезу до работающего платного продукта.',
      en: 'A full product in 3 days: payments, delivery, and analytics end-to-end. Proof I can take a hypothesis to a working paid product.',
    },
  },
  {
    id: 'Slopiq',
    title: {
      ru: 'Slopiq',
      en: 'Slopiq',
    },
    appType: {
      ru: 'iOS-приложение для катания на лыжах и сноуборде',
      en: 'iOS app for ski and snowboard sessions',
    },
    summary: {
      ru: 'iOS-приложение для трекинга катаний, погоды и AI-помощника по зимним видам спорта. Личный пет-проект на SwiftUI, собран за неделю от идеи до working build.',
      en: 'iOS app for tracking rides, weather, and an AI assistant for winter sports. Personal SwiftUI project that went from idea to a working build in a week.',
    },
    stack: ['SwiftUI', 'iOS', 'Weather', 'AI Assistant'],
    visibility: 'private',
    tier: 'pet',
    shipTime: { ru: '~7 дней', en: '~7 days' },
    petOrder: 4,
    proof: {
      ru: 'Product taste на новой платформе: за неделю собрал нативное iOS-приложение с AI-помощником с нуля до working build.',
      en: 'Product taste on a new platform: a native iOS app with an AI assistant, from zero to a working build in a week.',
    },
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
      ru: 'Сам собрал hiring-сайт на Astro: RU/EN на физических роутах, GitHub-heatmap из API, structured data для индексации. Открытый код, единственный публичный репозиторий из показанных.',
      en: 'Hiring-facing site I built end-to-end on Astro: RU/EN on physical routes, GitHub heatmap from the API, structured data for indexing. Open source, the only public repo among the projects shown.',
    },
    stack: ['Astro 5', 'TypeScript', 'MDX', 'GitHub Actions'],
    visibility: 'public',
    githubRepo: 'portfo',
    repoUrl: 'https://github.com/RebSem/portfo',
    demoUrl: 'https://rebsem.ru',
    featured: true,
    tier: 'pet',
    shipTime: { ru: '3 дня', en: '3 days' },
    petOrder: 5,
    proof: {
      ru: 'Этот самый сайт: единственный публичный репозиторий, агент-native поддержка через PR. Доказательство подхода в действии.',
      en: 'This very site: the only public repo here, maintained agent-native through PRs. Proof of the approach in action.',
    },
  },
];
