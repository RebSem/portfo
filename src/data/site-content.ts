import type { AboutContent, LocalizedText } from '../types/content';

export const githubUsername = 'RebSem';
export const telegramUrl = 'https://t.me/Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';
export const blogPath = '/posts';

export const heroFallbackName = 'Mikhail Semenov';

export const heroSubtitle: LocalizedText = {
  ru: 'Собираю понятные веб-продукты и довожу идеи до рабочего релиза.',
  en: 'I build clear web products and ship ideas all the way to production.',
};

export const heroStatusLoading: LocalizedText = {
  ru: 'Обновляю статус GitHub...',
  en: 'Refreshing GitHub status...',
};

export const heroStatusReady: LocalizedText = {
  ru: 'GitHub-активность загружена',
  en: 'GitHub activity loaded',
};

export const heroStatusError: LocalizedText = {
  ru: 'GitHub временно недоступен',
  en: 'GitHub is temporarily unavailable',
};

export const blogLabel: LocalizedText = {
  ru: 'Блог',
  en: 'Blog',
};

export const themeToggleLabel = {
  toDark: {
    ru: 'Включить тёмную тему',
    en: 'Switch to dark theme',
  },
  toLight: {
    ru: 'Включить светлую тему',
    en: 'Switch to light theme',
  },
} as const;

export const socialLabels = {
  github: {
    ru: 'GitHub профиль',
    en: 'GitHub profile',
  },
  telegram: {
    ru: 'Telegram',
    en: 'Telegram',
  },
  email: {
    ru: 'Написать на почту',
    en: 'Send email',
  },
  linkedin: {
    ru: 'LinkedIn профиль',
    en: 'LinkedIn profile',
  },
} as const;

export const aboutParagraphs: LocalizedText[] = [
  {
    ru: 'Глубоко в режиме разработки: тестирую стек, собираю интерфейсы и постоянно улучшаю архитектуру.',
    en: 'Deep in building mode: testing tooling, designing interfaces, and improving architecture continuously.',
  },
  {
    ru: 'Мне нравится делать продукты, которые быстро запускаются и остаются удобными в поддержке.',
    en: 'I like building products that launch fast and stay maintainable over time.',
  },
  {
    ru: 'Фокус сейчас: Astro, TypeScript, Node.js и аккуратный front-end с живыми данными.',
    en: 'Current focus: Astro, TypeScript, Node.js, and clean front-end systems with live data.',
  },
  {
    ru: 'Открыт к новым задачам, коллаборациям и техническим обсуждениям.',
    en: 'Open to new projects, collaborations, and technical conversations.',
  },
];

export const aboutContent: AboutContent = {
  intro: {
    ru: aboutParagraphs[0].ru,
    en: aboutParagraphs[0].en,
  },
  skills: [
    'JavaScript / TypeScript',
    'React',
    'Astro',
    'Node.js',
    'REST API',
    'Docker',
    'PostgreSQL',
    'GitHub Actions',
  ],
};

export const uiCopy = {
  nav: {
    about: { ru: 'Обо мне', en: 'About' },
    github: { ru: 'GitHub', en: 'GitHub' },
    projects: { ru: 'Проекты', en: 'Projects' },
    contact: { ru: 'Контакты', en: 'Contact' },
    blog: blogLabel,
  },
  hero: {
    badge: { ru: 'Личный сайт-визитка', en: 'Personal one-page portfolio' },
    cta: { ru: 'Написать в Telegram', en: 'Message me on Telegram' },
  },
  github: {
    title: { ru: 'GitHub активность', en: 'GitHub activity' },
    subtitle: {
      ru: 'Живые данные профиля и календарь вкладов за последний год.',
      en: 'Live profile data and yearly contribution heatmap.',
    },
    totalLabel: {
      ru: 'вкладов за последний год',
      en: 'contributions in the last year',
    },
    hoverHint: {
      ru: 'Наведите на кубик, чтобы увидеть дату и число вкладов.',
      en: 'Hover a square to see the exact date and contributions.',
    },
    unavailable: {
      ru: 'Не удалось загрузить данные GitHub. Попробуйте обновить страницу позже.',
      en: 'Unable to load GitHub data. Please refresh later.',
    },
  },
  about: {
    title: { ru: 'Обо мне', en: 'About me' },
    subtitle: {
      ru: 'Кратко о фокусе и подходе к разработке.',
      en: 'A quick snapshot of my focus and engineering approach.',
    },
    skillsTitle: { ru: 'Ключевые навыки', en: 'Core skills' },
  },
  projects: {
    title: { ru: 'Проекты', en: 'Projects' },
    subtitle: {
      ru: 'Подборка избранных работ. Список полностью редактируется вручную в data-файле.',
      en: 'Selected work. The list is fully managed manually in the data file.',
    },
    empty: {
      ru: 'Список проектов пока пуст. Добавьте карточки в src/data/projects.ts.',
      en: 'Project list is empty. Add cards to src/data/projects.ts.',
    },
    repo: { ru: 'Репозиторий', en: 'Repository' },
    demo: { ru: 'Демо', en: 'Live demo' },
  },
  contact: {
    title: { ru: 'Связаться со мной', en: 'Contact me' },
    subtitle: {
      ru: 'Открыт к новым задачам, партнёрствам и техническим обсуждениям.',
      en: 'Open to new projects, partnerships, and technical discussions.',
    },
    cta: { ru: 'Написать в Telegram', en: 'Write on Telegram' },
  },
  localeToggleLabel: {
    ru: 'Switch to English',
    en: 'Переключить на русский',
  },
  themeToggle: themeToggleLabel,
  social: socialLabels,
} as const;
