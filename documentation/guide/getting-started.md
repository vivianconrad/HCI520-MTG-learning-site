# Getting started

Welcome to the HCI520 MTG learning site, a React study instrument for teaching core Magic: The Gathering concepts and measuring pre/post learning gain.

This guide goes beyond [AGENTS.md](https://github.com/vivianconrad/HCI520-MTG-learning-site/blob/main/AGENTS.md) with onboarding context for human contributors.

## Prerequisites

- **Node.js 20** (matches CI)
- **npm** (lockfile: `package-lock.json`)
- A **Supabase** project for participant data (optional for UI-only work; required for save flows and integration tests)

## First-time setup

```bash
git clone https://github.com/vivianconrad/HCI520-MTG-learning-site.git
cd HCI520-MTG-learning-site
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run the app:

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173/HCI520-MTG-learning-site/`). The app uses a GitHub Pages `base` path locally as well.

Run the documentation wiki locally:

```bash
npm run docs:dev
```

## What you are working on

| Layer | Location | Responsibility |
| ----- | -------- | -------------- |
| Screens (routes) | `src/screens/` | One page per learner step; lazy-loaded in `App.jsx` |
| Components | `src/components/` | Reusable UI (frames, quizzes, nav) |
| Session state | `src/store/` | `useSessionStore`, browser persistence |
| Pure logic | `src/lib/` | DB, scoring, session gates (no JSX) |
| Static data | `src/data/` | Question bank, answer keys, image maps |
| Database | `supabase/` | SQL setup, RLS, RPC definitions |

## Learner path (15 steps)

The instrument is linear with server-backed progress. See [Session gating](/architecture/session-flow) for gate rules.

1. Consent → Welcome → Intro
2. Pre-test → Pre-test complete
3. Lesson intro → What Is MTG → Lessons 1–4 → Lesson complete
4. Post-test prep → Post-test → Calculating → Results

`/instructor` is outside the gated learner flow.

## Key conventions

- Routing: `BrowserRouter` basename `/HCI520-MTG-learning-site/` must match `vite.config.js` `base`.
- Supabase writes: RPC only (`register_participant`, `update_participant`, `get_participant_progress`). Do not REST `INSERT` or `PATCH` on `participants` from the client.
- Answer keys: `questionAnswerKeys.js` loads only for save and results, not during active tests.
- Commits: Do not commit `.env.local`. `npm run build` writes app output to `docs/`; CI deploys that folder.

## Where to read next

- [Development workflow](/guide/development): day-to-day commands and change patterns
- [Testing](/guide/testing): unit, Supabase, E2E, a11y
- [Architecture overview](/architecture/): C4 diagrams and data flow
- [API reference](/api/): RPC contracts

## Design system

UI tokens and layout patterns: `design-system/MASTER.md`. Page-specific notes: `design-system/pages/`.

## Getting help

- Save failures (“stored in this browser only”): re-run `supabase/setup.sql`; check `session_secret` migration order in README.
- DB security: `npm run verify:db`
- Session stuck or wrong step: check `src/lib/sessionGate.js` and persisted storage in DevTools (Application → Local Storage).
