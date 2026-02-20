# Blog Authoring Guide

This project uses paired RU/EN blog posts. Each pair shares one `translationKey`.

## 1) Create a new post pair

Use one command to generate both language versions:

```bash
npm run new:post -- my-topic --title-ru "Заголовок" --title-en "Title"
```

This creates two files in `src/content/blog/`:

- `YYYY-MM-DD-my-topic-ru.mdx`
- `YYYY-MM-DD-my-topic-en.mdx`

Both files include the same `translationKey` and a `cover` path template.

## 2) Fill frontmatter safely

Required fields for each post:

- `title`
- `description`
- `publishedAt`
- `lang`
- `translationKey`
- `tags`
- `draft`

When the article is ready, set:

```yaml
draft: false
```

## 3) Add images

Recommended location:

- `public/images/blog/<translationKey>/...`

Example:

- `public/images/blog/2026-02-20-my-topic/cover.jpg`

In MDX, reference images by absolute web path:

```md
![Architecture diagram](/images/blog/2026-02-20-my-topic/cover.jpg)
```

Image recommendations:

- width: `1200px` for covers
- format: `webp` or optimized `jpg`
- target size: under `300 KB` when possible
- always provide meaningful alt text

## 4) Local pre-publish checks

Run checks before every deploy:

```bash
npm run build
```

Optional quick run:

```bash
npm run dev
```

Then verify in browser:

- `/blog`
- both article URLs (`-ru` and `-en`)
- locale switch on article page (must jump to paired version)

## 5) Safe deploy flow

Use a small commit with only article/image changes:

```bash
git add src/content/blog public/images/blog
git commit -m "Add RU/EN post: my-topic"
git push origin main
```

GitHub Actions deploy will:

- pull latest code
- rebuild containers
- run healthchecks

## 6) GitHub activity sanity checks

If activity section looks stale, verify locally or on server:

```bash
curl -fsS http://127.0.0.1:4321/api/github/profile.json
curl -fsS http://127.0.0.1:4321/api/github/contributions.json
```

If needed, prewarm cache manually:

```bash
systemctl start portfo-github-prewarm.service
```
