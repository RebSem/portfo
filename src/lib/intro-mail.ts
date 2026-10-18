import type { Locale } from '../types/content';
import { email } from '../data/cv';

/**
 * A first email with the blanks a recruiter fills in anyway, used by the
 * contact line on case studies. Square-bracket placeholders, because they
 * survive every mail client and are obviously meant to be overwritten. CRLF
 * line breaks, as RFC 6068 asks of mailto.
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
