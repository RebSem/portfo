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
  ru: 'Продакт-менеджер в B2B SaaS. Запустил в Zvonobot (группа Prof-IT) направление голосовых AI-агентов с нуля: 80 платящих клиентов и 500 000+ минут разговоров в проде меньше чем за год. Прайсинг, юнит-экономика и вывод на рынок на мне; прототипы собираю с AI-агентами, чтобы гипотезы проверялись за дни. Удалённо, GMT+5, открыт к релокации.',
  en: 'Product manager in B2B SaaS. Launched the voice AI agent line at Zvonobot (Prof-IT Group) from zero: 80 paying customers and 500,000+ minutes of live conversations in production in under a year. Pricing, unit economics and go-to-market are mine; I prototype with AI coding agents so hypotheses get tested in days. Remote, GMT+5, open to relocation.',
};

export const currentRole: LocalizedText = {
  ru: 'Product Manager · Zvonobot (группа Prof-IT) · с февраля 2022',
  en: 'Product Manager · Zvonobot (Prof-IT Group) · since Feb 2022',
};

export const currentFocus: LocalizedText = {
  ru: `Осенью 2025 запустил новый продукт группы: голосовых AI-агентов для B2B, и развиваю его. Через них прошло ${cvMetric('minutes').value.ru} минут разговоров в проде.`,
  en: `In the fall of 2025 I launched a new product for the group, voice AI agents for B2B, and I keep scaling it. It has handled ${cvMetric('minutes').value.en} minutes of live conversations in production.`,
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
        ru: 'В Prof-IT я с февраля 2022 года: пришёл продактом в голосовые продукты zvonobot и effebot, где роботы обзванивают клиентов по записанным сценариям. Когда LLM научились вести нормальный диалог, стало понятно, что на записанных сценариях далеко не уедешь. Так осенью 2025 появился новый продукт группы, который я запустил и развиваю: голосовые AI-агенты для B2B, они разговаривают вживую, а не проигрывают запись.',
        en: 'I have been at Prof-IT since February 2022: I came in as a PM on its voice products, zvonobot and effebot, where robots call clients with pre-recorded scripts. Once LLMs learned to hold a real conversation, it became clear that recorded scripts would only get us so far. That is how the group’s new product came about in the fall of 2025, launched and now scaled by me: voice AI agents for B2B that talk to people live instead of playing a recording.',
      },
      {
        // Deliberately no revenue share here. The relative money figure is
        // approved for the unlisted /cv, which Mikhail hands out by link;
        // /about is indexed, so the same number would be findable by search.
        // Both pages stay factually consistent, /cv just says more.
        ru: `Веду продукт целиком, от клиентского кабинета до биллинга. Меньше чем за год: ${cvMetric('customers').value.ru} платящих B2B-клиентов, ${cvMetric('minutes').value.ru} минут разговоров в проде, отдел продаж под направление вырос с 4 до 15 менеджеров.`,
        en: `I own the product end to end, from the client console to billing. In under a year: ${cvMetric('customers').value.en} paying B2B customers, ${cvMetric('minutes').value.en} minutes of live conversations in production, and a sales team that grew from 4 to 15 to sell the line.`,
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
    eyebrow: { ru: '03 · Как проверяю идеи', en: '03 · How I validate ideas' },
    title: { ru: 'Гипотеза получает рабочий релиз за дни', en: 'A hypothesis gets a working release in days' },
    body: [
      {
        ru: 'Пет-проекты собираю с AI-агентами Claude Code и Codex, чтобы проверять гипотезу за дни и говорить с инженерами на одном языке. В основной работе продуктовые решения, прайсинг и вывод на рынок за мной, а команда инженеров отгружает. Каждый пет-проект на сайте прошёл путь от идеи до working release за 1-7 дней.',
        en: 'I build side projects with AI coding agents (Claude Code and Codex) so I can validate a hypothesis in days and speak the same language as engineers. In the day job, product decisions, pricing and go-to-market are mine, and the engineering team ships. Each side project on this site went from idea to a working release in 1-7 days.',
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
        ru: 'Направление я запускал с командой из четырёх разработчиков, ни один из которых мне не подчиняется. Работает это через понятную постановку, честный приоритет и ревью, где я читаю каждый дифф сам: инженерам проще делать, когда видно, зачем.',
        en: 'I launched the line with a team of four engineers, none of whom report to me. What makes it work is a clear spec, an honest priority call and a review where I read every diff myself: engineers move faster when the why is visible.',
      },
      {
        ru: 'Продажам новый продукт пришлось продать раньше, чем клиентам. Мы вышли на white-label платформу за несколько недель, доказали спрос на живых клиентах, и с этими цифрами отдел продаж вырос под направление с 4 до 15 менеджеров.',
        en: 'The sales team had to be sold on the product before any customer was. We went to market on a white-label platform in weeks, proved demand with live customers, and on those numbers the sales team grew from 4 to 15 to carry the line.',
      },
      {
        ru: 'Собственную платформу вместо white-label я обосновал не презентацией, а маржой по типам звонков и повторными оплатами. Релизный цикл веду вместе с продажами и поддержкой, поэтому обратная связь от клиента доходит до бэклога за дни, а не за квартал.',
        en: 'The case for building our own platform instead of staying on white-label was made with per-call-type margins and repeat payments, not with a deck. The release cycle runs jointly with sales and support, so customer feedback reaches the backlog in days, not a quarter.',
      },
    ],
  },
  {
    eyebrow: { ru: '05 · Что важно для роли', en: '05 · What matters in a role' },
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
    eyebrow: { ru: '06 · Open to', en: '06 · Open to' },
    title: { ru: 'Продакт-менеджер в B2B SaaS, платежах и AI-продуктах', en: 'Product manager in B2B SaaS, payments and AI products' },
    body: [
      {
        ru: 'Открыт к ролям продакт-менеджера, где я отвечаю за продукт целиком: B2B SaaS, платежи и подписки, AI-продукты. Голос лишь один из доменов, где я это уже делал; интересны любые продукты, где AI закрывает реальную бизнес-задачу, а не добавлен для галочки. Формат: удалённо (живу в зоне GMT+5), открыт к релокации. Русский родной, английский рабочий, уверенно в письменном и async-общении.',
        en: 'Open to product manager roles where I own the product end to end: B2B SaaS, payments and subscriptions, AI products. Voice is just one domain where I have already done this; I am interested in any product where AI solves a real business job rather than being a checkbox. Format: remote (I am in the GMT+5 zone), open to relocation. Russian native, English at working proficiency, comfortable in written and async communication.',
      },
    ],
  },
  {
    eyebrow: { ru: '07 · Где буду полезен меньше', en: '07 · Where I’m a weaker fit' },
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
      'Product Manager at Zvonobot (Prof-IT Group). Launched a B2B voice AI agent line from zero: 80 paying customers and 500,000+ minutes of live conversations in production in under a year. Owns pricing, unit economics and go-to-market. Based in Perm, Russia. Remote, GMT+5, open to relocation.',
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
    worksFor: {
      '@type': 'Organization',
      name: 'Prof-IT',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Product Manager',
      skills:
        'Product management, pricing and unit economics, go-to-market, voice AI agents, LLM orchestration, B2B SaaS',
    },
    seeks: {
      '@type': 'Demand',
      name: 'Product Manager roles in B2B SaaS, payments and AI products',
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
    // Concrete result instead of a slogan: what was launched and how many pay.
    eyebrow: { ru: 'Запустил направление голосовых AI-агентов с нуля · 80 платящих B2B-клиентов', en: 'Launched a voice AI product line from zero · 80 paying B2B customers' },
    title: {
      ru: 'Product Manager.',
      en: 'Product Manager.',
    },
    // "AI" moved out of the H1 and into this line: the roles applied for are
    // B2B SaaS, payments and AI products, and a headline that leads with AI
    // reads as a narrow specialist to the first two.
    subtitle: {
      ru: 'B2B SaaS · голосовые AI-агенты · LLM',
      en: 'B2B SaaS · Voice AI agents · LLM',
    },
    // Split in two so the phone can show only the first sentence above the
    // fold and keep the Telegram button visible without scrolling.
    lead: {
      ru: 'Запустил в Zvonobot направление голосовых AI-агентов с нуля: 80 платящих B2B-клиентов и 500 000+ минут живых разговоров в проде меньше чем за год.',
      en: 'I launched Zvonobot AI, a voice AI agent line, from zero: 80 paying B2B customers and 500,000+ minutes of live conversations in production in under a year.',
    },
    leadMore: {
      ru: 'Отвечаю за прайсинг, юнит-экономику и вывод на рынок, а прототипы собираю с AI-агентами за дни, поэтому гипотезы проверяются, а не обсуждаются.',
      en: 'I own pricing, unit economics and go-to-market, and I prototype with AI coding agents in days so hypotheses get tested, not debated.',
    },
    leadStrong: {
      ru: 'Открыт к ролям продакт-менеджера в B2B SaaS, платежах и AI-продуктах. Удалённо (GMT+5), готов к релокации.',
      en: 'Open to Product Manager roles in B2B SaaS, payments and AI products. Remote (GMT+5), open to relocation.',
    },
    heroStatus: {
      ru: 'Открыт к новым проектам',
      en: 'Open to new projects',
    },
    heroCtaPrimary: {
      ru: 'Написать в Telegram',
      en: 'Message me on Telegram',
    },
    heroCtaSecondary: {
      ru: 'Смотреть кейс',
      en: 'See the case',
    },
    metricLabel: {
      ru: 'Zvonobot AI · голосовые агенты для B2B',
      en: 'Zvonobot AI · voice agents for B2B',
    },
    // Sourced from cv.ts so the hero number and the resume can never diverge.
    metricNumber: cvMetric('minutes').value,
    metricUnit: {
      ru: 'минут',
      en: 'minutes',
    },
    metricCaption: {
      ru: 'разговоров провели в проде голосовые AI-агенты, продукт, который я веду.',
      en: 'of live conversations handled in production by the voice AI agents I lead.',
    },
    metricFootnoteOne: {
      ru: '80 платящих клиентов',
      en: '80 paying customers',
    },
    metricFootnoteTwo: {
      ru: 'запуск с нуля осенью 2025',
      en: 'from zero since fall 2025',
    },
    photoAlt: { ru: 'Фото Михаила Семенова', en: 'Photo of Mikhail Semenov' },
    // Three things the hero does not already say: where, with whom, on what.
    // The old third column repeated the minutes from the card above it.
    currentlyEyebrow: { ru: 'Сейчас', en: 'Currently' },
    currentlyTitle: { ru: 'Что я делаю сейчас', en: 'What I do now' },
    currentlyRoleLabel: { ru: 'Роль', en: 'Role' },
    currentlyFocusLabel: { ru: 'Команда', en: 'Team' },
    currentlyMetricLabel: { ru: 'Стек', en: 'Stack' },
    currentlyMetricValue: {
      ru: 'LLM-оркестрация, ASR/TTS, SIP-телефония, посекундный биллинг, кошельки, LLM-аналитика звонков',
      en: 'LLM orchestration, ASR/TTS, SIP telephony, per-second billing, wallets, LLM call analytics',
    },
    currentlyRole: {
      ru: 'Product Manager, Zvonobot (группа Prof-IT), с февраля 2022. Осенью 2025 запустил и с тех пор веду направление AI-агентов.',
      en: 'Product Manager, Zvonobot (Prof-IT Group), since Feb 2022. Launched and run the AI agent line since fall 2025.',
    },
    currentlyFocus: {
      ru: '4 инженера; отдел продаж вырос под направление с 4 до 15 менеджеров. Прайсинг и маржа на мне.',
      en: '4 engineers; a sales team that grew from 4 to 15 to sell the line. Pricing and margins are mine.',
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
    subtitle: {
      ru: 'Два уровня: продукты, за которые я отвечаю в Prof-IT, и пет-проекты, доведённые до релиза за дни.',
      en: 'Two tiers: the products I own at Prof-IT, and side projects taken to release in days.',
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
      ru: 'Продукт, прайсинг, вывод на рынок · запуск с нуля осенью 2025',
      en: 'Product, pricing, go-to-market · launched from zero in fall 2025',
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
    // Outcomes, not features. The feature list (console, balance hold, the
    // reconciling poller) lives on the case study, where it belongs.
    featuredHighlightsTitle: {
      ru: 'Что изменилось',
      en: 'What changed',
    },
    featuredHighlights: [
      {
        ru: '80 платящих B2B-клиентов меньше чем за год после запуска.',
        en: '80 paying B2B customers in under a year from launch.',
      },
      {
        ru: 'Отдел продаж вырос под направление с 4 до 15 менеджеров.',
        en: 'The sales team grew from 4 to 15 to sell the line.',
      },
      {
        ru: 'Средний чек сервиса вырос на 30% после запуска AI-тарифов.',
        en: 'Average customer spend grew 30% after the AI plans launched.',
      },
      {
        ru: '30% выручки направления дают повторные оплаты.',
        en: '30% of the line’s revenue comes from repeat payments.',
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
    workLedTitle: { ru: 'Продукты, за которые отвечаю', en: 'Products I own' },
    workLedEyebrow: { ru: '01 · Day job', en: '01 · Day job' },
    workLedNote: {
      ru: 'Здесь я отвечаю за продуктовую логику, метрики и delivery end-to-end.',
      en: 'Here I own product logic, metrics, and end-to-end delivery.',
    },
    petTitle: { ru: 'Пет-проекты, доведённые до релиза', en: 'Side projects, shipped' },
    petEyebrow: { ru: '02 · Собраны с AI-агентами', en: '02 · Built with AI coding agents' },
    petNote: {
      ru: 'Каждый собран лично с AI-агентами (Claude Code, Codex) за 1-7 дней от идеи до working release. Так я проверяю гипотезы и говорю с инженерами на одном языке. Под каждым указано, что именно он доказывает.',
      en: 'Each one built personally with AI coding agents (Claude Code, Codex) in 1-7 days from idea to a working release. That is how I validate hypotheses and speak the same language as engineers. Each notes what it proves.',
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
      ru: 'Заметки без расписания.',
      en: 'Notes, no schedule.',
    },
    socialAria: {
      ru: 'Ссылки на соцсети',
      en: 'Social links',
    },
    eyebrow: { ru: 'Контакт', en: 'Contact' },
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
