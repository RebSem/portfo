import type { APIRoute } from 'astro';
import { buildCvText } from '../lib/cv-text';

// Plain-text resume for copy-paste into an application form and for LLM
// readers handed the link. Built from cv.ts like everything else, so it can
// never fall behind the page.
export const GET: APIRoute = () =>
  new Response(buildCvText('en'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Unlisted like the page it mirrors.
      'X-Robots-Tag': 'noindex, follow',
    },
  });
