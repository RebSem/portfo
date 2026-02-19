import type { AboutContent, LocalizedText } from '../types/content';

export const githubUsername = 'RebSem';
export const telegramUrl = 'https://t.me/Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';

export const aboutPath = '/about';
export const blogPath = '/blog';

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
    blog: blogLabel,
    controlsAria: { ru: 'Элементы управления сайта', en: 'Site controls' },
    primaryAria: { ru: 'Основная навигация', en: 'Primary navigation' },
  },
  hero: {
    badge: { ru: 'Личный сайт-визитка', en: 'Personal one-page portfolio' },
    cta: { ru: 'Написать в Telegram', en: 'Message me on Telegram' },
    github: { ru: 'Мой GitHub', en: 'My GitHub' },
    and: { ru: 'и', en: 'and' },
    messageOnTelegram: { ru: 'написать в Telegram', en: 'message me on Telegram' },
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
    heatmapAria: {
      ru: 'Тепловая карта вкладов GitHub',
      en: 'GitHub contribution heatmap',
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
    stackAria: { ru: 'Технологии проекта', en: 'Project technologies' },
    statusInProgress: { ru: 'Статус: в процессе.', en: 'Status: in progress.' },
  },
  blog: {
    title: { ru: 'Блог', en: 'Blog' },
    subtitle: {
      ru: 'Публикации о разработке, экспериментах и процессе создания продуктов.',
      en: 'Posts about engineering, experiments, and product building.',
    },
    readMore: { ru: 'Читать статью', en: 'Read post' },
    empty: {
      ru: 'Для этой локали пока нет опубликованных постов.',
      en: 'No published posts for this locale yet.',
    },
    backToBlog: { ru: 'Вернуться в блог', en: 'Back to blog' },
    langRu: { ru: 'Русский', en: 'Russian' },
    langEn: { ru: 'Английский', en: 'English' },
    tagsAria: { ru: 'Теги статьи', en: 'Post tags' },
  },
  footer: {
    defaultNote: {
      ru: 'Открыт к новым проектам и коллаборациям.',
      en: 'Open to new projects and collaborations.',
    },
    blogNote: {
      ru: 'Новые публикации появляются регулярно.',
      en: 'New posts are published regularly.',
    },
    socialAria: {
      ru: 'Ссылки на соцсети',
      en: 'Social links',
    },
  },
  localeToggleLabel: {
    ru: 'Switch to English',
    en: 'Switch to Russian',
  },
  themeToggle: themeToggleLabel,
  social: socialLabels,
} as const;
