# HCI520 MTG Learning Site

Interactive learning site for beginners to learn core **Magic: The Gathering** concepts:

- Card anatomy
- Card types
- Turn structure
- Putting it all together in simple game situations

The app includes a pre-test/post-test flow and lesson-by-lesson progression.

## Tech Stack

- React
- React Router
- Vite
- ESLint

## Local Development

Install dependencies:

```bash
npm install
```

Copy environment variables (not committed):

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase project URL and anon key.

Start the dev server:

```bash
npm run dev
```

Build production files:

```bash
npm run build
```

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

## Project Structure

- `src/screens/` – route-level screens
- `src/components/` – reusable UI components
- `src/store/` – session state and persistence logic
- `src/data/` – question and image mapping data
- `src/assets/` – MTG card images and static assets
- `src/styles/` – shared styling and tokens

## CI/CD and GitHub Pages

GitHub Actions handles verification and deployment. You do not need to commit built files under `docs/` for production deploys.

### Pull requests

Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every PR to `main`:

1. ESLint (`npm run lint`)
2. Unit tests (`npm test`)
3. Supabase integration tests (`npm run test:supabase`)
4. Production build (`npm run build`)

Fix any failing checks before merging.

### Production deploy

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs the same checks on every push to `main`, then publishes the built site to GitHub Pages. You can also trigger it manually from the **Actions** tab (**Run workflow**).

**One-time repo setup**

1. In GitHub **Settings → Secrets and variables → Actions**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. In **Settings → Pages**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).

**Local build (optional)**

`npm run build` still writes to `docs/` for local preview (`npm run preview`) or debugging. CI rebuilds on deploy; committing `docs/` is optional and not required for the live site.

## Participant data (Supabase)

Research data is saved incrementally to the `participants` table. See **[docs/privacy.md](docs/privacy.md)** for purpose, stored fields, retention, Supabase as processor, participant export, and researcher erasure steps.

| When               | What is saved                                         |
| ------------------ | ----------------------------------------------------- |
| Intro screen       | New row with session ID (save code) and question set  |
| Pre-test complete  | Answers and score                                     |
| Lesson complete    | Screen times, lessons completed, scenarios attempted  |
| Post-test complete | Answers, score, completion timestamp                  |

**Setup**

1. **New project:** run **`supabase/setup.sql`** once in the [Supabase SQL editor](https://supabase.com/dashboard). It creates the table, RLS, RPCs, validation triggers, SHA-256 session secrets, and retention config.
2. **Existing project** (already has `participants`):
   - No `session_secret` column → **`supabase/migrations/add-session-secret.sql`**, then re-run **`supabase/setup.sql`**
   - Plaintext `session_secret` at rest → **`supabase/migrations/hash-session-secret.sql`**
   - Retention config missing → **`supabase/migrations/add-retention-policy.sql`**
   - Rows created but saves fail (“stored in this browser only”) → **`supabase/fix-participants-rls.sql`**
   - `verify:db` reports internal RPCs callable by anon → **`supabase/revoke-internal-rpc-execute.sql`**
3. Before your study ends, set **`study_end_date`** in `study_privacy_config` (Table Editor, row `id = 1`).
4. Verify with `npm run verify:db` — it should print `All participant security checks passed.`
5. Copy `.env.example` → `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. For GitHub Pages, the deploy workflow embeds those values at build time via repository secrets (see **CI/CD and GitHub Pages** above).
7. **CI / deploy:** add repository secret **`SUPABASE_DB_URL`** (Supabase → Settings → Database → connection URI). Each CI run applies `supabase/setup.sql` via `npm run apply:db-security` before integration tests so the live project matches the repo (including removal of public `hash_session_secret`).

**Instructor analysis**

- Browser route `/instructor` shows the dashboard UI and attempts to load cohort data. With deny-select RLS (the default from `setup.sql`), browser reads fail. This is expected.
- **Recommended:** use the Supabase **Table Editor** (→ `participants`) to view and export cohort data. The dashboard displays this guidance when RLS blocks reads.
- Do **not** add a permissive anon SELECT policy for browser reads. Participant rows must stay private to the service role / dashboard.

See `docs/evaluation.md` for reporting metrics.

**Deploying session_secret migration**

For existing Supabase projects that already have a `participants` table without `session_secret`:

1. Deploy the updated app (with `session_secret` in `src/lib/db.js` and session storage) **before** running `supabase/migrations/add-session-secret.sql`.
2. After the migration, participants who started a session before the update must reset: clear session storage (or use **Reset session** on the results page) so the app generates a matching `session_secret`.
3. If participant saves return 0 rows updated, run **`supabase/fix-participants-rls.sql`** in the Supabase SQL editor.
4. For server-side score validation, progress rules, and RPCs, run **`supabase/setup.sql`** (or re-run it if already partially applied).

## Security

- The Supabase **anon key** is public by design; row-level security (RLS) protects participant data.
- Participant **updates** use the `update_participant` RPC (security definer), which validates `session_secret` server-side and bypasses deny-SELECT RLS. REST PATCH is not used.
- Run **`supabase/setup.sql`** in production so scores are recomputed from answers, progress flags are validated, and participant rows are created via RPC (not open INSERT).
- Verify production with **`node scripts/verify-participants-db.mjs`** (deny SELECT, deny direct INSERT, RPC + PATCH + score rejection).
- Test questions in the client bundle omit answer keys; keys are loaded only when saving scores or viewing results.
- **Instructor** participant reads are not available from the browser when deny-select RLS is applied.
- Do **not** commit `.env.local` or other files containing secrets.

## Privacy

- Participant-facing copy on the consent screen names Supabase, lists stored fields, and links to the privacy notice.
- **[docs/privacy.md](docs/privacy.md)** — retention, backups, processor details, erasure runbook.
- **`public/privacy.md`** — same notice, copied to the deployed site at `/HCI520-MTG-learning-site/privacy.md`.
- **`participant_id`** mirrors **`session_id`** (same anonymous save code); the client registers both with the same value.

## Notes

- Vite `base` is set for GitHub Pages at:
  - `/HCI520-MTG-learning-site/`
