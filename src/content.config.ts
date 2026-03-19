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

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['ru', 'en']),
    projectId: z.string(), // Maps to the ID in src/data/projects.ts
    role: z.string().optional(),
    timeline: z.string().optional(),
    impact: z.string().optional(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  projects,
};
