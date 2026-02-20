// @ts-check
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rebsem.ru',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
