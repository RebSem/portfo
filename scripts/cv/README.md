# CV generator

Source of truth for the branded CV at `public/cv.pdf`.

- `cv.html` — the CV, styled with the site's design tokens (Geist / Geist Mono / Newsreader via Google Fonts, accent green `#00a06b` on white for print contrast).

## Regenerate the PDF

Requires Google Chrome installed. Fonts load from Google Fonts, so an internet
connection is needed for the first render.

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="public/cv.pdf" \
  "file://$(pwd)/scripts/cv/cv.html"
```

After editing `cv.html`, re-run the command and commit the updated `public/cv.pdf`.
Keep the content in sync with `src/data/site-content.ts` (positioning, metric,
skills, geo) and the resume facts.
