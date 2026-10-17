import { describe, expect, it } from 'vitest';
import { cvAvailability, email, telegramUrl } from '../src/data/cv';
import {
  SHORTLIST_SRC,
  buildIntroMailto,
  buildShortlistText,
  shortlistResumeUrl,
} from '../src/lib/shortlist';
import type { Locale } from '../src/types/content';

const LOCALES: Locale[] = ['ru', 'en'];

describe('shortlist card', () => {
  it('carries the same facts in both locales', () => {
    for (const locale of LOCALES) {
      const text = buildShortlistText(locale);
      expect(text).toContain(cvAvailability[locale]);
      expect(text).toContain('80');
      expect(text).toContain('GMT+5');
      expect(text).toContain('B2');
      expect(text).toContain(telegramUrl);
      expect(text).toContain(email);
      expect(text).toContain(shortlistResumeUrl(locale));
      expect(text.split('\n')).toHaveLength(6);
    }
  });

  it('points the resume link at the right locale with the shortlist tag', () => {
    expect(shortlistResumeUrl('en')).toBe(`https://rebsem.ru/cv/?src=${SHORTLIST_SRC}`);
    expect(shortlistResumeUrl('ru')).toBe(`https://rebsem.ru/ru/cv/?src=${SHORTLIST_SRC}`);
  });

  it('follows the resume rules: no phone, no dashes, no money, no home-page minutes', () => {
    // The card is pasted into ATS notes, so the resume rules apply to it.
    // 500,000+ minutes stays off the home page, where this card is built.
    for (const locale of LOCALES) {
      const text = buildShortlistText(locale);
      expect(text).not.toMatch(/\+7[\s(]*\d{3}/);
      expect(text).not.toMatch(/[—–]/);
      expect(text).not.toMatch(/\$\s*\d|RUB\s*\d|млн/i);
      expect(text).not.toMatch(/500[ ,]000/);
      expect(text).not.toContain('Семён');
    }
  });
});

describe('intro mailto', () => {
  it('prefills a subject and a template in each locale', () => {
    for (const locale of LOCALES) {
      const url = new URL(buildIntroMailto(locale));
      expect(url.protocol).toBe('mailto:');
      expect(decodeURIComponent(url.pathname)).toBe(email);
      const params = new URLSearchParams(url.search);
      expect(params.get('subject')).toBeTruthy();
      expect(params.get('body')).toContain('[');
      // RFC 6068: line breaks in a mailto body are CRLF.
      expect(params.get('body')).toContain('\r\n');
    }
    expect(new URLSearchParams(new URL(buildIntroMailto('ru')).search).get('subject')).toBe(
      'Роль продакта в [компания]',
    );
  });
});
