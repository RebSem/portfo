#!/usr/bin/env node
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/blog');

const usage = `Usage:\n  npm run new:post -- <slug> [--lang ru|en] [--title "Post title"]\n\nExample:\n  npm run new:post -- my-first-post --lang en --title "My first post"`;

const sanitizeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const parseArgs = () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(usage);
    process.exit(0);
  }

  const rawSlug = args[0];
  const slug = sanitizeSlug(rawSlug);
  if (!slug) {
    console.error('Invalid slug. Use latin letters, numbers, spaces, and dashes.');
    process.exit(1);
  }

  let lang = 'ru';
  let title = 'New post';

  for (let index = 1; index < args.length; index += 1) {
    const current = args[index];

    if (current === '--lang') {
      const value = args[index + 1];
      if (value !== 'ru' && value !== 'en') {
        console.error('`--lang` must be `ru` or `en`.');
        process.exit(1);
      }
      lang = value;
      index += 1;
      continue;
    }

    if (current === '--title') {
      const value = args[index + 1];
      if (!value) {
        console.error('`--title` requires a value.');
        process.exit(1);
      }
      title = value.trim();
      index += 1;
      continue;
    }
  }

  return { slug, lang, title };
};

const toDateStamp = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const run = async () => {
  const { slug, lang, title } = parseArgs();
  const date = new Date();
  const dateStamp = toDateStamp(date);
  const filename = `${dateStamp}-${slug}-${lang}.mdx`;
  const filepath = path.join(CONTENT_DIR, filename);

  await mkdir(CONTENT_DIR, { recursive: true });

  try {
    await access(filepath);
    console.error(`File already exists: ${filepath}`);
    process.exit(1);
  } catch {
    // file does not exist
  }

  const template = `---\ntitle: "${title}"\ndescription: "Short summary for the post."\npublishedAt: ${dateStamp}\nlang: ${lang}\ntags:\n  - engineering\ndraft: true\n---\n\nWrite your post here.\n`;

  await writeFile(filepath, template, 'utf8');
  console.log(`Created: ${filepath}`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
