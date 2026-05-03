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
  ru: 'Веду продуктовое развитие voice AI в группе компаний Prof-IT. Параллельно делаю пет-проекты — собираю продукт от идеи до релиза, тестирую гипотезы кратно быстрее, чем через долгую разработку.',
  en: 'I lead product development for voice AI at Prof-IT group. Alongside that I ship side projects end-to-end, validating hypotheses far faster than through long-form development cycles.',
};

export const currentRole: LocalizedText = {
  ru: 'Product Manager · Prof-IT (zvonobot, effebot, p1sms) · с начала 2022',
  en: 'Product Manager · Prof-IT (zvonobot, effebot, p1sms) · since early 2022',
};

export const currentFocus: LocalizedText = {
  ru: 'Сейчас: запустил и развиваю новый продукт — голосовых AI-агентов для B2B. За 2026 год через них прошло более 500 000 минут разговоров от новых клиентов.',
  en: 'Now: launched and scaling a new product — voice AI agents for B2B. In 2026 the new product has handled over 500,000 minutes of conversations from new customers.',
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
    ru: 'С начала 2022 года — Product Manager в Prof-IT. Работал над голосовыми роботами в zvonobot и effebot, а в 2026-м запустил и развиваю новый продукт группы — голосовых AI-агентов для B2B. За 2026 год через них прошло более 500 000 минут разговоров от новых клиентов.',
    en: 'Product Manager at Prof-IT since early 2022. Worked on voice automation at zvonobot and effebot, and in 2026 launched and have been scaling the group’s new product — voice AI agents for B2B. The new product has handled over 500,000 minutes of new-customer conversations in 2026.',
  },
  {
    ru: 'Где полезен сильнее всего: продукты, где AI встроен в реальный workflow, а не работает как демо. Особенно — голосовые и conversational AI-сценарии, B2B-телефония, customer engagement, операционные системы для отделов продаж и поддержки.',
    en: 'Where I add the most value: products where AI is embedded into a real workflow rather than living as a demo. Especially voice and conversational AI, B2B telephony, customer engagement, and operational tools for sales and support teams.',
  },
  {
    ru: 'Как работаю: сам кодю и собираю прототипы. Это позволяет проверять гипотезы за дни, а не за спринты, и говорить с инженерами на одном языке. Пет-проекты на сайте — иллюстрация скорости: каждый собран за 1–7 дней от идеи до работающего релиза.',
    en: 'How I work: I code and build prototypes myself. That lets me validate hypotheses in days rather than sprints, and stay on the same page with engineers. The pet projects on this site illustrate that speed — each shipped in 1–7 days from idea to working release.',
  },
  {
    ru: 'Что важно для роли: автономность и ownership на ambiguous-задачах, короткий цикл от идеи до проверки, продуктовая логика поверх AI, а не AI ради AI. Сильнее всего полезен в командах, где можно вести задачу end-to-end, а не быть звеном в длинной цепочке согласований.',
    en: 'What matters in a role: autonomy and ownership on ambiguous problems, a short loop from idea to validation, product logic on top of AI rather than AI for its own sake. I am at my best in teams where I can carry a problem end-to-end instead of being one step in a long approval chain.',
  },
  {
    ru: 'Открыт к ролям и коллаборациям в стартапах и tech-командах — особенно в русскоязычных международных продуктах и в нишах voice AI, conversational AI, B2B-инфраструктуре. Английский — рабочий B1+, готов подтянуть до зрелого B2 под нужды роли.',
    en: 'Open to roles and collaborations in startups and tech teams — especially Russian-speaking international products and the voice AI, conversational AI, and B2B infrastructure space. English at working B1+, willing to grow into mature B2 as the role demands.',
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
    eyebrow: { ru: 'Product Manager · Voice AI · Pet projects', en: 'Product Manager · Voice AI · Pet projects' },
    title: {
      ru: 'Веду продуктовое развитие voice AI в Prof-IT и параллельно собираю пет-проекты от идеи до релиза.',
      en: 'I lead voice AI product work at Prof-IT and ship side projects end-to-end on the side.',
    },
    lead: {
      ru: 'С 2022 года продакт в Prof-IT (zvonobot, effebot, p1sms). Сейчас фокус — голосовые AI-агенты для B2B: за 2026 год через них прошло более 500 000 минут разговоров от новых клиентов. Параллельно сам кодю и проверяю гипотезы пет-проектами быстрее, чем через долгую разработку.',
      en: 'Product manager at Prof-IT since 2022 (zvonobot, effebot, p1sms). Currently focused on voice AI agents for B2B — in 2026 the new product has handled over 500,000 minutes of conversations from new customers. Alongside that I code my own pet projects, testing hypotheses far faster than through long-form development.',
    },
    photoAlt: { ru: 'Фото Михаила Семенова', en: 'Photo of Mikhail Semenov' },
    currentlyEyebrow: { ru: 'Сейчас', en: 'Currently' },
    currentlyTitle: { ru: 'Что я делаю сейчас', en: 'What I do now' },
    currentlyRoleLabel: { ru: 'Роль', en: 'Role' },
    currentlyFocusLabel: { ru: 'Фокус', en: 'Focus' },
    currentlyMetricLabel: { ru: 'Сигнал 2026', en: '2026 signal' },
    currentlyMetricValue: {
      ru: '500 000+ минут разговоров от новых клиентов через голосовых AI-агентов',
      en: '500,000+ minutes of new-customer conversations via voice AI agents',
    },
    currentlyRole: {
      ru: 'Product Manager в Prof-IT (zvonobot, effebot, p1sms), с начала 2022',
      en: 'Product Manager at Prof-IT (zvonobot, effebot, p1sms), since early 2022',
    },
    currentlyFocus: {
      ru: 'Веду продуктовое развитие нового продукта — голосовых AI-агентов для B2B',
      en: 'Leading product development for the new product — voice AI agents for B2B',
    },
    postsTitle: { ru: 'Свежие статьи', en: 'Recent posts' },
    postsSubtitle: {
      ru: 'Заметки о продуктовой логике, delivery-процессах и практическом использовании AI.',
      en: 'Notes on product thinking, delivery systems, and practical AI usage.',
    },
    githubStatusTitle: { ru: 'GitHub статус', en: 'GitHub status' },
    githubStatusSubtitle: {
      ru: 'Живой срез публичного профиля GitHub и текущего состояния данных на сайте.',
      en: 'Live snapshot of the public GitHub profile and the current sync state on the site.',
    },
    githubStatusLoading: {
      ru: 'Синхронизация с GitHub...',
      en: 'Syncing with GitHub...',
    },
    githubStatusReady: {
      ru: 'Данные GitHub актуальны.',
      en: 'GitHub data is up to date.',
    },
    githubStatusError: {
      ru: 'Не удалось обновить GitHub-данные прямо сейчас.',
      en: 'Unable to refresh GitHub data right now.',
    },
    githubStatusRepos: { ru: 'Публичные репозитории', en: 'Public repositories' },
    githubStatusFollowers: { ru: 'Подписчики', en: 'Followers' },
    githubStatusFollowing: { ru: 'Подписки', en: 'Following' },
    githubStatusUpdated: { ru: 'Обновлено GitHub', en: 'GitHub updated' },
    githubStatusProfile: { ru: 'Открыть профиль', en: 'Open profile' },
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
      ru: 'Пять выбранных проектов из моего GitHub в едином формате: продукт, стек и где это уже работает.',
      en: 'Five selected GitHub projects in one consistent format: product, stack, and where it already works.',
    },
    empty: {
      ru: 'Сейчас собираю свежие кейсы. Скоро здесь появятся подробные разборы.',
      en: 'I am preparing fresh case studies. Detailed write-ups will appear here soon.',
    },
    typeLabel: { ru: 'Тип', en: 'Type' },
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
