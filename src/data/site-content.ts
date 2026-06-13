import type { LocalizedText } from '../types/content';

export const githubUsername = 'RebSem';
export const telegramUrl = 'https://t.me/Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';
export const cvPath = '/cv.pdf';

export const homePath = '/';
export const aboutPath = '/about';
export const blogPath = '/blog';

/** Work format and availability signal — recruiter filters and LLMs key on this first. */
export const workFormat: LocalizedText = {
  ru: 'Remote · GMT+5 · открыт к релокации · RU native, EN working',
  en: 'Remote · GMT+5 · open to relocation · RU native, EN working',
};

/** Compact timezone/format chip shown next to the hero status. */
export const locationSignal: LocalizedText = {
  ru: 'Remote · GMT+5 · релокация',
  en: 'Remote · GMT+5 · relocation',
};

export const heroFallbackName = 'Mikhail Semenov';
export const heroDisplayName: LocalizedText = {
  ru: 'Михаил Семенов',
  en: 'Mikhail Semenov',
};

export const heroSubtitle: LocalizedText = {
  ru: 'AI Product Manager: веду продукт и двигаю его за счёт продуманного внедрения AI. Сейчас фокус на голосовых AI-агентах для B2B в Prof-IT. Параллельно собираю пет-проекты от идеи до релиза с AI-агентами (Claude Code, Codex) и проверяю гипотезы за дни, а не за спринты. Remote, GMT+5, открыт к релокации.',
  en: 'AI Product Manager: I own the product and move it through thoughtful AI adoption. Right now my focus is voice AI agents for B2B at Prof-IT. Alongside that I ship side projects end-to-end with AI agents (Claude Code, Codex), validating hypotheses in days, not sprints. Remote, GMT+5, open to relocation.',
};

export const currentRole: LocalizedText = {
  ru: 'Product Manager · Prof-IT (zvonobot, effebot, p1sms) · с начала 2022',
  en: 'Product Manager · Prof-IT (zvonobot, effebot, p1sms) · since early 2022',
};

export const currentFocus: LocalizedText = {
  ru: 'Сейчас запустил и развиваю новый продукт группы: голосовых AI-агентов для B2B. За 2026 год через них прошло более 500 000 минут разговоров от новых клиентов.',
  en: 'Now: launched and scaling a new product, voice AI agents for B2B. In 2026 the new product has handled over 500,000 minutes of conversations from new customers.',
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
        ru: 'Product Manager в Prof-IT с начала 2022. Работал над голосовыми роботами в zvonobot и effebot, а в 2026-м запустил и развиваю новый продукт группы: голосовых AI-агентов для B2B. За 2026 год через них прошло более 500 000 минут разговоров от новых клиентов.',
        en: 'Product Manager at Prof-IT since early 2022. Worked on voice automation at zvonobot and effebot, and in 2026 launched and have been scaling the group’s new product: voice AI agents for B2B. The new product has handled over 500,000 minutes of new-customer conversations in 2026.',
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
      { ru: 'AI, который закрывает реальную бизнес-задачу, а не живёт как демо', en: 'AI that solves a real business job, not AI that lives as a demo' },
      { ru: 'Продукты, где AI убирает рутину и ускоряет работу команд', en: 'Products where AI removes busywork and speeds teams up' },
      { ru: 'Голосовые и conversational AI-сценарии (один из доменов)', en: 'Voice and conversational AI scenarios (one of the domains)' },
    ],
  },
  {
    eyebrow: { ru: '03 · Как работаю', en: '03 · How I work' },
    title: { ru: 'Пишу код в паре с AI-агентами', en: 'I ship code paired with AI agents' },
    body: [
      {
        ru: 'Весь код пет-проектов пишу с AI-агентами Claude Code и Codex. Это позволяет проверять гипотезы за дни, а не за спринты, и говорить с инженерами на одном языке. Каждый пет-проект на сайте прошёл путь от идеи до working release за 1–7 дней.',
        en: 'I build my pet projects with AI coding agents (Claude Code and Codex). That lets me validate hypotheses in days rather than sprints, and stay on the same page with engineers. Each pet project on this site went from idea to a working release in 1–7 days.',
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
      { ru: 'Команды, где можно вести задачу end-to-end, а не быть звеном в длинной цепочке согласований', en: 'Teams where I can carry a problem end-to-end, not one step in a long approval chain' },
    ],
  },
  {
    eyebrow: { ru: '05 · Open to', en: '05 · Open to' },
    title: { ru: 'AI Product Manager, кто драйвит продукт через AI', en: 'AI Product Manager who drives the product through AI' },
    body: [
      {
        ru: 'Открыт к ролям AI Product Manager, где я отвечаю за продукт и двигаю его за счёт продуманного, нужного внедрения AI, а не AI ради AI. Голос лишь один из доменов, где я это уже делал; интересны любые продукты, где AI закрывает реальную бизнес-задачу. Формат: remote (живу в зоне GMT+5), открыт к релокации. Русский родной, английский рабочий, уверенно в письменном и async-общении.',
        en: 'Open to AI Product Manager roles where I own the product and move it through thoughtful, purposeful AI adoption, not AI for its own sake. Voice is just one domain where I’ve already done this; I’m interested in any product where AI solves a real business job. Format: remote (I’m in the GMT+5 zone), open to relocation. Russian native, English at working proficiency, comfortable in written and async communication.',
      },
    ],
  },
  {
    eyebrow: { ru: '06 · Где буду полезен меньше', en: '06 · Where I’m a weaker fit' },
    title: { ru: 'Честно про anti-fit', en: 'An honest anti-fit' },
    body: [
      {
        ru: 'Чтобы не тратить ваше и своё время, вот где я не лучший выбор:',
        en: 'So we don’t waste each other’s time, here is where I’m not the best pick:',
      },
    ],
    bullets: [
      { ru: 'Чисто исследовательский ML/data science без продуктового слоя поверх', en: 'Pure research ML / data science with no product layer on top' },
      { ru: 'Роль звена в длинной цепочке согласований без ownership на задаче', en: 'A single step in a long approval chain with no ownership over the problem' },
      { ru: 'Продукт, где AI добавляют «для галочки», а не под реальную бизнес-задачу', en: 'Products that add AI as a checkbox rather than for a real business job' },
      { ru: 'Роли, где английский нужен на уровне ведущего публичных переговоров на C-уровне (письменно и async комфортно)', en: 'Roles needing C-level live negotiation in English (written and async are comfortable)' },
    ],
  },
];

