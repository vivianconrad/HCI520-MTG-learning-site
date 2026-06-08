# Agent Instructions

HCI520 MTG learning site — React 19 + Vite + React Router, deployed to GitHub Pages at `/HCI520-MTG-learning-site/`. See `README.md` for setup and `documentation/` (wiki at `/HCI520-MTG-learning-site/wiki/`) for architecture, API, and evaluation docs.

## Package Manager

Use **npm** (`package-lock.json`):

- `npm install` — dependencies
- `npm run dev` — local dev server
- `npm run build` — production build → `docs/`

## File-Scoped Commands

Prefer scoped commands over full-suite runs when validating a change.

| Task | Command |
|------|---------|
| Lint one file | `npx eslint path/to/file.js` |
| Format check one file | `npx prettier --check path/to/file` |
| Unit test one file | `npx vitest run path/to/file.test.js` |
| Supabase integration | `npm run test:supabase` |
| DB security verify | `npm run verify:db` |
| E2E / a11y | `npm run test:e2e` / `npm run test:a11y` |

CI runs lint, unit tests, Supabase tests, build, and Playwright E2E on every PR — see `.github/workflows/ci.yml`.

## Project Layout

| Path | Role |
|------|------|
| `src/screens/` | Route-level screens (lazy-loaded in `App.jsx`) |
| `src/components/` | Reusable UI (not full routes) |
| `src/store/` | Session state (`useSessionStore`, `sessionStorage`) |
| `src/lib/` | DB, scoring, session gates, utilities |
| `src/data/` | Question bank, answer keys, static mappings |
| `supabase/` | SQL setup, migrations, RLS/RPC definitions |

## Key Conventions

- **Routing**: `BrowserRouter` basename `/HCI520-MTG-learning-site/`; match `vite.config.js` `base`
- **Session flow**: 15-step learner path (consent → welcome → intro → pre-test → lessons → post-test → results); gate with `RequireSessionStep` + `src/lib/sessionGate.js`
- **Session state**: `useSessionStore` owns `sessionId`, `sessionSecret`, questions, answers, progress flags; persists to browser storage
- **Supabase writes**: RPC only — `register_participant` (create), `update_participant` (patch), `get_participant_progress` (read flags). Never REST PATCH/INSERT from the client
- **Answer keys**: `src/data/questionAnswerKeys.js` via `src/lib/questionKeys.js` — only for save/results, not during active tests. `questionBank.js` has no keys
- **Scoring**: Server-side on save; client uses `src/lib/scoring.js` and `src/lib/testScore.js` for display/export
- **Secrets**: Copy `.env.example` → `.env.local` locally; never commit `.env.local`. GitHub Actions uses repo secrets for deploy builds
- **Instructor data**: `/instructor` UI exists; cohort reads blocked by deny-SELECT RLS — export via Supabase Table Editor
- **Tests**: Colocate unit tests as `*.test.js` beside source; integration in `test/`
- **Style**: ESLint + Prettier configs are authoritative — do not restate their rules here

## Commit Attribution

Only commit when explicitly asked. AI commits MUST include:

```
Co-Authored-By: <Agent Model Name> <noreply@anthropic.com>
```

Example: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

## Cursor Rules

Focused rules live in `.cursor/rules/`:

- `supabase-security.mdc` — RLS, RPC, session_secret, answer-key handling
- `session-flow.mdc` — progress steps, gating, session store
- `react-structure.mdc` — screens vs components vs store
