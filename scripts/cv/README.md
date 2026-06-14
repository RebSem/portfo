# CV generator

Source of truth for the branded CV.

- `cv.html` — the CV, styled with the site's design tokens (Geist / Geist Mono / Newsreader via Google Fonts, accent green `#00a06b` on white for print contrast).
- `cv.pdf` — the rendered output, kept here on purpose.

> **The CV is not exposed on the site right now.** It lives in this folder (not
> `public/`) so it isn't served at `/cv.pdf`, and nothing on the site links to it.
> To publish it, render into `public/cv.pdf` instead and re-add a contact link.

## Regenerate the PDF

Requires Google Chrome installed. Fonts load from Google Fonts, so an internet
connection is needed for the first render.

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="scripts/cv/cv.pdf" \
  "file://$(pwd)/scripts/cv/cv.html"
```

After editing `cv.html`, re-run the command and commit the updated `cv.pdf`.
Keep the content in sync with `src/data/site-content.ts` (positioning, metric,
skills, geo) and the resume facts.