/** Grouped skills — rendered on About and mirrored into JSON-LD knowsAbout. */
export interface SkillGroup {
  label: LocalizedText;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: { ru: 'Продукт', en: 'Product' },
    items: [
      'Product discovery',
      'Product strategy',
      'Roadmap',
      'Метрики · unit-экономика',
      'CustDev',
      'B2B SaaS',
      'Go-to-market',
    ],
  },
  {
    label: { ru: 'AI / LLM', en: 'AI / LLM' },
    items: [
      'Voice AI agents',
      'Conversational AI',
      'LLM orchestration',
      'Prompt engineering',
      'RAG',
      'AI-в-workflow (не demo)',
    ],
  },
  {
    label: { ru: 'Delivery', en: 'Delivery' },
    items: [
      'Spec → review → ship',
      'Agent-native (Claude Code, Codex)',
      'Lean Startup · 0→1',
      'Быстрая валидация гипотез',
    ],
  },
  {
    label: { ru: 'Tech (общий язык с инженерами)', en: 'Tech (shared language with engineers)' },
    items: [
      'React / Next.js',
      'TypeScript',
      'Python / Flask',
      'PostgreSQL / Redis',
      'REST · интеграции',
      'Телефония',
    ],
  },
];

/** Flat domains/skills for Person.knowsAbout in structured data. */
export const knowsAbout: string[] = [
  'AI Product Management',
  'Voice AI agents',
  'Conversational AI',
  'LLM orchestration',
  'Prompt engineering',
  'RAG',
  'B2B SaaS',
  'Product discovery',
  'Product strategy',
  'Unit economics',
  'AI-assisted delivery',
  'B2B telephony',
];

/**
 * Single source of truth for the Person entity in JSON-LD.
 * Used by every page so structured data never drifts between routes.
 * `url` is page-specific and passed in by the caller.
 */
export function buildPersonSchema(url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: heroDisplayName.en,
    alternateName: heroDisplayName.ru,
    jobTitle: 'AI Product Manager',
    description:
      'AI Product Manager at Prof-IT leading voice AI agents for B2B. Ships products with AI coding agents (Claude Code, Codex), validating hypotheses in days. Remote, GMT+5, open to relocation.',
    url,
    image: 'https://rebsem.ru/main-hero.jpg',
    email: `mailto:${email}`,
    knowsLanguage: ['ru', 'en'],
    knowsAbout,
    worksFor: {
      '@type': 'Organization',
      name: 'Prof-IT',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'AI Product Manager',
      skills:
        'Product management, voice AI agents, LLM orchestration, B2B SaaS, AI-assisted delivery',
    },
    seeks: {
      '@type': 'Demand',
      name: 'AI Product Manager roles where the product grows through thoughtful AI adoption',
    },
    sameAs: [
      `https://github.com/${githubUsername}`,
      telegramUrl,
      linkedinUrl,
    ],
  };
}

export interface AgentOpsStep {
  k: string;
  title: LocalizedText;
  body: LocalizedText;
}

