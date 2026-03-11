#!/usr/bin/env node
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/blog');

const usage = `Usage:
  npm run new:post -- <slug> [--title "Post title"] [--title-ru "Заголовок"] [--title-en "Post title"]

Example:
  npm run new:post -- ai-in-product --title-ru "AI в продукте" --title-en "AI in Product"`;

const sanitizeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const escapeYaml = (value) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

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

  let baseTitle = 'New post';
  let titleRu = '';
  let titleEn = '';

  for (let index = 1; index < args.length; index += 1) {
    const current = args[index];

    if (current === '--title') {
      const value = args[index + 1];
      if (!value) {
        console.error('`--title` requires a value.');
        process.exit(1);
      }
      baseTitle = value.trim();
      index += 1;
      continue;
    }

    if (current === '--title-ru') {
      const value = args[index + 1];
      if (!value) {
        console.error('`--title-ru` requires a value.');
        process.exit(1);
      }
      titleRu = value.trim();
      index += 1;
      continue;
    }

    if (current === '--title-en') {
      const value = args[index + 1];
      if (!value) {
        console.error('`--title-en` requires a value.');
        process.exit(1);
      }
      titleEn = value.trim();
      index += 1;
    }
  }

  return {
    slug,
    titleRu: titleRu || baseTitle,
    titleEn: titleEn || baseTitle,
  };
};

const toDateStamp = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildTemplate = ({ lang, title, dateStamp, translationKey }) => {
  const description = lang === 'ru' ? 'Краткое описание статьи.' : 'Short summary of the post.';
  const body = lang === 'ru' ? 'Напишите русскую версию статьи.' : 'Write the English version of the post.';

  return `---\ntitle: "${escapeYaml(title)}"\ndescription: "${description}"\npublishedAt: ${dateStamp}\nlang: ${lang}\ntranslationKey: ${translationKey}\ntags:\n  - engineering\ndraft: true\ncover: "/images/blog/${translationKey}/cover.jpg"\n---\n\n${body}\n`;
};

const ensureAbsent = async (filepath) => {
  try {
    await access(filepath);
    return false;
  } catch {
    return true;
  }
};

const run = async () => {
  const { slug, titleRu, titleEn } = parseArgs();
  const date = new Date();
  const dateStamp = toDateStamp(date);
  const translationKey = `${dateStamp}-${slug}`;

  const files = [
    {
      lang: 'ru',
      filepath: path.join(CONTENT_DIR, `${dateStamp}-${slug}-ru.mdx`),
      template: buildTemplate({ lang: 'ru', title: titleRu, dateStamp, translationKey }),
    },
    {
      lang: 'en',
      filepath: path.join(CONTENT_DIR, `${dateStamp}-${slug}-en.mdx`),
      template: buildTemplate({ lang: 'en', title: titleEn, dateStamp, translationKey }),
    },
  ];

  await mkdir(CONTENT_DIR, { recursive: true });

  for (const entry of files) {
    const available = await ensureAbsent(entry.filepath);
    if (!available) {
      console.error(`File already exists: ${entry.filepath}`);
      process.exit(1);
    }
  }

  for (const entry of files) {
    await writeFile(entry.filepath, entry.template, 'utf8');
  }

  console.log('Created files:');
  for (const entry of files) {
    console.log(`- ${entry.filepath}`);
  }
  console.log(`translationKey: ${translationKey}`);
  console.log(`Cover path template: /images/blog/${translationKey}/cover.jpg`);
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
