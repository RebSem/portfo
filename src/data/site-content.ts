import type { Locale, LocalizedText } from '../types/content';
import {
  cvMetric,
  email,
  githubUsername,
  linkedinUrl,
  siteRepoUrl,
  telegramUrl,
} from './cv';

// Contacts and career numbers are owned by cv.ts and re-exported here so the
// rest of the site keeps its existing imports. The dependency runs one way,
// site-content -> cv, which is what makes the resume and the site physically
// unable to disagree.
export { email, githubUsername, linkedinUrl, siteRepoUrl, telegramUrl };

export const homePath = '/';
export const aboutPath = '/about';
export const blogPath = '/blog';

export const heroFallbackName = 'Mikhail Semenov';
export const heroDisplayName: LocalizedText = {
  ru: 'Михаил Семенов',
  en: 'Mikhail Semenov',
};

export const heroSubtitle: LocalizedText = {
  ru: 'Продакт-менеджер в B2B SaaS. Запустил в Zvonobot (группа Prof-IT) направление голосовых AI-агентов с нуля: 80 платящих клиентов меньше чем за год.',
  en: 'Product manager in B2B SaaS. Launched the voice AI agent line at Zvonobot (Prof-IT Group) from zero: 80 paying customers in under a year.',
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
    // "Latest role", not "Now": the Zvonobot role ended in October 2026.
    eyebrow: { ru: '01 · Последняя роль', en: '01 · Latest role' },
    title: { ru: 'Голосовые AI-агенты для B2B', en: 'Voice AI agents for B2B' },
    body: [
      {
        ru: 'В Prof-IT я работал с февраля 2022 по октябрь 2026 года. Пришёл продактом в голосовые продукты zvonobot и effebot, где роботы звонят клиентам по записанным сценариям. Когда LLM научились вести живой диалог, осенью 2025 я запустил в группе направление голосовых AI-агентов для B2B: они разговаривают с людьми, а не проигрывают запись.',
        en: 'I was at Prof-IT from February 2022 to October 2026. I came in as a PM on its voice products, zvonobot and effebot, where robots call clients with pre-recorded scripts. Once LLMs could hold a real conversation, I launched the group’s new line in the fall of 2025: voice AI agents for B2B that talk to people instead of playing a recording.',
      },
      {
        // Deliberately no revenue share here. The relative money figure is
        // approved for the unlisted /cv, which Mikhail hands out by link;
        // /about is indexed, so the same number would be findable by search.
        ru: `Вёл продукт целиком, от клиентского кабинета до биллинга. Меньше чем за год: ${cvMetric('customers').value.ru} платящих B2B-клиентов, ${cvMetric('minutes').value.ru} минут разговоров в проде.`,
        en: `I owned the product end to end, from the client console to billing. In under a year: ${cvMetric('customers').value.en} paying B2B customers, ${cvMetric('minutes').value.en} minutes of live conversations in production.`,
      },
    ],
  },
  {
    eyebrow: { ru: '02 · Где полезен сильнее всего', en: '02 · Where I add the most value' },
    title: { ru: 'AI, встроенный в реальную работу', en: 'AI built into real work' },
    body: [
      {
        ru: 'Продукты, где AI делает настоящую работу для бизнеса, а не живёт как демо.',
        en: 'Products where AI does the actual business job instead of living as a demo.',
      },
    ],
    bullets: [
      { ru: 'AI внутри рабочего процесса команды, а не отдельной кнопкой', en: 'AI inside a team’s workflow, not a separate button' },
      { ru: 'Продукты, где AI убирает рутину и ускоряет людей', en: 'Products where AI removes busywork and speeds people up' },
      { ru: 'Голосовые и диалоговые AI-сценарии: один из доменов, не единственный', en: 'Voice and conversational AI: one domain, not the only one' },
    ],
  },
  {
    eyebrow: { ru: '03 · Как проверяю идеи', en: '03 · How I validate ideas' },
    title: { ru: 'Гипотеза получает рабочий релиз за дни', en: 'A hypothesis gets a working release in days' },
    body: [
      {
        ru: 'Пет-проекты собираю сам с AI-агентами Claude Code и Codex: так гипотеза проверяется за дни, а с инженерами я говорю на одном языке. Каждый пет-проект на сайте прошёл путь от идеи до рабочего релиза за срок от 1 до 7 дней. В Zvonobot продуктовые решения, прайсинг и вывод на рынок были за мной, а команда инженеров отгружала.',
        en: 'I build side projects myself with AI coding agents (Claude Code and Codex): a hypothesis gets tested in days, and I speak the same language as engineers. Each side project on this site went from idea to a working release in 1 to 7 days. At Zvonobot, product decisions, pricing and go-to-market were mine, and the engineering team shipped.',
      },
    ],
  },
  {
    // Written strictly from the facts already in the resume canon (cv.ts):
    // white-label first, the case for the in-house platform, a team of four
    // engineers, sales growing from 4 to 15, a release cycle run with sales
    // and support. Nothing here is a claim the resume does not already make.
    eyebrow: { ru: '04 · Команда и люди', en: '04 · Team and people' },
    title: { ru: 'Без формальной власти, с общей целью', en: 'No formal authority, one shared goal' },
    body: [
      {
        ru: 'Направление я запускал с командой из четырёх разработчиков, ни один из которых мне не подчинялся. Работало это через понятную постановку, честный приоритет и ревью: инженерам проще делать, когда видно, зачем.',
        en: 'I launched the line with a team of four engineers, none of whom reported to me. What made it work was a clear spec, an honest priority call and a real review: engineers move faster when the why is visible.',
      },
      {
        ru: 'Продажам продукт пришлось продать раньше, чем клиентам: мы вышли на white-label платформу за несколько недель, доказали спрос на живых клиентах, и с этими цифрами отдел продаж вырос с 4 до 15 менеджеров. Собственную платформу я обосновал маржой по типам звонков и повторными оплатами, а не презентацией.',
        en: 'Sales had to be sold on the product before any customer was: we went to market on a white-label platform in weeks, proved demand with live customers, and on those numbers the sales team grew from 4 to 15. The case for an in-house platform was made with per-call-type margins and repeat payments, not with a deck.',
      },
    ],
  },
  {
    eyebrow: { ru: '05 · Ищу работу', en: '05 · Looking now' },
    title: { ru: 'Продакт-менеджер в B2B SaaS, платежах и AI-продуктах', en: 'Product manager in B2B SaaS, payments and AI products' },
    body: [
      {
        ru: 'Роль, где продукт целиком на мне: B2B SaaS, платежи и подписки, AI-продукты.',
        en: 'A role where I own the product end to end: B2B SaaS, payments and subscriptions, AI products.',
      },
    ],
    bullets: [
      { ru: 'Автономность и ownership на неоднозначных задачах', en: 'Autonomy and ownership on ambiguous problems' },
      { ru: 'Короткий цикл от идеи до проверки', en: 'A short loop from idea to validation' },
      { ru: 'Продуктовая логика поверх AI, а не AI ради AI', en: 'Product logic on top of AI, not AI for its own sake' },
      { ru: 'Возможность вести задачу целиком, а не быть звеном в цепочке согласований', en: 'Owning a problem from start to finish, not being one step in an approval chain' },
    ],
  },
  {
    eyebrow: { ru: '06 · Где буду полезен меньше', en: '06 · Where I’m a weaker fit' },
    title: { ru: 'Честно про anti-fit', en: 'An honest anti-fit' },
    body: [],
    bullets: [
      { ru: 'Чисто исследовательский ML/data science без продуктового слоя', en: 'Pure research ML or data science with no product layer on top' },
      { ru: 'Продукт, где AI добавляют «для галочки»', en: 'Products that add AI as a checkbox' },
      { ru: 'Роли с живыми переговорами на английском на C-уровне (письменно и async комфортно)', en: 'Roles needing live C-level negotiation in English (written and async are comfortable)' },
    ],
  },
];

