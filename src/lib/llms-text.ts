import {
  cvAvailability,
  cvExperience,
  cvMetric,
  cvName,
  cvProducts,
  email,
  githubUrl,
  linkedinUrl,
  siteRepoUrl,
  siteUrl,
  telegramUrl,
} from '../data/cv';

/**
 * The llms.txt file (llmstxt.org shape) for LLM screeners. The numbers, the
 * dates, the availability and the contacts come from cv.ts, so the file moves
 * with the resume. The wording is the llms voice and lives here once.
 *
 * Two things stay out on purpose, as the owner decided: the revenue share
 * (the "~10%" tile) and the city. The resume keeps both; this file does not.
 * tests/cv.test.ts checks the built file for them.
 */

export interface LlmsCase {
  /** Content collection entry id, which is also the case URL slug. */
  id: string;
  title: string;
  description: string;
}

const customers = cvMetric('customers');
const minutes = cvMetric('minutes');
const averageSpend = cvMetric('average-spend');
const repeatRevenue = cvMetric('repeat-revenue');
const countries = cvMetric('countries');

// The first role in cvExperience is the Zvonobot one.
const [zvonobot] = cvExperience;

const productUrl = (id: string): string => {
  const url = cvProducts.find((product) => product.id === id)?.externalUrl;
  if (!url) throw new Error(`No external URL for CV product: ${id}`);
  return url;
};

