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
        subsets: ['latin', 'cyrillic'],
        fallbacks: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      {
        provider: fontProviders.google(),
        name: 'Geist Mono',
        cssVariable: '--font-geist-mono',
        weights: ['400 600'],
        subsets: ['latin', 'cyrillic'],
        fallbacks: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      {
        provider: fontProviders.google(),
        name: 'Newsreader',
        cssVariable: '--font-newsreader',
        weights: ['400 500'],
        styles: ['italic'],
        subsets: ['latin'],
        fallbacks: ['Georgia', 'Times New Roman', 'serif'],
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
