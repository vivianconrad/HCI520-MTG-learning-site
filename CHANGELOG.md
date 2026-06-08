# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) where applicable.

## [Unreleased]

### Added

- VitePress documentation wiki in `documentation/` (architecture, Supabase RPC API, contributor guides), published at `/HCI520-MTG-learning-site/wiki/`.
- npm scripts `docs:dev`, `docs:build`, and `docs:preview`; `vitepress` dev dependency.
- Lesson navigation feedback: Card Types and Turn Structure pulse-highlight items still required before Continue when the gate is blocked (`f52478c`).
- Glossary entry for **Legendary** and expanded Card Types copy on legendary vs. non-legendary creatures and the legend rule (`814bca9`).
- Design tokens `--color-text-secondary`, `--color-disabled-text`, and `--touch-target-min` (44px) for accessible secondary copy and controls (`7402b78`).
- Global disabled-button styling in `a11y.css` using explicit colors instead of lowered opacity (preserves contrast on parchment).
- Mobile layout pass: safe-area padding, top-aligned lesson frames, full-width action buttons, horizontal phase timeline with scroll-snap, and larger card-anatomy callout markers (`7402b78`).
- Playwright E2E coverage for keyword tooltips: tap-to-pin on mobile, hover on desktop, and viewport clamping (`e2e/keyword-tooltip.spec.cjs`).
- Desktop Firefox project in Playwright config for cross-browser checks.

### Changed

- CI and deploy workflows build the wiki and copy output to `docs/wiki/` on GitHub Pages.
- README, AGENTS.md, and instructor dashboard reference wiki paths instead of `docs/evaluation.md`; README privacy links point at `documentation/guide/privacy.md` and `public/privacy.md`.
- Lesson intro lists the “What Is Magic?” overview with time estimate and preview image.
- Card Types, Turn Structure, and Putting It Together add clearer progress hints (optional practice scenarios, “See Cards” gate copy).
- Lesson Complete separates the completion headline from the flavor tagline.
- Terminology and explanations aligned to American English spelling and clearer stack/cast wording across glossary, question bank, and explainers (`814bca9`).
- Secondary text on lesson screens (breadcrumbs, hints, progress) uses `--color-text-secondary` instead of `--color-gold-on-parchment` for WCAG contrast on parchment.
- Pre-test, Results, Calculating, Instructor Dashboard, and Stack Explainer styles updated for small screens and readability.
- Rebuilt `docs/` GitHub Pages bundle after source changes (`7402b78`).
- E2E walkthrough script defaults: pre-test target 5 / post-test target 9 correct (override with `PRETEST_TARGET` / `POSTTEST_TARGET` env vars).
- Keyword tooltips use fixed viewport positioning with scroll/resize tracking so definitions stay on screen near page edges; hover handlers moved to the trigger button for cleaner touch behavior. Keyboard focus always opens the tooltip; mouse hover remains gated to fine-pointer devices.

### Removed

- `scripts/diag-supabase-connect.mjs` (one-off Supabase connectivity diagnostic).

## [1.2.0] - 2026-06-06

Security hardening, glossary tooling, session-save recovery, and instructor UX aligned with Supabase RLS.

### Added

- `CHANGELOG.md` and README guidance for `session_secret` migration deploy order.
- `src/lib/sessionErrors.js` with user-facing messages when participant updates are blocked.
- Post-bootstrap PATCH verification in `createParticipantRow` so mismatched `session_secret` values fail fast.
- Inline save warnings on pre-test, post-test, and lesson-complete screens when server persistence is blocked.
- `KeywordInlineHint` and `src/lib/assessmentRoutes.js` to hide the keyword dictionary on assessment routes.
- Narrower MTG-specific Cast patterns and global longest-match overlap resolution in `linkGlossaryTerms.js`.
- Keyword tooltip Escape-to-close, placement improvements, and selectable definition text when open.
- Instructor dashboard opt-in cohort load (“Try loading cohort data”) with static Table Editor guidance by default.
- Vite production code-splitting for route chunks and vendor bundles (`vite.config.js`).
- Deployment comments and optional incomplete-row cleanup notes in `supabase/migrations/add-session-secret.sql`.

