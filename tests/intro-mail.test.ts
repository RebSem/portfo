import { describe, expect, it } from 'vitest';
import { email } from '../src/data/cv';
import { buildIntroMailto } from '../src/lib/intro-mail';

describe('intro mailto', () => {
  it('prefills a subject and a template in each locale', () => {
    for (const locale of ['ru', 'en'] as const) {
      const url = new URL(buildIntroMailto(locale));
      expect(url.protocol).toBe('mailto:');
      expect(decodeURIComponent(url.pathname)).toBe(email);
      const params = new URLSearchParams(url.search);
      expect(params.get('subject')).toBeTruthy();
      expect(params.get('body')).toContain('[');
      // RFC 6068: line breaks in a mailto body are CRLF.
      expect(params.get('body')).toContain('\r\n');
      expect(params.get('body')).not.toMatch(/[—–]|\+7[\s(]*\d{3}/);
    }
    expect(new URLSearchParams(new URL(buildIntroMailto('ru')).search).get('subject')).toBe(
      'Роль продакта в [компания]',
    );
  });
});
