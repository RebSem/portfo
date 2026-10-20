import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The repository is public and its history is permanent. In October 2026 an
 * audit found the owner's full phone number in a code comment and in a resume
 * PDF that had sat at the repo root since February, and an old hero photo with
 * GPS coordinates. The dist/ and public/cv scans in cv.test.ts never looked at
 * those files, so this suite reads everything git tracks.
 */

const tracked = (): string[] =>
  execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);

const files = tracked();

const hasTool = (tool: string, args: string[]) => {
  try {
    execFileSync(tool, args, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// A full Russian mobile number, international or domestic form. A country and
// area code alone is fine: the Zvonobot case quotes a truncated "+7 (982)..."
// as an example of the messy CSV rows the ingest pipeline normalizes.
const PHONES = [
  /\+7[\s(]*\d{3}[)\s]*\d{3}[-\s]?\d{2}[-\s]?\d{2}/g,
  /(?<![\w+])8[\s(-]*9\d{2}[)\s-]*\d{3}[-\s]?\d{2}[-\s]?\d{2}(?!\d)/g,
];
// Placeholders in usage text and fixtures ("+7 900 000-00-00", "tel:+70000000000")
// end in seven zeros; no real subscriber number does.
const isPlaceholder = (found: string) => /0{7}$/.test(found.replace(/\D/g, ''));

const phonesIn = (text: string): string[] =>
  PHONES.flatMap((pattern) => [...text.matchAll(pattern)].map((match) => match[0])).filter(
    (found) => !isPlaceholder(found),
  );

// Generated and binary files carry no human-written text; base64 in the
// lockfile can look like "+7" followed by ten digits.
const SKIP_TEXT = new Set(['package-lock.json']);
const isBinary = (buffer: Buffer) => buffer.subarray(0, 8000).includes(0);

describe('tracked files', () => {
  it('lists the repository', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('include nothing from the git-ignored private folders', () => {
    const PRIVATE = /^(private|private-exports|dist-private|scripts\/cv\/_archive)\/|(^|\/)\.env$|(^|\/)\.env\.(?!example$)/;
    expect(files.filter((file) => PRIVATE.test(file))).toEqual([]);
  });

  it('hold no phone number in any text file', () => {
    const leaks: string[] = [];
    for (const file of files) {
      if (SKIP_TEXT.has(path.basename(file))) continue;
      const buffer = readFileSync(file);
      if (isBinary(buffer)) continue;
      // Never print the number itself: the test output is public in CI logs.
      if (phonesIn(buffer.toString('utf8')).length) leaks.push(file);
    }
    expect(leaks, 'phone number in tracked text files').toEqual([]);
  });

  const documents = files.filter((file) => /\.(pdf|docx)$/i.test(file));
  const canReadDocuments = hasTool('pdftotext', ['-v']) && hasTool('unzip', ['-v']);

  it.skipIf(!canReadDocuments)('hold no phone number in any PDF or DOCX', () => {
    const leaks: string[] = [];
    for (const file of documents) {
      let text = '';
      try {
        text = file.toLowerCase().endsWith('.pdf')
          ? execFileSync('pdftotext', ['-q', file, '-'], { encoding: 'utf8', maxBuffer: 16 << 20 })
          : execFileSync('unzip', ['-p', file, 'word/document.xml'], {
              encoding: 'utf8',
              maxBuffer: 16 << 20,
            }).replace(/<[^>]+>/g, '');
      } catch {
        continue;
      }
      if (phonesIn(text).length) leaks.push(file);
    }
    expect(leaks, 'phone number in tracked documents').toEqual([]);
  });

  // EXIF lives in a TIFF block: JPEG APP1, PNG eXIf, WebP EXIF, HEIC Exif item.
  // Tag 0x8825 in the first IFD points at the GPS data.
  const hasGps = (buffer: Buffer): boolean => {
    const starts: number[] = [];
    for (let at = buffer.indexOf('Exif\0\0'); at >= 0; at = buffer.indexOf('Exif\0\0', at + 1)) {
      starts.push(at + 6);
    }
    for (const signature of ['MM\0*', 'II*\0']) {
      for (let at = buffer.indexOf(signature); at >= 0 && starts.length < 64; at = buffer.indexOf(signature, at + 1)) {
        starts.push(at);
      }
    }
    for (const start of starts) {
      try {
        const little = buffer.toString('latin1', start, start + 2) === 'II';
        const u16 = (at: number) => (little ? buffer.readUInt16LE(start + at) : buffer.readUInt16BE(start + at));
        const u32 = (at: number) => (little ? buffer.readUInt32LE(start + at) : buffer.readUInt32BE(start + at));
        if (u16(2) !== 42) continue;
        const ifd = u32(4);
        const count = u16(ifd);
        if (count > 512) continue;
        for (let entry = 0; entry < count; entry += 1) {
          if (u16(ifd + 2 + entry * 12) === 0x8825) return true;
        }
      } catch {
        // Not a TIFF header after all: keep looking.
      }
    }
    return false;
  };

  it('hold no photo with GPS coordinates', () => {
    const photos = files.filter((file) => /\.(jpe?g|heic|heif|png|webp|tiff?)$/i.test(file));
    expect(photos.length).toBeGreaterThan(0);
    expect(photos.filter((file) => hasGps(readFileSync(file))), 'GPS EXIF in tracked images').toEqual([]);
  });
});
