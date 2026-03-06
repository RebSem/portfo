# Blog Authoring Guide

The blog is published in paired RU/EN posts. Each pair must share one `translationKey`.

## 1. Create a paired draft

Use the generator so both languages start from the same structure:

```bash
npm run new:post -- my-topic --title-ru "Заголовок" --title-en "Title"
```

Generated files:

- `src/content/blog/YYYY-MM-DD-my-topic-ru.mdx`
- `src/content/blog/YYYY-MM-DD-my-topic-en.mdx`

## 2. Fill frontmatter

Required fields for each language version:

- `title`
- `description`
- `publishedAt`
- `lang`
- `translationKey`
- `tags`
- `draft`

Optional fields:

- `updatedAt`
- `cover`

Only switch to `draft: false` when both RU and EN versions are ready.

## 3. Translation-pair checklist

Before publish, verify all of the following:

- both files share the same `translationKey`
- both files use the same `publishedAt` date
- RU version has `lang: ru`
- EN version has `lang: en`
- titles and descriptions are present in both files
- both posts have matching intent, not different topics under one key
- locale switch on the post page opens the paired article, not `/blog`

## 4. Images and assets

Recommended location:

- `public/images/blog/<translationKey>/...`

Example:

```md
![Architecture diagram](/images/blog/welcome-2026-02-19/cover.jpg)
```

Recommendations:

- cover width around `1200px`
- `webp` or optimized `jpg`
- keep cover images under `300 KB` when possible
- always include meaningful alt text

## 5. Local validation

Run the full local validation path before opening a PR:

```bash
npm run validate
```

If you only changed content and want a faster pass:

```bash
npm run build
npm run link-check
```

Manual browser checks:

- `/blog`
- both article URLs
- locale switch on article page
- metadata preview in built HTML if the post has a custom cover

## 6. Safe GitHub + Linear flow

Use the standard repo workflow from [`docs/workflow.md`](./workflow.md):

1. Create a branch from `main`
2. Reference the Linear issue in the branch or commit
3. Open a PR
4. Wait for CI to pass
5. Merge to `main`

GitHub Pages deploy runs after merge to `main`.
