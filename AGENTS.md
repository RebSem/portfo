# AGENTS.md: portfo

Canonical guide for coding agents (Claude Code, Codex, Cursor, others). `CLAUDE.md`
imports this file. Human-facing overview: [`README.md`](README.md).

## What this is

Source of [rebsem.ru](https://rebsem.ru): the personal site, bilingual (EN/RU) portfolio
and blog of Mikhail Semenov (GitHub `RebSem`), positioned as a Product Manager / AI
Product Manager. Static Astro site, deployed to GitHub Pages on every push to `main`.
Personal project, in production. It is read by recruiters, ATS parsers and LLM
screeners, so content accuracy and the resume files matter as much as the code.

The repository is **public**. Treat every commit as permanent and world-readable.

## Current state

- Default branch: `main` (the only remote branch as of 2026-10-21). Its history was
  rewritten on 2026-10-21 to purge personal data (see History), so every commit SHA
  from before that date changed.
- Version: `package.json` says `0.0.1` and is not bumped; there are no git tags. The
  deployed state is whatever is on `main`.
- Last meaningful activity: 2026-10-07, per-vacancy resume publishing (#59); before
  that 2026-10-06, human/bot classification in analytics (#56) and CV PDF link fix (#57).
- Since 2026-10-18 there is no current employer: the Zvonobot (Prof-IT Group) role
  ended in October 2026 (the position was cut) and the owner is actively looking,
  available to start immediately. `src/data/cv.ts` (`endDate`, `cvAvailability`,
  `cvWorkFormat`) is the source; the availability line under the home
  hero (`HomeHero.astro`), the closing of the home footer, About, the case studies,
  JSON-LD, llms.txt and the OG cards all say the same. Present tense about that role is
  a bug.
- Home page (since 2026-10-27): one-column editorial layout, **no picture in the hero**
  (the owner asked to drop the product screenshot; do not bring it back). Byline, a
  Geist H1 (never the Newsreader serif), standfirst, Telegram + case buttons, an
  "Open to work" pill with the four facts, then the results band (`HomeResults.astro`,
  80 / +30% / 30%) on the first laptop screen. Everything below sits on one label rail
  (`.ed-row` in `global.css`, the same grid as the About rows); the home footer is the
  closing call to action (`SiteFooter closing`). Nothing in the opener starts hidden:
  the only motion is the hairlines drawing in, so the H1 stays the LCP element.
- Content status: 7 published project case studies per locale (`tubedrop` is
  `draft: true`); one published blog post pair (`welcome`), the `tubedrop` post pair is
  a draft. The blog is **unlisted** since 2026-08-18: kept at its URLs, absent from the
  sitemap and navigation. `/cv` and `/ru/cv` are unlisted too (`noindex,follow`).
- Known gaps:
  - `scripts/update-github-stats.mjs` is not referenced by any npm script or workflow.
  - `scripts/webp-shots.mjs` imports `sharp`, which is not a direct dependency (it is
    present in `node_modules` only transitively, via Astro).
  - `docs/workflow.md` describes Linear issue IDs in branch names (`codex/reb-123-...`);
    the 2026 history uses `feat/`, `fix/`, `docs/`, `claude/` branches without IDs.

## Repository map

```
astro.config.mjs        site URL, i18n (en default unprefixed, ru under /ru), self-hosted
                        fonts (top-level `fonts`), /projects -> /#projects redirects,
                        compressHTML and the Vite CSS target (see Gotchas)
src/
  pages/                file routes; ru/ mirrors the root. cv.astro, cv.txt.ts (resume),
                        sitemap.xml.ts, robots.txt.ts, api/github/*.json.ts (build-time JSON)
  layouts/Layout.astro  the single page shell: head, meta, JSON-LD, robots, transitions
  components/           Astro components (HomeHero, CvDocument, FeaturedCase, Analytics, ...)
  content/blog/         MDX posts, RU/EN pairs linked by translationKey
  content/projects/     MDX case studies, one file per locale (<id>-en.mdx / <id>-ru.mdx)
  content.config.ts     glob loaders + zod schemas for both collections (entry.id = slug)
  data/cv.ts            single source of truth for career facts and the resume (RU+EN);
                        its header comment lists the content rules
  data/site-content.ts  site copy; imports from cv.ts, never the other way round
  data/projects.ts      project card metadata (tiers, links, visibility)
  lib/                  pure, unit-tested modules: GitHub fetch+cache, contributions parser,
                        analytics link classification, owner opt-out, visitor signals, cv-text
  scripts/              client-side vanilla modules (analytics, locale/theme, cv, github)
  styles/global.css     tokens and layout; styles/print.css drives the PDF resume
public/
  cv/                   generated resume files (PDF/DOCX/TXT, EN+RU); cv/<slug>/ holds
                        per-vacancy resumes (see scripts/cv/README.md)
  og/                   generated 1200x630 link-preview cards
  projects/             case-study screenshots (PNG sources + WebP at two widths)
  llms.txt, CNAME       hand-maintained llms.txt; CNAME = rebsem.ru
scripts/
  link-check.mjs        internal link check over dist/
  new-post.mjs          creates a RU/EN blog draft pair
  cv/build-exports.ts   regenerates public/cv/* from the built /cv page
  cv/publish-vacancy-cv.mjs  publishes a per-vacancy resume into public/cv/<slug>/
  cv/README.md          CV pipeline docs and hard-won PDF/ATS lessons
  og/build-og.mjs       renders public/og/*.png via headless Chrome
  webp-shots.mjs        converts case-study PNGs to WebP
  update-github-stats.mjs  standalone GitHub cache refresher (not wired anywhere)
tests/                  Vitest suites (node environment, no browser)
docs/                   workflow.md (branch/PR/merge rules), blog-authoring.md
.github/workflows/      ci.yml (PRs + main), deploy.yml (main -> GitHub Pages)
LICENSE / LICENSE-CONTENT / NOTICE   MIT code, all-rights-reserved content, upstream attribution
```

Git-ignored local-only folders you may see in the owner's checkout: `private/`
(personal notes), `private-exports/` and `dist-private/` (resume variants carrying the
phone number), `scripts/cv/_archive/`, `.claude/`. Never commit anything from them.

## Commands

Node 22.22 or newer (`.nvmrc`, `engines`; Astro 7 exits on older Node 22), npm 10. CI and
deploy ask for `node-version: 22` and get the runner's cached 22.x (22.23 in October 2026);
if a runner image ever ships an older 22.x, switch both to `node-version-file: .nvmrc`.

| Task | Command |
|---|---|
| Install | `npm ci` (or `npm install`) |
| Dev server | `npm run dev` → http://localhost:4321 |
| Typecheck | `npm run check` (`astro check`) |
| Unit tests | `npm test` (`vitest run`) |
| Build | `npm run build` → `dist/` |
| Link check | `npm run link-check` (needs `dist/`) |
| Everything CI runs | `npm run validate` (check → build → test → link-check) |
| Preview build | `npm run preview` |
| New blog pair | `npm run new:post -- my-slug --title-ru "Заголовок" --title-en "Title"` |
| Regenerate resume files | `npm run build && npm run cv:export` (needs Google Chrome) |
| Per-vacancy resume | `npm run cv:vacancy -- <source.md> <slug> <FileBaseName>` (needs the owner's job tracker, Chrome, `pdftotext`) |
| OG cards | `npm run og:build` (macOS Chrome path is hard-coded in the script) |
| WebP screenshots | `npm run shots:webp` |

Verified on 2026-10-21 (Node 22.22, npm 10.9): `npm ci`, `npm run validate`
(0 errors/warnings/hints, build OK, 80/80 tests including the `dist/` suites, link
check passed for 27 HTML files). Not run: `cv:export`, `cv:vacancy`, `og:build`,
`shots:webp`, `dev`, `preview`.

## Configuration

All variables are optional; the site builds with none of them. See `.env.example`.

| Variable | Purpose |
|---|---|
| `GITHUB_TOKEN` | Raises GitHub API rate limit at build time (CI passes `github.token`) |
| `GITHUB_CACHE_FILE` | Build-time GitHub response cache, default `.cache/github-cache.json` |
| `PUBLIC_ANALYTICS_KEY` | PostHog project token. Unset = analytics compiled out of the bundle. In CI it comes from the Actions secret of the same name |
| `PUBLIC_ANALYTICS_HOST` | PostHog ingestion host (default and CI value: PostHog EU) |
| `CV_PHONE` | Local-only, set by `cv:export --phone` for the git-ignored ATS variant. **Never set in CI** |
| `JOB_TRACKER_DIR` | `cv:vacancy` only: location of the owner's job tracker (outside this repo) |

Secrets: only `PUBLIC_ANALYTICS_KEY` is stored, as a GitHub Actions secret. Local `.env`
is git-ignored; `.env.example` is the template.

## Deploy & release

- `deploy.yml`: on push to `main` (and manual dispatch) → `npm ci` → `npm run build` →
  `npm run link-check` → upload `dist/` → GitHub Pages, custom domain via `public/CNAME`.
- `ci.yml`: on every pull request and push to `main` → check, build, test, link check.
  The build comes first so the suites that read `dist/` run in CI. `main` requires a PR
  and the `validate` check, admins included.
- No staging environment; a merge to `main` is a production release.
- `rebsem.ru` is a verified Pages domain of the `RebSem` account (TXT
  `_github-pages-challenge-RebSem`), which blocks domain takeover. The domain sends no
  mail: SPF `v=spf1 -all` and DMARC `p=reject` at REG.RU (2026-10-21).
- Repository security: secret scanning with push protection, Dependabot alerts and
  private vulnerability reporting are on. No deploy keys; the only Actions secret is
  `PUBLIC_ANALYTICS_KEY`.
- Until 2026-07-26 the repo also carried a Docker/Apache/systemd self-hosting path; it
  was removed (#46) because the site was on GitHub Pages throughout.

## Conventions

- Commits: Conventional-Commit style, imperative, lower case:
  `feat:`, `fix:`, `docs:`, `content:`, `chore:`, `ci:`, `refactor:`. Squash-merged PRs
  carry the PR number, e.g. `feat: ... (#59)`. Bodies explain the why in prose.
  Agent co-authorship trailers are used.
- Branches: short-lived `feat/…`, `fix/…`, `docs/…`, `claude/…` branches, PR into
  `main`, squash merge, never force-push `main` (see `docs/workflow.md`). The one
  exception was the 2026-10-21 privacy purge (see History).
- Every page exists in both locales: change EN and RU together. English is the
  default (unprefixed), Russian lives under `/ru`.
- No UI framework: Astro components plus small vanilla modules in `src/scripts/`.
  Logic worth testing goes into `src/lib/` without DOM or SDK imports.
- Content: no em dashes in site or resume text (removed site-wide in #36; enforced for
  the resume by `tests/cv.test.ts`).
- Blog posts follow [`docs/blog-authoring.md`](docs/blog-authoring.md): RU/EN pair, one
  `translationKey`, `draft: false` only when both are ready.
- Before a PR: `npm run validate`; for UI or copy changes also check the affected routes
  in a browser, both locales. PR template: `.github/pull_request_template.md`.

## Rules / what must not break

- **No phone number anywhere in the repository or on the public site.** Git history on
  a public repo is permanent. The phone variant of the resume is built only into the
  git-ignored `private-exports/` (and a temporary `dist-private/`). Never write a real
  number into a code comment, a commit message or PR text either: those are public too.
  `tests/repo-hygiene.test.ts` scans every tracked file (text, PDF, DOCX) for
  phone-shaped strings; `tests/cv.test.ts` scans `public/cv/**` and `dist/`.
- **Photos go in without location data.** Strip EXIF before committing a camera
  original; `tests/repo-hygiene.test.ts` fails on GPS tags in any tracked image.
- **Nothing from `private/`, `private-exports/`, `dist-private/`, `scripts/cv/_archive/`
  is ever committed.** No personal strategy notes in the public repo.
- `src/data/cv.ts` is the single source of career facts. Its header comment lists the
  content rules (no absolute money, no "Senior" in titles, no dashes in resume text,
  no unmeasured claims). Changing them needs the owner.
- After a resume content change, regenerate `public/cv/*` with `cv:export` and commit the
  files together with the change. Check PDFs with `pdftotext file.pdf - | head -40`.
- Per-vacancy resumes are the candidate's document: `cv:vacancy` only strips the phone,
  it does not edit the text. Slugs and file names stay ASCII.
- Unlisted pages (`/cv`, `/ru/cv`, `/cv.txt`, the blog) stay out of the sitemap,
  navigation and `llms.txt`; `/cv` keeps `noindex,follow`.
- Analytics stays storage-free and anonymous: `persistence: 'memory'`, no `identify()`,
  no session replay. The only device write is the owner's `?me=1` opt-out flag.
  UI code never imports posthog: it emits `rebsem:signal`, and only names and values
  allow-listed in `src/lib/site-signals.ts` are recorded.
  Visitor classification lives in `src/lib/visitor-signals.ts` and must stay pure.
- `print.css` and the PDF-related comments in it encode ATS lessons (see
  `scripts/cv/README.md`); don't "clean them up".
- Licensing: code MIT, content all rights reserved; keep the upstream attribution in
  `NOTICE`.
- Needs the owner's sign-off: positioning copy, any number on the home page or CV, the
  analytics configuration, the deploy workflow, anything under `public/cv/`.

## History & key decisions

- 2026-02-18: bootstrapped from Astro, based on steipete/steipete.me (see `NOTICE`).
- 2026-02-20 → 02-26: first deploy automation (self-hosted), then GitHub Pages at
  rebsem.ru; MIT code + all-rights-reserved content licensing.
- 2026-03-19: i18n (EN/RU), project case studies (#8); 2026-03-27 live GitHub data at
  build time (#10).
- 2026-05 → 06: repositioned as an AI Product Manager site (#22, #31), flagship work case
  (#29), GEO/SEO audit implemented: structured data, `llms.txt` (#37).
- 2026-07-06: visual/UX audit implemented (#40). 2026-07-19: privacy-minimal PostHog
  analytics (#43).
- 2026-07-26: dead Docker/Apache/systemd path removed, personal notes moved to the
  git-ignored `private/` (#46).
- 2026-08-17: unlisted interactive resume at `/cv`, `src/data/cv.ts` becomes the single
  source of truth (#48). 2026-08-18: site retold as a product manager's, generated OG
  cards, blog unlisted (#50).
- 2026-09-19: owner analytics opt-out via `?me=1` (#54).
- 2026-10-06: human vs automation classification, engagement events, heatmaps (#56);
  resume PDFs no longer link to a local server (#57).
- 2026-10-07: `cv:vacancy` command for per-vacancy resumes under `/cv/<slug>/` (#59).
- 2026-10-18: open to work. The Zvonobot role is dated Feb 2022 - Oct 2026, the resume and
  the site say "available now, no notice period", the home "What I do now" block became
  the "Before you ask" status block (folded into a one-line facts row under the hero on
  2026-10-19, with the home redesign: product shot in the hero, results-first projects,
  results-first case studies with collapsible depth).
- 2026-10-21: privacy purge after an audit of the public repo. The owner's phone number
  sat in a code comment, the CV pipeline README, two commit messages and an old resume
  PDF at the repo root (Feb-Jun 2026); the 2026 hero photo carried GPS EXIF; two personal
  positioning audits were in `docs/`. History was rewritten with `git filter-repo` and
  `main` force-pushed once (old tip `af11c41`). Stale self-hosting secrets and deploy
  keys were deleted, secret scanning turned on, `tests/repo-hygiene.test.ts` added and CI
  reordered to build before testing. Old PR refs and dangling commits on GitHub keep the
  old objects until GitHub Support purges them.
- 2026-10-21: dependencies upgraded to Astro 7.4, `@astrojs/mdx` 8 and Vitest 5 (content
  layer loaders, top-level `fonts`, `compressHTML: true`, a Vite CSS target); `npm audit`
  went from 28 advisories (3 critical) to 0. `posthog-js` stays on 1.404: from 1.423 its
  `respect_dnt` also honours Global Privacy Control and the lazy chunk grows by ~80 KB,
  an analytics change that needs the owner.
- 2026-10-27: home redesign without the hero screenshot (the 2026-10-19 product shot read
  as decoration to recruiters, and the owner preferred the earlier one-column hero). One
  editorial grid; the flagship results moved up from the Zvonobot card into a band
  under the hero; the Zvonobot card became the one tinted lead card; the home ends on
  "Hiring a product manager?" with Telegram and Email buttons and the status line. New
  structural copy: `home.resultsTitle`, `home.resultsContext`, `footer.closingTitle`;
  `heroShotCaption` and `featuredScreenshotAlt` were removed. The dashboard screenshots
  stay in the Zvonobot case study.

## Gotchas

- **Clones made before 2026-10-21 carry the pre-purge history**, phone number included.
  Re-clone (or reset to `origin/main` and delete old branches); never push old branches.
- Without a `dist/`, `npm test` skips the `cv build output` suite; `validate` builds
  first. `npm test` against a stale `dist/` tests stale output: rebuild first when
  checking resume or robots behaviour.
- PDFs are printed from a local preview server; relative links in them would point at
  `127.0.0.1`. Links in the resume must be absolute (a test inflates PDF streams to check).
- Chrome rasterizes `mix-blend-mode` in print (a 9 MB PDF), letter-spacing splits
  headings in the text layer, hyphens vanish at line breaks: details in
  `scripts/cv/README.md`.
- Project and blog slugs carry the locale suffix: `/projects/<id>-en/`,
  `/ru/projects/<id>-ru/`. `/projects` itself has no page and redirects to `/#projects`.
- `og:build` uses the macOS Google Chrome path; it won't run on Linux CI as is. When
  the card text changes, bump `OG_CARD_VERSION` in `Layout.astro` so preview caches
  fetch the new image.
- `cv:vacancy` must pass `DATA_DIR` to the tracker renderer (it does); without it the
  renderer writes into the real tracker `out/`.
- `astro.config.mjs` configures fonts via the top-level `fonts` key (stable since
  Astro 6); Newsreader is a local woff2 on purpose (the Google provider drops the
  optical-size axis).
- Astro 7 specifics in `astro.config.mjs` are load-bearing. `compressHTML: true` keeps
  the spaces between inline elements on separate lines (the 7.x default `'jsx'` glues
  words together in the hero, footer and the `/cv` text that becomes the PDF).
  `vite.build.cssTarget` stops Lightning CSS from dropping `-webkit-backdrop-filter`
  and rewriting `max-width` media queries to range syntax.
- A content collection without a `loader` builds as empty with exit 0 and only a
  warning. `tests/content-validation.test.ts` checks that every published MDX file
  got its page and sitemap entry (runs when `dist/` exists).
- When an AI agent is detected, Astro 7 starts `astro dev` / `astro preview` detached
  (lock file in `.astro/`). Any non-empty `ASTRO_DEV_BACKGROUND`
  (`ASTRO_PREVIEW_BACKGROUND`) keeps it in the foreground. A second dev server in the
  same checkout errors out instead of taking another port; `--ignore-lock` allows it.
- Telegram links use `telegram.me`, not `t.me` (the `t.me` domain was in serverHold
  from 2026-07-13; see #42 and the comment in `src/data/cv.ts`).
- Without `GITHUB_TOKEN` the build uses unauthenticated GitHub API calls (60 req/h) and
  falls back to cached (or stale) data when a request fails; `.cache/` is git-ignored,
  so a fresh clone starts with no cache.

## Where to look next

- [`README.md`](README.md): routes, analytics model, licensing
- [`docs/workflow.md`](docs/workflow.md): branch → PR → merge → deploy
- [`docs/blog-authoring.md`](docs/blog-authoring.md): RU/EN post pairs
- [`scripts/cv/README.md`](scripts/cv/README.md): resume pipeline and its lessons
- `src/data/cv.ts` header, `src/lib/visitor-signals.ts` header: content and analytics rules
