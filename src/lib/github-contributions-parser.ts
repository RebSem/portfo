import type { ContributionDay, GithubContributionsResponse } from '../types/github';

const clampLevel = (value: number): 0 | 1 | 2 | 3 | 4 => {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
};

const getAttribute = (tag: string, name: string): string | undefined => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1];
};

const stripTags = (raw: string): string => raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const parseTooltipCounts = (html: string): Map<string, number> => {
  const counts = new Map<string, number>();
  const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;

  for (const match of html.matchAll(tooltipRegex)) {
    const id = match[1];
    const text = stripTags(match[2]);
    const countMatch = text.match(/([0-9][0-9,]*)\s+contributions?/i);
    const count = countMatch ? Number.parseInt(countMatch[1].replace(/,/g, ''), 10) : 0;
    counts.set(id, Number.isFinite(count) ? count : 0);
  }

  return counts;
};

const parseContributionDays = (html: string): ContributionDay[] => {
  const tooltipCounts = parseTooltipCounts(html);
  const dayTags = html.match(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g) ?? [];
  const days: ContributionDay[] = [];

  for (const tag of dayTags) {
    const id = getAttribute(tag, 'id');
    const date = getAttribute(tag, 'data-date');
    const levelRaw = getAttribute(tag, 'data-level');
    const countRaw = getAttribute(tag, 'data-count');

    if (!date || !levelRaw) {
      continue;
    }

    const parsedLevel = Number.parseInt(levelRaw, 10);
    const fallbackCount = id ? tooltipCounts.get(id) ?? 0 : 0;
    const parsedCount = countRaw ? Number.parseInt(countRaw, 10) : fallbackCount;

    days.push({
      date,
      level: clampLevel(Number.isFinite(parsedLevel) ? parsedLevel : 0),
      count: Number.isFinite(parsedCount) ? parsedCount : 0,
    });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
};

const parseTotalContributions = (html: string, days: ContributionDay[]): number => {
  const heading = html.match(/id="js-contribution-activity-description"[\s\S]*?<\/h2>/i)?.[0];
  if (heading) {
    const text = stripTags(heading);
    const amountMatch = text.match(/([0-9][0-9,]*)\s+contributions?/i);
    if (amountMatch) {
      const parsed = Number.parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return days.reduce((acc, day) => acc + day.count, 0);
};

export const parseGithubContributionsHtml = (html: string): GithubContributionsResponse => {
  const days = parseContributionDays(html);

  return {
    totalLastYear: parseTotalContributions(html, days),
    days,
  };
};

