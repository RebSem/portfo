import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The placement hooks the click handler reads (linkPlacement in
 * src/scripts/analytics.ts). Each block that carries a new link is named here,
 * so a redesign that drops an attribute fails a test instead of quietly blanking
 * a metric. The built-page checks skip when there is no dist/, like the others.
 */

const DIST = path.resolve('dist');
const hasDist = existsSync(path.join(DIST, 'index.html'));

const built = (...parts: string[]) => readFileSync(path.join(DIST, ...parts, 'index.html'), 'utf8');
const placed = (value: string) => `data-analytics-placement="${value}"`;

const caseSlug = hasDist
  ? readdirSync(path.join(DIST, 'projects')).find((name) => name.endsWith('-en'))
  : undefined;
const caseSlugRu = hasDist
  ? readdirSync(path.join(DIST, 'ru', 'projects')).find((name) => name.endsWith('-ru'))
  : undefined;

describe('analytics placements in the built pages', () => {
  it.skipIf(!hasDist)('marks the booking link in the home closing footer, in both locales', () => {
    for (const [html, href] of [[built(), '/call/'], [built('ru'), '/ru/call/']] as const) {
      const footer = html.match(new RegExp(`<footer[^>]*${placed('footer')}[\\s\\S]*?</footer>`))?.[0] ?? '';
      expect(footer).toContain(`href="${href}"`);
    }
  });

  it.skipIf(!hasDist)('marks the booking link in the case availability strip, in both locales', () => {
    const en = built('projects', caseSlug ?? '');
    const ru = built('ru', 'projects', caseSlugRu ?? '');
    for (const [html, href] of [[en, '/call/'], [ru, '/ru/call/']] as const) {
      const strip = html.match(new RegExp(`<p[^>]*${placed('case')}[\\s\\S]*?</p>`))?.[0] ?? '';
      expect(strip).toContain(`href="${href}"`);
    }
  });

  it.skipIf(!hasDist)('marks the booking link in the About call to action, in both locales', () => {
    for (const [html, href] of [[built('about'), '/call/'], [built('ru', 'about'), '/ru/call/']] as const) {
      const cta = html.match(new RegExp(`<div class="about-cta"[^>]*${placed('about-cta')}[\\s\\S]*?</section>`))?.[0] ?? '';
      expect(cta).toContain(`href="${href}"`);
    }
  });

  it.skipIf(!hasDist)('marks the booking page section itself', () => {
    expect(built('call').includes(placed('call'))).toBe(true);
    expect(built('ru', 'call').includes(placed('call'))).toBe(true);
  });

  it.skipIf(!hasDist)('marks the phone line under the home hero, with its Email and LinkedIn links', () => {
    for (const html of [built(), built('ru')]) {
      const line = html.match(new RegExp(`<p[^>]*${placed('hero-alt')}[\\s\\S]*?</p>`))?.[0] ?? '';
      expect(line).toContain('mailto:');
      expect(line).toContain('linkedin.com');
    }
  });

  it.skipIf(!hasDist)('marks the Resume link in the hero, on the laptop row and the phone line', () => {
    for (const [html, href] of [
      [built(), '/cv/'],
      [built('ru'), '/ru/cv/'],
    ] as const) {
      const hero = html.match(new RegExp(`<section[^>]*${placed('hero')}[\\s\\S]*?</section>`))?.[0] ?? '';
      expect(hero).toMatch(new RegExp(`<a class="footer-cv hero-cv" href="${href}" rel="nofollow"`));
      expect(hero).toMatch(new RegExp(`<a href="${href}" [^>]*rel="nofollow"`));
    }
  });

  it.skipIf(!hasDist)('marks the home closing footer, with the Resume link inside it', () => {
    const footer = built().match(new RegExp(`<footer[^>]*${placed('footer')}[\\s\\S]*?</footer>`))?.[0] ?? '';
    expect(footer).toMatch(/<a class="footer-cv" href="\/cv\/"/);
  });

  it.skipIf(!hasDist)('keeps the Resume link out of the case strip, in the case closing footer instead', () => {
    const html = built('projects', caseSlug ?? '');
    const strip = html.match(new RegExp(`<p[^>]*${placed('case')}[\\s\\S]*?</p>`))?.[0] ?? '';
    expect(strip).not.toMatch(/href="\/cv\/"/);
    const footer = html.match(new RegExp(`<footer[^>]*${placed('footer')}[\\s\\S]*?</footer>`))?.[0] ?? '';
    expect(footer).toMatch(/<a class="footer-cv" href="\/cv\/"/);
  });

  it.skipIf(!hasDist)('marks the next-case block on every case page', () => {
    const block = built('projects', caseSlug ?? '').match(new RegExp(`<section[^>]*${placed('case-next')}`));
    expect(block).not.toBeNull();
  });

  it.skipIf(!hasDist)('marks the About call to action in both locales', () => {
    expect(built('about').includes(placed('about-cta'))).toBe(true);
    expect(built('ru', 'about').includes(placed('about-cta'))).toBe(true);
  });
});

describe('analytics placement in the source', () => {
  // The receipt list renders only when GitHub data or git is available at build
  // time, so it is checked in the component rather than in dist/.
  it('marks the AgentOps receipt list', () => {
    const source = readFileSync(path.resolve('src/components/AgentOps.astro'), 'utf8');
    expect(source).toContain(`class="agent-receipts" ${placed('agent-receipts')}`);
  });
});
