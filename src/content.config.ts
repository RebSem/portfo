import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    lang: z.enum(['ru', 'en']),
    translationKey: z.string().min(1),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    updatedAt: z.coerce.date().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
