import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const HTML_EXTENSIONS = new Set(['.html']);
const ASSET_EXTENSIONS = new Set([
  '.css',
  '.gif',
  '.ico',
  '.jpg',
  '.jpeg',
  '.js',
  '.json',
  '.mjs',
  '.png',
  '.svg',
  '.txt',
  '.webp',
  '.xml',
]);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return [fullPath];
    }),
  );

  return files.flat();
};

const normalizeRoute = (filePath) => {
  const relativePath = `/${path.relative(DIST_DIR, filePath).replaceAll(path.sep, '/')}`;
  if (relativePath === '/index.html') return '/';
  if (relativePath.endsWith('/index.html')) return relativePath.slice(0, -'index.html'.length);
  return relativePath;
};

const isExternal = (value) =>
  value.startsWith('http://') ||
  value.startsWith('https://') ||
  value.startsWith('mailto:') ||
  value.startsWith('tel:') ||
  value.startsWith('data:');

const stripHashAndQuery = (value) => value.split('#')[0].split('?')[0];

const toPathname = (rawValue, currentRoute) => {
  if (!rawValue || rawValue.startsWith('#') || isExternal(rawValue)) return null;

  const currentUrl = new URL(currentRoute, 'https://rebsem.ru');
  const resolved = new URL(rawValue, currentUrl);
  return resolved.pathname;
};

const resolveTarget = (pathname, htmlRoutes, assetTargets) => {
  if (htmlRoutes.has(pathname)) return true;
  if (assetTargets.has(pathname)) return true;

  const ext = path.extname(pathname);
  if (!ext) {
    const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
    return htmlRoutes.has(normalized);
  }

  if (HTML_EXTENSIONS.has(ext)) {
    const routePath = pathname === '/index.html' ? '/' : pathname.replace(/index\.html$/, '');
    return htmlRoutes.has(routePath);
  }

  if (ASSET_EXTENSIONS.has(ext)) {
    return assetTargets.has(pathname);
  }

  return false;
};

const collectTargets = async () => {
  const files = await walk(DIST_DIR);
  const htmlFiles = files.filter((file) => HTML_EXTENSIONS.has(path.extname(file)));
  const assetFiles = files.filter((file) => !HTML_EXTENSIONS.has(path.extname(file)));

  return {
    htmlFiles,
    htmlRoutes: new Set(htmlFiles.map(normalizeRoute)),
    assetTargets: new Set(assetFiles.map((file) => `/${path.relative(DIST_DIR, file).replaceAll(path.sep, '/')}`)),
  };
};

const extractLinks = (html) => {
  const values = [];
  const attributePattern = /\b(?:href|src)=["']([^"'<>]+)["']/g;

  for (const match of html.matchAll(attributePattern)) {
    values.push(match[1]);
  }

  return values;
};

const main = async () => {
  const { htmlFiles, htmlRoutes, assetTargets } = await collectTargets();
  const failures = [];

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const currentRoute = normalizeRoute(file);

    for (const rawValue of extractLinks(html)) {
      const value = stripHashAndQuery(rawValue);
      const pathname = toPathname(value, currentRoute);
      if (!pathname) continue;

      if (!resolveTarget(pathname, htmlRoutes, assetTargets)) {
        failures.push(`${currentRoute} -> ${rawValue}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error('Broken internal links detected:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Link check passed for ${htmlFiles.length} HTML files.`);
};

await main();
