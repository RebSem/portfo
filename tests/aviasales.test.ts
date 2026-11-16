import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as data from '../src/data/aviasales';
import { clockFrom, gtaRibbon, memeIsLive, ribbonTimerText, viewProgress } from '../src/lib/aviasales';

describe('GTA ribbon', () => {
  it('counts down before the release', () => {
    const state = gtaRibbon(new Date(2026, 10, 16, 9, 57));
    expect(state).toEqual({ phase: 'before', days: 2, hours: 14, minutes: 3 });
    expect(ribbonTimerText(state)).toBe(' · до релиза 2 д 14 ч 03 мин');
  });
  it('flips at local midnight of 19 Nov and goes away on 10 Dec', () => {
    expect(gtaRibbon(new Date(2026, 10, 19, 0, 0)).phase).toBe('after');
    expect(gtaRibbon(new Date(2026, 11, 9, 23, 59)).phase).toBe('after');
    expect(gtaRibbon(new Date(2026, 11, 10, 0, 0)).phase).toBe('off');
    expect(ribbonTimerText(gtaRibbon(new Date(2026, 10, 20)))).toBe('');
  });
});

describe('memes', () => {
  it('never shows an unapproved line', () => {
    expect(memeIsLive({ id: 'x', text: 'x', approved: false }, new Date(2026, 10, 16))).toBe(false);
  });
  it('drops a line after its shelf life', () => {
    const line = { id: 'x', text: 'x', approved: true, showUntil: '2026-12-15' };
    expect(memeIsLive(line, new Date(2026, 11, 15, 12))).toBe(true);
    expect(memeIsLive(line, new Date(2026, 11, 16, 0, 1))).toBe(false);
  });
  it('keeps the approved set exactly as the owner signed it off', () => {
    const approved = data.avMemes.filter((item) => item.approved).map((item) => item.id).sort();
    // 'paris' was switched off on 16 Nov 2026: it read as a limit on the owner's availability.
    expect(approved).toEqual(['baroness', 'dog', 'gta-after', 'gta-before', 'hermes', 'jacket', 'mission']);
  });
});

describe('helpers', () => {
  it('maps an element position to 0..1', () => {
    expect(viewProgress(800, 200, 800)).toBe(0);
    expect(viewProgress(-200, 200, 800)).toBe(1);
    expect(viewProgress(300, 200, 800)).toBeCloseTo(0.5);
  });
  it('reads the QA clock override and ignores junk', () => {
    const fallback = new Date(2026, 10, 16);
    expect(clockFrom('?av-now=2026-11-20T10:00', fallback).getDate()).toBe(20);
    expect(clockFrom('?av-now=nope', fallback)).toBe(fallback);
    expect(clockFrom('', fallback)).toBe(fallback);
  });
});

describe('landing copy', () => {
  const strings: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === 'string') strings.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(data);

  it('has seven requirements with unique ids', () => {
    expect(data.avRequirements.map((item) => item.id)).toEqual(['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']);
  });
  it('gives every requirement one scannable headline', () => {
    for (const item of data.avRequirements) {
      expect(item.headline.trim()).not.toBe('');
      expect(item.headline.length).toBeLessThanOrEqual(90);
    }
  });
  it('has no em or en dash and no phone-like string', () => {
    for (const text of strings) {
      expect(text).not.toMatch(/[–—]/);
      expect(text).not.toMatch(/\+7[\s(]*\d{3}/);
    }
  });
  // The owner's exclusion list is matched by digest. This repository is public, and
  // spelling the words out here would put them in the very place the rule keeps them out of.
  const EXCLUDED = new Set(['8c2a4dae77bdba61', '905391ab921bc59a', '53034e5b9bebfce6', '0c6e1b7d5ed0e354', 'f33557051c3790c9']);
  const EXCLUDED_LENGTHS = [6, 7, 8];
  const digest = (value: string): string => createHash('sha256').update(value).digest('hex').slice(0, 16);

  it('keeps the owner exclusions out of the copy', () => {
    const hits: string[] = [];
    for (const text of strings) {
      const flat = text.toLowerCase();
      for (const size of EXCLUDED_LENGTHS) {
        for (let at = 0; at + size <= flat.length; at += 1) {
          if (EXCLUDED.has(digest(flat.slice(at, at + size)))) hits.push(text);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});

describe('built page', () => {
  const file = 'dist/ru/aviasales/index.html';
  it.skipIf(!existsSync(file))('is unlisted and carries no unapproved or expired joke', () => {
    const html = readFileSync(file, 'utf8');
    expect(html).toMatch(/<meta[^>]+name="robots"[^>]+noindex/);
    // Judge the jokes by the moment the page was built, not by the moment the tests run.
    const builtAt = statSync(file).mtime;
    const live = data.avMemes.filter((line) => memeIsLive(line, builtAt));
    const dead = data.avMemes.filter((line) => !memeIsLive(line, builtAt));
    for (const item of dead) expect(html).not.toContain(item.text);
    // A live joke must be there, so the check above can never pass on an empty page.
    expect(live.some((item) => html.includes(item.text))).toBe(true);
    expect(html).not.toMatch(/[–—]/);
    for (const id of ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']) expect(html).toContain(`id="av-proof-${id}"`);
  });
});
