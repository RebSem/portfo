import { describe, expect, it } from 'vitest';
import { hiddenBucket, sanitizeSignal } from '../src/lib/site-signals';
import { AWAY_TITLE, awayTitle } from '../src/lib/tab-nudge';

describe('sanitizeSignal', () => {
  it('passes allowed signals with allowed values only', () => {
    expect(sanitizeSignal({ name: 'shortlist:copy', props: { copied: true } })).toEqual({
      name: 'shortlist:copy',
      props: { copied: true },
    });
    expect(sanitizeSignal({ name: 'tab:return', props: { hidden_bucket: '1-10m' } })).toEqual({
      name: 'tab:return',
      props: { hidden_bucket: '1-10m' },
    });
  });

  it('drops unknown signals, unknown keys and wrong values', () => {
    expect(sanitizeSignal({ name: 'identify', props: { email: 'x@y.z' } })).toBeNull();
    expect(sanitizeSignal({ name: 'toString' })).toBeNull();
    expect(sanitizeSignal(null)).toBeNull();
    expect(sanitizeSignal('shortlist:copy')).toBeNull();
    expect(
      sanitizeSignal({ name: 'shortlist:copy', props: { copied: 'yes', text: 'pasted text' } }),
    ).toEqual({ name: 'shortlist:copy', props: {} });
    expect(
      sanitizeSignal({
        name: 'shortlist:copy',
        props: { constructor: 'secret@mail.com', toString: { a: 1 }, hasOwnProperty: 1, valueOf: 2 },
      }),
    ).toEqual({ name: 'shortlist:copy', props: {} });
    expect(
      sanitizeSignal({ name: 'shortlist:copy', props: JSON.parse('{"__proto__": 1, "copied": true}') }),
    ).toEqual({ name: 'shortlist:copy', props: { copied: true } });
    expect(sanitizeSignal({ name: 'tab:return', props: { hidden_bucket: 123456 } })).toEqual({
      name: 'tab:return',
      props: {},
    });
  });
});

describe('hiddenBucket', () => {
  it('buckets the time away', () => {
    expect(hiddenBucket(5_000)).toBe('under-1m');
    expect(hiddenBucket(60_000)).toBe('1-10m');
    expect(hiddenBucket(600_000)).toBe('1-10m');
    expect(hiddenBucket(600_001)).toBe('over-10m');
  });
});

describe('awayTitle', () => {
  it('follows the page language and keeps the surname without ё', () => {
    expect(awayTitle('ru')).toBe(AWAY_TITLE.ru);
    expect(awayTitle('en')).toBe(AWAY_TITLE.en);
    expect(awayTitle(undefined)).toBe(AWAY_TITLE.en);
    expect(AWAY_TITLE.ru).toContain('Семенов');
    expect(Object.values(AWAY_TITLE).join(' ')).not.toMatch(/[—–]|Семён/);
  });
});
