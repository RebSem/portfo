import { describe, expect, it } from 'vitest';
import { chunks, HYPHENATED, noBreakAfterHyphen } from '../src/lib/nb';

describe('HYPHENATED', () => {
  it('matches a hyphen that joins two letters or digits', () => {
    for (const word of ['AI-агентов', 'B2B-звонков', 'LLM-оркестрация', 'full-time']) {
      expect(HYPHENATED.test(word), word).toBe(true);
    }
  });

  it('ignores dashes that do not join two words', () => {
    for (const token of ['AI', 'Zvonobot', ':', '-', 'AI-', '-агентов']) {
      expect(HYPHENATED.test(token), token).toBe(false);
    }
  });
});

describe('chunks', () => {
  it('keeps the whitespace as tokens, so joining them gives the text back', () => {
    const title = 'Zvonobot AI: платформа голосовых AI-агентов для B2B-звонков';
    expect(chunks(title).join('')).toBe(title);
    expect(chunks('a  b\nc')).toEqual(['a', '  ', 'b', '\n', 'c']);
  });
});

describe('noBreakAfterHyphen', () => {
  it('puts a word joiner after a hyphen that joins two words', () => {
    expect(noBreakAfterHyphen('Нужен продакт-менеджер?')).toBe('Нужен продакт-\u2060менеджер?');
    expect(noBreakAfterHyphen('B2B-звонков LLM-оркестрация')).toBe('B2B-\u2060звонков LLM-\u2060оркестрация');
  });

  it('leaves text without joining hyphens unchanged', () => {
    for (const text of ['Hiring a product manager?', 'AI: платформа', 'a - b', '-агентов', 'AI-']) {
      expect(noBreakAfterHyphen(text), text).toBe(text);
    }
  });

  it('removes nothing but the added joiners', () => {
    const title = 'Нужен продакт-менеджер?';
    expect(noBreakAfterHyphen(title).replaceAll('\u2060', '')).toBe(title);
  });
});
