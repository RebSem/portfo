import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export interface BlogTranslationPair {
  ru?: BlogEntry;
  en?: BlogEntry;
}

export const buildBlogTranslationIndex = (posts: BlogEntry[]): Map<string, BlogTranslationPair> => {
  const index = new Map<string, BlogTranslationPair>();

  for (const post of posts) {
    const key = post.data.translationKey;
    const pair = index.get(key) ?? {};
    pair[post.data.lang] = post;
    index.set(key, pair);
  }

  return index;
};

export const getBlogTranslationPair = (
  post: BlogEntry,
  index: Map<string, BlogTranslationPair>,
): BlogTranslationPair => {
  const pair = index.get(post.data.translationKey);

  if (!pair) {
    return post.data.lang === 'ru' ? { ru: post } : { en: post };
  }

  return {
    ru: pair.ru ?? (post.data.lang === 'ru' ? post : undefined),
    en: pair.en ?? (post.data.lang === 'en' ? post : undefined),
  };
};

export const getBlogSlugByLocale = (pair: BlogTranslationPair, locale: 'ru' | 'en'): string | undefined => {
  return pair[locale]?.slug;
};
