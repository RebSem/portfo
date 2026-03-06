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
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const staticUrls = ['/', '/about', '/blog'];

  const staticEntries = staticUrls
    .map((path) => {
      const loc = `${SITE_URL}${path}`;
      return `<url><loc>${escapeXml(loc)}</loc></url>`;
    })
    .join('');

  const postEntries = posts
    .map((post) => {
      const loc = `${SITE_URL}/blog/${post.slug}`;
      const updatedAt = (post.data.updatedAt ?? post.data.publishedAt).toISOString();
      return `<url><loc>${escapeXml(loc)}</loc><lastmod>${updatedAt}</lastmod></url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries}${postEntries}</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
