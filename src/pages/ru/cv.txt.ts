import type { APIRoute } from 'astro';
import { buildCvText } from '../../lib/cv-text';

export const GET: APIRoute = () =>
  new Response(buildCvText('ru', { audience: 'file' }), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, follow',
    },
  });
