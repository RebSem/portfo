import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  caseHref,
  cvAntiFit,
  cvExperience,
  cvMetrics,
  cvProducts,
  cvSkillGroups,
  email,
  linkedinHandle,
  linkedinUrl,
  telegramUrl,
} from '../src/data/cv';
import {
  CV_SECTION_KEYS,
  CV_SECTION_TITLES,
  buildCvNodes,
  buildCvText,
} from '../src/lib/cv-text';
import type { Locale } from '../src/types/content';

const LOCALES: Locale[] = ['ru', 'en'];
const DIST = path.resolve('dist');
const PROJECT_CONTENT = path.resolve('src/content/projects');

/**
 * Anything that reads dist/ only runs when a build is present. `npm run
 * validate` builds before the tests in CI; a bare `npm test` should not fail
 * for the absence of a build directory.
 */
const hasDist = existsSync(path.join(DIST, 'cv', 'index.html'));
const describeBuilt = hasDist ? describe : describe.skip;

const collectCvStrings = (locale: Locale): string[] => {
  const strings: string[] = [];
  cvExperience.forEach((role) => {
    strings.push(role.role[locale], role.company[locale], role.period[locale]);
    if (role.context) strings.push(role.context[locale]);
    role.phases.forEach((phase) => {
      strings.push(phase.title[locale]);
      // Per run, not the flattened bullet: a bullet carrying an inline case
      // link is three DOM nodes, so its flattened text is never one substring
      // of the HTML even though every word of it is present.
      phase.bullets.forEach((runs) => runs.forEach((run) => strings.push(run.text[locale])));
    });
  });
  cvMetrics.forEach((metric) => {
    strings.push(metric.value[locale], metric.label[locale], metric.caption[locale]);
  });
  cvProducts.forEach((product) => {
    strings.push(product.name, product.summary[locale], product.proof[locale]);
  });
  cvSkillGroups.forEach((group) => {
    strings.push(group.label[locale], ...group.items.map((item) => item[locale]));
  });
  cvAntiFit.forEach((item) => strings.push(item[locale]));
  return strings;
};

