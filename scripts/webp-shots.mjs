/**
 * Converts the case-study screenshots to WebP and AVIF at two widths.
 *
 *   node scripts/webp-shots.mjs
 *
 * The captured PNGs are 2880px wide (2x) and 200-520 KB each; a case page
 * loads five of them per theme. WebP at quality 82 lands at 70-200 KB for the
 * 2x file and 30-85 KB for the 1x, and ProjectScreenshot serves them through
 * srcset so a laptop never downloads the retina file. AVIF at quality 60 is
 * smaller again and reads the same on UI text; it comes first in a <picture>,
 * and the WebP stays as the fallback. Quality 50 softened the letter edges at
 * 2x. The tubedrop app windows are drawn by ProjectAppShot at their own size,
 * so each gets one AVIF beside its PNG and no WebP.
 * The PNGs stay in the repo as the source of truth for the next reconversion.
 */
import { readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const DIR = resolve(import.meta.dirname, '../public/projects');
const names = readdirSync(DIR);
const shots = names.filter((f) => /^(zvonobot|obrabot)-.*\.png$/.test(f));
const apps = names.filter((f) => /^tubedrop-.*\.png$/.test(f));

const AVIF = { quality: 60, effort: 6 };
const kb = (bytes) => Math.round(bytes / 1024);
const mb = (bytes) => (bytes / 1048576).toFixed(1);

let before = 0;
let webpAfter = 0;
let avifAfter = 0;
for (const file of shots) {
  const src = join(DIR, file);
  const base = file.replace(/\.png$/, '');
  before += statSync(src).size;

  const fullWebp = await sharp(src).webp({ quality: 82 }).toFile(join(DIR, `${base}.webp`));
  const halfWebp = await sharp(src).resize({ width: 1440 }).webp({ quality: 82 }).toFile(join(DIR, `${base}-1440.webp`));
  const fullAvif = await sharp(src).avif(AVIF).toFile(join(DIR, `${base}.avif`));
  const halfAvif = await sharp(src).resize({ width: 1440 }).avif(AVIF).toFile(join(DIR, `${base}-1440.avif`));
  webpAfter += fullWebp.size + halfWebp.size;
  avifAfter += fullAvif.size + halfAvif.size;
  console.log(
    `${base}: webp ${kb(fullWebp.size)} + ${kb(halfWebp.size)} KB, avif ${kb(fullAvif.size)} + ${kb(halfAvif.size)} KB (2x + 1x)`,
  );
}
console.log(
  `\n${shots.length} shots: ${mb(before)} MB png -> ${mb(webpAfter)} MB webp and ${mb(avifAfter)} MB avif (both sizes)`,
);

let appPng = 0;
let appAvif = 0;
for (const file of apps) {
  const src = join(DIR, file);
  appPng += statSync(src).size;
  const info = await sharp(src).avif(AVIF).toFile(join(DIR, file.replace(/\.png$/, '.avif')));
  appAvif += info.size;
  console.log(`${file}: avif ${kb(info.size)} KB (png ${kb(statSync(src).size)} KB)`);
}
console.log(`${apps.length} app windows: ${mb(appPng)} MB png -> ${mb(appAvif)} MB avif`);
