import type { Locale } from '../types/content';

/**
 * "How many working hours do we share?", the question every remote hire
 * raises and nobody wants to compute. The status block answers it with the
 * visitor's own clock.
 *
 * Pure on purpose: offsets come in as numbers, so the arithmetic is tested
 * against real zones (Moscow, Cyprus, Berlin, London, Dubai, New York, US
 * West, India) without a browser. The client script reads the visitor's
 * offset from Date and the owner's from Intl with the IANA zone, never from
 * a hard-coded +5.
 */

export const OWNER_TIME_ZONE = 'Asia/Yekaterinburg';
/** Fallback when Intl cannot report the zone's offset. Yekaterinburg has had
    no daylight saving time since 2014. */
export const OWNER_FALLBACK_OFFSET_MIN = 5 * 60;

const WORKDAY_START_H = 9;
const WORKDAY_END_H = 18;
const WORKDAY_H = WORKDAY_END_H - WORKDAY_START_H;

export type OverlapCase = 'same' | 'wide' | 'narrow' | 'none';

export interface Overlap {
  hours: number;
  kind: OverlapCase;
}

/**
 * Whole hours two 9:00-18:00 days share, for offsets given in minutes east of
 * UTC. Days wrap: a visitor 17 hours behind still shares the morning of the
 * owner's next day, so the neighbouring days count too.
 */
export function workdayOverlapHours(visitorOffsetMin: number, ownerOffsetMin: number): number {
  const shiftH = (ownerOffsetMin - visitorOffsetMin) / 60;
  const best = Math.max(
    ...[-24, 0, 24].map((day) => Math.max(0, WORKDAY_H - Math.abs(shiftH + day))),
  );
  return Math.floor(best);
}

export function overlap(visitorOffsetMin: number, ownerOffsetMin: number): Overlap {
  if (visitorOffsetMin === ownerOffsetMin) return { hours: WORKDAY_H, kind: 'same' };
  const hours = workdayOverlapHours(visitorOffsetMin, ownerOffsetMin);
  if (hours >= 3) return { hours, kind: 'wide' };
  if (hours >= 1) return { hours, kind: 'narrow' };
  return { hours: 0, kind: 'none' };
}

/** "GMT+05:00" / "GMT-4" / "GMT" -> minutes east of UTC, or null. */
export function parseGmtOffset(label: string): number | null {
  // "+", ASCII "-" or U+2212: escaped, or [+-−] becomes a character range.
  const match = label.trim().match(/^(?:GMT|UTC)(?:([+\-−])(\d{1,2})(?::?(\d{2}))?)?$/);
  if (!match) return null;
  if (!match[1]) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

const hoursEn = (n: number) => `${n} ${n === 1 ? 'hour' : 'hours'}`;

/**
 * The sentence under the format row. `clock` is the owner's local time,
 * already formatted ("14:20"). No em dashes: the EN copy rule.
 */
export function overlapLine(locale: Locale, result: Overlap, clock: string): string {
  if (locale === 'ru') {
    switch (result.kind) {
      case 'same':
        return `У меня тоже ${clock}: мы в одном часовом поясе.`;
      case 'wide':
        return `У меня сейчас ${clock}. Наши рабочие дни пересекаются на ${result.hours} ч.`;
      case 'narrow':
        return `У меня сейчас ${clock}. Рабочие дни пересекаются на ${result.hours} ч, на регулярный созвон хватит.`;
      case 'none':
        return `У меня сейчас ${clock}, рабочие дни у нас не пересекаются. Созвоны могу ставить на начало вашего дня, релокация тоже возможна.`;
    }
  }
  switch (result.kind) {
    case 'same':
      return `It's ${clock} here too: same time zone.`;
    case 'wide':
      return `It's ${clock} here. Our working days overlap by ${hoursEn(result.hours)}.`;
    case 'narrow':
      return `It's ${clock} here. Our working days overlap by ${hoursEn(result.hours)}, enough for a regular call.`;
    case 'none':
      // Bounded on purpose: "early in your day", not an open-ended promise,
      // and relocation is the other answer to a zero overlap.
      return `It's ${clock} here, and our working days don't overlap. I can take calls early in your day, or relocate.`;
  }
}
