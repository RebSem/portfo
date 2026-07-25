# CV generator

Source of truth for the branded CV, in both locales.

| File | What |
|---|---|
| `cv.html` | English CV, styled with the site's design tokens (Geist / Geist Mono / Newsreader, accent green `#00a06b` on white for print contrast) |
| `cv-ru.html` | Russian CV, same styling |
| `Mikhail_Semenov_AI_PM_EN.pdf` | Rendered English output |
| `Mikhail_Semenov_AI_PM_RU.pdf` | Rendered Russian output |

The PDFs are named for the reader, not the repo: the filename is what a recruiter
sees in their downloads folder after saving it from an email.

> **The CV is not served from the site.** It lives here rather than in `public/`,
> so there is no `/cv.pdf` route and nothing links to it. To publish it, render
> into `public/` instead and link it from the hero and the contact block — the
> analytics handler in `src/scripts/analytics.ts` already emits `cv:pdf_download`
> for any `.pdf` path, so no code change is needed.

## Regenerate

Requires Google Chrome. Fonts load from Google Fonts, so the first render needs
a network connection.

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="scripts/cv/Mikhail_Semenov_AI_PM_EN.pdf" \
  "file://$(pwd)/scripts/cv/cv.html"
```

Swap `cv.html` / `_EN.pdf` for `cv-ru.html` / `_RU.pdf` to render the Russian one.

After editing either HTML file, re-render and commit both it and the PDF. Keep the
content in sync with `src/data/site-content.ts` — positioning, the headline metric,
skills and geo signals all appear in both places.

`_archive/` holds superseded drafts and render previews. It is gitignored.
