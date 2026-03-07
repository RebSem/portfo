import type { AboutContent, LocalizedText } from '../types/content';

export const githubUsername = 'RebSem';
export const telegramUrl = 'https://t.me/Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';

export const homePath = '/';
export const aboutPath = '/about';
export const blogPath = '/blog';
export const projectsPath = '/projects';

export const heroFallbackName = 'Mikhail Semenov';
export const heroDisplayName: LocalizedText = {
  ru: 'Михаил Семенов',
  en: 'Mikhail Semenov',
};

export const heroSubtitle: LocalizedText = {
  ru: 'Помогаю продуктам расти быстрее за счёт понятного UX и сильной инженерной базы.',
  en: 'I help products grow faster through clear UX and strong engineering foundations.',
};

export const heroStatusLoading: LocalizedText = {
  ru: 'Обновляю данные GitHub...',
  en: 'Refreshing GitHub data...',
};

export const heroStatusReady: LocalizedText = {
  ru: 'Профиль GitHub синхронизирован',
  en: 'GitHub profile synced',
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
    ru: 'Собираю понятные цифровые продукты: от идеи и прототипа до стабильного релиза.',
    en: 'I build understandable digital products from idea and prototype to a stable release.',
  },
  {
    ru: 'Совмещаю продуктовый подход и инженерную глубину: формулирую гипотезы, проверяю их на данных и довожу до production.',
    en: 'I combine product thinking with engineering depth: framing hypotheses, validating with data, and shipping to production.',
  },
  {
    ru: 'Системно внедряю нейросети и AI-агентов в рабочие процессы, чтобы ускорять delivery и повышать качество решений.',
    en: 'I integrate neural tools and AI agents into delivery workflows to increase speed and improve outcome quality.',
  },
  {
    ru: 'Этот сайт — мой открытый трек прогресса: показываю эксперименты, выводы и рабочие внедрения.',
    en: 'This site is my public progress log: experiments, learnings, and practical implementations.',
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
    home: { ru: 'Главная', en: 'Home' },
    about: { ru: 'Обо мне', en: 'About' },
    blog: blogLabel,
    controlsAria: { ru: 'Элементы управления сайта', en: 'Site controls' },
    primaryAria: { ru: 'Основная навигация', en: 'Primary navigation' },
  },
  home: {
    eyebrow: { ru: 'Product strategy + product engineering', en: 'Product strategy + product engineering' },
    title: {
      ru: 'Делаю продуктовые и AI-задачи end-to-end: от неясной постановки и UX до работающего релиза.',
      en: 'I take product and AI work end-to-end, from messy problem framing and UX to a working release.',
    },
    lead: {
      ru: 'Подхожу как продакт, реализую как инженер: собираю структуру решения, убираю лишнюю сложность и довожу систему до production.',
      en: 'I approach work like a product owner and build it like an engineer: shape the solution, remove unnecessary complexity, and ship it to production.',
    },
    photoAlt: { ru: 'Фото Михаила Семенова', en: 'Photo of Mikhail Semenov' },
    proofTitle: { ru: 'Что беру на себя', en: 'What I own' },
    proofOne: {
      ru: 'Формулирую задачу, собираю scope и превращаю размытый запрос в понятный план.',
      en: 'I turn vague requests into a scoped problem statement and a plan the team can execute.',
    },
    proofTwo: {
      ru: 'Проектирую UX и информационную структуру так, чтобы продукт было легко понять и использовать.',
      en: 'I design UX and information architecture so the product is easy to understand and use.',
    },
    proofThree: {
      ru: 'Сам довожу реализацию до релиза: frontend, интеграции, контентная система и delivery-процесс.',
      en: 'I carry implementation through release myself: frontend, integrations, content systems, and delivery workflow.',
    },
    primaryCta: { ru: 'Посмотреть кейс portfo', en: 'See the portfo case' },
    secondaryCta: { ru: 'Написать в Telegram', en: 'Message me on Telegram' },
    availabilityTitle: { ru: 'Подхожу для задач', en: 'Best fit for' },
    availabilityOne: { ru: 'AI-фичи и внутренние инструменты', en: 'AI features and internal tools' },
    availabilityTwo: { ru: 'Product UX, IA и front-of-product layer', en: 'Product UX, IA, and front-of-product work' },
    availabilityThree: { ru: 'Небольшие команды, где нужен сильный generalist', en: 'Small teams that need a strong generalist' },
    postsTitle: { ru: 'Свежие статьи', en: 'Recent posts' },
    postsSubtitle: {
      ru: 'Заметки о разработке, архитектуре и практическом использовании AI.',
      en: 'Notes on engineering, architecture, and practical AI usage.',
    },
    featuredLabel: { ru: 'Избранный кейс', en: 'Featured case' },
    featuredTitle: { ru: 'Проект, в который уже можно провалиться', en: 'A project you can inspect in detail' },
    featuredSubtitle: {
      ru: 'Начал с собственного сайта: это хороший образец того, как я совмещаю positioning, UX, разработку и release discipline.',
      en: 'I started with my own site because it is a good example of how I combine positioning, UX, implementation, and release discipline.',
    },
  },
  hero: {
    badge: { ru: 'Обо мне', en: 'About me' },
    cta: { ru: 'Написать в Telegram', en: 'Message me on Telegram' },
  },
  github: {
    title: { ru: 'GitHub активность', en: 'GitHub activity' },
    subtitle: {
      ru: 'Живая статистика профиля и график активности за год.',
      en: 'Live profile stats and yearly activity graph.',
    },
    totalLabel: {
      ru: 'вкладов за последний год',
      en: 'contributions in the last year',
    },
    hoverHint: {
      ru: 'Наведите на ячейку, чтобы увидеть дату и число вкладов.',
      en: 'Hover a cell to see the exact date and number of contributions.',
    },
    unavailable: {
      ru: 'Не удалось загрузить данные GitHub. Попробуйте обновить страницу позже.',
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
      ru: 'Коротко о подходе к разработке и текущем фокусе.',
      en: 'A short note on how I build and what I focus on now.',
    },
    skillsTitle: { ru: 'Ключевые навыки', en: 'Core skills' },
  },
  projects: {
    title: { ru: 'Проекты', en: 'Projects' },
    subtitle: {
      ru: 'Кейсы, где можно посмотреть не только результат, но и мою роль, решения и ход работы.',
      en: 'Case studies that show not just the outcome, but also my role, decisions, and how the work was shaped.',
    },
    empty: {
      ru: 'Сейчас собираю свежие кейсы. Скоро здесь появятся подробные разборы.',
      en: 'I am preparing fresh case studies. Detailed write-ups will appear here soon.',
    },
    repo: { ru: 'Репозиторий', en: 'Repository' },
    demo: { ru: 'Демо', en: 'Live demo' },
    case: { ru: 'Открыть кейс', en: 'Open case study' },
    roleLabel: { ru: 'Роль', en: 'Role' },
    scopeLabel: { ru: 'Объем', en: 'Scope' },
    timelineLabel: { ru: 'Период', en: 'Timeline' },
    challengeLabel: { ru: 'Контекст и задача', en: 'Context and challenge' },
    responsibilitiesLabel: { ru: 'Что я вел сам', en: 'What I owned directly' },
    decisionsLabel: { ru: 'Ключевые решения', en: 'Key decisions' },
    outcomesLabel: { ru: 'Что получилось', en: 'Outcome' },
    metricsLabel: { ru: 'Срез проекта', en: 'Project snapshot' },
    stackAria: { ru: 'Технологии проекта', en: 'Project technologies' },
    statusInProgress: { ru: 'В работе', en: 'In progress' },
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
