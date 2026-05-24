import type { AboutContent, LocalizedText } from '../types/content';

export const githubUsername = 'RebSem';
export const telegramUrl = 'https://t.me/Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';
export const cvUrl = '/mikhail-semenov-cv.pdf';

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

export interface AboutBlock {
  eyebrow: LocalizedText;
  title: LocalizedText;
  body: LocalizedText[];
  bullets?: LocalizedText[];
}

export const aboutBlocks: AboutBlock[] = [
  {
    eyebrow: { ru: '01 · Сейчас', en: '01 · Now' },
    title: { ru: 'Voice AI агенты для B2B', en: 'Voice AI agents for B2B' },
    body: [
      {
        ru: 'Product Manager в Prof-IT с начала 2022. Работал над голосовыми роботами в zvonobot и effebot, а в 2026-м запустил и развиваю новый продукт группы — голосовых AI-агентов для B2B. За 2026 год через них прошло более 500 000 минут разговоров от новых клиентов.',
        en: 'Product Manager at Prof-IT since early 2022. Worked on voice automation at zvonobot and effebot, and in 2026 launched and have been scaling the group’s new product — voice AI agents for B2B. The new product has handled over 500,000 minutes of new-customer conversations in 2026.',
      },
    ],
  },
  {
    eyebrow: { ru: '02 · Где полезен сильнее всего', en: '02 · Where I add the most value' },
    title: { ru: 'AI, встроенный в реальный workflow', en: 'AI embedded into real workflows' },
    body: [
      {
        ru: 'Продукты, где AI работает на бизнес-задачу, а не существует как демо. Точки максимальной пользы:',
        en: 'Products where AI does the actual business job, not just lives as a demo. Sweet spots:',
      },
    ],
    bullets: [
      { ru: 'Голосовые и conversational AI-сценарии', en: 'Voice and conversational AI scenarios' },
      { ru: 'B2B-телефония и customer engagement', en: 'B2B telephony and customer engagement' },
      { ru: 'Операционные инструменты для отделов продаж и поддержки', en: 'Operational tools for sales and support teams' },
    ],
  },
  {
    eyebrow: { ru: '03 · Как работаю', en: '03 · How I work' },
    title: { ru: 'Сам кодю и собираю прототипы', en: 'I code and ship prototypes myself' },
    body: [
      {
        ru: 'Это позволяет проверять гипотезы за дни, а не за спринты, и говорить с инженерами на одном языке. Пет-проекты на сайте — иллюстрация скорости: каждый собран за 1–7 дней от идеи до working release.',
        en: 'That lets me validate hypotheses in days rather than sprints, and stay on the same page with engineers. The pet projects on this site illustrate that speed — each shipped in 1–7 days from idea to a working release.',
      },
    ],
  },
  {
    eyebrow: { ru: '04 · Что важно для роли', en: '04 · What matters in a role' },
    title: { ru: 'Ownership и короткий цикл идея → проверка', en: 'Ownership and a short idea-to-validation loop' },
    body: [],
    bullets: [
      { ru: 'Автономность и ownership на ambiguous-задачах', en: 'Autonomy and ownership on ambiguous problems' },
      { ru: 'Короткий цикл от идеи до проверки', en: 'A short loop from idea to validation' },
      { ru: 'Продуктовая логика поверх AI, а не AI ради AI', en: 'Product logic on top of AI, not AI for its own sake' },
      { ru: 'Команды, где можно вести задачу end-to-end, а не быть звеном в длинной цепочке согласований', en: 'Teams where I can carry a problem end-to-end, not be one step in a long approval chain' },
    ],
  },
  {
    eyebrow: { ru: '05 · Open to', en: '05 · Open to' },
    title: { ru: 'Voice AI · conversational AI · B2B-инфраструктура', en: 'Voice AI · conversational AI · B2B infrastructure' },
    body: [
      {
        ru: 'Открыт к ролям и коллаборациям в стартапах и tech-командах — особенно в русскоязычных международных продуктах. Английский — рабочий B1+, готов подтянуть до зрелого B2 под нужды роли.',
        en: 'Open to roles and collaborations in startups and tech teams — especially Russian-speaking international products. English at working B1+, willing to grow into mature B2 as the role demands.',
      },
    ],
  },
];

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
    eyebrow: { ru: 'Product Manager · Voice AI · Prof-IT', en: 'Product Manager · Voice AI · Prof-IT' },
    title: {
      ru: 'Product Manager. Voice AI.',
      en: 'Voice AI Product Manager.',
    },
    titleAccent: {
      ru: 'Voice AI.',
      en: 'Voice AI.',
    },
    lead: {
      ru: 'С 2022 года веду продукт в Prof-IT (zvonobot, effebot, p1sms). С 2026 фокус — голосовые AI-агенты для B2B. Параллельно сам кодю пет-проекты и проверяю гипотезы за дни, а не за спринты.',
      en: 'Product manager at Prof-IT (zvonobot, effebot, p1sms) since 2022. Since 2026 fully focused on voice AI agents for B2B. I also code my own pet projects, validating hypotheses in days rather than sprints.',
    },
    leadStrong: {
      ru: 'Сейчас открыт к ролям и коллаборациям в voice / conversational AI и B2B-инфраструктуре.',
      en: 'Currently open to roles and collaborations in voice / conversational AI and B2B infrastructure.',
    },
    heroStatus: {
      ru: 'Открыт к новым ролям',
      en: 'Open to new roles',
    },
    heroCtaPrimary: {
      ru: 'Написать в Telegram',
      en: 'Message me on Telegram',
    },
    heroCtaSecondary: {
      ru: 'Скачать CV (PDF)',
      en: 'Download CV (PDF)',
    },
    metricLabel: {
      ru: 'Сигнал 2026 · голосовые AI-агенты Prof-IT',
      en: '2026 signal · Prof-IT voice AI agents',
    },
    metricNumber: '500,000+',
    metricUnit: {
      ru: 'минут',
      en: 'minutes',
    },
    metricCaption: {
      ru: 'разговоров от новых клиентов прошло через продукт, который я веду — за 2026 год.',
      en: 'of new-customer conversations handled by the product I lead — in 2026.',
    },
    metricFootnoteOne: {
      ru: 'Prof-IT · с начала 2022',
      en: 'Prof-IT · since early 2022',
    },
    metricFootnoteTwo: {
      ru: 'B2B · voice + AI',
      en: 'B2B · voice + AI',
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
      ru: 'Два уровня: продукты, которые я веду в Prof-IT, и личные пет-проекты, собранные за дни — иллюстрация скорости shipping.',
      en: 'Two tiers: products I lead at Prof-IT, and personal pet projects shipped in days — proof of shipping speed.',
    },
    workLedTitle: { ru: 'Продукты, которые я веду', en: 'Products I lead' },
    workLedEyebrow: { ru: '01 · Day job', en: '01 · Day job' },
    workLedNote: {
      ru: 'Здесь я отвечаю за продуктовую логику, метрики и delivery end-to-end.',
      en: 'Here I own product logic, metrics, and end-to-end delivery.',
    },
    petTitle: { ru: 'Пет-проекты', en: 'Pet projects' },
    petEyebrow: { ru: '02 · Built in days, not sprints', en: '02 · Built in days, not sprints' },
    petNote: {
      ru: 'Каждый собран лично за 1–7 дней от идеи до working release. Способ быстро валидировать гипотезы и оставаться на одном языке с инженерами.',
      en: 'Each one personally built in 1–7 days from idea to a working release. How I validate hypotheses fast and stay on the same page with engineers.',
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
