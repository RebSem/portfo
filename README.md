# Portfo

Astro SSR portfolio with RU/EN interface, smooth client-side navigation, GitHub activity heatmap, and bilingual MDX blog.

## Requirements

- Node.js 20+
- npm 10+ (tested on npm 11)

## Current structure

- `/` - main landing page (hero + selected projects)
- `/about` - profile page (about + GitHub activity)
- `/blog` - blog index
- `/blog/:slug` - blog post page
- `/posts` - `301 -> /blog` (compat route)
- `/api/github/profile.json` - GitHub profile endpoint
- `/api/github/contributions.json` - GitHub contributions endpoint

## Features

- RU/EN locale toggle with persistent preference
- Light/dark theme toggle with persistent preference
- Smooth page transitions via Astro client router
- Locale-aware post switching (RU/EN pair)
- Own GitHub heatmap rendering from internal API
- 24h cache + 72h stale fallback for GitHub data
- Persistent file cache (`GITHUB_CACHE_FILE`) to survive container restarts
- MDX blog via Astro Content Collections (`translationKey`, `lang: ru|en`, `draft`, tags, dates)

## SEO and Crawlability

- Canonical + OpenGraph + Twitter meta tags in layout
- `robots.txt`: `/robots.txt`
- XML sitemap: `/sitemap.xml`
- AI crawler helper file: `/llms.txt`
- Structured data (Person + WebSite) on the main page

## Local development

```bash
npm install
npm run dev
```

Open: `http://localhost:4321`

## Build

```bash
npm run build
node dist/server/entry.mjs
```

Preview production build locally:

```bash
npm run preview
```

## Validation

Basic project validation:

```bash
npm run build
```

Astro type/content checks:

```bash
npm run check
```

## Blog workflow

Create a new RU/EN draft pair:

```bash
npm run new:post -- my-post-slug --title-ru "Заголовок" --title-en "Title"
```

Generated file location:

- `src/content/blog/YYYY-MM-DD-my-post-slug-ru.mdx`
- `src/content/blog/YYYY-MM-DD-my-post-slug-en.mdx`

Required frontmatter:

- `title: string`
- `description: string`
- `publishedAt: date`
- `lang: 'ru' | 'en'`
- `translationKey: string`
- `tags: string[]`
- `draft: boolean`
- `updatedAt?: date`
- `cover?: string`

Detailed authoring guide:

- `docs/blog-authoring.md`

## GitHub activity checks

Quick verification commands:

```bash
curl -fsS http://127.0.0.1:4321/api/github/profile.json
curl -fsS http://127.0.0.1:4321/api/github/contributions.json
```

## Environment variables

See `.env.example`.

- `GITHUB_CACHE_FILE` - path to persistent cache file (default: `/app/data/github-cache.json`)
- `GITHUB_TOKEN` - optional GitHub token for higher API rate limits

Create runtime env on server:

```bash
cp .env.example .env
```

## Docker (production shape)

`docker-compose.yml` is configured for server deployment:

- binds app only to localhost: `127.0.0.1:4321`
- mounts persistent data: `/var/www/portfo/data:/app/data`
- applies restart policy and log limits

Build and run:

```bash
docker compose up -d --build
```

## DigitalOcean deployment (WordPress untouched)

WordPress stays on the same droplet but under another domain/vhost.
Portfolio lives in `/var/www/portfo`.

### 1) Server provisioning

Run as root:

```bash
mkdir -p /var/www/portfo
cd /var/www/portfo
git clone https://github.com/RebSem/portfo.git app
cd app
bash ops/server/provision-portfo.sh
```

What it does:

- installs docker + compose plugin + certbot
- creates `deploy` user
- ensures `/var/www/portfo/app` and `/var/www/portfo/data`
- runs `docker compose up -d --build`

### 2) Apache reverse proxy for `rebsem.ru`

```bash
cd /var/www/portfo/app
bash ops/server/install-apache-vhost.sh
```

### 3) Free SSL certificate

```bash
certbot --apache -d rebsem.ru -d www.rebsem.ru
systemctl status certbot.timer
```

### 4) Daily GitHub cache prewarm

```bash
cd /var/www/portfo/app
bash ops/server/install-prewarm.sh
```

### Runtime `.env` on server

After provisioning, create secure runtime env in one command:

```bash
cd /var/www/portfo/app
bash ops/server/setup-env.sh
docker compose up -d --build
```

Prewarm endpoints:

- `http://127.0.0.1:4321/api/github/contributions.json`
- `http://127.0.0.1:4321/api/github/profile.json`

## GitHub Actions auto-deploy

Workflow: `.github/workflows/deploy.yml`

Required repository secrets:

- `DEPLOY_HOST` (example: `192.34.60.236`)
- `DEPLOY_PORT` (usually `22`)
- `DEPLOY_USER` (`deploy`)
- `DEPLOY_SSH_KEY` (private key for deploy user)

On push to `main`, workflow connects by SSH and runs:

- `git pull --ff-only`
- `docker compose up -d --build`
- healthchecks for `/`, `/about`, `/blog`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`

## DNS for rebsem.ru (REG.RU)

Keep NS:

- `ns1.reg.ru`
- `ns2.reg.ru`

Required records:

- `A` `@` -> `192.34.60.236`
- `CNAME` `www` -> `rebsem.ru`

Optional hardening:

- `CAA` `0 issue "letsencrypt.org"`
