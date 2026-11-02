import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards for the October 2026 audit fixes. Each suite fails as soon as the
 * change it protects is undone, so a later edit cannot quietly bring back an
 * endless animation, a hidden first paint, a long search snippet or a browser
 * call to GitHub's search API. Suites that read the built site skip when no
 * dist/ is present, like the other suites.
 */

const SRC = path.resolve('src');
const DIST = path.resolve('dist');
const GLOBAL_CSS = path.resolve('src/styles/global.css');
const hasDist = existsSync(path.join(DIST, 'index.html'));

const rel = (file: string) => path.relative(process.cwd(), file);

const walk = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const full = path.join(directory, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const stripCssComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

// The <style> blocks of an .astro component or a built page. The markup around
// them can say "infinite" in prose, which is not an animation, so only these count.
const styleBlocks = (source: string) =>
  [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]).join('\n');

// The CSS a file ships: a stylesheet as written, or the inline styles of a component or page.
const cssOf = (file: string) => {
  const source = readFileSync(file, 'utf8');
  return stripCssComments(file.endsWith('.css') ? source : styleBlocks(source));
};

// The `{ ... }` block that follows the at-rule at `start`, matched by brace depth
// so that rules nested inside it count too.
const blockAt = (source: string, start: number): string => {
  const open = source.indexOf('{', start);
  if (open < 0) return '';
  let depth = 0;
  for (let at = open; at < source.length; at += 1) {
    if (source[at] === '{') depth += 1;
    if (source[at] === '}') depth -= 1;
    if (depth === 0) return source.slice(open, at + 1);
  }
  return source.slice(open);
};

// The content of a <meta> tag found by its name or property, whatever the attribute order.
const metaContent = (html: string, attribute: string, value: string) => {
  const tag = [...html.matchAll(/<meta\b[^>]*>/g)]
    .map((match) => match[0])
    .find((candidate) => candidate.includes(` ${attribute}="${value}"`));
  return tag?.match(/ content="([^"]*)"/)?.[1];
};

// Astro escapes attribute values, so decode before counting: "&#39;" is one character.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

const decodeEntities = (text: string): string =>
  text.replace(/&(?:#x([\da-f]+)|#(\d+)|([a-z]+));/gi, (match, hex, dec, name) => {
    if (hex !== undefined) return String.fromCodePoint(parseInt(hex, 16));
    if (dec !== undefined) return String.fromCodePoint(parseInt(dec, 10));
    return NAMED_ENTITIES[name.toLowerCase()] ?? match;
  });

describe('no endless animations', () => {
  // A looping animation keeps the GPU busy on a page nobody is watching and pulls
  // the eye off the text. Reduced-motion overrides write `animation: none`, which
  // does not contain the word, so they pass.
  const ENDLESS = /\binfinite\b/i;

  it('keeps `infinite` out of the components and stylesheets in src/', () => {
    for (const file of walk(SRC).filter((name) => /\.(astro|css)$/.test(name))) {
      expect(ENDLESS.test(cssOf(file)), `${rel(file)} loops an animation forever`).toBe(false);
    }
  });

  // Astro inlines small stylesheets into the HTML, so the built CSS is not all in _astro/.
  it.skipIf(!hasDist)('keeps `infinite` out of the built stylesheets and inline styles', () => {
    for (const file of walk(DIST).filter((name) => /\.(css|html)$/.test(name))) {
      expect(ENDLESS.test(cssOf(file)), `${rel(file)} loops an animation forever`).toBe(false);
    }
  });
});

describe('nothing starts hidden', () => {
  // A @starting-style block that begins at opacity 0 leaves the hero, About and
  // /cv blank until the transition runs. Motion may only start from a visible state.
  const HIDDEN = /\bopacity\s*:\s*0(?:\.0+)?\s*[;}!]/;

  it('sets no opacity 0 inside any @starting-style block in src/', () => {
    for (const file of walk(SRC)) {
      const source = stripCssComments(readFileSync(file, 'utf8'));
      for (
        let at = source.indexOf('@starting-style');
        at >= 0;
        at = source.indexOf('@starting-style', at + 1)
      ) {
        expect(
          HIDDEN.test(blockAt(source, at)),
          `${rel(file)} starts hidden (opacity: 0 in @starting-style)`,
        ).toBe(false);
      }
    }
  });
});

describe('meta descriptions', () => {
  // Search snippets are cut at about 160 characters, so a longer description loses
  // its tail. Only the pages rewritten for that are pinned here; case studies and
  // posts still run longer and are shortened separately.
  const LIMIT = 160;
  const PAGES = [
    'index.html',
    'ru/index.html',
    'about/index.html',
    'ru/about/index.html',
    'cv/index.html',
    'ru/cv/index.html',
  ];
  const TAGS = [
    ['name', 'description'],
    ['property', 'og:description'],
  ] as const;

  it.skipIf(!hasDist)('keeps each description and og:description within 160 characters', () => {
    for (const page of PAGES) {
      const file = path.join(DIST, page);
      const html = readFileSync(file, 'utf8');
      for (const [attribute, value] of TAGS) {
        const content = metaContent(html, attribute, value);
        expect(content, `${rel(file)} has no <meta ${attribute}="${value}">`).toBeDefined();
        const length = [...decodeEntities(content ?? '')].length;
        expect(
          length,
          `${rel(file)}: ${value} is ${length} characters, the limit is ${LIMIT}`,
        ).toBeLessThanOrEqual(LIMIT);
      }
    }
  });
});

describe('anchors clear the sticky header', () => {
  // Skip links and /cv anchors scroll their target to the top of the viewport,
  // under the sticky header, unless html reserves the offset.
  it('sets scroll-padding-top on html in src/styles/global.css', () => {
    const css = stripCssComments(readFileSync(GLOBAL_CSS, 'utf8'));
    expect(
      /(?:^|[\s}])html\s*\{[^}]*\bscroll-padding-top\s*:/.test(css),
      `${rel(GLOBAL_CSS)} has no scroll-padding-top on html`,
    ).toBe(true);
  });
});

describe('GitHub numbers come from the build', () => {
  // The GitHub counters are read at build time (src/lib/github.ts) and printed into
  // the HTML. A browser call to the search API would run on every visit and share
  // GitHub's unauthenticated rate limit with all of them.
  const SEARCH_API = 'api.github.com/search';
  // A <script> without a src attribute runs its text inline.
  const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

  it.skipIf(!hasDist)('keeps GitHub search calls out of built scripts', () => {
    for (const file of walk(DIST).filter((name) => name.endsWith('.js'))) {
      expect(
        readFileSync(file, 'utf8').includes(SEARCH_API),
        `${rel(file)} calls the GitHub search API in the browser`,
      ).toBe(false);
    }
    for (const file of walk(DIST).filter((name) => name.endsWith('.html'))) {
      for (const [, script] of readFileSync(file, 'utf8').matchAll(INLINE_SCRIPT)) {
        expect(
          script.includes(SEARCH_API),
          `${rel(file)} has an inline script calling the GitHub search API`,
        ).toBe(false);
      }
    }
  });
});
