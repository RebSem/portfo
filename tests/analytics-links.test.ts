import { describe, expect, it } from 'vitest';
import {
  contactChannel,
  isInternal,
  projectDestination,
  projectSlugFromPath,
} from '../src/lib/analytics-links';

const SITE = 'rebsem.ru';
const u = (href: string) => new URL(href);

describe('contactChannel', () => {
  it('reads the real contact links from site-content', () => {
    expect(contactChannel(u('mailto:perk77331@gmail.com'))).toBe('email');
    expect(contactChannel(u('https://telegram.me/Michael_Semenov'))).toBe('telegram');
    expect(contactChannel(u('https://www.linkedin.com/in/mikhail-semenovv/'))).toBe('linkedin');
    expect(contactChannel(u('https://github.com/RebSem'))).toBe('github');
  });

  it('still counts t.me, in case the link is ever switched back', () => {
    expect(contactChannel(u('https://t.me/Michael_Semenov'))).toBe('telegram');
  });

  // The bug this file exists for: every github.com link used to count as a
  // contact, so repo links on case studies inflated the one number that is
  // supposed to mean hiring interest.
  it('does not treat repository links as a contact channel', () => {
    expect(contactChannel(u('https://github.com/RebSem/portfo'))).toBeNull();
    expect(contactChannel(u('https://github.com/RebSem/tubedrop'))).toBeNull();
    expect(
      contactChannel(u('https://github.com/RebSem/portfo/pulls?q=is%3Apr+is%3Amerged')),
    ).toBeNull();
    expect(contactChannel(u('https://github.com/yt-dlp/yt-dlp'))).toBeNull();
  });

  it('tolerates a trailing slash on the profile', () => {
    expect(contactChannel(u('https://github.com/RebSem/'))).toBe('github');
  });

  it('ignores unrelated destinations and non-web protocols', () => {
    expect(contactChannel(u('https://cursivo.xyz/'))).toBeNull();
    expect(contactChannel(u('https://rebsem.ru/about'))).toBeNull();
    expect(contactChannel(u('tel:+70000000000'))).toBeNull();
  });
});

describe('projectSlugFromPath', () => {
  it('reads the slug in both locales, with or without a trailing slash', () => {
    expect(projectSlugFromPath('/projects/cursivo-en')).toBe('cursivo-en');
    expect(projectSlugFromPath('/projects/cursivo-en/')).toBe('cursivo-en');
    expect(projectSlugFromPath('/ru/projects/cursivo-ru/')).toBe('cursivo-ru');
  });

  it('returns null for anything that is not a single project page', () => {
    expect(projectSlugFromPath('/')).toBeNull();
    expect(projectSlugFromPath('/about')).toBeNull();
    expect(projectSlugFromPath('/projects')).toBeNull();
    expect(projectSlugFromPath('/blog/some-post/')).toBeNull();
    expect(projectSlugFromPath('/projects/a/b')).toBeNull();
  });
});

describe('projectDestination', () => {
  it('separates the case study, the repo and the live demo', () => {
    expect(projectDestination(u('https://rebsem.ru/projects/cursivo-en/'), SITE)).toBe('case');
    expect(projectDestination(u('https://github.com/RebSem/tubedrop'), SITE)).toBe('repo');
    expect(projectDestination(u('https://cursivo.xyz/'), SITE)).toBe('demo');
  });
});

describe('isInternal', () => {
  it('compares host, so the locale prefix does not matter', () => {
    expect(isInternal(u('https://rebsem.ru/ru/about'), SITE)).toBe(true);
    expect(isInternal(u('https://cursivo.xyz/'), SITE)).toBe(false);
  });
});
