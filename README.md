# Portfo

Astro SSR portfolio with RU/EN interface, GitHub activity heatmap, and MDX blog.

## Current structure

- `/about` - main portfolio page (about + GitHub activity + projects)
- `/blog` - blog index
- `/blog/:slug` - blog post page
- `/` - `301 -> /about`
- `/posts` - `301 -> /blog` (compat route)
- `/api/github/profile.json` - GitHub profile endpoint
- `/api/github/contributions.json` - GitHub contributions endpoint

## Features

- RU/EN locale toggle with persistent preference
- Light/dark theme toggle with persistent preference
- Own GitHub heatmap rendering from internal API
- 24h cache + 72h stale fallback for GitHub data
- Persistent file cache (`GITHUB_CACHE_FILE`) to survive container restarts
- MDX blog via Astro Content Collections (`lang: ru|en`, `draft`, tags, dates)

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

## Blog workflow

Create a new draft post:

```bash
npm run new:post -- my-post-slug --lang ru --title "Post title"
```

Generated file location:

- `src/content/blog/YYYY-MM-DD-my-post-slug-ru.mdx`

Required frontmatter:

- `title: string`
- `description: string`
- `publishedAt: date`
- `lang: 'ru' | 'en'`
- `tags: string[]`
- `draft: boolean`
- `updatedAt?: date`
- `cover?: string`

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

Prewarm endpoint:

- `http://127.0.0.1:4321/api/github/contributions.json`

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
- healthcheck `curl -f http://127.0.0.1:4321/about`

## DNS for rebsem.ru (REG.RU)

Keep NS:

- `ns1.reg.ru`
- `ns2.reg.ru`

Required records:

- `A` `@` -> `192.34.60.236`
- `CNAME` `www` -> `rebsem.ru`

Optional hardening:

- `CAA` `0 issue "letsencrypt.org"`
