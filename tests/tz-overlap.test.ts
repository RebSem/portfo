import { describe, expect, it } from 'vitest';
import {
  OWNER_FALLBACK_OFFSET_MIN,
  overlap,
  overlapLine,
  parseGmtOffset,
  workdayOverlapHours,
} from '../src/lib/tz-overlap';

const OWNER = OWNER_FALLBACK_OFFSET_MIN; // Asia/Yekaterinburg, UTC+5, no DST
const h = (hours: number) => hours * 60;

describe('workday overlap with GMT+5', () => {
  it('matches the zones recruiters actually write from (October offsets)', () => {
    expect(overlap(h(5), OWNER)).toEqual({ hours: 9, kind: 'same' }); // Perm, Tashkent
    expect(overlap(h(3), OWNER)).toEqual({ hours: 7, kind: 'wide' }); // Moscow, Cyprus (EEST)
    expect(overlap(h(4), OWNER)).toEqual({ hours: 8, kind: 'wide' }); // Dubai
    expect(overlap(h(2), OWNER)).toEqual({ hours: 6, kind: 'wide' }); // Berlin (CEST)
    expect(overlap(h(1), OWNER)).toEqual({ hours: 5, kind: 'wide' }); // London (BST)
    expect(overlap(0, OWNER)).toEqual({ hours: 4, kind: 'wide' }); // UTC
    expect(overlap(h(-4), OWNER)).toEqual({ hours: 0, kind: 'none' }); // New York (EDT)
    expect(overlap(h(-7), OWNER)).toEqual({ hours: 0, kind: 'none' }); // US West (PDT)
  });

  it('floors half-hour zones instead of promising the half', () => {
    expect(workdayOverlapHours(h(5.5), OWNER)).toBe(8); // India
    expect(workdayOverlapHours(h(-2.5), OWNER)).toBe(1); // Newfoundland (NDT)
  });

  it('wraps around midnight for zones far behind', () => {
    // UTC-12: the visitor's day is the owner's 02:00-11:00 the next day.
    expect(overlap(h(-12), OWNER)).toEqual({ hours: 2, kind: 'narrow' });
    // UTC+14 is nine hours ahead: 09:00 there is midnight in Perm.
    expect(overlap(h(14), OWNER)).toEqual({ hours: 0, kind: 'none' });
  });
});

describe('parseGmtOffset', () => {
  it('reads the labels Intl produces', () => {
    expect(parseGmtOffset('GMT+05:00')).toBe(300);
    expect(parseGmtOffset('GMT+5')).toBe(300);
    expect(parseGmtOffset('GMT-04:00')).toBe(-240);
    expect(parseGmtOffset('GMT−3')).toBe(-180);
    expect(parseGmtOffset('GMT+05:30')).toBe(330);
    expect(parseGmtOffset('GMT')).toBe(0);
    expect(parseGmtOffset('Moscow Time')).toBeNull();
    // [+-−] unescaped is a range that swallows digits and letters.
    expect(parseGmtOffset('GMT05')).toBeNull();
    expect(parseGmtOffset('GMT=5')).toBeNull();
    expect(parseGmtOffset('GMTa5')).toBeNull();
  });
});

describe('overlapLine', () => {
  it('writes every case in both locales without dashes', () => {
    const cases = [overlap(h(5), OWNER), overlap(h(2), OWNER), overlap(h(-12), OWNER), overlap(h(-4), OWNER)];
    for (const result of cases) {
      for (const locale of ['ru', 'en'] as const) {
        const line = overlapLine(locale, result, '14:20');
        expect(line).toContain('14:20');
        expect(line).not.toMatch(/[—–]/);
      }
    }
    expect(overlapLine('en', overlap(h(2), OWNER), '14:20')).toContain('6 hours');
    expect(overlapLine('en', { hours: 1, kind: 'narrow' }, '14:20')).toContain('by 1 hour,');
    // No PM-unfriendly "async by default" and no open-ended promise.
    for (const locale of ['ru', 'en'] as const) {
      expect(overlapLine(locale, overlap(h(-4), OWNER), '14:20')).not.toMatch(/async/i);
    }
    expect(overlapLine('ru', overlap(h(3), OWNER), '14:20')).toContain('на 7 ч');
  });
});
