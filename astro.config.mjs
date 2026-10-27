// @ts-check
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://rebsem.ru',
  output: 'static',
  // Astro 7 defaults to 'jsx', which drops the whitespace between inline
  // elements written on separate lines ("growB2B", "Also as:DOCX" on /cv, the
  // text layer of the PDF resume). `true` keeps the Astro 5 output; switching
  // to 'jsx' needs explicit {' '} in the components first.
  compressHTML: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Self-hosted fonts: downloaded at build, served same-origin with
  // preload + metric-matched fallbacks. Replaces the render-chained
  // Google Fonts @import (two cold cross-origin connections before
  // the H1 could swap to the webfont). Stable since Astro 6 (it used to
  // live under `experimental`).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['400 700'],
      // Without this the provider also builds (and preloads) italic faces
      // the site never renders — nothing here sets sans/mono italic.
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['JetBrains Mono', 'Menlo', 'monospace'],
    },
    {
      // Local file instead of the google provider: the provider resolves
      // static instances and drops the optical-size axis, flattening the
      // hero serif to its 16pt text cut. This woff2 keeps opsz 6-72 so
      // font-optical-sizing: auto picks the display cut at H1 sizes.
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      options: {
        variants: [
          {
            weight: '400 500',
            style: 'italic',
            src: ['./src/assets/fonts/newsreader-italic-var-latin.woff2'],
          },
        ],
      },
    },
  ],
  // /projects has no index page, only /projects/<slug>. It 404s, and the ATS
  // PDF sent out in early August points recruiters straight at it. A redirect
  // to the projects section of the home page recovers those visits; a static
  // build emits a meta-refresh page with a canonical link, which is enough for
  // a URL that only exists because an old document mentions it.
  redirects: {
    '/projects': '/#projects',
    '/ru/projects': '/ru/#projects',
  },
  integrations: [mdx()],
  vite: {
    build: {
      // Vite 8 minifies CSS with Lightning CSS, and Astro sets the build
      // target to 'esnext', so without explicit targets it strips
      // -webkit-backdrop-filter from the sticky header (Safari/iOS < 18) and
      // rewrites @media (max-width: N) to range syntax (Safari/iOS 16.4+).
      // Vite 8's own baseline list, with Safari/iOS lowered to 15 so both
      // survive as written.
      cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari15', 'ios15'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