describe('cv canon', () => {
  it('carries the same sections in both locales', () => {
    const sectionsByLocale = LOCALES.map((locale) =>
      buildCvNodes(locale)
        .filter((node) => node.type === 'heading')
        .map((node) => ('text' in node ? node.text : '')),
    );

    expect(sectionsByLocale[0]).toHaveLength(CV_SECTION_KEYS.length);
    expect(sectionsByLocale[1]).toHaveLength(CV_SECTION_KEYS.length);
  });

  it('carries the same structure in both locales', () => {
    const shapes = LOCALES.map((locale) => buildCvNodes(locale).map((node) => node.type));
    expect(shapes[0]).toEqual(shapes[1]);
  });

  it('states the same key numbers in both locales', () => {
    // The numbers are what sell the grade, so a figure present in one locale
    // and missing in the other is a defect, not a translation choice.
    for (const figure of ['80', '30%', '4 → 15', '2022']) {
      for (const locale of LOCALES) {
        expect(buildCvText(locale), `${figure} missing from ${locale}`).toContain(figure);
      }
    }
    expect(buildCvText('en')).toContain('500,000+');
    expect(buildCvText('ru')).toContain('500 000+');
  });

  it('publishes no money, absolute or relative', () => {
    // Colleagues read this site too. Neither the monthly revenue of the line
    // nor its share of group revenue belongs on a public page; product numbers
    // only. See the decision record in src/data/cv.ts.
    for (const locale of LOCALES) {
      const text = buildCvText(locale);
      expect(text).not.toMatch(/\d\s*-?\s*\d?\s*млн/i);
      expect(text).not.toMatch(/RUB\s*\d/i);
      expect(text).not.toMatch(/\$\s*\d/);
      expect(text).not.toMatch(/выручки группы|of group revenue|group revenue/i);
    }
  });

  it('keeps the anti-fit section and the CEFR level off the downloadable files', () => {
    // On the page both are candour a person reads. In a file uploaded to a
    // form they are the first negative a keyword robot latches onto.
    for (const locale of LOCALES) {
      const page = buildCvText(locale);
      const file = buildCvText(locale, { audience: 'file' });
      expect(page).toMatch(/B1\+/);
      expect(file).not.toMatch(/B1\+/);
      expect(page).toMatch(/WEAKER FIT|НЕ ЛУЧШИЙ ВЫБОР/);
      expect(file).not.toMatch(/WEAKER FIT|НЕ ЛУЧШИЙ ВЫБОР/);
      expect(file).toMatch(/working proficiency|рабочий/i);
    }
  });

  it('contains no em dashes', () => {
    // An em dash reads as machine-written text. The rule is Mikhail's and it
    // applies to every string that reaches the resume.
    for (const locale of LOCALES) {
      const offenders = collectCvStrings(locale).filter((value) => value.includes('—'));
      expect(offenders, `em dash in ${locale}: ${offenders.join(' | ')}`).toEqual([]);
    }
  });

  it('never uses the word Senior in a title', () => {
    for (const locale of LOCALES) {
      const titles = cvExperience.map((role) => role.role[locale]);
      expect(titles.some((title) => /senior/i.test(title))).toBe(false);
    }
  });

  it('keeps the contacts populated', () => {
    expect(email).toMatch(/@/);
    expect(telegramUrl).toMatch(/^https:\/\//);
    expect(linkedinUrl).toMatch(/^https:\/\//);
  });

  it('holds no phone number', () => {
    // The repository is public and its history is permanent.
    for (const locale of LOCALES) {
      expect(buildCvText(locale)).not.toMatch(/\+7[\s(]*\d{3}/);
    }
  });

  it('links only to case studies that exist', () => {
    const slugs = new Set(
      readdirSync(PROJECT_CONTENT)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace(/\.mdx$/, '')),
    );

    const caseIds = new Set<string>();
    cvProducts.forEach((product) => {
      if (product.caseId) caseIds.add(product.caseId);
    });
    cvExperience.forEach((role) =>
      role.phases.forEach((phase) =>
        phase.bullets.forEach((runs) =>
          runs.forEach((run) => {
            if (run.caseId) caseIds.add(run.caseId);
          }),
        ),
      ),
    );

    expect(caseIds.size).toBeGreaterThan(0);
    for (const caseId of caseIds) {
      expect(slugs, `${caseId} has no EN case`).toContain(`${caseId}-en`);
      expect(slugs, `${caseId} has no RU case`).toContain(`${caseId}-ru`);
      expect(caseHref(caseId, 'en')).toBe(`/projects/${caseId}-en/`);
      expect(caseHref(caseId, 'ru')).toBe(`/ru/projects/${caseId}-ru/`);
    }
  });
});

describeBuilt('cv build output', () => {
  const readDist = (relative: string) => readFileSync(path.join(DIST, relative), 'utf8');

  it('keeps the resume unlisted', () => {
    for (const page of ['cv/index.html', 'ru/cv/index.html']) {
      // noindex so it does not get indexed, follow so an LLM screener handed
      // the link can still reach the case studies it cites.
      expect(readDist(page)).toContain('content="noindex,follow"');
    }

    expect(readDist('sitemap.xml')).not.toContain('/cv');
    expect(readDist('llms.txt')).not.toMatch(/\/cv\b/);
  });

  it('is not linked from the site chrome', () => {
    // Unlisted means no inbound links, not just no sitemap entry.
    for (const page of ['index.html', 'ru/index.html', 'about/index.html', 'ru/about/index.html']) {
      expect(readDist(page), `${page} links to the CV`).not.toMatch(/href="\/(ru\/)?cv/);
    }
  });

  it('ships the whole resume in static HTML', () => {
    // A recruiter's LLM tool may not run scripts, and neither does a text
    // browser. Nothing that matters may depend on JS.
    //
    // Checked against the atomic canon strings rather than the composed text
    // nodes: the page splits a metric across three elements, so the flattened
    // "value label caption" line legitimately never appears as one substring.
    for (const [page, locale] of [
      ['cv/index.html', 'en'],
      ['ru/cv/index.html', 'ru'],
    ] as Array<[string, Locale]>) {
      // Compared against the rendered text, not the markup: hyphenated tokens
      // ship wrapped in nowrap spans (see the nb() helper in CvDocument), so
      // the canon strings are correct in the text stream while never being
      // contiguous in the HTML source. Stripping tags is also closer to what
      // an LLM reader actually consumes.
      const html = readDist(page)
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ');
      const probes = collectCvStrings(locale).filter(
        (value) => value.length >= 25 && !/[&<>]/.test(value),
      );

      expect(probes.length).toBeGreaterThan(20);
      for (const probe of probes) {
        expect(html, `missing from static ${page}: ${probe.slice(0, 60)}`).toContain(probe);
      }
    }
  });

  it('exposes the plain-text resume in both locales', () => {
    // The txt is a downloadable artifact like the PDF and DOCX, so it carries
    // the file variant.
    expect(readDist('cv.txt')).toBe(buildCvText('en', { audience: 'file' }));
    expect(readDist('ru/cv.txt')).toBe(buildCvText('ru', { audience: 'file' }));
  });

  it('gives every page with a theme button the script that drives it', () => {
    // /cv shipped a theme toggle that did nothing: locale.js was imported by
    // each page individually and the resume pages never got the import. The
    // script now loads from SiteHeader, and this asserts nobody undoes that.
    const walk = (directory: string): string[] =>
      readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
      });

    const pages = walk(DIST).filter((file) => file.endsWith('.html'));
    const withToggle = pages.filter((file) => readFileSync(file, 'utf8').includes('id="theme-btn"'));

    expect(withToggle.length).toBeGreaterThan(10);
    for (const page of withToggle) {
      expect(readFileSync(page, 'utf8'), `${page} has a dead theme button`).toMatch(
        /src="\/_astro\/locale\.[^"]+\.js"/,
      );
    }
  });

  it('leaks no phone number into the deployed site', () => {
    // Guards against CV_PHONE ever being set in CI.
    const walk = (directory: string): string[] =>
      readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
      });

    const textFiles = walk(DIST).filter((file) =>
      ['.html', '.txt', '.xml', '.json'].includes(path.extname(file)),
    );

    // A full number, not just a country code and an area code: the Zvonobot
    // case study legitimately quotes "+7 (982)..." as an example of the messy
    // CSV rows the ingest pipeline normalizes.
    const FULL_PHONE = /\+7[\s(]*\d{3}[)\s]*\d{3}[-\s]?\d{2}[-\s]?\d{2}/;

    for (const file of textFiles) {
      expect(readFileSync(file, 'utf8'), `phone number in ${file}`).not.toMatch(FULL_PHONE);
    }
  });
});

