import type { Locale, LocalizedText } from '../types/content';

/**
 * Single source of truth for the CV.
 *
 * Everything a recruiter, an ATS parser or an LLM screener ever sees about the
 * career history originates here: the /cv pages, the generated PDF/DOCX/txt,
 * the numbers quoted on the home page and in llms.txt. site-content.ts imports
 * from this file and never the other way around, so the site and the resume
 * cannot drift apart.
 *
 * Content rules that are deliberate, not accidental:
 *
 * - Canon is resume v3 (12 Aug 2026). Location is Perm / Russia everywhere.
 * - The word "Senior" never appears in a title. The numbers sell the grade.
 * - Revenue is relative only (share of group revenue). The absolute monthly
 *   figure is employer-sensitive and stays out of every public artifact.
 * - No phone number anywhere in this repository or on the public site. The
 *   variant carrying it is built locally and is git-ignored.
 * - No em dashes. They read as machine-written text; use a hyphen or a comma.
 * - The "10% -> 38% conversion" line from older drafts is intentionally gone:
 *   it was a retrospective estimate, not a measured experiment.
 */

// --- Contacts -------------------------------------------------------------

export const githubUsername = 'RebSem';
export const githubUrl = `https://github.com/${githubUsername}`;
// t.me has been in serverHold since 2026-07-13 (registry-level block; the
// domain itself stays Telegram's until 2035) and no longer resolves in
// browsers. telegram.me is the working alias, still recognized in-app too.
export const telegramUrl = 'https://telegram.me/Michael_Semenov';
export const telegramHandle = '@Michael_Semenov';
export const email = 'perk77331@gmail.com';
export const linkedinUrl = 'https://www.linkedin.com/in/mikhail-semenovv/';
export const linkedinHandle = 'linkedin.com/in/mikhail-semenovv';
export const siteRepoUrl = 'https://github.com/RebSem/portfo';
export const siteHost = 'rebsem.ru';
export const siteUrl = `https://${siteHost}`;

/**
 * The phone number is intentionally absent from this file and from the repo.
 * Git history on a public repository is permanent, so a number committed once
 * is public forever.
 *
 * The ATS-form variant of the resume does carry it: `npm run cv:export --
 * --phone "..."` builds the site into a git-ignored directory with CV_PHONE
 * set, and the exports produced from that build include the number. The
 * public build never sets the variable, and a test asserts no phone-shaped
 * string reaches dist/. Never set CV_PHONE in CI.
 */
export const phone: string | undefined = import.meta.env?.CV_PHONE || undefined;

// --- Inline runs (text that can carry a link) -----------------------------

export interface CvRun {
  text: LocalizedText;
  /** Project id from projects.ts, resolved to the localized case-study route. */
  caseId?: string;
  /** Absolute external URL. */
  href?: string;
}

/** Plain text run. */
const t = (ru: string, en: string): CvRun => ({ text: { ru, en } });

/** Text run that links to a case study on this site or to an external URL. */
const link = (
  ru: string,
  en: string,
  target: { caseId?: string; href?: string },
): CvRun => ({ text: { ru, en }, ...target });

/** Case-study route for a project id. Mirrors src/pages/projects/[slug].astro. */
export const caseHref = (caseId: string, locale: Locale): string =>
  locale === 'ru' ? `/ru/projects/${caseId}-ru/` : `/projects/${caseId}-en/`;

/** Resolved destination of a run, or undefined when the run is plain text. */
export const runHref = (run: CvRun, locale: Locale): string | undefined =>
  run.href ?? (run.caseId ? caseHref(run.caseId, locale) : undefined);

/** Flattens runs to plain text, for the txt/DOCX exports and for tests. */
export const runsToText = (runs: CvRun[], locale: Locale): string =>
  runs.map((run) => run.text[locale]).join('');

// --- Shape ----------------------------------------------------------------

export interface CvMetric {
  id: string;
  /** Short numeric value, rendered large. Localized: RU groups with a space. */
  value: LocalizedText;
  label: LocalizedText;
  caption: LocalizedText;
}

export interface CvExperiencePhase {
  title: LocalizedText;
  bullets: CvRun[][];
}

