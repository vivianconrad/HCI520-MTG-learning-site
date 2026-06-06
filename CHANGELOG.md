# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) where applicable.

## [Unreleased]

### Added

- Per-session `session_secret` column and RLS policies requiring the `x-session-secret` header for participant updates (`supabase/participants.sql`, `src/lib/db.js`).
- Migration script `supabase/migrations/add-session-secret.sql` for existing deployments adding `session_secret` to an already-created `participants` table.
- Optional `supabase/validate-participant-scores.sql` trigger to enforce pre-test and post-test score bounds.
- Glossary keyword tooltips and inline hints (`KeywordTooltip`, `GlossaryText`, `linkGlossaryTerms`) integrated across lesson content and explainers.
- Content Security Policy and `strict-origin-when-cross-origin` referrer policy in `index.html` and the built `docs/index.html`.
- Results review links that route learners back to the relevant lesson or Lesson 4 scenarios based on topic performance and missed questions (`src/lib/scoring.js`, `src/screens/Results.jsx`).
- Instructor dashboard message when RLS blocks browser reads, directing instructors to the Supabase Table Editor.

### Changed

- Removed optional `VITE_INSTRUCTOR_PASSWORD` from environment configuration; the instructor route no longer uses a client-side password gate.
- Updated `@supabase/supabase-js` and related dependencies.
- Refactored instructor dashboard with clearer cohort summary, CSV export when reads succeed, and explicit RLS-blocked guidance.
- Keyword dictionary panel hidden on pre-test and post-test routes (`src/lib/assessmentRoutes.js`).
- Participant bootstrap and persistence send `session_secret` on insert and update; verification scripts updated accordingly.
- `supabase/instructor-select-policy.sql` is now explicitly a no-op—anon SELECT on `participants` remains denied by design.
- Expanded question bank and keyword dictionary entries; glossary rendering wired through shared components.

### Security

- Row-level security denies anon SELECT on `participants`; cohort data is not readable from the public browser with the anon key.
- Participant updates require a matching per-session secret enforced by RLS.
- Content Security Policy restricts scripts, connections, and framing for the deployed static site.
