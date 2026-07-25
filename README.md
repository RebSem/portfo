# portfo

[![Site](https://img.shields.io/badge/site-rebsem.ru-0a7cff)](https://rebsem.ru)
[![CI](https://github.com/RebSem/portfo/actions/workflows/ci.yml/badge.svg)](https://github.com/RebSem/portfo/actions/workflows/ci.yml)
[![Deploy](https://github.com/RebSem/portfo/actions/workflows/deploy.yml/badge.svg)](https://github.com/RebSem/portfo/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-green.svg)](./LICENSE)

Source of [rebsem.ru](https://rebsem.ru) — the personal site and bilingual blog of
Mikhail Semenov, AI Product Manager. Astro, statically built, deployed to GitHub
Pages on every push to `main`.

## Stack

| | |
|---|---|
| Framework | Astro 5, `output: 'static'` |
| Content | MDX via `astro:content`, schema-validated collections |
| Language | TypeScript (`astro/tsconfigs/strict`) |
| Fonts | Self-hosted, built by Astro's font pipeline |
| Tests | Vitest |
| CI/CD | GitHub Actions → GitHub Pages |
| Analytics | PostHog, anonymous and storage-free (see below) |

No UI framework and no client-side router library: navigation uses Astro's
`<ClientRouter />`, and every interactive piece is a small vanilla module in
`src/scripts/`.

## Routes

Every page exists in both locales. English is the default and unprefixed;
Russian lives under `/ru`.

| Route | |
|---|---|
| `/`, `/ru/` | Landing page |
| `/about`, `/ru/about` | Profile, working style, anti-fit |
| `/blog`, `/ru/blog` | Blog index |
| `/blog/:slug` | Post, paired across locales by slug |
| `/projects/:slug` | Project case study, 8 per locale |
| `/api/github/{profile,repos,contributions}.json` | Static JSON, generated at build time |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Generated |

## Layout

```
src/
  components/   Astro components, styles scoped per component
  content/      MDX collections: blog/, projects/
  data/         Site copy and project metadata, bilingual
  layouts/      The single page shell: head, meta, JSON-LD, transitions
  lib/          Pure modules, unit-tested (GitHub parsing, link classification)
  pages/        File-based routes; ru/ mirrors the root
  scripts/      Client-side modules, one concern each
  styles/       Global tokens and layout
scripts/        Build and authoring tooling, plus the CV generator
tests/          Vitest suites for the pure modules
docs/           Contributor docs
```

`src/lib/` exists so that logic worth testing carries no DOM or SDK imports;
`src/scripts/` is where the DOM lives. That split is why the test suite needs no
browser environment.

## Development

Node 22 and npm 10 (CI pins the same major).

```bash
npm install
npm run dev
```

Runs on `http://localhost:4321`.

## Validation

```bash
npm run validate
```

Typecheck, tests, a production build, and an internal link check across every
generated page. This is what CI runs on pull requests, so a green local run means
a green PR. Pre-merge process: [`docs/workflow.md`](docs/workflow.md).

## Writing a post

```bash
npm run new:post -- my-post-slug --title-ru "Заголовок" --title-en "Title"
```

Creates the RU/EN draft pair already linked to each other. Frontmatter reference
and conventions: [`docs/blog-authoring.md`](docs/blog-authoring.md).

## Environment

All optional — the site builds without any of them. See [`.env.example`](.env.example).

| Variable | Effect when unset |
|---|---|
| `GITHUB_TOKEN` | GitHub API calls stay unauthenticated (60 req/hour); the build falls back to cached data |
| `GITHUB_CACHE_FILE` | Defaults to `.cache/github-cache.json` |
| `PUBLIC_ANALYTICS_KEY` | Analytics is compiled out of the bundle entirely |
| `PUBLIC_ANALYTICS_HOST` | Defaults to PostHog EU |

## Analytics

Deliberately minimal. `persistence: 'memory'` means nothing is written to the
visitor's device — no cookie, no `localStorage`, no `sessionStorage` — so there is
no consent banner. Nothing calls `identify()`, so every event is anonymous and no
person profile is created. Session replay, feature flags, surveys and remote
config are all off, which also removes their network requests.

The project token is public by design and ships in the built JavaScript; it lives
in an Actions secret so it stays out of git history and can be rotated without a
commit. Without that secret the analytics module is dropped at build time, so
pull-request builds cannot send events.

## Deployment

Push to `main` builds and publishes to GitHub Pages, served at `rebsem.ru` via
[`public/CNAME`](public/CNAME). Pull requests run [`ci.yml`](.github/workflows/ci.yml);
`main` additionally runs [`deploy.yml`](.github/workflows/deploy.yml).

## Licensing

Dual, and the split matters if you reuse anything here.

- **Code** — MIT, see [`LICENSE`](LICENSE).
- **Content** — text, images, case studies and the CV are All Rights Reserved,
  see [`LICENSE-CONTENT`](LICENSE-CONTENT). Fork the code, not the biography.

## Attribution

Originally bootstrapped from [steipete/steipete.me](https://github.com/steipete/steipete.me)
by Peter Steinberger, then substantially rewritten. Upstream code remains MIT; see
[`NOTICE`](NOTICE) for details, and keep the attribution if you reuse this.
