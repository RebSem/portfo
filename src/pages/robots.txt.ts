import type { APIRoute } from 'astro';

const SITE_URL = 'https://rebsem.ru';
const SITE_HOST = 'rebsem.ru';

export const GET: APIRoute = async () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Host: ${SITE_HOST}`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