export interface CvExperienceRole {
  role: LocalizedText;
  company: LocalizedText;
  period: LocalizedText;
  /** ISO start date, for JSON-LD and for the ATS date-parsing test. */
  startDate: string;
  /** Omitted while the role is current. */
  endDate?: string;
  context?: LocalizedText;
  phases: CvExperiencePhase[];
}

export interface CvProduct {
  id: string;
  name: string;
  caseId?: string;
  externalUrl?: string;
  summary: LocalizedText;
  /** One line on what shipping this proves. Same device as projects.ts. */
  proof: LocalizedText;
}

export interface CvSkillGroup {
  label: LocalizedText;
  items: LocalizedText[];
}

// --- Identity -------------------------------------------------------------

export const cvName: LocalizedText = {
  ru: 'Михаил Семёнов',
  en: 'Mikhail Semenov',
};

export const cvHeadline: LocalizedText = {
  ru: 'Product Manager (AI/ML) · голосовые AI-агенты · LLM · B2B SaaS',
  en: 'AI Product Manager · Voice AI Agents · LLM · B2B SaaS',
};

export const cvLocationLine: LocalizedText = {
  ru: 'Пермь, Россия · удалённо (GMT+5) · открыт к релокации · готов к командировкам',
  en: 'Perm, Russia (GMT+5) · Remote · Open to relocation (Cyprus, EU, UAE)',
};

export const cvSummary: LocalizedText = {
  ru: 'Продакт-менеджер с инженерным бэкграундом. В Zvonobot запустил с нуля направление голосовых AI-агентов и меньше чем за год довёл его до ~10% выручки группы. Отвечаю за discovery, юнит-экономику, прайсинг и go-to-market. Гипотезы проверяю быстро: рабочий прототип на нейросетях (LLM) собираю с AI-агентами за 2-4 дня.',
  en: 'Product manager with an engineering background. Launched Zvonobot AI, a B2B voice AI agent platform, and took it from zero to roughly 10% of group revenue in under a year. Run discovery, unit economics, pricing and go-to-market; prototype with AI coding agents in days. Open to full-time or contract work; can start within 2-4 weeks.',
};

// --- Metrics --------------------------------------------------------------

/**
 * The four tiles that sell the grade. All relative: the absolute monthly
 * revenue of the AI line is employer-sensitive and is not published anywhere.
 */
export const cvMetrics: CvMetric[] = [
  {
    id: 'revenue-share',
    value: { ru: '~10%', en: '~10%' },
    label: { ru: 'выручки группы', en: 'of group revenue' },
    caption: {
      ru: 'доля направления, которое я запустил с нуля меньше чем за год.',
      en: 'share held by the line I launched from zero in under a year.',
    },
  },
  {
    id: 'customers',
    value: { ru: '~80', en: '~80' },
    label: { ru: 'платящих B2B-клиентов', en: 'paying B2B customers' },
    caption: {
      ru: '30% выручки направления дают повторные платежи.',
      en: 'repeat payments account for 30% of the line revenue.',
    },
  },
  {
    id: 'minutes',
    value: { ru: '500 000+', en: '500,000+' },
    label: { ru: 'минут разговоров', en: 'minutes of conversation' },
    caption: {
      ru: 'проведено голосовыми AI-агентами в проде.',
      en: 'handled by the voice AI agents in production.',
    },
  },
  {
    id: 'average-spend',
    value: { ru: '+30%', en: '+30%' },
    label: { ru: 'средний чек', en: 'average customer spend' },
    caption: {
      ru: 'рост среднего чека сервиса после запуска AI-тарифов.',
      en: 'growth in average spend after the AI plans launched.',
    },
  },
];

/** Lookup by id, so a renamed or dropped metric fails loudly at build time. */
export const cvMetric = (id: string): CvMetric => {
  const found = cvMetrics.find((metric) => metric.id === id);
  if (!found) throw new Error(`Unknown CV metric: ${id}`);
  return found;
};

// --- Experience -----------------------------------------------------------

