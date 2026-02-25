// @ts-check
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rebsem.ru',
  output: 'static',
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
