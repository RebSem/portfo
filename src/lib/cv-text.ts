import type { Locale } from '../types/content';
import {
  cvAntiFit,
  cvAntiFitIntro,
  cvEducation,
  cvExperience,
  cvHeadline,
  cvLanguages,
  cvLanguagesFile,
  cvLocationLine,
  cvMetrics,
  cvName,
  cvProducts,
  cvRoles,
  cvSkillGroups,
  cvSummary,
  cvWorkFormat,
  caseHref,
  email,
  githubUrl,
  linkedinHandle,
  linkedinUrl,
  runsToText,
  siteHost,
  siteUrl,
  telegramHandle,
  telegramUrl,
} from '../data/cv';

/**
 * One structured rendering of the resume, shared by every text-shaped export:
 * the /cv.txt route, the DOCX builder and the tests. Keeping the shape here
 * rather than in each generator is what makes "RU and EN carry the same
 * sections" a property of the code instead of a thing to remember.
 *
 * A flat node list rather than nested sections, because the two things that
 * consume it care about order and role, not hierarchy: the txt writer maps
 * node type to spacing, the DOCX writer maps it to a paragraph style. The
 * `roleHeader` type exists specifically so the "Job, Company | Feb 2022 -
 * Present" line stays a standalone line: ATS date parsers key on that shape,
 * and burying it in a bullet list is a known way to lose the employment
 * history entirely.
 */
export type CvNode =
  | { type: 'name'; text: string }
  | { type: 'headline'; text: string }
  | { type: 'contact'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'roleHeader'; text: string }
  | { type: 'phase'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'row'; label: string; text: string };

/**
 * Section names, used by the page, the txt export and the DOCX alike. One
 * source, because the page and the txt had already drifted apart once: the
 * page said "Education, languages, format" while the text export said
 * "Education and languages", which is precisely the kind of split that makes
 * "RU and EN carry the same sections" untestable.
 */
export const CV_SECTION_TITLES = {
  summary: { ru: 'Кратко', en: 'Summary' },
  metrics: { ru: 'Цифры', en: 'Numbers' },
  experience: { ru: 'Опыт работы', en: 'Experience' },
  products: { ru: 'Продукты', en: 'Products' },
  skills: { ru: 'Навыки', en: 'Skills' },
  background: { ru: 'Образование, языки, формат', en: 'Education, languages, format' },
  antiFit: { ru: 'Где я не лучший выбор', en: 'Where I am a weaker fit' },
  contact: { ru: 'Контакт', en: 'Contact' },
} as const;

/** ATS resumes conventionally shout their section headings; the page does the
    same visually via text-transform, so both read identically. */
const HEADINGS = Object.fromEntries(
  Object.entries(CV_SECTION_TITLES).map(([key, value]) => [
    key,
    { ru: value.ru.toUpperCase(), en: value.en.toUpperCase() },
  ]),
) as Record<keyof typeof CV_SECTION_TITLES, { ru: string; en: string }>;

const LABELS = {
  roles: { ru: 'Роли', en: 'Roles' },
  education: { ru: 'Образование', en: 'Education' },
  languages: { ru: 'Языки', en: 'Languages' },
  format: { ru: 'Формат работы', en: 'Work format' },
  caseStudy: { ru: 'Кейс', en: 'Case study' },
  phone: { ru: 'Телефон', en: 'Phone' },
} as const;

/** Ordered section keys, so a test can assert RU and EN carry the same set. */
export const CV_SECTION_KEYS = Object.keys(CV_SECTION_TITLES) as Array<
  keyof typeof CV_SECTION_TITLES
>;

/**
 * `phone` is threaded through rather than read from cv.ts on purpose: the
 * repository never holds the number, and the ATS-form variant of the exports
 * passes it in at build time from outside the repo.
 */
export interface CvTextOptions {
  phone?: string;
  /**
   * `page` (default) mirrors /cv exactly. `file` is what goes into the PDF,
   * DOCX and txt a recruiter uploads to a form: the anti-fit section is left
   * out and the English level loses its CEFR code. On the page both are a
   * trust signal read by a person; in a file they are the first thing a
   * keyword robot and a 30-second skim latch onto, and both read as negative.
   */
  audience?: 'page' | 'file';
}

