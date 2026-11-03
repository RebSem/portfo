import { describe, expect, it } from 'vitest';
import {
  cleanKey,
  contactChannel,
  contactHref,
  isCallLink,
  isCallPath,
  isCvLink,
  isCvPath,
  isInternal,
  outreachTag,
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

describe('contactHref', () => {
  it('records a prefilled mailto as the bare address plus a flag', () => {
    const prefilled = u(
      'mailto:perk77331@gmail.com?subject=Product%20Manager%20role%20at%20%5Bcompany%5D&body=Hi%20Mikhail%2C%0D%0A',
    );
    expect(contactChannel(prefilled)).toBe('email');
    expect(contactHref(prefilled)).toEqual({ href: 'mailto:perk77331@gmail.com', prefilled: true });
  });

  it('handles a Russian template the same way', () => {
    const ru = u(
      `mailto:perk77331@gmail.com?subject=${encodeURIComponent('Роль продакта в [компания]')}`,
    );
    expect(contactHref(ru)).toEqual({ href: 'mailto:perk77331@gmail.com', prefilled: true });
  });

  it('leaves a plain mailto and every web link untouched', () => {
    expect(contactHref(u('mailto:perk77331@gmail.com'))).toEqual({
      href: 'mailto:perk77331@gmail.com',
      prefilled: false,
    });
    expect(contactHref(u('https://telegram.me/Michael_Semenov'))).toEqual({
      href: 'https://telegram.me/Michael_Semenov',
      prefilled: false,
    });
  });
});

describe('cleanKey', () => {
  it('normalizes a short slug and rejects anything else', () => {
    expect(cleanKey('Status')).toBe('status');
    expect(cleanKey(' footer ')).toBe('footer');
    expect(cleanKey('hr-card')).toBe('hr-card');
    expect(cleanKey('<x>')).toBeNull();
    expect(cleanKey('-lead')).toBeNull();
    expect(cleanKey('a'.repeat(41))).toBeNull();
    expect(cleanKey('')).toBeNull();
    expect(cleanKey(undefined)).toBeNull();
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
    expect(projectSlugFromPath('/projects/zvonobot-agent-light.webp')).toBeNull();
    expect(projectSlugFromPath('/ru/projects/obrabot-prompts-dark.webp')).toBeNull();
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

describe('isCvPath', () => {
  it('matches the resume routes in both locales', () => {
    expect(isCvPath('/cv')).toBe(true);
    expect(isCvPath('/cv/')).toBe(true);
    expect(isCvPath('/ru/cv')).toBe(true);
    expect(isCvPath('/ru/cv/')).toBe(true);
  });

  it('does not match anything else', () => {
    // /cv.txt and the download files are separate artifacts, not page views.
    expect(isCvPath('/cv.txt')).toBe(false);
    expect(isCvPath('/cv/Mikhail_Semenov_CV_EN.pdf')).toBe(false);
    expect(isCvPath('/')).toBe(false);
    expect(isCvPath('/about')).toBe(false);
    expect(isCvPath('/blog/cv')).toBe(false);
  });
});

describe('isCallPath', () => {
  it('matches the booking page in both locales, with or without a trailing slash', () => {
    expect(isCallPath('/call/')).toBe(true);
    expect(isCallPath('/call')).toBe(true);
    expect(isCallPath('/ru/call/')).toBe(true);
    expect(isCallPath('/ru/call')).toBe(true);
  });

  it('does not match the thank-you page, which is not a booking link', () => {
    expect(isCallPath('/call/thanks/')).toBe(false);
    expect(isCallPath('/ru/call/thanks/')).toBe(false);
    expect(isCallPath('/callback/')).toBe(false);
    expect(isCallPath('/cv/')).toBe(false);
    expect(isCallPath('/blog/call/')).toBe(false);
  });
});

describe('isCallLink', () => {
  // The booking links in the home and case closing blocks, the case strip and
  // the About call to action all point at these.
  it('matches the booking page on this site in both locales, whatever the query', () => {
    expect(isCallLink(u('https://rebsem.ru/call/'), SITE)).toBe(true);
    expect(isCallLink(u('https://rebsem.ru/ru/call/'), SITE)).toBe(true);
    expect(isCallLink(u('https://rebsem.ru/call/?utm_source=x'), SITE)).toBe(true);
  });

  it('ignores the same path on another host, and the thank-you page', () => {
    expect(isCallLink(u('https://example.com/call/'), SITE)).toBe(false);
    expect(isCallLink(u('https://cal.com/michael-semenov/15min'), SITE)).toBe(false);
    expect(isCallLink(u('https://rebsem.ru/call/thanks/'), SITE)).toBe(false);
  });
});

describe('outreachTag', () => {
  it('reads and normalizes the campaign tag', () => {
    expect(outreachTag('?src=exness')).toBe('exness');
    expect(outreachTag('?src=Exness')).toBe('exness');
    expect(outreachTag('?src=%20wildberries%20')).toBe('wildberries');
    expect(outreachTag('?utm_source=x&src=yandex-hr')).toBe('yandex-hr');
  });

  it('returns null when there is no usable tag', () => {
    expect(outreachTag('')).toBeNull();
    expect(outreachTag('?utm_source=linkedin')).toBeNull();
    expect(outreachTag('?src=')).toBeNull();
  });

  it('drops anything that is not a plain slug', () => {
    // The value lands in an analytics property and anyone can craft the URL.
    expect(outreachTag('?src=<script>alert(1)</script>')).toBeNull();
    expect(outreachTag('?src=a b')).toBeNull();
    expect(outreachTag('?src=-leading-dash')).toBeNull();
    expect(outreachTag(`?src=${'x'.repeat(41)}`)).toBeNull();
    expect(outreachTag(`?src=${'x'.repeat(40)}`)).toBe('x'.repeat(40));
  });
});

describe('isCvLink', () => {
  // The resume link in the home closing block, the case availability strip and
  // the case closing block all point at these.
  it('matches the resume pages on this site in both locales', () => {
    expect(isCvLink(u('https://rebsem.ru/cv/'), SITE)).toBe(true);
    expect(isCvLink(u('https://rebsem.ru/ru/cv/'), SITE)).toBe(true);
  });

  it('ignores the same path on another host, and the downloads on this one', () => {
    expect(isCvLink(u('https://example.com/cv/'), SITE)).toBe(false);
    expect(isCvLink(u('https://rebsem.ru/cv/Mikhail_Semenov_CV_EN.pdf'), SITE)).toBe(false);
    expect(isCvLink(u('https://rebsem.ru/cv.txt'), SITE)).toBe(false);
  });
});

describe('the resume link keeps its outreach tag', () => {
  // Every application goes out as /cv?src=<tag>. The resume link must not
  // lose the tag: the page view reads it from the URL the visitor lands on.
  it('still yields the tag on /cv/ and /ru/cv/ after the resume check', () => {
    const en = u('https://rebsem.ru/cv/?src=exness');
    expect(isCvLink(en, SITE)).toBe(true);
    expect(outreachTag(en.search)).toBe('exness');

    const ru = u('https://rebsem.ru/ru/cv/?src=yandex-hr');
    expect(isCvLink(ru, SITE)).toBe(true);
    expect(outreachTag(ru.search)).toBe('yandex-hr');
  });
});

describe('the next-case link', () => {
  // The block at the end of a case study is a plain case-study URL, so it is
  // classified by its slug and lands as a case click, never as a contact.
  it('is a case click on this site in both locales', () => {
    const en = u('https://rebsem.ru/projects/cursivo-en/');
    expect(projectSlugFromPath(en.pathname)).toBe('cursivo-en');
    expect(projectDestination(en, SITE)).toBe('case');
    expect(contactChannel(en)).toBeNull();

    const ru = u('https://rebsem.ru/ru/projects/cursivo-ru/');
    expect(projectSlugFromPath(ru.pathname)).toBe('cursivo-ru');
    expect(projectDestination(ru, SITE)).toBe('case');
    expect(isCvLink(ru, SITE)).toBe(false);
  });
});

describe('the receipt link', () => {
  // The merged-PRs link in AgentOps is a repository link: not a contact, not a
  // case study, not a resume. It is recorded as an outbound GitHub link.
  it('is none of the on-site classes and not a contact', () => {
    const receipt = u('https://github.com/RebSem/portfo/pulls?q=is%3Apr+is%3Amerged');
    expect(contactChannel(receipt)).toBeNull();
    expect(projectSlugFromPath(receipt.pathname)).toBeNull();
    expect(isCvLink(receipt, SITE)).toBe(false);
    expect(isInternal(receipt, SITE)).toBe(false);
    expect(receipt.hostname).toBe('github.com');
  });
});
