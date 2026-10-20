import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Astro 6+ dropped legacy `type: 'content'` collections: without a loader a
// collection is silently empty and every case study and post vanishes from the
// build. The glob loader's `id` is the old slug (`<name>-en`, `<name>-ru`), so
// pages use `entry.id` and the URLs stay the same. Files starting with `_` are
// skipped, as before.
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
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

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['ru', 'en']),
    projectId: z.string(), // Maps to the ID in src/data/projects.ts
    role: z.string().optional(),
    timeline: z.string().optional(),
    impact: z.string().optional(),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  projects,
};
