/**
 * The title a background tab shows while the visitor is away. Recruiters
 * keep a row of candidate tabs open; this one says the useful thing from the
 * tab strip. One plain, true sentence: no fake "(1)" badge, no flashing, no
 * favicon swap, at most one swap per hide.
 */
export const AWAY_TITLE = {
  ru: 'Могу выйти в понедельник · Михаил Семенов',
  en: 'Can start Monday · Mikhail Semenov',
} as const;

export const awayTitle = (lang: string | null | undefined): string =>
  lang?.toLowerCase().startsWith('ru') ? AWAY_TITLE.ru : AWAY_TITLE.en;
