import type { Locale } from '../types/content';
import type { ContributionDay } from '../types/github';

export interface ContributionCell {
  date: string;
  level: ContributionDay['level'];
  count: number;
}

export interface ContributionGrid {
  weeks: number;
  /** Week by week, Sunday first: cell i sits in week floor(i / 7), weekday i % 7. */
  cells: ContributionCell[];
}

const DAY_MS = 86_400_000;

const utcDate = (isoDate: string): Date => new Date(`${isoDate}T00:00:00.000Z`);

// Pads the year to whole Sunday-to-Saturday weeks, the way GitHub draws its
// calendar, so the first and last columns are full. No days gives an empty grid.
export const buildContributionGrid = (days: ContributionDay[]): ContributionGrid => {
  if (days.length === 0) return { weeks: 0, cells: [] };

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((day) => [day.date, day]));

  const start = utcDate(sorted[0].date);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const end = utcDate(sorted[sorted.length - 1].date);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const dayCount = Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
  const weeks = Math.ceil(dayCount / 7);

  const cells: ContributionCell[] = [];
  for (let index = 0; index < weeks * 7; index += 1) {
    const current = new Date(start);
    current.setUTCDate(start.getUTCDate() + index);
    const date = current.toISOString().slice(0, 10);
    const day = byDate.get(date);
    cells.push({ date, level: day?.level ?? 0, count: day?.count ?? 0 });
  }

  return { weeks, cells };
};

// The noun after a count, picked by the locale's plural rule: Russian reads
// "1 вклад", "2 вклада", "5 вкладов", "21 вклад". src/scripts/github-activity.js
// repeats this table, because that script is served as-is and cannot import from
// src/lib; keep the two in step.
const CONTRIBUTION_WORDS: Record<Locale, Record<string, string>> = {
  en: { one: 'contribution', other: 'contributions' },
  ru: { one: 'вклад', few: 'вклада', many: 'вкладов', other: 'вкладов' },
};

const PLURAL_RULES: Record<Locale, Intl.PluralRules> = {
  en: new Intl.PluralRules('en-US'),
  ru: new Intl.PluralRules('ru-RU'),
};

export const contributionWord = (count: number, locale: Locale): string => {
  const forms = CONTRIBUTION_WORDS[locale];
  return forms[PLURAL_RULES[locale].select(count)] ?? forms.other;
};