export const cvExperience: CvExperienceRole[] = [
  {
    role: { ru: 'Product Manager', en: 'Product Manager' },
    company: { ru: 'Zvonobot (группа Prof-IT)', en: 'Zvonobot (Prof-IT Group)' },
    period: { ru: 'февраль 2022, настоящее время', en: 'Feb 2022 - Present' },
    startDate: '2022-02',
    context: {
      ru: 'Zvonobot, B2B-сервис автоматизации звонков: голосовые роботы и AI-агенты для лидогенерации, продаж и реактивации клиентов.',
      en: 'Zvonobot is a B2B call automation service: voice bots and AI agents for lead generation, sales outreach and customer reactivation.',
    },
    phases: [
      {
        title: {
          ru: 'Запуск Zvonobot AI (осень 2025, настоящее время)',
          en: 'Zvonobot AI (fall 2025 - present)',
        },
        bullets: [
          [
            t('Запустил ', 'Launched '),
            link('Zvonobot AI', 'Zvonobot AI', { caseId: 'zvonobot-ai' }),
            t(
              ', направление голосовых AI-агентов, с нуля: за несколько недель вывел продукт на рынок на white-label платформе, доказал спрос на живых клиентах и обосновал переход на собственное решение.',
              ', the voice AI agent line, from scratch: went to market on a white-label platform in weeks, proved demand with live customers, and made the case to build an in-house platform.',
            ),
          ],
          [
            t(
              'Результат к августу 2026: около 80 платящих B2B-клиентов, ~10% выручки группы, 500 000+ минут разговоров в проде; 30% выручки дают повторные платежи.',
              'By August 2026: about 80 paying business customers, roughly 10% of group revenue, 500,000+ minutes of live conversations in production; 30% of revenue comes from repeat payments.',
            ),
          ],
          [
            t(
              'AI-агенты стабильно обходят классические обзвоны по конверсии в целевое действие на тёплых базах; средний чек сервиса вырос на 30% после запуска AI-тарифов.',
              'AI agents consistently outperform legacy robocalls on conversion to the target action on warm lead lists; average customer spend grew 30% after the launch of AI plans.',
            ),
          ],
          [
            t(
              'Собрал продуктовый контур AI-направления: конструктор AI-агентов и сценариев, ',
              'Built the AI product suite: agent and script builder, ',
            ),
            link('LLM-аналитика звонков', 'LLM call analytics', { caseId: 'obrabot' }),
            t(
              ', тарифы с посекундным биллингом (LLM, ASR, TTS).',
              ', per-second billing plans (LLM, ASR, TTS stack).',
            ),
          ],
          [
            t(
              'Веду go-to-market в связке с командой из 4 разработчиков и отделом продаж, выросшим под направление с 4 до 15 менеджеров; выстраиваю прайсинг и контролирую маржу по типам звонков.',
              'Run go-to-market with a team of 4 engineers and a sales team that grew from 4 to 15 people to support the line; own pricing and per-call-type margins.',
            ),
          ],
        ],
      },
      {
        title: {
          ru: 'Платформа обзвонов (2022-2025)',
          en: 'Core platform (2022-2025)',
        },
        bullets: [
          [
            t(
              'Вёл основную платформу: личный кабинет, конструктор сценариев, исходящие кампании, телефония, посекундный биллинг, кошельки, аналитика звонков.',
              'Ran the core outbound-calling platform: customer console, call script builder, outbound campaigns, telephony, per-second billing, wallets, call analytics.',
            ),
          ],
          [
            t(
              'Запустил виртуальную АТС как комплементарный продукт для удержания клиентов платформы.',
              'Launched a virtual PBX as a complementary product to improve customer retention.',
            ),
          ],
          [
            t(
              'Наладил работу с клиентами: кастдев-интервью, приоритизация по метрикам, релизный цикл в связке с отделами продаж и поддержки.',
              'Built the customer discovery process: interviews, metric-driven prioritization, a release cycle run jointly with sales and support.',
            ),
          ],
          [
            t(
              'Первым внедрил LLM-инструменты в процессы компании: MVP голосового бота на OpenAI Realtime API собрал за 2 дня, внутренний инструмент поверх базы данных за 4 дня.',
              'Introduced LLM tooling across company workflows; built a voice bot MVP on the OpenAI Realtime API in 2 days and an internal database tool in 4 days.',
            ),
          ],
        ],
      },
    ],
  },
  {
    role: { ru: 'iOS/Frontend-разработчик', en: 'iOS / Frontend Developer' },
    company: { ru: 'Fodoj UG (Германия)', en: 'Fodoj UG (Germany)' },
    period: { ru: 'ноябрь 2020, январь 2022', en: 'Nov 2020 - Jan 2022' },
    startDate: '2020-11',
    endDate: '2022-01',
    phases: [
      {
        title: { ru: '', en: '' },
        bullets: [
          [
            t(
              'Разрабатывал интерфейс веб-приложения для рынка ЕС: испанская локализация, отчётность и комплаенс, UX-тестирование.',
              'Built the web app UI for the EU market: Spanish localization, reporting and compliance, usability testing.',
            ),
          ],
        ],
      },
    ],
  },
];

