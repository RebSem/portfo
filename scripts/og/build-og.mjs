/**
 * Renders the link-preview cards (og:image) for the pages that used to fall
 * back to a photo. A recruiter sees this card in Telegram or LinkedIn before
 * they see the site, so it carries the same three things the hero does: the
 * name, the role line, and the one number.
 *
 *   node scripts/og/build-og.mjs
 *
 * Writes public/og/{page}-{locale}.png at 1200x630 via headless Chrome. Fonts
 * come from the site's own assets: Newsreader italic from src/assets/fonts,
 * Geist and Geist Mono from Google (the same source astro.config.mjs uses).
 * Newsreader has no Cyrillic, so the Russian name is set in Geist; the
 * Latin name keeps the serif the site's brand mark uses.
 */
import { mkdirSync, writeFileSync, statSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const OUT = resolve(ROOT, 'public/og');
const TMP = resolve(ROOT, 'node_modules/.cache/og');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const NEWSREADER = `file://${resolve(ROOT, 'src/assets/fonts/newsreader-italic-var-latin.woff2')}`;

mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const CARDS = [
  { page: 'home', locale: 'en', eyebrow: 'rebsem.ru', role: 'Product Manager · B2B SaaS · Voice AI agents · LLM' },
  { page: 'home', locale: 'ru', eyebrow: 'rebsem.ru', role: 'Product Manager · B2B SaaS · голосовые AI-агенты · LLM' },
  { page: 'about', locale: 'en', eyebrow: 'rebsem.ru / about', role: 'Product Manager · B2B SaaS · Voice AI agents · LLM' },
  { page: 'about', locale: 'ru', eyebrow: 'rebsem.ru / обо мне', role: 'Product Manager · B2B SaaS · голосовые AI-агенты · LLM' },
  { page: 'cv', locale: 'en', eyebrow: 'rebsem.ru / cv', role: 'Product Manager · B2B SaaS · Voice AI agents · LLM' },
  { page: 'cv', locale: 'ru', eyebrow: 'rebsem.ru / резюме', role: 'Product Manager · B2B SaaS · голосовые AI-агенты · LLM' },
];

const COPY = {
  en: { name: 'Mikhail Semenov', number: '500,000+', unit: 'minutes', caption: 'of live voice-AI conversations in production · 80 paying B2B customers · launched from zero' },
  ru: { name: 'Михаил Семенов', number: '500 000+', unit: 'минут', caption: 'живых разговоров голосовых AI-агентов в проде · 80 платящих B2B-клиентов · запуск с нуля' },
};

const html = ({ locale, eyebrow, role }) => {
  const c = COPY[locale];
  const serifName = locale === 'en';
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500&display=block" rel="stylesheet">
<style>
  @font-face { font-family: 'Newsreader'; font-style: italic; font-weight: 400 500; src: url('${NEWSREADER}') format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #0c0d0e; color: #ececec; font-family: 'Geist', system-ui, sans-serif;
    position: relative;
    padding: 64px 72px 60px;
    display: flex; flex-direction: column; justify-content: space-between;
    -webkit-font-smoothing: antialiased;
  }
  /* A single soft accent wash top-left, mirroring the site's body gradient. */
  body::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(900px 420px at 6% -10%, rgba(45,214,146,0.14), transparent 65%);
  }
  .eyebrow { position: relative; font-family: 'Geist Mono', monospace; font-size: 20px; letter-spacing: 0.14em; text-transform: uppercase; color: #8b9096; }
  .name { position: relative; margin-top: 18px; font-size: 96px; line-height: 1.02; letter-spacing: -0.02em; color: #ffffff; }
  .name.serif { font-family: 'Newsreader', Georgia, serif; font-style: italic; font-weight: 400; letter-spacing: -0.01em; }
  .name.sans { font-family: 'Geist', sans-serif; font-weight: 600; }
  .role { position: relative; margin-top: 22px; font-size: 30px; font-weight: 500; color: #c9cdd2; letter-spacing: -0.005em; }
  .bottom { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; padding-top: 28px; border-top: 1px solid #25282b; }
  .number { font-size: 74px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; color: #2dd692; white-space: nowrap; }
  .number .unit { font-size: 30px; font-weight: 500; letter-spacing: 0; color: #ececec; margin-left: 12px; }
  .caption { max-width: 560px; font-size: 21px; line-height: 1.4; color: #a4a9af; text-align: right; }
</style></head><body>
  <div>
    <p class="eyebrow">${eyebrow}</p>
    <h1 class="name ${serifName ? 'serif' : 'sans'}">${c.name}</h1>
    <p class="role">${role}</p>
  </div>
  <div class="bottom">
    <p class="number">${c.number}<span class="unit">${c.unit}</span></p>
    <p class="caption">${c.caption}</p>
  </div>
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
