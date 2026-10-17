import type { Locale } from '../types/content';
import { cvAvailability, cvMetric, cvName, email, siteUrl, telegramUrl } from '../data/cv';

/**
 * The two "take me with you" artifacts of the home status block, built at
 * build time from the resume canon so they cannot drift from it.
 *
 * Recruiters rarely decide alone: the usual next step after a profile looks
 * right is pasting it into an ATS note or a message to the hiring manager.
 * The shortlist text is that paste, written by the candidate instead of
 * retyped by the recruiter. The intro mailto is the other common next step,
 * a first email, with the subject and the questions already in place.
 *
 * Kept free of DOM imports so the tests can check the exact text: no phone
 * number, no dashes, no money, the same facts in both locales.
 */

/** `?src=` tag on the resume link inside the copied text. A cv:view with
    cv_src=shortlist means a pasted card was opened by someone downstream. */
export const SHORTLIST_SRC = 'shortlist';

const RESUME_PATH: Record<Locale, string> = { en: '/cv/', ru: '/ru/cv/' };

export const shortlistResumeUrl = (locale: Locale): string =>
  `${siteUrl}${RESUME_PATH[locale]}?src=${SHORTLIST_SRC}`;

const COPY = {
  role: {
    ru: 'Product Manager (B2B SaaS, AI-продукты)',
    en: 'Product Manager (B2B SaaS, AI products)',
  },
  format: {
    ru: 'Удалённо, GMT+5, открыт к релокации. Русский родной, английский B2.',
    en: 'Remote, GMT+5, open to relocation. Russian native, English B2.',
  },
  proof: {
    ru: (customers: string) =>
      `Запустил в Zvonobot направление голосовых AI-агентов с нуля: ${customers} платящих B2B-клиентов меньше чем за год.`,
    en: (customers: string) =>
      `Launched Zvonobot's voice AI agent line from zero: ${customers} paying B2B customers in under a year.`,
  },
  resume: { ru: 'Резюме', en: 'Resume' },
  email: { ru: 'Почта', en: 'Email' },
} as const;

export const buildShortlistText = (locale: Locale): string =>
  [
    `${cvName[locale]}, ${COPY.role[locale]}`,
    `${cvAvailability[locale]}. ${COPY.format[locale]}`,
    COPY.proof[locale](cvMetric('customers').value[locale]),
    `${COPY.resume[locale]}: ${shortlistResumeUrl(locale)}`,
    `Telegram: ${telegramUrl}`,
    `${COPY.email[locale]}: ${email}`,
  ].join('\n');

/**
 * A first email with the blanks a recruiter fills in anyway. Square-bracket
 * placeholders, because they survive every mail client and are obviously
 * meant to be overwritten. CRLF line breaks, as RFC 6068 asks of mailto.
 */
const INTRO = {
  subject: {
    ru: 'Роль продакта в [компания]',
    en: 'Product Manager role at [company]',
  },
  body: {
    ru: [
      'Михаил, добрый день!',
      '',
      'У нас открыта роль [название] в [компания]: [ссылка].',
      'Найдёте 20 минут на созвон [когда]?',
      '',
      '[Ваше имя]',
    ],
    en: [
      'Hi Mikhail,',
      '',
      'We have a [role] opening at [company]: [link].',
      'Would you have 20 minutes for a call on [day]?',
      '',
      '[Your name]',
    ],
  },
} as const;

export const buildIntroMailto = (locale: Locale): string =>
  `mailto:${email}?subject=${encodeURIComponent(INTRO.subject[locale])}&body=${encodeURIComponent(
    INTRO.body[locale].join('\r\n'),
  )}`;
