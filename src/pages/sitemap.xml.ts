import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE_URL = 'https://rebsem.ru';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  // The blog is unlisted: not maintained, not linked, kept at its URLs only
  // for anyone who already holds one.
  const staticUrls = ['/', '/about', '/ru/', '/ru/about'];

  const staticEntries = staticUrls
    .map((path) => {
      const loc = `${SITE_URL}${path.endsWith('/') ? path : path + '/'}`;
      return `<url><loc>${escapeXml(loc)}</loc></url>`;
    })
    .join('');

  const projectEntries = projects
    .map((project) => {
      const prefix = project.data.lang === 'ru' ? '/ru' : '';
      const loc = `${SITE_URL}${prefix}/projects/${project.slug}/`;
      return `<url><loc>${escapeXml(loc)}</loc></url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries}${projectEntries}</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