export const agentOps = {
  eyebrow: { ru: 'Как я делаю продукты · Claude Code & Codex', en: 'How I ship · Claude Code & Codex' },
  title: { ru: 'Моя команда — AI-агенты.', en: 'I run a team of AI agents.' },
  lead: {
    ru: 'Постановка, ограничения и ревью остаются за мной. Реализацию делают Claude Code и Codex. Так пет-проект проходит путь от идеи до релиза за дни, а этот сайт поддерживает сам себя: каждое изменение — это PR, написанный агентом и проверенный мной.',
    en: 'Spec, constraints, and review stay with me. Implementation goes to Claude Code and Codex. That is how a side project gets from idea to release in days, and how this site maintains itself: every change is an agent-written PR that I review.',
  },
  steps: [
    {
      k: '01',
      title: { ru: 'Постановка', en: 'Spec' },
      body: { ru: 'Формулирую задачу, ограничения и критерий «готово».', en: 'I frame the problem, the constraints, and what “done” means.' },
    },
    {
      k: '02',
      title: { ru: 'Агенты строят', en: 'Agents build' },
      body: { ru: 'Claude Code и Codex пишут код, гоняют проверки и открывают pull request.', en: 'Claude Code and Codex write the code, run the checks, and open a pull request.' },
    },
    {
      k: '03',
      title: { ru: 'Ревью', en: 'Review' },
      body: { ru: 'Каждый дифф читаю сам. Мерджу только то, что готов защищать.', en: 'I read every diff myself and merge only what I can defend.' },
    },
    {
      k: '04',
      title: { ru: 'Прод', en: 'Production' },
      body: { ru: 'Смердженный PR автоматически уезжает в прод.', en: 'A merged PR deploys straight to production.' },
    },
  ] satisfies AgentOpsStep[],
  terminalAria: { ru: 'Живые данные о PR этого репозитория', en: 'Live pull-request stats for this repository' },
  receiptPrs: {
    ru: 'PR смерджено в этом репозитории, написаны агентами и проверены мной',
    en: 'merged PRs on this repo, agent-written and reviewed by me',
  },
  receiptPrsLink: { ru: 'смотреть PR на GitHub', en: 'see the PRs on GitHub' },
  receiptDeployNote: { ru: 'этот самый деплой собран из PR, написанного агентом', en: 'this very deploy shipped from an agent-written PR' },
} as const;

