/**
 * Generates the downloadable resume files from src/data/cv.ts.
 *
 *   npm run cv:export            public files, no phone number
 *   npm run cv:export -- --phone "+7 000 000-00-00"
 *
 * Public run writes into public/cv/ and those files ship with the site. The
 * --phone run writes into private-exports/ instead, which is git-ignored: the
 * repository is public and git history is permanent, so the number never
 * enters it. That variant is the one to upload into ATS forms.
 *
 * PDF rendering goes through the real /cv page and src/styles/print.css, so
 * the downloaded PDF and a visitor's Cmd+P produce the same document.
 */
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import type { Locale } from '../../src/types/content.ts';
import { cvFileBaseName } from '../../src/data/cv.ts';
import { buildCvNodes, buildCvText, type CvNode } from '../../src/lib/cv-text.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const PUBLIC_DIST = join(ROOT, 'dist');
// The phone-carrying run builds the site into its own directory so a number
// can never end up in dist/, which is what gets deployed.
const PRIVATE_DIST = join(ROOT, 'dist-private');
const LOCALES: Locale[] = ['en', 'ru'];

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const phoneIndex = args.indexOf('--phone');
  const phone = phoneIndex >= 0 ? args[phoneIndex + 1] : undefined;
  if (phoneIndex >= 0 && !phone) {
    throw new Error('--phone needs a value, e.g. --phone "+7 900 000-00-00"');
  }
  return { phone };
};

// --- DOCX -----------------------------------------------------------------

/**
 * Deliberately plain. This file exists to be parsed by Greenhouse, Lever and
 * Workday, not admired: single column, no tables, no text boxes, no headers
 * or footers, no images. Every one of those is a known way to lose content in
 * an ATS import.
 */
const nodeToParagraph = (node: CvNode): Paragraph => {
  switch (node.type) {
    case 'name':
      return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: node.text, bold: true, size: 32 })],
      });
    case 'headline':
      return new Paragraph({
        children: [new TextRun({ text: node.text, bold: true, size: 22 })],
        spacing: { after: 60 },
      });
    case 'contact':
      return new Paragraph({
        children: [new TextRun({ text: node.text, size: 19 })],
        spacing: { after: 200 },
      });
    case 'heading':
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: node.text, bold: true, size: 24 })],
        spacing: { before: 260, after: 100 },
      });
    case 'roleHeader':
      return new Paragraph({
        children: [new TextRun({ text: node.text, bold: true, size: 21 })],
        spacing: { before: 160, after: 60 },
      });
    case 'phase':
      return new Paragraph({
        children: [new TextRun({ text: node.text, italics: true, size: 21 })],
        spacing: { before: 120, after: 60 },
      });
    case 'bullet':
      return new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: node.text, size: 21 })],
        spacing: { after: 60 },
      });
    case 'row':
      return new Paragraph({
        children: [
          new TextRun({ text: `${node.label}: `, bold: true, size: 21 }),
          new TextRun({ text: node.text, size: 21 }),
        ],
        spacing: { after: 60 },
      });
    default:
      return new Paragraph({
        children: [new TextRun({ text: node.text, size: 21 })],
        spacing: { after: 80 },
      });
  }
};

const buildDocx = async (locale: Locale, phone?: string): Promise<Buffer> => {
  const nodes = buildCvNodes(locale, { phone, audience: 'file' });
  const doc = new Document({
    creator: 'Mikhail Semenov',
    title: `${locale === 'ru' ? 'Резюме' : 'CV'} Mikhail Semenov`,
    description: 'Product Manager · B2B SaaS · Voice AI agents · LLM',
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children: nodes.map(nodeToParagraph),
      },
    ],
  });

  return Packer.toBuffer(doc);
};

// --- PDF ------------------------------------------------------------------

const findChrome = async (): Promise<string> => {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // Try the next one.
    }
  }
  throw new Error(
    `No Chrome found. Looked in:\n${CHROME_CANDIDATES.map((c) => `  ${c}`).join('\n')}`,
  );
};

