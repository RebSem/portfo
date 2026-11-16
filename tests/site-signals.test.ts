import { describe, expect, it } from 'vitest';
import { hiddenBucket, sanitizeSignal } from '../src/lib/site-signals';
import { AWAY_TITLE, awayTitle } from '../src/lib/tab-nudge';

describe('sanitizeSignal', () => {
  it('passes allowed signals with allowed values only', () => {
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
      sanitizeSignal({ name: 'tab:return', props: { hidden_bucket: '1-10m', text: 'pasted text' } }),
    ).toEqual({ name: 'tab:return', props: { hidden_bucket: '1-10m' } });
    expect(
      sanitizeSignal({
        name: 'tab:return',
        props: { constructor: 'secret@mail.com', toString: { a: 1 }, hasOwnProperty: 1, valueOf: 2 },
      }),
    ).toEqual({ name: 'tab:return', props: {} });
    expect(
      sanitizeSignal({ name: 'tab:return', props: JSON.parse('{"__proto__": 1, "hidden_bucket": "over-10m"}') }),
    ).toEqual({ name: 'tab:return', props: { hidden_bucket: 'over-10m' } });
    expect(sanitizeSignal({ name: 'tab:return', props: { hidden_bucket: 123456 } })).toEqual({
      name: 'tab:return',
      props: {},
    });
  });
});

describe('sanitizeSignal for the booking page', () => {
  it('passes a format length of 15, 30 or 60 minutes', () => {
    for (const minutes of [15, 30, 60]) {
      expect(sanitizeSignal({ name: 'booking:select', props: { minutes } })).toEqual({
        name: 'booking:select',
        props: { minutes },
      });
      expect(sanitizeSignal({ name: 'booking:done', props: { minutes } })).toEqual({
        name: 'booking:done',
        props: { minutes },
      });
    }
  });

  it('drops any other length, or a length sent as text', () => {
    for (const minutes of [45, 0, 90, '30', null, undefined]) {
      expect(sanitizeSignal({ name: 'booking:done', props: { minutes } })).toEqual({
        name: 'booking:done',
        props: {},
      });
    }
  });

  it('keeps nothing from the embed but the length', () => {
    // Names, emails, times and the Cal.com event itself must never reach a property.
    expect(
      sanitizeSignal({
        name: 'booking:done',
        props: { minutes: 30, name: 'Anna', email: 'anna@example.com', start: '2026-11-10T10:00', eventType: '30min' },
      }),
    ).toEqual({ name: 'booking:done', props: { minutes: 30 } });
  });

  it('does not accept booking names outside the allow-list', () => {
    expect(sanitizeSignal({ name: 'booking:cancel', props: { minutes: 30 } })).toBeNull();
    expect(sanitizeSignal({ name: 'booking', props: { minutes: 30 } })).toBeNull();
  });
});

describe('sanitizeSignal for the Aviasales landing', () => {
  it('passes the allowed ids and actions', () => {
    for (const id of ['price', 'mission', 'baroness']) {
      for (const action of ['shown', 'closed']) {
        expect(sanitizeSignal({ name: 'aviasales:toast', props: { id, action } })).toEqual({
          name: 'aviasales:toast',
          props: { id, action },
        });
      }
    }
    for (const req of ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']) {
      expect(sanitizeSignal({ name: 'aviasales:filter', props: { req } })).toEqual({
        name: 'aviasales:filter',
        props: { req },
      });
    }
    for (const id of ['baroness', 'turbulence', 'search']) {
      expect(sanitizeSignal({ name: 'aviasales:egg', props: { id } })).toEqual({
        name: 'aviasales:egg',
        props: { id },
      });
    }
  });

  it('drops values outside the lists', () => {
    expect(sanitizeSignal({ name: 'aviasales:toast', props: { id: 'other', action: 'opened' } })).toEqual({
      name: 'aviasales:toast',
      props: {},
    });
    for (const req of ['r8', 'R1', '', 1, null]) {
      expect(sanitizeSignal({ name: 'aviasales:filter', props: { req } })).toEqual({
        name: 'aviasales:filter',
        props: {},
      });
    }
    expect(sanitizeSignal({ name: 'aviasales:egg', props: { id: 'pug' } })).toEqual({
      name: 'aviasales:egg',
      props: {},
    });
  });

  it('keeps nothing but the allowed keys', () => {
    expect(
      sanitizeSignal({
        name: 'aviasales:filter',
        props: { req: 'r3', text: 'Опыт с B2B', query: 'отель', email: 'a@example.com' },
      }),
    ).toEqual({ name: 'aviasales:filter', props: { req: 'r3' } });
    expect(
      sanitizeSignal({ name: 'aviasales:egg', props: { id: 'search', typed: 'hello', constructor: 'x' } }),
    ).toEqual({ name: 'aviasales:egg', props: { id: 'search' } });
  });

  it('accepts only a boolean for calm mode', () => {
    expect(sanitizeSignal({ name: 'aviasales:calm', props: { on: true } })).toEqual({
      name: 'aviasales:calm',
      props: { on: true },
    });
    expect(sanitizeSignal({ name: 'aviasales:calm', props: { on: false } })).toEqual({
      name: 'aviasales:calm',
      props: { on: false },
    });
    for (const on of ['true', 1, 0, null, undefined]) {
      expect(sanitizeSignal({ name: 'aviasales:calm', props: { on } })).toEqual({
        name: 'aviasales:calm',
        props: {},
      });
    }
  });

  it('does not accept names outside the allow-list', () => {
    expect(sanitizeSignal({ name: 'aviasales:click', props: { id: 'price' } })).toBeNull();
    expect(sanitizeSignal({ name: 'aviasales', props: {} })).toBeNull();
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
