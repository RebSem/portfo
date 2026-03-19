# Linear Project Card: portfo

## Project
- Name: `portfo`
- URL: https://rebsem.ru
- Repository: https://github.com/RebSem/portfo
- Type: Personal portfolio + bilingual blog (RU/EN)
- Stack: Astro 5, TypeScript, MDX, GitHub Actions, GitHub Pages

## Project Summary
Develop and maintain a fast, SEO-friendly personal portfolio and bilingual blog.
Main focus: content quality, stable deploys, good UX (locale/theme), and predictable release process through GitHub + Linear.

## Goals (Q1)
1. Publish and maintain portfolio pages with no broken routes.
2. Keep blog workflow simple: create RU/EN post pairs quickly.
3. Keep CI/CD green and deploy only verified changes.
4. Improve Lighthouse/technical quality for key pages.

## Success Metrics
- CI pass rate: >= 95%
- Failed production deploys: 0
- New post publish lead time: <= 1 day from draft to live
- No broken links on main routes (`/`, `/about`, `/blog`)

## In Scope
- Portfolio pages and blog content
- Localization (RU/EN)
- Theme behavior (light/dark)
- SEO/metadata/sitemap/robots/structured data
- GitHub profile/contributions generated JSON endpoints
- Build, test, deploy pipeline

## Out of Scope
- CMS integration
- Complex backend services
- User authentication

## Risks
- GitHub API rate limits during local build
- Content drift between RU/EN translation pairs
- Regressions in static generation/deploy workflow

## Milestones
1. M1: Workflow baseline
- Stable branch/PR process
- CI rules fixed and documented

2. M2: Content system
- Repeatable post creation flow
- Translation pair checks

3. M3: Quality + SEO polish
- Route validation
- Metadata/schema consistency

## Recommended Labels
- `type:feature`
- `type:bug`
- `type:content`
- `type:chore`
- `area:blog`
- `area:infra`
- `area:seo`
- `area:ui`
- `prio:p0` `prio:p1` `prio:p2`

## Initial Backlog (create as issues)
1. [P1][infra] Document GitHub + Linear flow for this repo
- AC: short guide in `README` or `docs`; includes branch naming, PR flow, merge rules.

2. [P1][infra] Add PR template
- AC: PR template includes checklist (tests, routes checked, screenshots if UI).

3. [P1][infra] Protect `main` branch settings
- AC: require PR, require CI pass, disable force pushes.

4. [P1][blog] Add checklist for RU/EN translation pair completeness
- AC: clear rules for source/target post pairing; no orphan post.

5. [P2][seo] Validate metadata coverage for all key routes
- AC: title/description/OG/structured data present for `/`, `/about`, `/blog`, `/blog/:slug`.

6. [P2][ui] Verify locale toggle persistence and edge cases
- AC: preference persists across reload/navigation; default behavior documented.

7. [P2][ui] Verify theme toggle persistence and no flash issues
- AC: no incorrect theme flash on first paint.

8. [P2][infra] Add periodic link check task
- AC: command/script to detect broken internal links before deploy.

9. [P2][infra] Improve test coverage for content and routes
- AC: tests for route generation and minimal content validation.

10. [P3][content] Define monthly content plan
- AC: list of 4 post ideas with RU/EN intent.

## Suggested Workflow Mapping (already configured)
- Draft PR opened -> In Progress
- PR opened -> In Review
- PR review activity -> In Review
- PR ready for merge -> In Review (or Ready to Merge if added)
- PR merged -> Done

## Issue Template (for Linear issue description)
### Context
What problem are we solving and why now?

### Scope
What is included and what is explicitly excluded?

### Acceptance Criteria
- [ ]
- [ ]
- [ ]

### Verification
How to verify locally and in CI?

### Links
PR / docs / screenshots
