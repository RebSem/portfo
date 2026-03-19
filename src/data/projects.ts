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
      ru: 'CRM-система для автоматизации автопрокатов: управление автопарком, интеграция с AI для скоринга клиентов и анализа документов.',
      en: 'CRM system for car rental automation: fleet management, AI integration for client scoring and document analysis.',
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI', 'Linear'],
    visibility: 'private',
    featured: true,
  },
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
    stack: ['SwiftUI', 'iOS', 'Weather', 'Session History', 'AI Assistant'],
    visibility: 'private',
  },
];
