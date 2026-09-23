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
 * - Canon is resume v5 (24 Aug 2026), rebuilt to the resume-page spec: six
 *   metric tiles, a "What I am looking for" section instead of the anti-fit
 *   list, result-first experience bullets. Location is Perm / Russia
 *   everywhere.
 * - The word "Senior" never appears in a title. The numbers sell the grade.
 * - No absolute money. Shares and percentages are allowed since the 24 Aug
 *   2026 spec (the "~10% of group revenue" tile is its centrepiece); rubles,
 *   dollars and millions still never appear. Nothing that cannot be defended
 *   in an interview.
 * - No phone number anywhere in this repository or on the public site. The
 *   variant carrying it is built locally and is git-ignored.
 * - No dashes in resume text, em or en: commas, colons and periods only.
 *   Hyphens inside compound words and ATS date ranges stay.
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
  /** Link label for externalUrl. Falls back to "Live" / "GitHub" on the page. */
  externalLabel?: LocalizedText;
  /**
   * Exactly one honest fact line per card: a number where one exists, "live
   * in production" where it does not. Never more than one figure per card.
   */
  metric: LocalizedText;
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
  ru: 'Михаил Семенов',
  en: 'Mikhail Semenov',
};

// B2B SaaS before the AI words on purpose: a recruiter for a payments or
// subscriptions role should not close the page on the first token.
export const cvHeadline: LocalizedText = {
  ru: 'Product Manager · B2B SaaS · голосовые AI-агенты · LLM',
  en: 'Product Manager · B2B SaaS · Voice AI Agents · LLM',
};

// Relocation targets named in both locales: an RU-speaking recruiter hiring
// for Cyprus/UAE scans this line first. "Business travel" stays in the Work
// format block only; up top it is an RU convention Western readers don't use.
export const cvLocationLine: LocalizedText = {
  ru: 'Пермь, Россия · удалённо (GMT+5) · открыт к релокации (Кипр, ЕС, ОАЭ) · готов к командировкам',
  en: 'Perm, Russia (GMT+5) · Remote · Open to relocation (Cyprus, EU, UAE)',
};

export const cvSummary: LocalizedText = {
  ru: 'Продакт-менеджер с инженерным бэкграундом, 4,5 года в B2B SaaS. Запустил направление голосовых AI-агентов с нуля до 80 платящих клиентов, 500 000+ минут в проде и ~10% выручки группы меньше чем за год. Веду продуктовую команду из 4 инженеров, отвечаю за прайсинг, юнит-экономику и запуск новых направлений.',
  // "Currently lead", not "Lead": after the past-tense "Launched", a bare
  // "Lead" reads as a typo for "Led" to a native skimmer.
  en: 'Product manager with an engineering background, 4.5 years in B2B SaaS. Launched a voice AI agent line from zero to 80 paying customers, 500,000+ minutes in production and ~10% of group revenue in under a year. Currently lead a product team of 4 engineers, own pricing, unit economics and new line launches.',
};

// --- Metrics --------------------------------------------------------------

/**
 * The six tiles that sell the grade. Value plus one short label, no caption:
 * a recruiter with 40 seconds reads a number and one line under it. Shares
 * and percentages only, never absolute money; every figure is defensible in
 * an interview.
 *
 * Decisions from the 25 Aug 2026 HR review, approved by Mikhail:
 * - The strongest business claim (~10% of group revenue) leads.
 * - The "4 -> 15 sales team" tile is gone: hiring salespeople is the sales
 *   director's number, and as a headline it read as borrowed credit. The
 *   fact stays in the go-to-market bullet, where its context lives. The
 *   CPaaS coverage figure took the slot.
 * - The tiles render in the site's original modest card style (Mikhail
 *   rejected the display-size numbers and decorative bars on sight).
 */
