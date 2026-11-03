import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { buildLlmsText } from '../lib/llms-text';

// llms.txt for LLM screeners. Built from the resume facts in cv.ts and from the
// published English case studies, so it cannot fall behind either of them.
export const GET: APIRoute = async () => {
  const cases = await getCollection('projects', ({ data }) => !data.draft && data.lang === 'en');

  return new Response(
    buildLlmsText(
      cases.map((entry) => ({
        id: entry.id,
        title: entry.data.title,
        description: entry.data.description,
      })),
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
