import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { projects } from '../src/data/projects';

const BLOG_DIRECTORY = path.resolve('src/content/blog');
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