describe('cv download files', () => {
  const CV_DIR = path.resolve('public/cv');
  const files = existsSync(CV_DIR) ? readdirSync(CV_DIR) : [];
  const itWithFiles = files.length > 0 ? it : it.skip;

  itWithFiles('publishes pdf, docx and txt for both locales', () => {
    for (const base of ['Mikhail_Semenov_CV_EN', 'Mikhail_Semenov_CV_RU']) {
      for (const extension of ['pdf', 'docx', 'txt']) {
        expect(files, `${base}.${extension} is missing`).toContain(`${base}.${extension}`);
      }
    }
  });

  itWithFiles('keeps the PDFs small enough to survive a mail server', () => {
    // A decorative blend mode once rasterized every page and pushed these to
    // 9.2 MB. See scripts/cv/README.md.
    for (const file of files.filter((name) => name.endsWith('.pdf'))) {
      const megabytes = statSync(path.join(CV_DIR, file)).size / 1024 / 1024;
      expect(megabytes, `${file} is ${megabytes.toFixed(1)} MB`).toBeLessThan(1.5);
    }
  });

  /**
   * Reads the PDF the way an ATS does. Nothing checked the text layer before,
   * which is exactly how a PDF with no contact details, split headings and
   * three destroyed keywords got shipped. Skipped where pdftotext is absent
   * rather than failing the suite on a machine without poppler.
   */
  const pdfText = (file: string): string | null => {
    try {
      return execFileSync('pdftotext', [path.join(CV_DIR, file), '-'], {
        encoding: 'utf8',
        maxBuffer: 8 * 1024 * 1024,
      });
    } catch {
      return null;
    }
  };

  const hasPdftotext = files.length > 0 && pdfText('Mikhail_Semenov_CV_EN.pdf') !== null;
  const itWithPdftotext = hasPdftotext ? it : it.skip;

  itWithPdftotext('keeps the PDF text layer readable by a parser', () => {
    for (const [file, locale] of [
      ['Mikhail_Semenov_CV_EN.pdf', 'en'],
      ['Mikhail_Semenov_CV_RU.pdf', 'ru'],
    ] as Array<[string, Locale]>) {
      const text = pdfText(file);
      expect(text).toBeTruthy();
      const extracted = text as string;

      // The August PDF rendered capital J as "Ã" and lost the whole
      // employment history to the parser.
      expect(extracted, `${file} has broken glyphs`).not.toContain('Ã');

      // A resume with no way to reply is not a resume.
      expect(extracted, `${file} has no email`).toContain(email);
      expect(extracted, `${file} has no Telegram`).toContain('Michael_Semenov');
      expect(extracted, `${file} has no LinkedIn`).toContain(linkedinHandle);

      // Section headings: letter-spacing once split SUMMARY into "S U MMARY".
      for (const key of CV_SECTION_KEYS) {
        if (key === 'contact') continue; // Folded into the header line in print.
        if (key === 'antiFit') {
          // Page-only by design; the file must NOT carry it.
          const heading = CV_SECTION_TITLES[key][locale].toUpperCase();
          expect(extracted, `${file} leaked the anti-fit section`).not.toContain(heading);
          continue;
        }
        const heading = CV_SECTION_TITLES[key][locale].toUpperCase();
        expect(extracted, `${file} lost the ${heading} heading`).toContain(heading);
      }

      // Date ranges have to survive as ranges, on one line with their role.
      const range = locale === 'ru' ? 'февраль 2022 - настоящее время' : 'Feb 2022 - Present';
      expect(extracted, `${file} lost the current role date range`).toContain(range);
    }
  });

  itWithPdftotext('keeps hyphenated keywords whole in the PDF', () => {
    // A compound word wrapping at its hyphen silently deletes the hyphen from
    // the text layer: "full-time" became "Fulltime", "юнит-экономика" became
    // "юнитэкономика". Every one of these is a term a recruiter searches on.
    const cases: Array<[string, string[]]> = [
      ['Mikhail_Semenov_CV_EN.pdf', ['full-time', 'go-to-market', 'per-second']],
      ['Mikhail_Semenov_CV_RU.pdf', ['юнит-экономика', 'LLM-аналитика', 'go-to-market']],
    ];

    for (const [file, terms] of cases) {
      const extracted = (pdfText(file) as string).toLowerCase();
      for (const term of terms) {
        expect(extracted, `${file} broke "${term}"`).toContain(term.toLowerCase());
        expect(
          extracted,
          `${file} contains the hyphen-less "${term.replace(/-/g, '')}"`,
        ).not.toContain(term.replace(/-/g, '').toLowerCase());
      }
    }
  });

  itWithFiles('ships downloadable text that matches the canon', () => {
    expect(readFileSync(path.join(CV_DIR, 'Mikhail_Semenov_CV_EN.txt'), 'utf8')).toBe(
      buildCvText('en', { audience: 'file' }),
    );
    expect(readFileSync(path.join(CV_DIR, 'Mikhail_Semenov_CV_RU.txt'), 'utf8')).toBe(
      buildCvText('ru', { audience: 'file' }),
    );
  });
});