/** Serves the built site so Chrome loads pages with working asset paths. */
const serveDist = async (
  distDir: string,
): Promise<{ port: number; close: () => Promise<void> }> => {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    let filePath = join(distDir, decodeURIComponent(url.pathname));

    try {
      const stats = await stat(filePath);
      if (stats.isDirectory()) filePath = join(filePath, 'index.html');
    } catch {
      response.statusCode = 404;
      response.end('not found');
      return;
    }

    try {
      await stat(filePath);
    } catch {
      response.statusCode = 404;
      response.end('not found');
      return;
    }

    response.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream');
    createReadStream(filePath).pipe(response);
  });

  await new Promise<void>((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const address = server.address();
  if (typeof address === 'string' || address === null) {
    throw new Error('Could not determine the port of the local preview server');
  }

  return {
    port: address.port,
    close: () => new Promise<void>((resolveClose) => server.close(() => resolveClose())),
  };
};

const renderPdf = async (chrome: string, url: string, outputPath: string): Promise<void> => {
  const args = [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${outputPath}`,
    url,
  ];

  await new Promise<void>((resolvePdf, rejectPdf) => {
    const child = spawn(chrome, args, { stdio: 'ignore' });
    child.on('error', rejectPdf);
    child.on('exit', (code) => {
      if (code === 0) resolvePdf();
      else rejectPdf(new Error(`Chrome exited with code ${code} while rendering ${url}`));
    });
  });
};

// --- Main -----------------------------------------------------------------

/**
 * Rebuilds the site with CV_PHONE set. The page renders the number at build
 * time (static output), which is what puts it into the PDF: the PDF is
 * printed from the real page, so it cannot carry anything the page does not.
 */
const buildPrivateSite = async (phone: string): Promise<void> => {
  await new Promise<void>((resolveBuild, rejectBuild) => {
    const child = spawn('npx', ['astro', 'build', '--outDir', PRIVATE_DIST], {
      cwd: ROOT,
      env: { ...process.env, CV_PHONE: phone },
      stdio: 'ignore',
    });
    child.on('error', rejectBuild);
    child.on('exit', (code) => {
      if (code === 0) resolveBuild();
      else rejectBuild(new Error(`astro build for the private export exited with code ${code}`));
    });
  });
};

const main = async () => {
  const { phone } = parseArgs();
  const outputDir = phone ? join(ROOT, 'private-exports') : join(ROOT, 'public', 'cv');
  const distDir = phone ? PRIVATE_DIST : PUBLIC_DIST;

  if (phone) {
    console.log('Building a local site with the phone number (never committed)...');
    await buildPrivateSite(phone);
  }

  try {
    await stat(join(distDir, 'cv', 'index.html'));
  } catch {
    throw new Error(`${distDir}/cv/index.html is missing. Run \`npm run build\` first.`);
  }

  await mkdir(outputDir, { recursive: true });

  const chrome = await findChrome();
  const server = await serveDist(distDir);

  try {
    for (const locale of LOCALES) {
      const base = cvFileBaseName[locale];
      const pagePath = locale === 'ru' ? '/ru/cv/' : '/cv/';

      await writeFile(join(outputDir, `${base}.txt`), buildCvText(locale, { phone, audience: 'file' }), 'utf8');
      await writeFile(join(outputDir, `${base}.docx`), await buildDocx(locale, phone));

      const pdfPath = join(outputDir, `${base}.pdf`);
      await rm(pdfPath, { force: true });
      await renderPdf(chrome, `http://127.0.0.1:${server.port}${pagePath}`, pdfPath);

      // `astro build` copies public/ into dist/ before this script runs, so
      // without this the built site keeps the previous generation of the
      // download files: edit the canon, rebuild, re-export, and dist still
      // serves yesterday's PDF. Only for the public run; the phone-carrying
      // files must never be written into a directory that gets deployed.
      if (!phone) {
        const distCv = join(PUBLIC_DIST, 'cv');
        await mkdir(distCv, { recursive: true });
        for (const extension of ['pdf', 'docx', 'txt']) {
          await copyFile(
            join(outputDir, `${base}.${extension}`),
            join(distCv, `${base}.${extension}`),
          );
        }
      }

      console.log(`${locale}: ${base}.pdf, .docx, .txt -> ${outputDir}`);
    }
  } finally {
    await server.close();
  }

  if (phone) {
    // The build output is removed rather than left around: a directory full
    // of pages carrying the number is not something to keep on disk by
    // default, and it is cheap to regenerate.
    await rm(PRIVATE_DIST, { recursive: true, force: true });
    console.log('\nPhone-carrying variant written to private-exports/ (git-ignored).');
  }
};

await main();
