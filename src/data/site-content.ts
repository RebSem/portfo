import type { AboutContent, LocalizedText } from '../types/content';

export const githubUsername = 'RebSem';
export const telegramUrl = 'https://t.me/Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';

export const homePath = '/';
export const aboutPath = '/about';
export const blogPath = '/blog';

export const heroFallbackName = 'Mikhail Semenov';
export const heroDisplayName: LocalizedText = {
  ru: 'Михаил Семенов',
  en: 'Mikhail Semenov',
};

export const heroSubtitle: LocalizedText = {
  ru: 'Работаю на стыке продукта, UX и инженерии: превращаю сложные задачи в понятные решения и рабочие системы.',
  en: 'I work across product, UX, and engineering, turning complex problems into clear decisions and working systems.',
};

export const heroStatusLoading: LocalizedText = {
  ru: 'Загружаю GitHub-раздел...',
  en: 'Loading GitHub section...',
};

export const heroStatusReady: LocalizedText = {
  ru: 'GitHub-данные загружены',
  en: 'GitHub data loaded',
};

export const heroStatusError: LocalizedText = {
  ru: 'GitHub-данные временно недоступны',
  en: 'GitHub data is temporarily unavailable',
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
    ru: 'Веду продукт end-to-end: от формулировки задачи и гипотез до интерфейса, технического решения и запуска.',
    en: 'I work end to end, from defining the problem and shaping hypotheses to interface decisions, technical delivery, and launch.',
  },
  {
    ru: 'Лучше всего работаю там, где задачу ещё нужно собрать: понять контекст, выстроить приоритеты и снять ключевые риски.',
    en: 'I am most useful when the problem still needs structure, priorities, and a practical path through the main risks.',
  },
  {
    ru: 'Сильнее всего полезен в AI- и цифровых продуктах, где нужны одновременно продуктовая логика, UX-мышление и инженерная дисциплина.',
    en: 'My strongest fit is AI and digital product work that needs product judgment, UX clarity, and engineering discipline at the same time.',
  },
  {
    ru: 'На сайте держу открытый рабочий след: проекты, тексты и GitHub-активность, по которым видно, как я думаю и принимаю решения.',
    en: 'This site keeps a public working trail of projects, writing, and GitHub activity so people can see how I think and make decisions.',
  },
  {
    ru: 'Открыт к новым проектам, коллаборациям и ролям, где ценятся системность, скорость и ответственность за результат.',
    en: 'Open to new projects, collaborations, and roles where systems thinking, speed, and ownership matter.',
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
    home: { ru: 'Главная', en: 'Home' },
    about: { ru: 'Обо мне', en: 'About' },
    blog: blogLabel,
    controlsAria: { ru: 'Элементы управления сайта', en: 'Site controls' },
    primaryAria: { ru: 'Основная навигация', en: 'Primary navigation' },
  },
  home: {
    eyebrow: { ru: 'Product Manager / Product Engineer', en: 'Product Manager / Product Engineer' },
    title: {
      ru: 'Помогаю превращать сложные продуктовые задачи в понятные решения, рабочие интерфейсы и реальные релизы.',
      en: 'I help turn complex product problems into clear product decisions, useful interfaces, and shipped releases.',
    },
    lead: {
      ru: 'Работаю на стыке продукта, UX и инженерии: discovery, постановка решений, delivery и практическое внедрение AI.',
      en: 'I work across product, UX, and engineering: discovery, solution framing, delivery, and practical AI adoption.',
    },
    photoAlt: { ru: 'Фото Михаила Семенова', en: 'Photo of Mikhail Semenov' },
    postsTitle: { ru: 'Свежие статьи', en: 'Recent posts' },
    postsSubtitle: {
      ru: 'Заметки о продуктовой логике, delivery-процессах и практическом использовании AI.',
      en: 'Notes on product thinking, delivery systems, and practical AI usage.',
    },
  },
  hero: {
    badge: { ru: 'Обо мне', en: 'About me' },
    cta: { ru: 'Написать в Telegram', en: 'Message me on Telegram' },
  },
  github: {
    title: { ru: 'GitHub активность', en: 'GitHub activity' },
    subtitle: {
      ru: 'GitHub-профиль и график активности за последний год.',
      en: 'GitHub profile snapshot and activity graph from the last year.',
    },
    totalLabel: {
      ru: 'вкладов за последний год',
      en: 'contributions in the last year',
    },
    snapshotNote: {
      ru: 'Данные обновляются при сборке сайта.',
      en: 'Data is refreshed during site builds.',
    },
    hoverHint: {
      ru: 'Наведите или перейдите на ячейку, чтобы увидеть дату и число вкладов.',
      en: 'Hover or focus a cell to see the exact date and number of contributions.',
    },
    unavailable: {
      ru: 'Не удалось загрузить GitHub-данные. Попробуйте обновить страницу позже.',
      en: 'Unable to load GitHub data. Please refresh later.',
    },
    heatmapAria: {
      ru: 'График активности GitHub',
      en: 'GitHub activity graph',
    },
  },
  about: {
    title: { ru: 'Обо мне', en: 'About me' },
    subtitle: {
      ru: 'Как я работаю на стыке продукта, delivery, AI и инженерии.',
      en: 'How I work across product, delivery, AI, and engineering.',
    },
    skillsTitle: { ru: 'Ключевые навыки', en: 'Core skills' },
  },
  projects: {
    title: { ru: 'Проекты', en: 'Projects' },
    subtitle: {
      ru: 'Пять выбранных проектов из моего GitHub в едином формате: продукт, роль, стек и зачем этот кейс важен.',
      en: 'Five selected GitHub projects in one consistent format: product, role, stack, and why each case matters.',
    },
    empty: {
      ru: 'Сейчас собираю свежие кейсы. Скоро здесь появятся подробные разборы.',
      en: 'I am preparing fresh case studies. Detailed write-ups will appear here soon.',
    },
    typeLabel: { ru: 'Тип', en: 'Type' },
    roleLabel: { ru: 'Роль', en: 'Role' },
    proofLabel: { ru: 'Что показывает', en: 'What it shows' },
    privateCase: { ru: 'Приватный кейс', en: 'Private case' },
    repo: { ru: 'Репозиторий', en: 'Repository' },
    demo: { ru: 'Демо', en: 'Live demo' },
    stackAria: { ru: 'Технологии проекта', en: 'Project technologies' },
    statusInProgress: { ru: 'В работе', en: 'In progress' },
  },
  blog: {
    title: { ru: 'Блог', en: 'Blog' },
    subtitle: {
      ru: 'Публикации о продуктовой логике, системах delivery и практическом использовании AI.',
      en: 'Posts about product thinking, delivery systems, and practical AI usage.',
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