/** "2022-02" to "February 2022", the month style the rest of the page uses. */
const monthYear = (isoMonth: string): string =>
  new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${isoMonth}-01T00:00:00Z`),
  );

const zvonobotStart = monthYear(zvonobot.startDate);
const zvonobotEnd = zvonobot.endDate ? monthYear(zvonobot.endDate) : 'present';

// The same status line as the resume, in the sentence form this file uses.
const availability = cvAvailability.en.replace(' · ', ', ');

/**
 * One line per published case, in the order the list shows them: the Prof-IT
 * work first, then the product in development, then the side projects. A case
 * that is not listed here still appears, with its collection description, so a
 * new case never needs an edit in this file to show up.
 */
const CASE_NOTES = new Map<string, string>([
  [
    'zvonobot-ai-en',
    `the line launched from scratch in October 2025, ${customers.value.en} ${customers.label.en} in under a year`,
  ],
  [
    'obrabot-en',
    'internal prompt registry, proposal generator and LLM call analytics, in production; owned as the PM until October 2026',
  ],
  [
    'cursivo-en',
    `own product in development, no public release and no users yet (product site: ${productUrl('cursivo')})`,
  ],
  [
    'bazabot-en',
    'contact list cleanup for SMS and calling campaigns, built and shipped in one day',
  ],
  [
    'zodial-en',
    'payments, computation, PDF and email with no human in the loop, built in 3 days',
  ],
  ['slopiq-en', 'personal SwiftUI app, from idea to a working build in 7 days'],
  ['portfo-en', 'this hiring site, built in 3 days and open source'],
]);

const CASE_ORDER = [...CASE_NOTES.keys()];

const caseRank = (id: string): number => {
  const index = CASE_ORDER.indexOf(id);
  return index === -1 ? CASE_ORDER.length : index;
};

export const buildLlmsText = (cases: LlmsCase[]): string => {
  const caseLines = [...cases]
    .sort((a, b) => caseRank(a.id) - caseRank(b.id))
    .map(
      (item) =>
        `- [${item.title}](${siteUrl}/projects/${item.id}/): ${CASE_NOTES.get(item.id) ?? item.description}`,
    );

  const lines = [
    `# ${cvName.en}, Product Manager`,
    '',
    `> Product manager in B2B SaaS, 4.5 years. ${availability}. At Zvonobot (Prof-IT Group), ${zvonobotStart} to ${zvonobotEnd}, launched a voice AI agent line from scratch in October 2025: ${customers.value.en} paying B2B customers and ${minutes.value.en} minutes of live conversations in production in under a year. Remote, GMT+5, open to relocation.`,
    '',
    '## Profile',
    '- Title: Product Manager (B2B SaaS, voice AI agents, LLM)',
    `- Status: ${availability.toLowerCase()}`,
    '- Looking for: Product Manager or Product Owner roles on a product team, in B2B SaaS, AI and LLM products, payments and billing, telecom and CPaaS, or infrastructure platforms with integrations and APIs; full-time or contract',
    '- Location and format: remote, GMT+5; open to relocation',
    '- Languages: Russian (native); English B2, working correspondence and documentation daily, confident on work calls',
    '',
    `## Zvonobot AI, October 2025 to ${zvonobotEnd}`,
    '- Launched from scratch: a white-label platform first, to prove demand with live customers; then the case, made with numbers, for an in-house and more flexible platform, and the move of the line onto it',
    `- ${customers.value.en} ${customers.label.en} and ${minutes.value.en} minutes of live conversations in production by August 2026, in under a year from launch`,
    `- ${repeatRevenue.value.en} ${repeatRevenue.label.en}`,
    `- ${averageSpend.value.en} average spend: customers on AI agents versus customers on the legacy linear IVR robot, which became the basis for pricing`,
    '- Full product suite of the line: agent and script builder, LLM call analytics, per-second billing plans by cost component (LLM, ASR, TTS), balance hold at campaign start',
    '- Owned pricing, per-call-type margins, unit economics and go-to-market with sales, support and finance; the sales team grew from 4 to 15 people to sell the line',
    '- Team of 4 engineers: engineering reported to the tech lead, while priorities, specs and acceptance were mine; set quarterly OKRs for the line',
    '',
    '## Zvonobot core platform, 2022-2025',
    '- The core B2B SaaS platform end to end: self-service customer console, campaign creation and lead-list targeting, script builder, telephony, per-second billing, wallets, reporting and call analytics',
    `- CPaaS products of the group in ${countries.value.en} countries (bulk calls and SMS): ran Effebot (Zvonobot's international brand) and P1SMS, with traffic routing across providers, billing and API integrations`,
    '- Took over the virtual PBX line: connecting businesses to it as an adjacent product for existing call and SMS customers',
    '- A full discovery and delivery loop: customer interviews, hypotheses tested on metrics, A/B tests of call scripts, PRDs, and a release cycle run with sales, support and engineering',
    '- A voice bot MVP on the OpenAI Realtime API in 2 days, and an internal analytics tool over the database in 4 days',
    '',
    '## Case studies',
    ...caseLines,
    '',
    '## Pages',
    `- [Home](${siteUrl}/): profile, results and open-to-work status`,
    `- [About](${siteUrl}/about/): how I launch products from scratch, own pricing and go-to-market, and work with engineers`,
    `- [Russian version](${siteUrl}/ru/): the same site in Russian; case studies are published in RU and EN`,
    `- [Source code](${siteRepoUrl}): this site is open source (Astro)`,
    '',
    '## Skills',
    'Product: product strategy, roadmap, discovery, customer interviews, metrics and unit economics, pricing, A/B experiments, go-to-market, B2B SaaS, CRM.',
    'AI / LLM: voice AI agents, conversational AI, LLM orchestration, prompt engineering, LLM evals, ASR, TTS, contact centers, SIP telephony.',
    'Delivery: spec, review, release cycle; prototyping with AI coding agents (Claude Code, Codex); fast hypothesis validation, 0 to 1.',
    'Shared language with engineers: TypeScript, Python, SQL, REST, telephony.',
    '',
    '## Contact',
    `- Telegram: ${telegramUrl}`,
    `- Email: ${email}`,
    `- LinkedIn: ${linkedinUrl}`,
    `- GitHub: ${githubUrl}`,
  ];

  return `${lines.join('\n')}\n`;
};
