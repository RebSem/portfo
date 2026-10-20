import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { projects } from '../src/data/projects';

const BLOG_DIRECTORY = path.resolve('src/content/blog');
const PROJECT_DIRECTORY = path.resolve('src/content/projects');
const DIST = path.resolve('dist');
const describeBuilt = existsSync(path.join(DIST, 'index.html')) ? describe : describe.skip;
type PublishedEntry = {
  file: string;
  lang: 'ru' | 'en';
  publishedAt: string;
};

const readFrontmatter = (source: string) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? '';
};

const getField = (frontmatter: string, field: string) => {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim() ?? '';
};

describe('project catalog', () => {
  it('contains at least one visible project and no placeholders', () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((project) => project.placeholder !== true)).toBe(true);
    expect(projects.every((project) => project.appType.ru.length > 0 && project.appType.en.length > 0)).toBe(true);
    expect(projects.every((project) => project.visibility === 'public' || project.visibility === 'private')).toBe(true);
    expect(projects.every((project) => project.visibility === 'private' || Boolean(project.repoUrl || project.demoUrl))).toBe(true);
  });
});

describe('blog translation pairs', () => {
  it('keeps every published translation key complete for ru/en', () => {
    const files = readdirSync(BLOG_DIRECTORY).filter((file) => file.endsWith('.mdx'));
    const grouped = new Map<string, PublishedEntry[]>();

    for (const file of files) {
      const source = readFileSync(path.join(BLOG_DIRECTORY, file), 'utf8');
      const frontmatter = readFrontmatter(source);
      const lang = getField(frontmatter, 'lang');
      const translationKey = getField(frontmatter, 'translationKey');
      const publishedAt = getField(frontmatter, 'publishedAt');
      const draft = getField(frontmatter, 'draft');

      expect(lang === 'ru' || lang === 'en').toBe(true);
      expect(translationKey.length).toBeGreaterThan(0);
      expect(publishedAt.length).toBeGreaterThan(0);

      if (draft === 'true') continue;
      if (lang !== 'ru' && lang !== 'en') continue;

      const current = grouped.get(translationKey) ?? [];
      current.push({ file, lang, publishedAt });
      grouped.set(translationKey, current);
    }

    for (const [translationKey, entries] of grouped.entries()) {
      expect(entries, `${translationKey} should include RU and EN versions`).toHaveLength(2);
      expect(entries.map((entry: PublishedEntry) => entry.lang).sort()).toEqual(['en', 'ru']);
      expect(
        new Set(entries.map((entry: PublishedEntry) => entry.publishedAt)).size,
        `${translationKey} should share the same publication date`,
      ).toBe(1);
    }
  });
});

/**
 * Astro 6+ treats a collection without a loader as empty and still exits 0,
 * logging only a warning: every case study and post would vanish from the
 * build. This reads the MDX files directly and checks that each published one
 * got its page (and, for case studies, its sitemap entry). Runs when dist/
 * exists, like the build output suite in cv.test.ts.
 */
describeBuilt('built content pages', () => {
  const unquote = (value: string) => value.replace(/^(['"])(.*)\1$/, '$2');

  const publishedEntries = (directory: string) =>
    readdirSync(directory)
      .filter((file) => /\.mdx?$/.test(file) && !file.startsWith('_'))
      .map((file) => {
        const frontmatter = readFrontmatter(readFileSync(path.join(directory, file), 'utf8'));
        return {
          id: file.replace(/\.mdx?$/, ''),
          lang: unquote(getField(frontmatter, 'lang')),
          draft: unquote(getField(frontmatter, 'draft')) === 'true',
        };
      })
      .filter((entry) => !entry.draft);

  const pagePath = (lang: string, section: string, id: string) =>
    `${lang === 'ru' ? '/ru' : ''}/${section}/${id}/`;

  it('builds a page for every published case study and blog post', () => {
    const expected = [
      ...publishedEntries(PROJECT_DIRECTORY).map((entry) => pagePath(entry.lang, 'projects', entry.id)),
      ...publishedEntries(BLOG_DIRECTORY).map((entry) => pagePath(entry.lang, 'blog', entry.id)),
    ];
    const missing = expected.filter((page) => !existsSync(path.join(DIST, page, 'index.html')));

    expect(expected.length).toBeGreaterThan(0);
    expect(missing, 'published content without a built page').toEqual([]);
  });

  it('lists every published case study in the sitemap', () => {
    const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
    const missing = publishedEntries(PROJECT_DIRECTORY)
      .map((entry) => `https://rebsem.ru${pagePath(entry.lang, 'projects', entry.id)}`)
      .filter((url) => !sitemap.includes(`<loc>${url}</loc>`));

    expect(missing, 'published case studies missing from sitemap.xml').toEqual([]);
  });
});
