# Portfo

[![Site](https://img.shields.io/badge/site-rebsem.ru-0a7cff)](https://rebsem.ru)
[![Deploy to GitHub Pages](https://github.com/RebSem/portfo/actions/workflows/deploy.yml/badge.svg)](https://github.com/RebSem/portfo/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Personal portfolio + RU/EN blog built with Astro and deployed to GitHub Pages.

Live site: [rebsem.ru](https://rebsem.ru)

## Stack

- Astro 5
- MDX (`astro:content`)
- TypeScript
- GitHub Actions + GitHub Pages

## Features

- RU/EN locale toggle with persistent preference
- Light/dark theme toggle
- Smooth client-side navigation
- Bilingual blog posts (translation pairs)
- GitHub profile + contributions JSON generated at build time
- `robots.txt`, `sitemap.xml`, `llms.txt`, meta tags, structured data

## Routes

- `/` - landing page
- `/about` - profile/about page
- `/blog` - blog index
- `/blog/:slug` - blog post
- `/posts` - redirect/compat route
- `/api/github/profile.json` - generated static JSON
- `/api/github/contributions.json` - generated static JSON

## Local Development

Requirements:

- Node.js 20+
- npm 10+

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

## Validation

```bash
npm run check
npm test
```

## Blog Workflow

Create a new RU/EN draft pair:

```bash
npm run new:post -- my-post-slug --title-ru "Заголовок" --title-en "Title"
```

Detailed guide: `docs/blog-authoring.md`

## Environment Variables

See `.env.example`.

- `GITHUB_TOKEN` - optional token for higher GitHub API rate limits during local build/preview
- `GITHUB_CACHE_FILE` - local cache file path (default: `.cache/github-cache.json`)

## Deploy (GitHub Pages)

This repository deploys via GitHub Actions workflow:

- Workflow: `.github/workflows/deploy.yml`
- Trigger: push to `main`
- Custom domain: `rebsem.ru` (via `public/CNAME`)

## Attribution

This project was originally bootstrapped from the website code of Peter Steinberger ([`steipete`](https://github.com/steipete)) and then adapted/modified for this portfolio.

Reference repository:

- [steipete/steipete.me](https://github.com/steipete/steipete.me)

If you reuse this repository, keep attribution for upstream code where applicable.

## License

Code in this repository is licensed under the MIT License (`LICENSE`).

Content (texts, images, media) is licensed separately under `LICENSE-CONTENT` unless otherwise noted.

Portions of the code are derived from Peter Steinberger's site code and remain subject to the MIT license terms and attribution notice.

## Content Licensing Notes

- Repository code: MIT (`LICENSE`)
- Portfolio/blog content and media authored for this site: All Rights Reserved (`LICENSE-CONTENT`)
- Third-party content/assets (if any): keep original license/attribution requirements