// --- Products -------------------------------------------------------------

export const cvProducts: CvProduct[] = [
  {
    id: 'zvonobot-ai',
    name: 'Zvonobot AI',
    caseId: 'zvonobot-ai',
    summary: {
      ru: 'Платформа голосовых AI-агентов для B2B: конструктор агентов, кампании, телефония, посекундный биллинг.',
      en: 'A B2B voice AI agent platform: agent builder, campaigns, telephony, per-second billing.',
    },
    proof: {
      ru: 'Доказывает запуск направления с нуля до ~10% выручки группы меньше чем за год.',
      en: 'Proves a line taken from zero to roughly 10% of group revenue in under a year.',
    },
  },
  {
    id: 'cursivo',
    name: 'cursivo',
    caseId: 'cursivo',
    externalUrl: 'https://cursivo.xyz',
    summary: {
      ru: 'AI-CRM для автопрокатов в проде: читает документы клиента, считает риск по сделке, подсказывает следующий шаг.',
      en: 'An AI CRM for car rental, live in production: reads client documents, scores deal risk, suggests the next step.',
    },
    proof: {
      ru: 'Доказывает, что довожу продукт до живых пользователей вне рабочего контекста.',
      en: 'Proves I take a product to live users outside the day job.',
    },
  },
  {
    id: 'obrabot',
    name: 'obrabot',
    caseId: 'obrabot',
    summary: {
      ru: 'Внутренний кабинет аналитики голосовых AI-агентов: LLM сегментирует звонки и подсвечивает то, что требует внимания.',
      en: 'An internal voice AI analytics console: an LLM segments calls and surfaces what needs human attention.',
    },
    proof: {
      ru: 'Доказывает работу с LLM-аналитикой поверх реальных данных прода.',
      en: 'Proves LLM analytics built on top of real production data.',
    },
  },
  {
    id: 'pet-projects',
    name: 'pet projects',
    externalUrl: githubUrl,
    summary: {
      ru: 'Пет-проекты, собранные лично с AI-агентами (Claude Code, Codex) за 1-7 дней от идеи до working release.',
      en: 'Side projects built personally with AI coding agents (Claude Code, Codex) in 1-7 days from idea to a working release.',
    },
    proof: {
      ru: 'Доказывает скорость проверки гипотез и общий язык с инженерами.',
      en: 'Proves hypothesis-validation speed and a shared language with engineers.',
    },
  },
];

// --- Skills ---------------------------------------------------------------

/** ATS keyword line: recruiters and parsers match on the role name itself. */
export const cvRoles: LocalizedText = {
  ru: 'Product Manager, Product Owner',
  en: 'Product Manager, Product Owner',
};

