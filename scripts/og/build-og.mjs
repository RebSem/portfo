/**
 * Renders the link-preview cards (og:image) for the home, About, CV and booking
 * pages in both locales, and for the Zvonobot AI case. A recruiter sees this card in
 * Telegram or LinkedIn before they see the site, and a feed often shows only the
 * card and the title, so the home card carries what the home page leads with:
 * the name and the role, the headline, the job-search status and the one proof
 * point. It repeats the home page's copy and sets no display-size number, so it
 * does not contradict the page it links to. The case card uses the same
 * template with the case's own copy.
 *
 *   node scripts/og/build-og.mjs
 *
 * Writes public/og/{page}-{locale}.png at 1200x630 via headless Chrome. Geist
 * and Geist Mono come from Google. Bump OG_CARD_VERSION in
 * src/layouts/Layout.astro after a change here, so preview caches refetch.
 */
import { mkdirSync, writeFileSync, statSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const OUT = resolve(ROOT, 'public/og');
const TMP = resolve(ROOT, 'node_modules/.cache/og');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

// Kept in step by hand with the home hero (src/data/site-content.ts) and the
// resume (src/data/cv.ts): this script runs outside Astro and cannot import them.
const COPY = {
  en: {
    name: 'Mikhail Semenov · Product Manager since 2022',
    headline: ['I launch and grow', 'B2B &amp; AI products.'],
    status: 'Open to work · available now',
    proof: '80 paying B2B customers in under a year · Remote, GMT+5',
  },
  ru: {
    name: 'Михаил Семенов · Product Manager с 2022 года',
    headline: ['Запускаю и развиваю', 'B2B и AI-продукты.'],
    status: 'Ищу работу · готов выйти сразу',
    proof: '80 платящих B2B-клиентов меньше чем за год · удалённо, GMT+5',
  },
};

// The Zvonobot AI case card. Kept in step by hand with the case's description
// and frontmatter (src/content/projects/zvonobot-ai-*.mdx). It has no status
// pill: the case is about the product, not the job search.
const CASE = {
  en: {
    name: 'Product, pricing, go-to-market · Mikhail Semenov',
    headline: ['Zvonobot AI'],
    proof: 'Voice AI agents for B2B · 80 paying customers in under a year',
  },
  ru: {
    name: 'Продукт, прайсинг, вывод на рынок · Михаил Семенов',
    headline: ['Zvonobot AI'],
    proof: 'Голосовые AI-агенты для B2B · 80 платящих клиентов меньше чем за год',
  },
};

// The booking page's card (/call/). The name line is the home card's; the
// headline is the page's H1, and the line under it lists the formats. No status
// pill: the card is about booking, not the job search. The Russian headline is
// two lines, since the one-line size would not fit "Давайте созвонимся".
const CALL = {
  en: {
    name: COPY.en.name,
    headline: ["Let's talk"],
    proof: '15, 30 or 60 minutes · Google Meet · your time zone',
  },
  ru: {
    name: COPY.ru.name,
    headline: ['Давайте', 'созвонимся'],
    proof: '15, 30 или 60 минут · Google Meet · ваш часовой пояс',
  },
};

// The eyebrow is the only part that differs between pages: it says where the
// link leads. Everything else is the same card for every page of a locale.
const CARDS = [
  { page: 'home', locale: 'en', eyebrow: 'rebsem.ru' },
  { page: 'home', locale: 'ru', eyebrow: 'rebsem.ru' },
  { page: 'about', locale: 'en', eyebrow: 'rebsem.ru / about' },
  { page: 'about', locale: 'ru', eyebrow: 'rebsem.ru / обо мне' },
  { page: 'cv', locale: 'en', eyebrow: 'rebsem.ru / cv' },
  { page: 'cv', locale: 'ru', eyebrow: 'rebsem.ru / резюме' },
  { page: 'call', locale: 'en', eyebrow: 'rebsem.ru / call', copy: CALL.en },
  { page: 'call', locale: 'ru', eyebrow: 'rebsem.ru / созвон', copy: CALL.ru },
  { page: 'case-zvonobot-ai', locale: 'en', eyebrow: 'rebsem.ru / case', copy: CASE.en },
  { page: 'case-zvonobot-ai', locale: 'ru', eyebrow: 'rebsem.ru / кейс', copy: CASE.ru },
];

const html = ({ locale, eyebrow, copy = COPY[locale] }) => {
  const c = copy;
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@500&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #0c0d0e; color: #ececec; font-family: 'Geist', system-ui, sans-serif;
    position: relative;
    padding: 64px 72px 60px;
    display: flex; flex-direction: column;
    -webkit-font-smoothing: antialiased;
  }
  /* A single soft accent wash top-left, mirroring the site's body gradient. */
  body::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(900px 420px at 6% -10%, rgba(45,214,146,0.14), transparent 65%);
  }
  .top { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .status { display: inline-flex; align-items: center; gap: 12px; padding: 9px 20px 9px 16px; border: 1px solid rgba(45,214,146,0.38); border-radius: 999px; background: rgba(45,214,146,0.08); font-size: 22px; font-weight: 500; color: #2dd692; white-space: nowrap; }
  .status::before { content: ''; width: 10px; height: 10px; border-radius: 50%; background: #2dd692; }
  .eyebrow { font-family: 'Geist Mono', monospace; font-size: 20px; letter-spacing: 0.14em; text-transform: uppercase; color: #8b9096; }
  .lead { position: relative; margin: auto 0 36px; }
  .name { font-size: 32px; font-weight: 500; letter-spacing: -0.01em; color: #ececec; }
  .headline { margin-top: 24px; font-size: 84px; font-weight: 580; line-height: 1.02; letter-spacing: -0.045em; color: #ffffff; }
  .headline span { display: block; }
  .headline .accent { color: #2dd692; }
  /* A one-line headline (the case name) is set larger, so the card does not look empty. */
  .headline.solo { font-size: 136px; }
  .proof { position: relative; padding-top: 28px; border-top: 1px solid #25282b; font-size: 26px; line-height: 1.2; color: rgba(255,255,255,0.7); white-space: nowrap; }
</style></head><body>
  <div class="top">
    <p class="eyebrow">${eyebrow}</p>
    ${c.status ? `<p class="status">${c.status}</p>` : ''}
  </div>
  <div class="lead">
    <p class="name">${c.name}</p>
    <h1 class="headline${c.headline.length === 1 ? ' solo' : ''}">${c.headline.map((line, i) => `<span${i === 1 ? ' class="accent"' : ''}>${line}</span>`).join('')}</h1>
  </div>
  <p class="proof">${c.proof}</p>
</body></html>`;
};

let ok = 0;
for (const card of CARDS) {
  const file = resolve(TMP, `${card.page}-${card.locale}.html`);
  const png = resolve(OUT, `${card.page}-${card.locale}.png`);
  writeFileSync(file, html(card), 'utf8');
  const res = spawnSync(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--virtual-time-budget=6000', '--window-size=1200,630',
    `--screenshot=${png}`, `file://${file}`,
  ], { stdio: 'ignore' });
  if (res.status !== 0) { console.error(`FAIL ${card.page}-${card.locale}`); continue; }
  ok += 1;
  console.log(`ok  ${card.page}-${card.locale}.png  ${Math.round(statSync(png).size / 1024)} KB`);
}
rmSync(TMP, { recursive: true, force: true });
console.log(`${ok}/${CARDS.length} cards -> public/og`);
