# HCI520 MTG Learning Site

Interactive learning site for beginners to learn core **Magic: The Gathering** concepts:

- Card anatomy
- Card types
- Turn structure
- Putting it all together in simple game situations

The app includes a pre-test/post-test flow and lesson-by-lesson progression.

## Tech Stack

- React 19, React Router, Vite
- Supabase (Postgres + RPC; no custom backend)
- Vitest (unit), Playwright (E2E / a11y)
- ESLint, Prettier
- VitePress (documentation wiki in `documentation/`)

## Local Development

Install dependencies:

```bash
npm install
```

Copy environment variables (not committed). On Windows PowerShell: `copy .env.example .env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase project URL and anon key (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

Start the dev server:

```bash
npm run dev
```

Build production files (output → `docs/`):

```bash
npm run build
npm run preview   # serve docs/ locally
```

## Testing

| Command | Purpose |
| ------- | ------- |
| `npm test` | Unit tests (Vitest) |
| `npm run test:supabase` | Supabase RPC integration (`test/supabase.integration.test.mjs`) |
| `npm run test:e2e` | Playwright E2E |
| `npm run test:a11y` | Playwright accessibility suite |
| `npm run verify:db` | Production DB security checks (`scripts/verify-participants-db.mjs`) |

CI runs these on every PR. See [CI/CD and GitHub Pages](#cicd-and-github-pages) below.

## App Flow

Current learning path (15 progress steps; routes in parentheses):

1. Consent (`/`)
2. Welcome (`/welcome`)
3. Intro (`/intro`)
4. Pre-Test (`/pretest`)
5. Pre-Test Complete (`/pretest-complete`)
6. Lesson Intro, curiosity focus (`/lesson/intro`)
7. What Is MTG? (`/what-is-mtg`)
8. Lesson 1: Card Anatomy (`/lesson/1`)
9. Lesson 2: Card Types (`/lesson/2`)
10. Lesson 3: Turn Structure (`/lesson/3`)
11. Lesson 4: Putting It Together (`/lesson/4`)
12. Lesson Complete (`/lesson/complete`)
13. Post-Test Prep (`/posttest-prep`), optional bridge before the post-test
14. Post-Test (`/posttest`)
15. Calculating (`/calculating`) → Results (`/results`)

Instructor dashboard: `/instructor`

## Documentation wiki

The wiki source is in `documentation/` (VitePress). On `main`, it is published at:

https://vivianconrad.github.io/HCI520-MTG-learning-site/wiki/

| Command | Purpose |
| ------- | ------- |
| `npm run docs:dev` | Local wiki dev server |
| `npm run docs:build` | Production wiki build → `documentation/.vitepress/dist/` |
| `npm run docs:preview` | Preview wiki production build |

See [getting started](documentation/guide/getting-started.md), [architecture](documentation/architecture/index.md), [Supabase RPC API](documentation/api/index.md), and [evaluation & reporting](documentation/guide/evaluation.md).

## Project Structure

- `src/screens/` – route-level screens (lazy-loaded in `App.jsx`)
- `src/components/` – reusable UI components
- `src/store/` – session state and browser persistence (`useSessionStore`)
- `src/lib/` – DB, scoring, session gates (no JSX)
- `src/data/` – question bank, answer keys, image mappings
- `src/assets/` – MTG card images and static assets
- `src/styles/` – shared styling and tokens
- `supabase/` – SQL setup, migrations, RLS, RPC definitions
- `test/` – Supabase integration tests
- `e2e/` – Playwright specs
- `documentation/` – VitePress wiki source (architecture, API, guides)

## CI/CD and GitHub Pages

GitHub Actions runs checks and deploys the site. You do not need to commit `docs/` for production deploys.

### Pull requests

Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every PR to `main`:

#### Job `verify`

1. ESLint (`npm run lint`)
2. Unit tests (`npm test`)
3. Supabase sync and integration tests (`scripts/ci-supabase.mjs`, then `apply:db-security` and `test:supabase`)
4. App build (`npm run build`)
5. Wiki build (`npm run docs:build`)

#### Job `e2e` (runs after `verify` passes)

6. Playwright E2E (`npm run test:e2e`)

Fix any failing checks before merging.

### Production deploy

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main` (or when you choose **Run workflow** in Actions). The `build` job runs the same lint, unit, Supabase, app, and wiki steps as CI, then:

1. Copies the wiki into `docs/wiki/`
2. Runs Playwright E2E (`npm run test:e2e`)
3. Uploads `docs/` (app at site root, wiki under `/wiki/`)

The `deploy` job publishes the artifact to GitHub Pages.

Live URLs after deploy:

- App: `https://vivianconrad.github.io/HCI520-MTG-learning-site/`
- Wiki: `https://vivianconrad.github.io/HCI520-MTG-learning-site/wiki/`

#### One-time repo setup

