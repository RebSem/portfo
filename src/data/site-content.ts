import type { Locale, LocalizedText } from '../types/content';
import {
  cvExperience,
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

// The Cal.com calendar behind /call/ (CallBooking.astro). The public embed needs
// no key, so none is stored. The user slug is the account's public name: renaming
// the account means changing this one value. The page offers only these three
// public event types; the hidden default type is never linked.
//
// Cal.com settings this page depends on (made in the Cal.com account, not here):
// - the three event types stay public under the slugs above, and the hidden
//   default type ("secret") is never linked;
// - each event type's "Redirect on booking" points at https://rebsem.ru/call/thanks/
//   with parameter forwarding off, so a booking made on cal.com lands on the
//   thank-you page without its details in the address;
// - optional: a 30 minute slot interval on the 15 minute type halves its slot list.
export const calBooking = {
  user: 'michael-semenov',
  events: {
    intro: '15min',
    product: '30min',
    deepDive: '60min',
  },
} as const;

export const homePath = '/';
export const aboutPath = '/about/';
export const blogPath = '/blog/';

export const heroFallbackName = 'Mikhail Semenov';
export const heroDisplayName: LocalizedText = {
  ru: 'Михаил Семенов',
  en: 'Mikhail Semenov',
};

export const heroSubtitle: LocalizedText = {
  ru: 'Продакт-менеджер в B2B SaaS. Запустил в Zvonobot (группа Prof-IT) направление голосовых AI-агентов с нуля: 80 платящих клиентов меньше чем за год.',
  en: 'Product manager in B2B SaaS. Launched the voice AI agent line at Zvonobot (Prof-IT Group) from scratch: 80 paying customers in under a year.',
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
      {
        ru: 'До этого, с 2022 года, вёл основную платформу: self-service кабинет, посекундный биллинг и кошельки (пополнения, списания, холды), CPaaS-продукты группы для массовых звонков и SMS.',
        en: 'Before that, from 2022, I ran the core platform: the self-service console, per-second billing and wallets (top-ups, charges, balance holds), and the group’s CPaaS products for bulk calls and SMS.',
      },
    ],
  },
  {
    eyebrow: { ru: '02 · Где полезен сильнее всего', en: '02 · Where I add the most value' },
    title: { ru: 'AI, встроенный в реальную работу', en: 'AI built into real work' },
    body: [],
    bullets: [
      { ru: 'Продукты, где AI убирает рутину и ускоряет людей', en: 'Products where AI removes busywork and speeds people up' },
      { ru: 'Голосовые и диалоговые AI-сценарии: один из доменов, не единственный', en: 'Voice and conversational AI: one domain, not the only one' },
    ],
  },
  {
    eyebrow: { ru: '03 · Как проверяю идеи', en: '03 · How I validate ideas' },
    title: { ru: 'Гипотеза получает рабочий релиз за дни', en: 'A hypothesis gets a working release in days' },
    body: [
      {
        ru: 'Пет-проекты собираю сам с AI-агентами Claude Code и Codex, а с инженерами я говорю на одном языке. Каждый пет-проект на сайте прошёл путь от идеи до рабочего релиза за срок от 1 до 7 дней. В Zvonobot продуктовые решения, прайсинг и вывод на рынок были за мной, а команда инженеров отгружала.',
        en: 'I build side projects myself with AI coding agents (Claude Code and Codex), and I speak the same language as engineers. Each side project on this site went from idea to a working release in 1 to 7 days. At Zvonobot, product decisions, pricing and go-to-market were mine, and the engineering team shipped.',
      },
    ],
  },
  {
    // Stated once, here. Blocks 02 and 03 no longer repeat them in prose.
    eyebrow: { ru: '04 · Принципы', en: '04 · Principles' },
    title: { ru: 'Пять принципов', en: 'Five principles' },
    body: [],
    bullets: [
      { ru: 'Сначала доказать, что платят, потом строить', en: 'Prove they pay before you build' },
      { ru: 'Решения на цифрах, а не на презентациях', en: 'Decisions on numbers, not decks' },
      { ru: 'AI внутри рабочего процесса, а не отдельной кнопкой', en: 'AI inside the workflow, not a separate button' },
      { ru: 'Надёжность без блеска тоже продуктовая работа', en: 'Boring reliability is product work' },
      { ru: 'Сначала минимальная стабильная поверхность, потом рост', en: 'Smallest stable surface first, then grow it' },
    ],
  },
  {
    // Written strictly from the facts already in the resume canon (cv.ts):
    // white-label first, the case for the in-house platform, a team of four
    // engineers, sales growing from 4 to 15, a release cycle run with sales
    // and support. Nothing here is a claim the resume does not already make.
    eyebrow: { ru: '05 · Команда и люди', en: '05 · Team and people' },
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
    eyebrow: { ru: '06 · Ищу работу', en: '06 · Looking now' },
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
    items: ['SQL', 'REST', { ru: 'Телефония', en: 'Telephony' }],
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
 * Stable IRIs for the site-wide JSON-LD nodes. Every page that names the
 * person (the Person entity, a case study's or a post's author) points at
 * personSchemaId, so a reader that takes several pages sees one entity with
 * one image, not a new anonymous Person on each.
 */
export const personSchemaId = 'https://rebsem.ru/#person';
export const websiteSchemaId = 'https://rebsem.ru/#website';

const personDescription: LocalizedText = {
  ru: 'Продакт-менеджер, открыт к работе и готов выйти сразу. В Zvonobot (группа Prof-IT) с февраля 2022 по октябрь 2026 запустил с нуля направление голосовых AI-агентов для B2B: 80 платящих клиентов и 500 000+ минут живых разговоров в проде меньше чем за год. Отвечал за прайсинг, юнит-экономику и вывод на рынок. Базируется в Перми, Россия. Удалённо, GMT+5, открыт к релокации.',
  en: 'Product Manager, open to work and available to start immediately. At Zvonobot (Prof-IT Group) from February 2022 to October 2026, launched a B2B voice AI agent line from scratch: 80 paying customers and 500,000+ minutes of live conversations in production in under a year. Owned pricing, unit economics and go-to-market. Based in Perm, Russia. Remote, GMT+5, open to relocation.',
};

/**
 * Single source of truth for the Person entity in JSON-LD.
 * Used by every page so structured data never drifts between routes.
 * `url` is page-specific and passed in by the caller; `locale` picks the
 * description, so a Russian page does not describe its owner in English.
 */
export function buildPersonSchema(url: string, locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personSchemaId,
    name: heroDisplayName.en,
    alternateName: heroDisplayName.ru,
    jobTitle: 'Product Manager',
    description: personDescription[locale],
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

/**
 * The WebSite node, emitted on each home page. Its publisher is the Person by
 * @id, so the site and its owner are linked in the structured data itself.
 */
export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteSchemaId,
    url: 'https://rebsem.ru/',
    name: heroFallbackName,
    alternateName: heroDisplayName.ru,
    inLanguage: ['en', 'ru'],
    publisher: { '@id': personSchemaId },
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
    en: 'I build prototypes and side projects myself with AI coding agents. A hypothesis gets a working release in days instead of a sprint, and I speak the same language as engineers. Product decisions, specs and review stay with me; this site runs the same way, every change an agent-written PR that I review.',
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
  // The proof is two plain lines with build-time figures, not a terminal
  // window: a dark box on a light page read as "developer" to a recruiter.
  receiptPrs: {
    ru: 'PR в этом репозитории: написаны агентами, каждый прочитан и смерджен мной',
    en: 'merged PRs on this repo: agent-written, each one read and merged by me',
  },
  receiptPrsLink: { ru: 'смотреть PR на GitHub', en: 'see the PRs on GitHub' },
  receiptDeployNote: { ru: 'этот деплой собран из такого PR', en: 'this deploy shipped from one of them' },
} as const;

// The year the product work started, read from the Zvonobot role in cv.ts so
// the byline cannot drift from the resume. Throws at build time if that role
// is renamed, the same way cvMetric() fails loudly.
const zvonobotRole = cvExperience.find((role) => role.company.en.startsWith('Zvonobot'));
if (!zvonobotRole) throw new Error('Zvonobot role not found in cvExperience');
const productSinceYear = zvonobotRole.startDate.slice(0, 4);

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
    // The byline states how long the product work has run: a bare job title
    // leaves a screener to guess the tenure.
    heroRole: {
      ru: `Product Manager с ${productSinceYear} года`,
      en: `Product Manager since ${productSinceYear}`,
    },
    title: {
      ru: 'Запускаю и развиваю',
      en: 'I launch and grow',
    },
    titleFocus: {
      ru: 'B2B и AI-продукты.',
      en: 'B2B & AI products.',
    },
    // The standfirst says what he owned; the 80 stays in the results band
    // right below it. The intro has no full stop: the result line continues
    // the same sentence on its own line.
    proofIntro: {
      ru: 'В Zvonobot запустил направление голосовых AI-агентов с нуля',
      en: 'Launched Zvonobot’s voice AI agent line from scratch',
    },
    proofResult: {
      ru: 'и вёл его целиком: продукт, прайсинг, вывод на рынок.',
      en: 'and owned it end to end: product, pricing, go-to-market.',
    },
    // An active search, not a passive "open to offers": the role at Zvonobot
    // ended in October 2026, and the status links down to the block that
    // answers the screening questions.
    heroStatus: {
      ru: 'Ищу работу · готов выйти сразу',
      en: 'Open to work · available now',
    },
    // Same wording as /cv and About: the stance is "open to", not a bare
    // noun, in both locales. The meta descriptions leave relocation out to
    // stay under 160 characters.
    workFormat: {
      ru: 'Удалённо · GMT+5 · открыт к релокации',
      en: 'Remote · GMT+5 · open to relocation',
    },
    heroCtaPrimary: {
      ru: 'Написать в Telegram',
      en: 'Message me on Telegram',
    },
    heroCtaSecondary: {
      ru: 'Читать кейс',
      en: 'Read the case study',
    },
    heroCaseLabel: {
      ru: 'Читать кейс Zvonobot AI',
      en: 'Read the case study: Zvonobot AI',
    },
    // The footer renders the same icon row under uiCopy.footer.socialAria;
    // two landmarks with one name would be indistinguishable to a screen reader.
    heroSocialAria: { ru: 'Контакты и профили', en: 'Contact and profiles' },
    // On phones the icon row is hidden, so the two other ways to write sit in
    // one line under the buttons (HomeHero.astro, .hero-alt).
    heroAlt: {
      lead: { ru: 'или', en: 'or' },
      email: { ru: 'Почта', en: 'Email' },
      linkedin: { ru: 'LinkedIn', en: 'LinkedIn' },
    },
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
        label: { ru: 'Формат', en: 'Work setup' },
        value: { ru: 'Удалённо, GMT+5, открыт к релокации', en: 'Remote, GMT+5, open to relocation' },
      },
      {
        label: { ru: 'Английский', en: 'English' },
        value: { ru: 'B2, рабочий', en: 'B2, working proficiency' },
      },
    ],
    // The results band right under the hero (HomeResults.astro): a section
    // label and its context, nothing more. The numbers themselves are
    // uiCopy.projects.featuredResults, so the band and the case never drift.
    resultsTitle: { ru: 'Результаты', en: 'Results' },
    resultsContext: { ru: 'Zvonobot AI, B2B-платформа автоматизации звонков, 2025-2026', en: 'Zvonobot AI, a B2B call automation platform, 2025-2026' },
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
    // The pitch line under "Hiring a product manager?" at the end of About
    // (SiteFooter.astro, closingPitch).
    closingPitch: {
      ru: 'Пришлите вакансию и пару слов о продукте. Честно скажу, подхожу ли я.',
      en: 'Send me the role and a line about the product. I will tell you honestly whether I am a fit.',
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
      ru: 'Продакт-менеджер направления с октября 2025 по октябрь 2026',
      en: 'Product manager of the line, October 2025 to October 2026',
    },
    // Says why the case is worth the click, in the card under the summary.
    featuredInside: {
      ru: 'В кейсе: главное решение «сначала продать, потом строить», три компромисса в прайсинге, биллинге и регистрации, как оценивали качество агентов.',
      en: 'In the case: the key decision (sell first, build later), three trade-offs in pricing, billing and signup, and how agent quality was judged.',
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
        label: { ru: 'выше средний чек на AI-агентах, чем на классическом роботе', en: 'higher average spend on AI agents than on our scripted robot' },
      },
      {
        value: { ru: '30%', en: '30%' },
        label: { ru: 'выручки направления давали повторные оплаты', en: 'of the line’s revenue came from repeat payments' },
      },
    ],
    caseLink: { ru: 'Читать кейс', en: 'Read the case study' },
    caseShort: { ru: 'Кейс', en: 'Case study' },
    workTitle: { ru: 'Работа и свой продукт', en: 'Work and my own product' },
    petTitle: { ru: 'Пет-проекты', en: 'Side projects' },
    statusLabel: {
      cursivo: { ru: 'В разработке', en: 'In development' },
      obrabot: { ru: 'Внутреннее рабочее пространство Prof-IT', en: 'Internal Prof-IT workspace' },
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
    // The envelope icon has no visible text, so its name says what it does.
    // The visible email buttons (SiteFooter, About) keep `email`.
    emailAria: { ru: 'Написать на почту', en: 'Email me' },
  },
  // The label over the next case, after a case study's last section (CaseNext.astro).
  caseNext: {
    label: { ru: 'Следующий кейс', en: 'Next case' },
  },
  // The booking page at /call/ (CallBooking.astro). The calendar itself is
  // Cal.com's; this is the frame around it. Each format's time and title are the
  // three options the page offers.
  call: {
    title: {
      ru: 'Давайте созвонимся',
      en: "Let's talk",
    },
    // The group label of the format choice. Screen readers hear it; it is not shown.
    formatLegend: { ru: 'Формат', en: 'Format' },
    // The panel beside the calendar (CallBooking.astro): the photo's alt text and
    // the two facts that do not change with the format.
    portraitAlt: { ru: 'Портрет Михаила Семенова', en: 'Portrait of Mikhail Semenov' },
    // The time zone row: the text until the script reads the browser's zone, and
    // the label that follows the zone name then ("Europe/Berlin, your time zone").
    facts: {
      meet: { ru: 'Google Meet', en: 'Google Meet' },
      timezone: { ru: 'Ваш часовой пояс', en: 'Your time zone' },
      zone: { ru: 'ваш часовой пояс', en: 'your time zone' },
    },
    // The titles are also the short names on a phone's segment control, which is
    // about 80px wide at 320px. The soft hyphens (U+00AD, invisible unless a line
    // breaks there) let a long word break at a hyphen point, not mid-word.
    formats: {
      intro: {
        time: { ru: '15 минут', en: '15 min' },
        title: { ru: 'Зна\u00ADком\u00ADство', en: 'Intro call' },
      },
      product: {
        time: { ru: '30 минут', en: '30 min' },
        title: { ru: 'Продук\u00ADтовый разговор', en: 'Product con\u00ADversation' },
      },
      deepDive: {
        time: { ru: '60 минут', en: '60 min' },
        title: { ru: 'Подроб\u00ADный разбор', en: 'Deep dive' },
      },
    },
    loading: { ru: 'Загружаю календарь…', en: 'Loading the calendar…' },
    // The calendar's frame title, which a screen reader announces. Cal names the
    // frame in English on both locales, so the page sets its own.
    frameTitle: { ru: 'Календарь для записи на созвон', en: 'Booking calendar' },
    // The card when the calendar cannot load (a blocked script, or a link Cal
    // cannot find): the message and the ways to book instead.
    failed: { ru: 'Календарь не загрузился.', en: 'The calendar did not load.' },
    // The card while a slow calendar is still loading after the wait: the same
    // links, under a line that says it is still coming.
    slow: { ru: 'Ещё загружается. Или выберите другой способ:', en: 'Still loading. Or use one of these:' },
    openCalLink: { ru: 'Открыть на Cal.com', en: 'Open it on Cal.com' },
    noscript: {
      ru: 'Календарю нужен JavaScript.',
      en: 'The calendar needs JavaScript.',
    },
    telegram: { ru: 'Написать в Telegram', en: 'Message on Telegram' },
    email: { ru: 'Почта', en: 'Email' },
    // The label of every link to this page: the home and case closing blocks,
    // the case strip and About. The links point at /call/ (or /ru/call/).
    linkLabel: { ru: 'Записаться на созвон', en: 'Book a call' },
  },
  // The thank-you page after a booking (CallThanks.astro): where the invitation
  // is, and three quiet links for the time before the call. The resume link
  // reuses footer.resume.
  callThanks: {
    title: { ru: 'Готово, спасибо', en: 'Booked, thank you' },
    invite: {
      ru: 'Приглашение со ссылкой на Google Meet уже у вас в почте. Перенести или отменить встречу можно по ссылке из приглашения.',
      en: 'The invitation with a Google Meet link is in your email. To reschedule or cancel, use the link in that invitation.',
    },
    prepare: { ru: 'Перед звонком, если будет минута:', en: 'Before the call, if you have a minute:' },
    caseLink: { ru: 'Кейс Zvonobot AI', en: 'The Zvonobot AI case' },
    telegram: { ru: 'Написать в Telegram', en: 'Message on Telegram' },
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
    // The home page, the case studies and About end on this question, set in
    // the headline's type as a bookend to the H1, with closingPitch below as
    // its subline (SiteFooter.astro, closing; About passes its own pitch).
    // It must not repeat the question. Other pages keep the regular pitch alone.
    closingTitle: { ru: 'Нужен продакт-менеджер?', en: 'Hiring a product manager?' },
    closingPitch: {
      ru: 'B2B SaaS, платежи, AI-продукты. Быстрее всего в Telegram, почта тоже подходит.',
      en: 'B2B SaaS, payments, AI products. Telegram is fastest, email works too.',
    },
    pitch: {
      ru: 'Ищете продакт-менеджера для B2B SaaS, платежей или AI-продуктов? Напишите мне.',
      en: 'Hiring a product manager for B2B SaaS, payments or AI products? Message me.',
    },
    // The quiet text link to /cv after Email on the home closing and in the
    // case availability strip. Not a button: the resume is a second step.
    resume: {
      ru: 'Резюме',
      en: 'Resume',
    },
    // How fast a message gets an answer: a quiet line under the closing buttons
    // (SiteFooter.astro) and in the case availability strip (CaseAvailability.astro).
    // The owner replies within about half an hour, so the line sets that expectation.
    replyTime: {
      ru: 'Отвечаю в течение 30 минут в рабочее время (GMT+5).',
      en: 'I reply within 30 minutes during working hours (GMT+5).',
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
  // The accessible name starts with the visible text (WCAG 2.5.3 Label in Name),
  // so the link reads "EN" on the Russian pages and "RU" on the English ones.
  localeToggleLabel: {
    ru: 'EN, English version',
    en: 'RU, русская версия',
  },
  themeToggle: themeToggleLabel,
  social: socialLabels,
} as const;
