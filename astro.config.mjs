// @ts-check
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://rebsem.ru',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  experimental: {
    // Self-hosted fonts: downloaded at build, served same-origin with
    // preload + metric-matched fallbacks. Replaces the render-chained
    // Google Fonts @import (two cold cross-origin connections before
    // the H1 could swap to the webfont).
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
  },
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