export const cvSkillGroups: CvSkillGroup[] = [
  {
    label: { ru: 'Продукт', en: 'Product' },
    items: [
      { ru: 'стратегия и роадмап продукта', en: 'product strategy and roadmap' },
      { ru: 'discovery, кастдев', en: 'discovery, customer interviews' },
      { ru: 'метрики и продуктовая аналитика', en: 'metrics and product analytics' },
      { ru: 'юнит-экономика, прайсинг', en: 'unit economics, pricing' },
      { ru: 'A/B-эксперименты', en: 'A/B experiments' },
      { ru: 'go-to-market', en: 'go-to-market' },
      { ru: 'B2B SaaS, CRM', en: 'B2B SaaS, CRM' },
    ],
  },
  {
    label: { ru: 'AI и LLM', en: 'AI and LLM' },
    items: [
      { ru: 'голосовые AI-агенты, разговорный ИИ', en: 'voice AI agents, conversational AI' },
      { ru: 'LLM-оркестрация', en: 'LLM orchestration' },
      { ru: 'промпт-инжиниринг, RAG', en: 'prompt engineering, RAG' },
      { ru: 'оценка качества моделей (evals)', en: 'LLM evals' },
      { ru: 'ASR, TTS', en: 'ASR, TTS' },
      { ru: 'контакт-центры, SIP-телефония', en: 'contact centers, SIP telephony' },
    ],
  },
  {
    label: { ru: 'Delivery', en: 'Delivery' },
    items: [
      { ru: 'постановка, ревью, релизный цикл', en: 'spec, review, release cycle' },
      { ru: 'работа с инженерами и продажами', en: 'working with engineers and sales' },
      { ru: 'прототипирование с AI-агентами (Claude Code, Codex)', en: 'prototyping with AI coding agents (Claude Code, Codex)' },
      { ru: 'быстрая валидация гипотез, 0 -> 1', en: 'fast hypothesis validation, 0 to 1' },
    ],
  },
  {
    label: { ru: 'Технологии', en: 'Technical' },
    items: [
      { ru: 'SQL', en: 'SQL' },
      { ru: 'Python', en: 'Python' },
      { ru: 'TypeScript', en: 'TypeScript' },
      { ru: 'REST, интеграции', en: 'REST, integrations' },
      { ru: 'телефония', en: 'telephony' },
    ],
  },
];

// --- Education, languages, format ----------------------------------------

export const cvEducation: LocalizedText = {
  ru: 'ПГНИУ, Пермский государственный национальный исследовательский университет, среднее специальное, 2022.',
  en: 'Diploma, Perm State University, 2022.',
};

export const cvLanguages: LocalizedText = {
  ru: 'Русский родной. Английский B1+, ежедневная рабочая переписка и документация.',
  en: 'Russian: native. English: working proficiency (B1+), daily written use.',
};

export const cvWorkFormat: LocalizedText = {
  ru: 'Удалённо из Перми (GMT+5), открыт к релокации (Кипр, ЕС, ОАЭ), готов к командировкам. Полная занятость или контракт, готов выйти за 2-4 недели.',
  en: 'Remote from Perm (GMT+5), open to relocation (Cyprus, EU, UAE), available for business travel. Full-time or contract, can start within 2-4 weeks.',
};

// --- Anti-fit -------------------------------------------------------------

/** Mirrors block 06 on /about. A rare and credible trust signal on a resume. */
export const cvAntiFitIntro: LocalizedText = {
  ru: 'Чтобы не тратить ваше и своё время, вот где я не лучший выбор:',
  // Straight apostrophe on purpose: the EN text layer of the PDF has already
  // been burned once by a non-ASCII glyph, so resume copy stays ASCII-safe.
  en: "So we do not waste each other's time, here is where I am not the best pick:",
};

export const cvAntiFit: LocalizedText[] = [
  {
    ru: 'Чисто исследовательский ML/data science без продуктового слоя поверх.',
    en: 'Pure research ML or data science with no product layer on top.',
  },
  {
    ru: 'Роль звена в длинной цепочке согласований без ownership на задаче.',
    en: 'A single step in a long approval chain with no ownership over the problem.',
  },
  {
    ru: 'Продукт, где AI добавляют «для галочки», а не под реальную бизнес-задачу.',
    en: 'Products that add AI as a checkbox rather than for a real business job.',
  },
  {
    ru: 'Роли, где английский нужен на уровне ведущего публичных переговоров на C-уровне (письменно и async комфортно).',
    en: 'Roles needing C-level live negotiation in English (written and async are comfortable).',
  },
];

// --- Export file names ----------------------------------------------------

/**
 * Named for the reader, not for the repository: a recruiter sees this string
 * in their downloads folder. Convention is fixed in scripts/cv/README.md.
 */
export const cvFileBaseName: Record<Locale, string> = {
  en: 'Mikhail_Semenov_AI_PM_EN',
  ru: 'Mikhail_Semenov_AI_PM_RU',
};