1. In GitHub **Settings → Secrets and variables → Actions**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_DB_URL` (Postgres URI from Supabase → Settings → Database; CI uses it to apply `supabase/setup.sql` before integration tests)
2. In **Settings → Pages**, set **Source** to **GitHub Actions**, not “Deploy from a branch”.

#### Local build (optional)

`npm run build` writes the app to `docs/`. For a full local Pages layout including the wiki, also run `npm run docs:build` and copy `documentation/.vitepress/dist/*` into `docs/wiki/`, then `npm run preview`. CI rebuilds everything on deploy; committing `docs/` is optional.

## Participant data (Supabase)

Research data is saved incrementally to the `participants` table. The [privacy notice](documentation/guide/privacy.md) in the wiki covers purpose, stored fields, retention, Supabase as processor, export, and erasure. Participant-facing copy is in [`public/privacy.md`](public/privacy.md) (live at `/HCI520-MTG-learning-site/privacy.md`).

| When               | What is saved                                         |
| ------------------ | ----------------------------------------------------- |
| Intro screen       | New row with session ID (save code) and question set  |
| Pre-test complete  | Answers and score                                     |
| Lesson complete    | Screen times, lessons completed, scenarios attempted  |
| Post-test complete | Answers, score, completion timestamp                  |

#### Setup

1. New project: run `supabase/setup.sql` once in the [Supabase SQL editor](https://supabase.com/dashboard). It creates the table, RLS, RPCs, validation triggers, SHA-256 session secrets, and retention config.
2. Existing project (already has `participants`):
   - No `session_secret` column: `supabase/migrations/add-session-secret.sql`, then re-run `supabase/setup.sql`
   - Plaintext `session_secret` at rest: `supabase/migrations/hash-session-secret.sql`
   - Retention config missing: `supabase/migrations/add-retention-policy.sql`
   - Rows created but saves fail (“stored in this browser only”): `supabase/fix-participants-rls.sql`
   - `verify:db` reports internal RPCs callable by anon: `supabase/revoke-internal-rpc-execute.sql`
3. Before your study ends, set `study_end_date` in `study_privacy_config` (Table Editor, row `id = 1`).
4. Verify with `npm run verify:db`. It should print `All participant security checks passed.`
5. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. For GitHub Pages, the deploy workflow embeds those `VITE_*` values at build time via repository secrets (see [CI/CD and GitHub Pages](#cicd-and-github-pages) above).
7. For CI Supabase tests, add repository secret `SUPABASE_DB_URL` (see one-time repo setup). Each CI run applies `supabase/setup.sql` via `npm run apply:db-security` before integration tests so the live project matches the repo.

#### Instructor analysis

- Route `/instructor` shows the dashboard UI and tries to load cohort data. With deny-select RLS (the default from `setup.sql`), browser reads fail. That is normal.
- Use the Supabase Table Editor (`participants`) to view and export cohort data. The dashboard says the same when RLS blocks reads.
- Do not add a permissive anon SELECT policy for browser reads. Participant rows stay private to the service role.

See [evaluation & reporting](documentation/guide/evaluation.md) for reporting metrics.

#### Deploying `session_secret` migration

For existing Supabase projects that already have a `participants` table without `session_secret`:

1. Deploy the updated app (with `session_secret` in `src/lib/db.js` and session storage) before running `supabase/migrations/add-session-secret.sql`.
2. After the migration, participants who started before the update must reset: clear session storage or use **Reset session** on the results page so the app generates a matching `session_secret`.
3. If participant saves return 0 rows updated, run `supabase/fix-participants-rls.sql` in the Supabase SQL editor.
4. For server-side score validation, progress rules, and RPCs, run `supabase/setup.sql` (or re-run it if already partially applied).

## Security

- The Supabase **anon key** is public by design; row-level security (RLS) protects participant data.
- Participant **updates** use the `update_participant` RPC (security definer), which validates `session_secret` server-side and bypasses deny-SELECT RLS. REST PATCH is not used.
- Run `supabase/setup.sql` in production so scores are recomputed from answers, progress flags are validated, and participant rows are created via RPC (not open INSERT).
- Verify production with `node scripts/verify-participants-db.mjs` (deny SELECT, deny direct INSERT, RPC + PATCH + score rejection).
- Test questions in the client bundle omit answer keys; keys are loaded only when saving scores or viewing results.
- **Instructor** participant reads are not available from the browser when deny-select RLS is applied.
- Do **not** commit `.env.local` or other files containing secrets.

## Privacy

- Participant-facing copy on the consent screen names Supabase, lists stored fields, and links to the privacy notice.
- `public/privacy.md` is the canonical participant notice, deployed at `/HCI520-MTG-learning-site/privacy.md`.
- [Wiki privacy guide](documentation/guide/privacy.md) is the contributor summary (retention, erasure runbook, links to `public/privacy.md`).
- **`participant_id`** mirrors **`session_id`** (same anonymous save code); the client registers both with the same value.

## Notes

- Vite `base` is set for GitHub Pages at:
  - `/HCI520-MTG-learning-site/`
