/**
 * Converts the case-study screenshots to WebP at two widths.
 *
 *   node scripts/webp-shots.mjs
 *
 * The captured PNGs are 2880px wide (2x) and 300-500 KB each; a case page
 * loads five of them per theme. WebP at quality 82 lands at 60-110 KB for the
 * 2x file and about a third of that for the 1x, and ProjectScreenshot serves
 * them through srcset so a laptop never downloads the retina file. The PNGs
 * stay in the repo as the source of truth for the next reconversion.
 */
import { readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import sharp from 'sharp';

const DIR = resolve(import.meta.dirname, '../public/projects');
const sources = readdirSync(DIR).filter((f) => /^(zvonobot|obrabot)-.*\.png$/.test(f));

let before = 0;
let after = 0;
for (const file of sources) {
  const src = join(DIR, file);
  const base = file.replace(/\.png$/, '');
  before += statSync(src).size;

  const full = join(DIR, `${base}.webp`);
  const half = join(DIR, `${base}-1440.webp`);
  await sharp(src).webp({ quality: 82 }).toFile(full);
  await sharp(src).resize({ width: 1440 }).webp({ quality: 82 }).toFile(half);
  after += statSync(full).size + statSync(half).size;
  console.log(`${base}: ${Math.round(statSync(full).size / 1024)} KB @2x, ${Math.round(statSync(half).size / 1024)} KB @1x`);
}
console.log(`\n${sources.length} shots: ${(before / 1048576).toFixed(1)} MB png -> ${(after / 1048576).toFixed(1)} MB webp (both sizes)`);