export const buildCvNodes = (locale: Locale, options: CvTextOptions = {}): CvNode[] => {
  const nodes: CvNode[] = [];

  const contactLine = [
    cvLocationLine[locale],
    ...(options.phone ? [options.phone] : []),
    `Telegram ${telegramHandle}`,
    email,
    siteHost,
    linkedinHandle,
    githubUrl.replace('https://', ''),
  ].join(' · ');

  nodes.push({ type: 'name', text: cvName[locale] });
  nodes.push({ type: 'headline', text: cvHeadline[locale] });
  nodes.push({ type: 'contact', text: contactLine });

  nodes.push({ type: 'heading', text: HEADINGS.summary[locale] });
  nodes.push({ type: 'paragraph', text: cvSummary[locale] });

  nodes.push({ type: 'heading', text: HEADINGS.metrics[locale] });
  cvMetrics.forEach((metric) => {
    nodes.push({
      type: 'bullet',
      text: `${metric.value[locale]} ${metric.label[locale]}: ${metric.caption[locale]}`,
    });
  });

  nodes.push({ type: 'heading', text: HEADINGS.experience[locale] });
  cvExperience.forEach((role) => {
    nodes.push({
      type: 'roleHeader',
      text: `${role.role[locale]}, ${role.company[locale]} | ${role.period[locale]}`,
    });
    if (role.context) nodes.push({ type: 'paragraph', text: role.context[locale] });
    role.phases.forEach((phase) => {
      if (phase.title[locale]) nodes.push({ type: 'phase', text: phase.title[locale] });
      phase.bullets.forEach((runs) => {
        nodes.push({ type: 'bullet', text: runsToText(runs, locale) });
      });
    });
  });

  nodes.push({ type: 'heading', text: HEADINGS.products[locale] });
  cvProducts.forEach((product) => {
    const links = [
      product.caseId ? `${LABELS.caseStudy[locale]}: ${siteUrl}${caseHref(product.caseId, locale)}` : '',
      product.externalUrl ?? '',
    ]
      .filter(Boolean)
      .join(' · ');
    // The proof line already opens with "Proves" / "Доказывает", so it is
    // appended as a sentence rather than given a redundant label.
    nodes.push({
      type: 'bullet',
      text: `${product.name}: ${product.summary[locale]} ${product.proof[locale]}${links ? ` ${links}` : ''}`,
    });
  });

  nodes.push({ type: 'heading', text: HEADINGS.skills[locale] });
  nodes.push({ type: 'row', label: LABELS.roles[locale], text: cvRoles[locale] });
  cvSkillGroups.forEach((group) => {
    nodes.push({
      type: 'row',
      label: group.label[locale],
      text: group.items.map((item) => item[locale]).join(', '),
    });
  });

  const forFile = options.audience === 'file';

  nodes.push({ type: 'heading', text: HEADINGS.background[locale] });
  nodes.push({ type: 'row', label: LABELS.education[locale], text: cvEducation[locale] });
  nodes.push({
    type: 'row',
    label: LABELS.languages[locale],
    text: (forFile ? cvLanguagesFile : cvLanguages)[locale],
  });
  nodes.push({ type: 'row', label: LABELS.format[locale], text: cvWorkFormat[locale] });

  if (!forFile) {
    nodes.push({ type: 'heading', text: HEADINGS.antiFit[locale] });
    nodes.push({ type: 'paragraph', text: cvAntiFitIntro[locale] });
    cvAntiFit.forEach((item) => nodes.push({ type: 'bullet', text: item[locale] }));
  }

  nodes.push({ type: 'heading', text: HEADINGS.contact[locale] });
  if (options.phone) {
    nodes.push({ type: 'row', label: LABELS.phone[locale], text: options.phone });
  }
  nodes.push({ type: 'row', label: 'Telegram', text: telegramUrl });
  nodes.push({ type: 'row', label: 'Email', text: email });
  nodes.push({ type: 'row', label: 'LinkedIn', text: linkedinUrl });
  nodes.push({ type: 'row', label: 'GitHub', text: githubUrl });
  nodes.push({ type: 'row', label: 'Site', text: `${siteUrl}/` });

  return nodes;
};

/** Plain-text resume, for copy-paste into a form and for LLM readers. */
export const buildCvText = (locale: Locale, options: CvTextOptions = {}): string => {
  const lines: string[] = [];

  buildCvNodes(locale, options).forEach((node) => {
    switch (node.type) {
      case 'heading':
        lines.push('', node.text);
        break;
      case 'roleHeader':
        lines.push('', node.text);
        break;
      case 'phase':
        lines.push('', node.text);
        break;
      case 'bullet':
        lines.push(`- ${node.text}`);
        break;
      case 'row':
        lines.push(`${node.label}: ${node.text}`);
        break;
      default:
        lines.push(node.text);
    }
  });

  return `${lines.join('\n').trim()}\n`;
};