/**
 * A skill that reads identically in both locales (a tool, a proper noun, an
 * established English term) stays a plain string; anything that needs real
 * translating carries both. Most of this list is the former, so localizing
 * every entry would be noise.
 */
export type SkillItem = string | LocalizedText;

/** Grouped skills — rendered on About and mirrored into JSON-LD knowsAbout. */
export interface SkillGroup {
  label: LocalizedText;
  items: SkillItem[];
}

export const skillItemText = (item: SkillItem, locale: Locale): string =>
  typeof item === 'string' ? item : item[locale];

export const skillGroups: SkillGroup[] = [
  {
    label: { ru: 'Продукт', en: 'Product' },
    items: [
      'Product discovery',
      'Product strategy',
      'Roadmap',
      { ru: 'Метрики · unit-экономика', en: 'Metrics · unit economics' },
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
      { ru: 'AI-в-workflow (не demo)', en: 'AI in the workflow (not demos)' },
    ],
  },
  {
    label: { ru: 'Delivery', en: 'Delivery' },
    items: [
      'Spec → review → ship',
      'Agent-native (Claude Code, Codex)',
      'Lean Startup · 0→1',
      { ru: 'Быстрая валидация гипотез', en: 'Fast hypothesis validation' },
    ],
  },
  {
    // One line, not a framework list: a product manager's stack is a shared
    // language with engineers, not a claim to their job.
    label: { ru: 'Общий язык с инженерами', en: 'Shared language with engineers' },
    items: ['TypeScript', 'Python', 'SQL', 'REST', { ru: 'Телефония', en: 'Telephony' }],
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
  'Payments and billing',
  'CPaaS',
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
    jobTitle: 'Product Manager',
    description:
      'Product Manager, open to work and available to start immediately. At Zvonobot (Prof-IT Group) from February 2022 to October 2026, launched a B2B voice AI agent line from zero: 80 paying customers and 500,000+ minutes of live conversations in production in under a year. Owned pricing, unit economics and go-to-market. Based in Perm, Russia. Remote, GMT+5, open to relocation.',
    url,
    image: 'https://rebsem.ru/main-hero.jpg',
    email: `mailto:${email}`,
    // Location is a canon fact (Perm / Russia) and recruiter-side LLM tools
    // read it straight out of JSON-LD, so it is stated explicitly.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Perm',
      addressCountry: 'RU',
    },
    knowsLanguage: ['ru', 'en'],
    knowsAbout,
    // Education existed nowhere in the structured data an LLM screener reads
    // first, while the visible page names the university.
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Perm State University',
    },
    // No worksFor: since October 2026 there is no current employer, and a
    // bare worksFor is read as one. The dated history (OrganizationRole with
    // start and end) is attached on /cv from buildEmploymentSchema.
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Product Manager',
      skills:
        'Product management, pricing and unit economics, go-to-market, voice AI agents, LLM orchestration, B2B SaaS',
    },
    seeks: {
      '@type': 'Demand',
      name: 'Product Manager or Product Owner roles in B2B SaaS, payments and AI products, available to start immediately',
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
  // Titled around the product outcome (hypotheses tested fast), not around
  // running agents: the reader is hiring a product manager, and "I run a team
  // of AI agents" read as an engineer and quietly replaced the human team.
  eyebrow: { ru: 'Как я быстро проверяю гипотезы · Claude Code & Codex', en: 'How I test hypotheses fast · Claude Code & Codex' },
  title: { ru: 'Гипотеза получает релиз за дни, а не за спринт.', en: 'A hypothesis gets a release in days, not a sprint.' },
  lead: {
    ru: 'Прототипы и пет-проекты собираю сам с AI-агентами. Так гипотеза получает рабочий релиз за дни вместо спринта, а с инженерами я говорю на одном языке. Продуктовые решения, постановка и ревью остаются за мной; этот сайт тоже живёт так: каждое изменение это PR, написанный агентом и проверенный мной.',
    en: 'Prototypes and side projects I build myself with AI coding agents. A hypothesis gets a working release in days instead of a sprint, and I speak the same language as engineers. Product decisions, specs and review stay with me; this site runs the same way, every change an agent-written PR that I review.',
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
      title: { ru: 'Ревью и релиз', en: 'Review and ship' },
      body: { ru: 'Каждый дифф читаю сам, мерджу только то, что готов защищать. Смердженный PR уезжает в прод.', en: 'I read every diff myself and merge only what I can defend. A merged PR deploys to production.' },
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
    // The hero makes one claim and backs it with one result. Career numbers
    // stay owned by cv.ts; both locales render the same semantic component.
    title: {
      ru: 'Запускаю и развиваю',
      en: 'I launch and grow',
    },
    titleFocus: {
      ru: 'B2B и AI-продукты.',
      en: 'B2B & AI products.',
    },
    proofIntro: {
      ru: 'В Zvonobot запустил направление голосовых AI-агентов с нуля.',
      en: 'Launched Zvonobot’s voice AI agent line from zero.',
    },
    proofResult: {
      ru: `${cvMetric('customers').value.ru} платящих B2B-клиентов меньше чем за год.`,
      en: `${cvMetric('customers').value.en} paying B2B customers in under a year.`,
    },
    // An active search, not a passive "open to offers": the role at Zvonobot
    // ended in October 2026, and the status links down to the block that
    // answers the screening questions.
    heroStatus: {
      ru: 'Ищу работу · готов выйти сразу',
      en: 'Open to work · available now',
    },
    // Same wording as the meta description, /cv and About: the stance is
    // "open to", not a bare noun, in both locales.
    workFormat: {
      ru: 'Удалённо · GMT+5 · открыт к релокации',
      en: 'Remote · GMT+5 · open to relocation',
    },
    heroCtaPrimary: {
      ru: 'Написать в Telegram',
      en: 'Message me on Telegram',
    },
    heroCtaSecondary: {
      ru: 'Смотреть кейс',
      en: 'See the case',
    },
    heroCaseLabel: {
      ru: 'Смотреть кейс Zvonobot AI',
      en: 'See the case: Zvonobot AI',
    },
    // The footer renders the same icon row under uiCopy.footer.socialAria;
    // two landmarks with one name would be indistinguishable to a screen reader.
    heroSocialAria: { ru: 'Контакты и профили', en: 'Contact and profiles' },
    // One line under the hero instead of the former status section: the four
    // facts a recruiter screens on. The pill says only the status; "start
    // now" is the second fact, so it is not said twice.
    heroStatusShort: { ru: 'Ищу работу', en: 'Open to work' },
    facts: [
      {
        label: { ru: 'Роль', en: 'Role' },
        value: { ru: 'PM или PO, B2B и AI', en: 'PM or PO, B2B and AI' },
      },
      {
        label: { ru: 'Выход', en: 'Start' },
        value: { ru: 'Сразу, без отработки', en: 'Right away, no notice period' },
      },
      {
        label: { ru: 'Формат', en: 'Format' },
        value: { ru: 'Удалённо, GMT+5, открыт к релокации', en: 'Remote, GMT+5, open to relocation' },
      },
      {
        label: { ru: 'Английский', en: 'English' },
        value: { ru: 'B2, рабочий', en: 'B2, daily at work' },
      },
    ],
    // The results band right under the hero (HomeResults.astro): a section
    // label and its context, nothing more. The numbers themselves are
    // uiCopy.projects.featuredResults, so the band and the case never drift.
    resultsTitle: { ru: 'Результаты', en: 'Results' },
    resultsContext: { ru: 'Zvonobot AI, 2025-2026', en: 'Zvonobot AI, 2025-2026' },
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
      ru: 'Как я работаю: продукт, прайсинг, вывод на рынок и AI там, где он реально нужен.',
      en: 'How I work: product, pricing, go-to-market, and AI where it earns its place.',
    },
    skillsEyebrow: { ru: 'Навыки', en: 'Skills' },
    skillsTitle: { ru: 'Ключевые навыки', en: 'Core skills' },
    skillsNote: {
      ru: 'Сгруппировано под то, что важно для роли продакт-менеджера: продукт, AI/LLM, delivery и общий язык с инженерами.',
      en: 'Grouped around what matters in a product manager role: product, AI/LLM, delivery, and a shared language with engineers.',
    },
  },
  projects: {
    title: { ru: 'Проекты', en: 'Projects' },
    heading: { ru: 'Что я запускал', en: 'What I launched' },
    featuredEyebrow: {
      ru: 'Флагман · 2025-2026',
      en: 'Flagship · 2025-2026',
    },
    featuredLiveBadge: {
      ru: 'В проде',
      en: 'Live in production',
    },
    featuredRole: {
      ru: 'Продукт, прайсинг, вывод на рынок\u00a0· запустил с нуля осенью 2025, вёл до октября 2026',
      en: 'Product, pricing, go-to-market\u00a0· launched from zero in fall 2025, ran it until October 2026',
    },
    // Results, not features: three numbers a reader keeps, shown in the band
    // right under the hero. The modest size is deliberate (Mikhail rejected
    // display-size figures on /cv), and the set stays inside the home-page
    // rules: no minutes, no revenue share, no sales headcount as a headline
    // (that is the sales director's number).
    featuredResults: [
      {
        value: { ru: '80', en: '80' },
        label: { ru: 'платящих B2B-клиентов меньше чем за год', en: 'paying B2B customers in under a year' },
      },
      {
        value: { ru: '+30%', en: '+30%' },
        label: { ru: 'к среднему чеку после запуска AI-тарифов', en: 'average customer spend after the AI plans launched' },
      },
      {
        value: { ru: '30%', en: '30%' },
        label: { ru: 'выручки направления давали повторные оплаты', en: 'of the line’s revenue came from repeat payments' },
      },
    ],
    caseLink: { ru: 'Открыть кейс', en: 'Read the case' },
    caseShort: { ru: 'Кейс', en: 'Case' },
    workTitle: { ru: 'Работа и свой продукт', en: 'Work and my own product' },
    petTitle: { ru: 'Пет-проекты', en: 'Side projects' },
    statusLabel: {
      cursivo: { ru: 'В разработке', en: 'In development' },
      obrabot: { ru: 'Внутренний продукт Prof-IT', en: 'Internal Prof-IT product' },
    },
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
  // The contact line under a case study's quick facts (CaseAvailability.astro).
  // The status text itself is uiCopy.home.heroStatus, so the two never drift.
  caseAvailability: {
    telegram: { ru: 'Написать в Telegram', en: 'Message on Telegram' },
    email: { ru: 'Почта', en: 'Email' },
  },
  footer: {
    defaultNote: {
      ru: 'Ищу роль продакт-менеджера, готов выйти сразу.',
      en: 'Looking for a product manager role, available now.',
    },
    blogNote: {
      ru: 'Заметки без расписания.',
      en: 'Notes, no schedule.',
    },
    socialAria: {
      ru: 'Ссылки на соцсети',
      en: 'Social links',
    },
    eyebrow: { ru: 'Контакт', en: 'Contact' },
    // The home page ends on this question, set in the headline's type as a
    // bookend to the H1, with the pitch below as its subline
    // (SiteFooter.astro, closing). Other pages keep the pitch alone.
    closingTitle: { ru: 'Нужен продакт-менеджер?', en: 'Hiring a product manager?' },
    pitch: {
      ru: 'Напишите, если ищете продакта в B2B SaaS, платежи или AI-продукты.',
      en: 'Write me if you are hiring a product manager for B2B SaaS, payments or AI products.',
    },
    navAria: {
      ru: 'Навигация в подвале',
      en: 'Footer navigation',
    },
    backToTop: {
      ru: 'Наверх',
      en: 'Back to top',
    },
    craft: {
      ru: 'Собрал этот сайт сам, в паре с AI-агентами.',
      en: 'Built this site myself, pairing with AI agents.',
    },
    craftSource: {
      ru: 'Код открыт',
      en: 'Source is open',
    },
  },
  localeToggleLabel: {
    ru: 'Switch to English',
    en: 'Switch to Russian',
  },
  themeToggle: themeToggleLabel,
  social: socialLabels,
} as const;