export const uiCopy = {
  nav: {
    home: { ru: 'Главная', en: 'Home' },
    about: { ru: 'Обо мне', en: 'About' },
    blog: blogLabel,
    controlsAria: { ru: 'Элементы управления сайта', en: 'Site controls' },
    primaryAria: { ru: 'Основная навигация', en: 'Primary navigation' },
  },
  home: {
    eyebrow: { ru: 'Драйвлю продукт через продуманное внедрение AI · Prof-IT', en: 'Driving product through thoughtful AI adoption · Prof-IT' },
    title: {
      ru: 'AI Product Manager.',
      en: 'AI Product Manager.',
    },
    titleAccent: {
      ru: 'AI',
      en: 'AI',
    },
    lead: {
      ru: 'Веду B2B-продукты в Prof-IT с 2022, сейчас это голосовые AI-агенты. Параллельно собираю пет-проекты с AI-агентами и проверяю гипотезы за дни, а не за спринты.',
      en: 'I lead B2B products at Prof-IT since 2022, now voice AI agents. Alongside that I ship pet projects with AI agents, validating hypotheses in days, not sprints.',
    },
    leadStrong: {
      ru: 'Открыт к ролям AI Product Manager, где продукт растёт за счёт продуманного внедрения AI.',
      en: 'Open to AI Product Manager roles where the product grows through thoughtful AI adoption.',
    },
    heroStatus: {
      ru: 'Открыт к новым проектам',
      en: 'Open to new projects',
    },
    heroCtaPrimary: {
      ru: 'Написать в Telegram',
      en: 'Message me on Telegram',
    },
    heroCtaEmail: {
      ru: 'Написать на почту',
      en: 'Email me',
    },
    heroCtaLinkedin: {
      ru: 'Написать в LinkedIn',
      en: 'Connect on LinkedIn',
    },
    heroCtaCv: {
      ru: 'Скачать CV',
      en: 'Download CV',
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
      ru: 'разговоров от новых клиентов прошло за 2026 год через продукт, который я веду.',
      en: 'of new-customer conversations handled by the product I lead in 2026.',
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
      ru: 'Веду продуктовое развитие нового продукта группы: голосовых AI-агентов для B2B',
      en: 'Leading product development for the new product: voice AI agents for B2B',
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
    skillsEyebrow: { ru: 'Навыки', en: 'Skills' },
    skillsTitle: { ru: 'Ключевые навыки', en: 'Core skills' },
    skillsNote: {
      ru: 'Сгруппировано под то, что важно для роли AI Product Manager: продукт, AI/LLM, delivery и общий язык с инженерами.',
      en: 'Grouped around what matters for an AI Product Manager role: product, AI/LLM, delivery, and a shared language with engineers.',
    },
  },
  projects: {
    title: { ru: 'Проекты', en: 'Projects' },
    subtitle: {
      ru: 'Два уровня: продукты, которые я веду в Prof-IT, и личные пет-проекты, собранные за дни. Они показывают скорость, с которой довожу идею до релиза.',
      en: 'Two tiers: products I lead at Prof-IT, and personal pet projects built in days. They show the speed I take an idea to release.',
    },
    featuredEyebrow: {
      ru: 'Флагман · 2026',
      en: 'Flagship · 2026',
    },
    featuredLiveBadge: {
      ru: 'В проде',
      en: 'Live in production',
    },
    featuredRole: {
      ru: 'Веду end-to-end · продукт, UX, инженерия',
      en: 'I run it end-to-end · product, UX, engineering',
    },
    featuredKpis: [
      {
        ru: 'Multi-tenant SaaS',
        en: 'Multi-tenant SaaS',
      },
      {
        ru: 'Voice + LLM-оркестрация',
        en: 'Voice + LLM orchestration',
      },
      {
        ru: 'B2B-телефония',
        en: 'B2B telephony',
      },
    ],
    featuredHighlightsTitle: {
      ru: 'Что я собрал и держу в проде',
      en: 'What I built and keep in production',
    },
    featuredHighlights: [
      {
        ru: 'Кабинет для клиентов: создание агентов, промпт-сценарии, кампании, история звонков и биллинг — всё под одной ролью.',
        en: 'Client console: agent builder, prompt flows, campaigns, call history, and billing, all under one role.',
      },
      {
        ru: 'Биллинг с резервом баланса на старте кампании: клиент не уходит в минус, расходы предсказуемы.',
        en: 'Billing with a balance hold on campaign start, so clients never go negative and spend stays predictable.',
      },
      {
        ru: 'Надёжный поток звонков: фоновый поллер сверяет статусы каждые 60 секунд, чтобы ни один звонок не "застрял" и был корректно списан.',
        en: 'Reliable call pipeline: a background poller reconciles statuses every 60 seconds so no call gets stuck and every minute is billed.',
      },
    ],
    featuredScreenshotAlt: {
      ru: 'Скриншот клиентского дашборда Zvonobot AI с моковыми демо-данными',
      en: 'Zvonobot AI client dashboard screenshot with mock demo data',
    },
    featuredNda: {
      ru: 'Демо-данные · реальные интерфейсы клиентов под NDA',
      en: 'Demo data · real client interfaces under NDA',
    },
    workLedTitle: { ru: 'Продукты, которые я веду', en: 'Products I lead' },
    workLedEyebrow: { ru: '01 · Day job', en: '01 · Day job' },
    workLedNote: {
      ru: 'Здесь я отвечаю за продуктовую логику, метрики и delivery end-to-end.',
      en: 'Here I own product logic, metrics, and end-to-end delivery.',
    },
    petTitle: { ru: 'Довожу любую идею до релиза за дни', en: 'I take any idea to release in days' },
    petEyebrow: { ru: '02 · Скорость и общий язык с инженерами', en: '02 · Speed and a shared language with engineers' },
    petNote: {
      ru: 'Не хобби, а доказательство: каждый проект собран лично с AI-агентами (Claude Code, Codex) за 1–7 дней от идеи до working release. Так я быстро валидирую гипотезы и говорю с инженерами на одном языке. Под каждым указано, что именно он доказывает.',
      en: 'Not hobbies but proof: each project was personally built with AI coding agents (Claude Code, Codex) in 1–7 days from idea to a working release. That is how I validate hypotheses fast and speak the same language as engineers. Each one notes what it proves.',
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
    eyebrow: { ru: 'Контакт', en: 'Contact' },
    pitch: {
      ru: 'Пишите, если ищете AI-продакта.',
      en: 'Write me if you are hiring an AI product lead.',
    },
    frame: {
      ru: 'Открыт к ролям AI Product Manager и к продуктам, где AI закрывает реальную бизнес-задачу. Проще всего написать напрямую: выбирайте удобный канал.',
      en: 'Open to AI Product Manager roles and to products where AI solves a real business job. The easiest way to reach me is directly: pick whichever channel suits you.',
    },
    cv: { ru: 'Скачать CV (PDF)', en: 'Download CV (PDF)' },
  },
  localeToggleLabel: {
    ru: 'Switch to English',
    en: 'Switch to Russian',
  },
  themeToggle: themeToggleLabel,
  social: socialLabels,
} as const;