### Changed

- `GlossaryText` respects an `enabled` prop; glossary styles updated across lesson and dictionary components.
- `useParticipantBootstrap` surfaces recovery guidance when bootstrap verification fails.
- `useSessionStore` legacy `scenariosAttempted` count migrates to deduplicated `scenarioIdsAttempted`.
- Lesson intro copy clarifies gold terms and the Keyword guide (`4042b46`).
- Rebuilt `docs/` assets for code-split bundles.

### Security

- Per-session `session_secret` on participant insert/update with RLS enforcing `x-session-secret` (`5c77dcd`).
- Removed `VITE_INSTRUCTOR_PASSWORD`; `supabase/instructor-select-policy.sql` documented as intentional no-op.
- Content Security Policy and `strict-origin-when-cross-origin` referrer policy in `index.html` / `docs/index.html`.
- Anon SELECT denied on `participants`; instructor cohort review via Supabase Table Editor.

## [1.1.0] - 2026-06-05

Content expansion, assessment UX, deployment automation, and asset optimization.

### Added

- GitHub Actions workflow for automated GitHub Pages deployment (`8cb47ae`).
- Tap symbol image (WEBP) and styling in `TapExplainer` (`0fce390`, `4e796d2`).
- Divination card type; Welcome screen opening image (`286e0af`).
- Question card image layouts and expanded question bank entries (`e531d2c`).
- Google Fonts (Cinzel, Inter) and additional card assets (`60853f6`).
- Gameplay explanation updates across explainers (priority, casting, scenarios) (`f8780c8`, `29ed81a`).

### Changed

- Instructor dashboard script references and cohort UI assets (`7549ebe`).
- GitHub Pages rebuild with public registry lockfile (`af8c51e`).
- ImgBot image optimization (~2% size reduction across card assets) (`7bb4856`).

## [1.0.0] - 2026-05-31

Initial HCI520 learning site: lesson flow, assessments, Supabase participant tracking, and UI redesign.

### Added

- React + Vite app with full lesson path (intro → pre-test → four lessons → post-test → results).
- Card Anatomy, Card Types, Turn Structure, and Putting It Together lesson screens.
- Pre-test / post-test flows, results summary, and session ID copy/export.
- Supabase `participants` table with incremental saves and participant row upsert (`5e60e8d`).
- Scenario practice pool in Lesson 4; session state persisted in `sessionStorage`.
- Keyword dictionary panel, card anatomy tooltips, and progress dots.
- Instructor dashboard with cohort summary and CSV export (browser reads subject to RLS).
- Favicon, icons, and GitHub Pages `docs/` deployment scaffold.
- Confirmation dialogs for navigation away from in-progress tests (`23db97a`).

### Changed

- UI redesign with improved accessibility, contrast, and typography (`ba10d99`, `54afcf5`, `47cb17b`).
- Card Types page: larger thumbnails, Instant highlight, clickable examples (`df2aaac`, `29c722a`).
- Power/Toughness markers moved to bottom-right on anatomy callouts (`f4f7217`).
- `CopySessionId` uses themeable CSS custom properties (`f3013ad`).

### Fixed

- Missing design tokens and stray UI arrows from review pass (`d27e34d`).
- Document title clarity (`38df3d5`).

[Unreleased]: https://github.com/vivianconrad/HCI520-MTG-learning-site/compare/2bd133d...HEAD
[1.2.0]: https://github.com/vivianconrad/HCI520-MTG-learning-site/compare/8cb47ae...2bd133d
[1.1.0]: https://github.com/vivianconrad/HCI520-MTG-learning-site/compare/5e60e8d...8cb47ae
[1.0.0]: https://github.com/vivianconrad/HCI520-MTG-learning-site/compare/57d6ec7...5e60e8d
