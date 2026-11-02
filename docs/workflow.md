# GitHub + Linear Workflow

This repository uses `Linear -> branch -> PR -> main -> GitHub Pages deploy`.

## 1. Pick the issue in Linear

- move the issue to `In Progress`
- confirm scope and acceptance criteria before coding
- keep one issue per branch where possible

## 2. Create a branch from `main`

Recommended naming:

```bash
git checkout main
git pull origin main
git checkout -b codex/reb-123-short-name
```

Rules:

- use the Linear identifier in the branch name
- keep branch names short and readable
- avoid direct commits to `main`

## 3. Implement and validate locally

Required checks before PR:

```bash
npm run check
npm test
npm run build
npm run link-check
```

If the change touches UI or copy, also verify the affected routes in a browser.

## 4. Open a pull request

PR expectations:

- short summary of what changed and why
- linked Linear issue
- note verification steps
- screenshots for visible UI changes

The repository PR template already includes the required checklist.

## 5. Merge rules

- merge only after CI is green
- prefer squash merge for small focused changes
- keep `main` deployable at all times
- do not force-push `main`

## 6. After merge

- confirm GitHub Pages deploy succeeds
- move the issue to review or done depending on whether manual verification is still needed
- if manual QA is required, leave a short note with the exact routes to check

## 7. Refresh link previews

Telegram, LinkedIn and Facebook (WhatsApp reads Facebook's cache) keep the preview they fetched for a page address. A new `?v=` on the card does not reach a cached address, so after a change to a link-preview card (`npm run og:build`, `OG_CARD_VERSION` in `src/layouts/Layout.astro`) or to a page's title or description, ask each service to fetch the page again. Do this once the Pages deploy from `main` has finished:

1. Telegram: send each address to `@WebpageBot`: `https://rebsem.ru/`, `https://rebsem.ru/ru/`, `https://rebsem.ru/about/`, `https://rebsem.ru/ru/about/`, `https://rebsem.ru/cv/`, `https://rebsem.ru/ru/cv/`, and both Zvonobot case studies, `https://rebsem.ru/projects/zvonobot-ai-en/` and `https://rebsem.ru/ru/projects/zvonobot-ai-ru/`.
2. LinkedIn: run the same addresses through the Post Inspector at `https://www.linkedin.com/post-inspector/` and inspect each one again.
3. Facebook: run the same addresses through the Sharing Debugger at `https://developers.facebook.com/tools/debug/` and choose "Scrape again" for each one.
