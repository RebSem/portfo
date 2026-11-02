import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The owner reads the em dash as the visible mark of generated text, so the
 * published case studies and blog posts and the web manifest (its name shows in
 * install prompts and the browser) must not carry one. Drafts are not built,
 * so they are skipped: this checks what visitors and crawlers can reach.
 */

const EM_DASH = '—';
const CONTENT_DIRECTORY = path.resolve('src/content');
const MANIFEST = path.resolve('public/manifest.webmanifest');

const listFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const full = path.join(directory, entry);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });

const readFrontmatter = (source: string) => source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';

const isDraft = (source: string) => /^draft:\s*true\s*$/m.test(readFrontmatter(source));

const emDashLines = (file: string): string[] =>
  readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, index) => (line.includes(EM_DASH) ? [`${path.relative(process.cwd(), file)}:${index + 1}`] : []));

describe('published copy', () => {
  it('keeps em dashes out of published MDX', () => {
    const published = listFiles(CONTENT_DIRECTORY).filter(
      (file) =>
        file.endsWith('.mdx') &&
        !path.basename(file).startsWith('_') &&
        !isDraft(readFileSync(file, 'utf8')),
    );

    expect(published.length).toBeGreaterThan(0);
    expect(published.flatMap(emDashLines)).toEqual([]);
  });

  it('keeps em dashes out of the web manifest', () => {
    expect(emDashLines(MANIFEST)).toEqual([]);
  });
});