export const cvMetrics: CvMetric[] = [
  {
    id: 'group-share',
    value: { ru: '~10%', en: '~10%' },
    label: {
      ru: 'выручки группы даёт направление, запущенное с нуля за год',
      en: 'of group revenue comes from a line launched from zero in a year',
    },
  },
  {
    id: 'customers',
    value: { ru: '80', en: '80' },
    label: { ru: 'платящих B2B-клиентов', en: 'paying B2B customers' },
  },
  {
    id: 'minutes',
    value: { ru: '500 000+', en: '500,000+' },
    label: { ru: 'минут разговоров в проде', en: 'minutes of conversations in production' },
  },
  {
    id: 'average-spend',
    value: { ru: '+30%', en: '+30%' },
    label: {
      ru: 'средний чек после запуска новых тарифов',
      en: 'average customer spend after the new plans launched',
    },
  },
  {
    id: 'repeat-revenue',
    value: { ru: '30%', en: '30%' },
    label: {
      ru: 'выручки направления приносят повторные оплаты',
      en: 'of line revenue comes from repeat purchases',
    },
  },
  {
    id: 'countries',
    value: { ru: '130+', en: '130+' },
    label: {
      ru: 'стран: CPaaS-продукты группы, массовые звонки и SMS',
      en: 'countries: the group CPaaS products, bulk calls and SMS',
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

/**
 * Date ranges use a plain hyphen, never a comma. Every ATS date parser
 * expects a dash or "to" between the endpoints; the Russian version read
 * "февраль 2022, настоящее время", which a parser takes as a list and turns
 * into either one open-ended job or two. A hyphen satisfies the no-em-dash
 * rule and parses correctly.
 */
export const cvExperience: CvExperienceRole[] = [
  {
    role: { ru: 'Product Manager', en: 'Product Manager' },
    company: { ru: 'Zvonobot (группа Prof-IT)', en: 'Zvonobot (Prof-IT Group)' },
    period: { ru: 'февраль 2022 - настоящее время', en: 'Feb 2022 - Present' },
    startDate: '2022-02',
    context: {
      ru: 'Zvonobot, B2B-платформа автоматизации звонков: голосовые роботы и AI-агенты для лидогенерации, продаж и реактивации клиентов.',
      en: 'Zvonobot is a B2B call automation platform: voice bots and AI agents for lead generation, sales outreach and customer reactivation.',
    },
    phases: [
      {
        // October, not "fall": a season is not a parseable date, and a resume
        // parser reading the phase line needs a real month to anchor it.
        title: {
          ru: 'Запуск Zvonobot AI (октябрь 2025 - настоящее время)',
          en: 'Zvonobot AI (Oct 2025 - present)',
        },
        // Result first, then the action: every bullet opens with a number or
        // an outcome, never with a process verb. Spec of 24 Aug 2026.
        //
        // All four headline figures live in ONE bullet on purpose: legacy ATS
        // parsers only bucket standard sections, so Experience must carry the
        // numbers, but repeating the tiles verbatim across several bullets
        // read as "one figure stretched over the whole resume" (HR review,
        // 25 Aug 2026).
        bullets: [
          [
            t(
              '~10% выручки группы меньше чем за год: 80 платящих B2B-клиентов и 500 000+ минут живых разговоров в проде к августу 2026. Повторные оплаты дают 30% выручки направления.',
              '~10% of group revenue in under a year: 80 paying B2B customers and 500,000+ minutes of live conversations in production by August 2026. Repeat purchases bring 30% of the line revenue.',
            ),
          ],
          [
            t('С нуля до рынка за несколько недель: запустил ', 'From zero to market in weeks: launched '),
            link('Zvonobot AI', 'Zvonobot AI', { caseId: 'zvonobot-ai' }),
            t(
              ', направление голосовых AI-агентов, на white-label платформе и доказал спрос на живых клиентах. Сейчас перевожу направление на собственную, более гибкую платформу.',
              ', the voice AI agent line, on a white-label platform and proved demand with live customers. Now moving the line to our own, more flexible platform.',
            ),
          ],
          [
            t(
              '+30% к среднему чеку после запуска AI-тарифов: чек клиентов на AI-агентах против клиентов на классическом линейном IVR-роботе. Конверсия AI-агентов в целевое действие на тёплых базах стабильно выше линейных роботов, это стало основой прайсинга.',
              '+30% in average customer spend after the AI plans launched: customers on AI agents versus customers on the legacy linear IVR robot. AI agents consistently outperform the scripted robots on conversion to the target action on warm lead lists, which became the basis for pricing.',
            ),
          ],
          [
            t(
              'Полный продуктовый контур направления: конструктор AI-агентов и сценариев, ',
              'The full product suite of the line: agent and script builder, ',
            ),
            link('LLM-аналитика звонков', 'LLM call analytics', { caseId: 'obrabot' }),
            t(
              ' (исход, настроение, кастомные поля после звонка), тарифы с посекундным биллингом по компонентам стоимости (LLM, ASR, TTS), холд баланса на старте кампании.',
              ' (outcome, sentiment, custom post-call fields), per-second billing plans by cost component (LLM, ASR, TTS), balance hold at campaign start.',
            ),
          ],
          [
            t(
              'Команда из 4 инженеров: разработка подчиняется техлиду, приоритеты, постановка и приёмка за мной. Ставлю квартальные цели по направлению и защищаю их перед руководством.',
              'A product team of 4 engineers: engineering reports to the tech lead, while priorities, specs and acceptance are mine. Set quarterly OKRs for the line and defend them with leadership.',
            ),
          ],
          [
            t(
              'Отдел продаж вырос с 4 до 15 менеджеров под направление: веду go-to-market со стейкхолдерами из продаж, поддержки и финансов, еженедельно обучаю продажи и поддержку продукту. Отвечаю за прайсинг, тарифы, маржу по типам звонков и юнит-экономику направления.',
              "The sales team grew from 4 to 15 people to sell the line: I run go-to-market with stakeholders in sales, support and finance, and train sales and support on the product weekly. Own pricing, plans, per-call-type margins and the product's unit economics.",
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
              'Вся основная SaaS-платформа end-to-end: self-service личный кабинет, создание кампаний и таргетинг по базам, конструктор сценариев, телефония, посекундный биллинг, кошельки, отчётность и аналитика звонков. Приоритизация по метрикам и данным.',
              'The core B2B SaaS platform end to end: self-service customer console, campaign creation and lead-list targeting, script builder, telephony, per-second billing, wallets, reporting and call analytics. Prioritization by metrics and data.',
            ),
          ],
          [
            t(
              '130+ стран, массовые звонки и SMS: вёл CPaaS-продукты группы, Effebot (международный бренд Zvonobot) и P1SMS. Маршрутизация трафика по провайдерам, биллинг, интеграции по API.',
              "130+ countries, bulk calls and SMS: ran the group CPaaS products, Effebot (Zvonobot's international brand) and P1SMS. Traffic routing across providers, billing, API integrations.",
            ),
          ],
          [
            t(
              'Виртуальная АТС запущена как комплементарный продукт для удержания клиентов платформы.',
              'A virtual PBX launched as a complementary product to raise customer retention.',
            ),
          ],
          [
            t(
              'Полный цикл discovery и delivery: кастдев-интервью, формулирование и проверка гипотез на метриках, A/B-тесты сценариев, оценка эффекта до разработки, декомпозиция и ТЗ, кросс-функциональный релизный цикл в связке с продажами, поддержкой и разработкой.',
              'A full discovery and delivery loop: customer interviews, hypotheses formulated and defended with metrics, A/B testing of call scripts, effect sizing before development, decomposition and PRDs, a cross-functional release cycle run jointly with sales, support and engineering.',
            ),
          ],
          [
            // No slang and no primacy claim: "vibe coding" reads unserious to
            // the conservative half of the target domains, and "was the
            // first" is a superlative colleagues can dispute. The 2-day MVP
            // fact carries the point on its own.
            t(
              'MVP голосового бота на OpenAI Realtime API за 2 дня, внутренний аналитический инструмент поверх базы данных за 4 дня: внедрил LLM-инструменты и прототипирование с AI-агентами в процессы компании. Ежедневно работаю с Claude Code и Codex.',
              'A voice bot MVP on the OpenAI Realtime API in 2 days and an internal analytics tool over the database in 4 days: brought LLM tooling and AI-assisted prototyping into company workflows. Work with Claude Code and Codex daily.',
            ),
          ],
        ],
      },
    ],
  },
  {
    role: { ru: 'iOS/Frontend-разработчик', en: 'iOS / Frontend Developer' },
    company: { ru: 'Fodoj UG (Германия)', en: 'Fodoj UG (Germany)' },
    period: { ru: 'ноябрь 2020 - январь 2022', en: 'Nov 2020 - Jan 2022' },
    startDate: '2020-11',
    endDate: '2022-01',
    phases: [
      {
        title: { ru: '', en: '' },
        bullets: [
          [
            t(
              'Веб-продукт для рынка ЕС: self-service личный кабинет, испанская локализация, отчётность и комплаенс, UX-тестирование с пользователями.',
              'A web product for the EU market: a self-service web account, Spanish localization, reporting and compliance features, usability testing.',
            ),
          ],
        ],
      },
    ],
  },
];

/**
 * Employment history for JSON-LD.
 *
 * The site-wide Person schema says only `worksFor: Prof-IT` with no dates,
 * so the word "Zvonobot" — the subject of the whole resume — appeared nowhere
 * in the structured data an LLM screener reads first, and the second employer
 * was missing entirely. Built from cvExperience so it cannot drift from the
 * visible text, and it is what finally gives `startDate`/`endDate` a reader.
 */
export const buildEmploymentSchema = (locale: Locale): Record<string, unknown>[] =>
  cvExperience.map((role) => ({
    '@type': 'OrganizationRole',
    roleName: role.role[locale],
    startDate: role.startDate,
    ...(role.endDate ? { endDate: role.endDate } : {}),
    worksFor: {
      '@type': 'Organization',
      name: role.company[locale],
    },
  }));

// --- Products -------------------------------------------------------------

export const cvProducts: CvProduct[] = [
  {
    id: 'zvonobot-ai',
    name: 'Zvonobot AI',
    caseId: 'zvonobot-ai',
    externalUrl: 'https://zvonobot.ru/ai-agent',
    externalLabel: { ru: 'лендинг продукта', en: 'product landing' },
    metric: { ru: '80 клиентов, 500 000+ минут', en: '80 customers, 500,000+ minutes' },
    summary: {
      ru: 'Платформа голосовых AI-агентов для B2B: конструктор агентов, кампании, телефония, посекундный биллинг.',
      en: 'A B2B voice AI agent platform: agent builder, campaigns, telephony, per-second billing.',
    },
    // The card's metric line above already carries the 80/500k figures, so
    // the proof line makes the different claim: zero to a revenue line.
    proof: {
      ru: 'Доказывает запуск нового направления с нуля до заметной доли выручки группы за год.',
      en: 'Proves a new line launched from zero to a visible share of group revenue in a year.',
    },
  },
  {
    id: 'cursivo',
    name: 'cursivo',
    caseId: 'cursivo',
    externalUrl: 'https://cursivo.xyz',
    // In development, not launched: no live users yet, and claiming any is
    // exactly the kind of line that dies in the first interview question.
    metric: { ru: 'В процессе реализации', en: 'In development' },
    // The status lives in the metric line above; repeating it in the summary
    // read as an unedited card.
    summary: {
      ru: 'AI-CRM для автопрокатов: читает документы клиента, считает риск по сделке, подсказывает следующий шаг.',
      en: 'An AI CRM for car rental: reads client documents, scores deal risk, suggests the next step.',
    },
    // Not another "Proves...": three cards opening with the same verb read
    // as a template. One card keeps the frame, the other two state the fact.
    proof: {
      ru: 'Собственный продукт от идеи до работающей системы вне рабочего контекста.',
      en: 'My own product, from idea to a working system, outside the day job.',
    },
  },
  {
    id: 'obrabot',
    name: 'obrabot',
    caseId: 'obrabot',
    metric: {
      ru: 'Продукт в проде, внутренний инструмент Prof-IT',
      en: 'Live in production, internal Prof-IT tool',
    },
    summary: {
      ru: 'Внутренний кабинет аналитики голосовых AI-агентов: LLM сегментирует звонки и подсвечивает то, что требует внимания.',
      en: 'An internal voice AI analytics console: an LLM segments calls and surfaces what needs human attention.',
    },
    proof: {
      ru: 'LLM-аналитика поверх реальных данных прода.',
      en: 'LLM analytics built on top of real production data.',
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
      {
        // "churn" spelled out next to retention: it is the free exact-match
        // twin every B2B SaaS screener keys on.
        ru: 'юнит-экономика (LTV, CAC, retention и churn, средний чек)',
        en: 'unit economics (LTV, CAC, retention and churn, average spend)',
      },
      { ru: 'прайсинг и монетизация', en: 'pricing and monetization' },
      { ru: 'A/B-эксперименты, проверка гипотез', en: 'A/B experiments, hypothesis validation' },
      { ru: 'go-to-market, OKR', en: 'go-to-market, OKRs' },
      { ru: 'управление стейкхолдерами', en: 'stakeholder management' },
      { ru: 'B2B SaaS, CRM', en: 'B2B SaaS, CRM' },
    ],
  },
  {
    label: { ru: 'AI и LLM', en: 'AI and LLM' },
    items: [
      { ru: 'генеративный AI', en: 'generative AI (GenAI)' },
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
      { ru: 'PRD и ТЗ, декомпозиция', en: 'PRDs and specs, decomposition' },
      { ru: 'постановка, ревью, релизный цикл', en: 'acceptance criteria, reviews, release cycle' },
      { ru: 'работа с инженерами и продажами', en: 'working with engineers and sales' },
      { ru: 'быстрая валидация гипотез, 0 -> 1', en: 'fast hypothesis validation, 0 to 1' },
    ],
  },
  // The three tool groups mirror the current resume file verbatim: full tool
  // list, an AI-tools group of its own, and SIP named in the tech line.
  {
    label: { ru: 'Инструменты', en: 'Tools' },
    items: [
      { ru: 'Jira', en: 'Jira' },
      { ru: 'YouTrack', en: 'YouTrack' },
      { ru: 'Notion', en: 'Notion' },
      { ru: 'Confluence', en: 'Confluence' },
      { ru: 'Figma', en: 'Figma' },
      { ru: 'Miro', en: 'Miro' },
      { ru: 'Яндекс Метрика', en: 'Yandex Metrica' },
      { ru: 'PostHog', en: 'PostHog' },
    ],
  },
  {
    label: { ru: 'AI-инструменты', en: 'AI tools' },
    items: [
      { ru: 'Claude Code', en: 'Claude Code' },
      { ru: 'Codex', en: 'Codex' },
      { ru: 'прототипирование с AI-агентами', en: 'prototyping with AI agents' },
    ],
  },
  {
    label: { ru: 'Технологии', en: 'Technical' },
    items: [
      { ru: 'SQL', en: 'SQL' },
      { ru: 'Python', en: 'Python' },
      { ru: 'TypeScript', en: 'TypeScript' },
      { ru: 'REST', en: 'REST' },
      { ru: 'интеграции', en: 'integrations' },
      { ru: 'телефония (SIP)', en: 'telephony (SIP)' },
    ],
  },
];

// --- Education, languages, format ----------------------------------------

/**
 * University and year, with no qualification level named.
 *
 * The two locales used to say different things: RU spelled out "среднее
 * специальное" while EN said "Diploma", which a Western recruiter reads as a
 * degree. Naming no level at all is both consistent and accurate, and the
 * grade this resume argues for is carried by the numbers, not the credential.
 */
export const cvEducation: LocalizedText = {
  ru: 'ПГНИУ, Пермский государственный национальный исследовательский университет, 2022.',
  en: 'Perm State University, 2022.',
};

/**
 * Level code AND the fact, everywhere (Mikhail's call, 25 Aug 2026, after
 * the HR review): recruiters file English as a CEFR field, and a description
 * with no level gets recorded as "not stated". The descriptive half stays
 * because it is the evidence the label lacks. One string for the page and
 * the files alike.
 */
export const cvLanguages: LocalizedText = {
  ru: 'Русский родной. Английский B2: рабочая переписка и документация ежедневно, уверенно на рабочих созвонах.',
  en: 'Russian: native. English: B2, working correspondence and documentation daily, confident on work calls.',
};

export const cvWorkFormat: LocalizedText = {
  ru: 'Удалённо из Перми (GMT+5), открыт к релокации (Кипр, ЕС, ОАЭ), готов к командировкам. Полная занятость или контракт (ИП или самозанятость), оплата в USD, EUR или USDT, готов выйти за 2-4 недели.',
  en: 'Remote from Perm (GMT+5), open to relocation (Cyprus, EU, UAE), available for business travel. Full-time or contract (self-employed), invoices in USD, EUR or USDT, can start within 2-4 weeks.',
};

// --- What I am looking for ------------------------------------------------

/**
 * Replaces the former anti-fit list. Screeners, human and LLM alike, index
 * every word on the page, and negatives from the candidate's own site surface
 * in their summaries. The self-selection function stays, restated as a
 * positive filter: the same reader who would have failed the anti-fit list
 * fails this description too.
 */
/**
 * No format sentence here: the header line and the Work format block already
 * carry it, and stating it a third time (with a UTC+5 vs GMT+5 flip) read as
 * padding. The grade word differs by locale on purpose: "middle+" is the
 * native hh.ru convention, but it is CIS ladder jargon that does not exist in
 * Western vocabulary and self-caps the profile, so the EN version lets scope
 * name the level instead.
 */
export const cvLookingFor: LocalizedText = {
  ru: 'Роль Product Manager или Product Owner уровня middle+ в продуктовой команде. Домены, где мой опыт работает сразу: B2B SaaS, AI/LLM-продукты, платежи и биллинг, телеком и CPaaS, инфраструктурные платформы с интеграциями и API. Сильнее всего я там, где продукт надо запустить с нуля или вывести из MVP в рост.',
  en: 'A Product Manager or Product Owner role on a product team. Domains where my experience works from day one: B2B SaaS, AI and LLM products, payments and billing, telecom and CPaaS, infrastructure platforms with integrations and APIs. I am at my best where a product needs to be launched from zero or taken from MVP to growth.',
};

// --- Export file names ----------------------------------------------------

/**
 * Named for the reader, not for the repository: a recruiter sees this string
 * in their downloads folder. Convention is fixed in scripts/cv/README.md.
 */
export const cvFileBaseName: Record<Locale, string> = {
  en: 'Mikhail_Semenov_CV_EN',
  ru: 'Mikhail_Semenov_CV_RU',
};
