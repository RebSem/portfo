#!/usr/bin/env node
/**
 * Publishes a resume written for one vacancy at rebsem.ru/cv/<slug>/.
 *
 *   npm run cv:vacancy -- <source.md> <slug> <FileBaseName>
 *   npm run cv:vacancy -- "…/Drinkit 07.10/исходники/drinkit_ru.md" drinkit Semenov_Mikhail_Product_Owner_Drinkit_RU
 *
 * The per-vacancy resumes are written and rendered in the job tracker (outside
 * this repo), and they carry the phone number on purpose: they go into
 * application forms. This repository is public and git history is permanent,
 * so the number never comes here. The script takes the markdown source, drops
 * the phone from a copy, renders that copy with the tracker's own renderer (the
 * same Geist layout as the files that get attached to applications), checks
 * the output and writes the PDF and DOCX into public/cv/<slug>/. Content is
 * otherwise untouched: it is the candidate's document, not the site's copy.
 *
 * JOB_TRACKER_DIR overrides the tracker location (default
 * ~/Desktop/резюме/job-tracker). Needs Google Chrome and, for the text-layer
 * check, pdftotext.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { inflateSync } from 'node:zlib';

const PHONE = /\+7[\s(]*\d{3}[)\s]*\d{3}[-\s]?\d{2}[-\s]?\d{2}/;
const LOCAL_LINK = /https?:\/\/(?:127\.0\.0\.1|localhost|0\.0\.0\.0)/;

const [source, slug, base] = process.argv.slice(2);
if (!source || !slug || !base) {
  console.error('usage: npm run cv:vacancy -- <source.md> <slug> <FileBaseName>');
  process.exit(1);
}
// ASCII only: the URL is pasted into chats and forms, and some of them mangle
// percent-encoded Cyrillic. The file name is also what the recruiter's
// download is called.
if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`slug must be lowercase ascii: ${slug}`);
if (!/^[A-Za-z0-9_]+$/.test(base)) throw new Error(`file base name must be ascii: ${base}`);

const tracker = resolve(process.env.JOB_TRACKER_DIR ?? join(homedir(), 'Desktop', 'резюме', 'job-tracker'));
const renderer = join(tracker, 'scripts', 'build-resumes.mjs');
if (!existsSync(renderer)) throw new Error(`tracker renderer not found: ${renderer}`);

// Contact lines are " · "-separated; drop the part that is a phone number and
// keep everything else byte for byte.
// A line that held nothing but the phone disappears entirely.
const original = readFileSync(resolve(source), 'utf8');
const stripped = original
  .split('\n')
  .flatMap((line) => {
    if (!PHONE.test(line)) return [line];
    const rest = line.split(' · ').filter((part) => !PHONE.test(part)).join(' · ');
    return rest.trim() ? [rest] : [];
  })
  .join('\n')
  .replace(/^file:.*$/m, `file: ${base}`);
if (PHONE.test(stripped)) throw new Error('a phone number survived the strip; refusing to publish');

const work = mkdtempSync(join(tmpdir(), 'vacancy-cv-'));
try {
  mkdirSync(join(work, 'data', 'resumes', 'src'), { recursive: true });
  writeFileSync(join(work, 'data', 'resumes', 'src', 'resume.md'), stripped);
  // The renderer resolves its fonts from <cwd>/node_modules.
  symlinkSync(join(tracker, 'node_modules'), join(work, 'node_modules'));
  // RESUMES_EXPORT=0: never let the renderer touch the role folders on the desktop.
  execFileSync('node', [renderer], { cwd: work, env: { ...process.env, RESUMES_EXPORT: '0' }, stdio: 'inherit' });

  const out = join(work, 'data', 'resumes', 'out');
  const pdf = join(out, `${base}.pdf`);
  const docx = join(out, `${base}.docx`);
  for (const file of [pdf, docx]) if (!existsSync(file)) throw new Error(`renderer did not produce ${file}`);

  checkPdf(pdf);
  checkDocx(docx);

  const target = resolve('public', 'cv', slug);
  mkdirSync(target, { recursive: true });
  copyFileSync(pdf, join(target, `${base}.pdf`));
  copyFileSync(docx, join(target, `${base}.docx`));
  console.log(`\nhttps://rebsem.ru/cv/${slug}/${base}.pdf\nhttps://rebsem.ru/cv/${slug}/${base}.docx`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

function checkPdf(file) {
  const raw = readFileSync(file);
  const chunks = [raw.toString('latin1')];
  for (const match of chunks[0].matchAll(/stream\r?\n/g)) {
    const start = (match.index ?? 0) + match[0].length;
    const end = chunks[0].indexOf('endstream', start);
    if (end < 0) continue;
    try {
      chunks.push(inflateSync(raw.subarray(start, end)).toString('latin1'));
    } catch {
      // not a Flate stream
    }
  }
  if (chunks.some((chunk) => LOCAL_LINK.test(chunk))) throw new Error('PDF links to a local server');

  let text = '';
  try {
    text = execFileSync('pdftotext', [file, '-'], { encoding: 'utf8' });
  } catch {
    console.warn('pdftotext not found: the PDF text layer was not checked for a phone number');
    return;
  }
  if (PHONE.test(text)) throw new Error('phone number in the PDF text layer');
  // Garbled glyphs once broke date parsing in an ATS; the tracker checks too.
  if (/�/.test(text)) throw new Error('replacement characters in the PDF text layer');
}

function checkDocx(file) {
  const xml = execFileSync('unzip', ['-p', file, 'word/document.xml'], { encoding: 'utf8' });
  if (PHONE.test(xml)) throw new Error('phone number in the DOCX');
}
