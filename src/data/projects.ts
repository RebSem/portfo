import type { ProjectItem } from '../types/content';

export const projects: ProjectItem[] = [
  {
    id: 'obrabot',
    title: {
      ru: 'obrabot',
      en: 'obrabot',
    },
    appType: {
      ru: 'Веб-сервис контроля качества звонков',
      en: 'Call quality control web service',
    },
    summary: {
      ru: 'Сервис забирает звонки из Google Sheets, сегментирует их с помощью AI и сохраняет историю отчётов для операционного контроля.',
      en: 'Service that pulls calls from Google Sheets, segments them with AI, and keeps report history for operational QA.',
    },
    role: {
      ru: 'Архитектура продукта, UX потока отчётов и full-stack delivery.',
      en: 'Product architecture, reporting-flow UX, and full-stack delivery.',
    },
    proof: {
      ru: 'Показывает, что я умею собирать AI-операционный инструмент от пайплайна данных до production-контура.',
      en: 'Shows that I can build an AI operations tool from data pipeline to production hardening.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI API', 'Google Sheets API'],
    visibility: 'private',
    featured: true,
  },
  {
    id: 'portfo',
    title: {
      ru: 'portfo',
      en: 'portfo',
    },
    appType: {
      ru: 'Персональный сайт и двуязычный блог',
      en: 'Personal site and bilingual blog',
    },
    summary: {
      ru: 'Личный сайт-витрина с кейсами, блогом, SEO и GitHub-сигналами для hiring-контекста.',
      en: 'Portfolio site with case studies, a blog, SEO, and GitHub trust signals for a hiring-facing audience.',
    },
    role: {
      ru: 'Продуктовая стратегия, контентная архитектура и frontend delivery.',
      en: 'Product strategy, content architecture, and frontend delivery.',
    },
    proof: {
      ru: 'Показывает, что я умею собирать продуктовую витрину вокруг смысла, контента и технической системы.',
      en: 'Shows that I can build a clear portfolio around positioning, content, and technical structure.',
    },
    stack: ['Astro 5', 'TypeScript', 'MDX', 'GitHub Actions', 'GitHub Pages'],
    visibility: 'public',
    repoUrl: 'https://github.com/RebSem/portfo',
    demoUrl: 'https://rebsem.ru',
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
      ru: 'Бот принимает CSV/XLSX, нормализует номера, фильтрует операторов и возвращает готовую базу без дублей.',
      en: 'Bot that accepts CSV/XLSX files, normalizes numbers, filters operators, and returns a deduplicated clean base.',
    },
    role: {
      ru: 'Сценарий бота, логика обработки файлов и интеграция с внешним API.',
      en: 'Bot flow design, file-processing logic, and external API integration.',
    },
    proof: {
      ru: 'Показывает, как я упаковываю рутинную операционную задачу в понятный self-service инструмент.',
      en: 'Shows how I turn routine operations work into a clear self-service tool.',
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
      ru: 'Next.js приложение для генерации персонализированных астрологических PDF-отчётов с оплатой, email-доставкой и аналитикой.',
      en: 'Next.js application for generating personalized astrology PDF reports with payments, email delivery, and analytics.',
    },
    role: {
      ru: 'Продуктовая логика воронки, платёжный контур и full-stack реализация.',
      en: 'Funnel product logic, payment flow design, and full-stack implementation.',
    },
    proof: {
      ru: 'Показывает, что я умею собирать цифровой продукт с монетизацией, генерацией контента и delivery-инфраструктурой.',
      en: 'Shows that I can build a monetized digital product with content generation and delivery infrastructure.',
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
      ru: 'iOS-приложение для трекинга катаний, погоды, истории сессий и AI-помощника для зимних видов спорта.',
      en: 'iOS application for tracking rides, weather, session history, and an AI assistant for winter sports.',
    },
    role: {
      ru: 'Продуктовый сценарий мобильного трекинга и реализация нативного UX на SwiftUI.',
      en: 'Mobile tracking product flow and native SwiftUI UX implementation.',
    },
    proof: {
      ru: 'Показывает, что я могу упаковать lifestyle-продукт в нативное мобильное приложение с AI-слоем.',
      en: 'Shows that I can package a lifestyle product into a native mobile app with an AI layer.',
    },
    stack: ['SwiftUI', 'iOS', 'Weather', 'Session History', 'AI Assistant'],
    visibility: 'private',
  },
];
