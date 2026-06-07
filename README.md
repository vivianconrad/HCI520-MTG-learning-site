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

Current learning path:

1. Welcome
2. Intro
3. Pre-Test
4. Lesson Intro
5. Lesson 1: Card Anatomy
6. Lesson 2: Card Types
7. Lesson 3: Turn Structure
8. Lesson 4: Putting It Together
9. Lesson Complete
10. Post-Test
11. Calculating
12. Results

## Project Structure

- `src/screens/` – route-level screens
- `src/components/` – reusable UI components
- `src/store/` – session state and persistence logic
- `src/data/` – question and image mapping data
- `src/assets/` – MTG card images and static assets
- `src/styles/` – shared styling and tokens

## GitHub Pages Deployment (main/docs)

This project is configured to publish from the `main` branch using the `/docs` folder.

1. Run:
   ```bash
   npm run build
   ```
   This outputs the production site to `docs/`.
2. Commit and push both source changes and updated `docs/`.
3. In GitHub repo settings, confirm:
   - **Pages → Deploy from a branch**
   - **Branch: `main`**
   - **Folder: `/docs`**

## Participant data (Supabase)

Research data is saved incrementally to the `participants` table:

| When               | What is saved                                         |
| ------------------ | ----------------------------------------------------- |
| Intro screen       | New row with session ID, question set, participant ID |
| Pre-test complete  | Answers and score                                     |
| Lesson complete    | Screen times, lessons completed, scenarios attempted  |
| Post-test complete | Answers, score, completion timestamp                  |

**Setup**

1. Run **`supabase/setup.sql`** in the [Supabase SQL editor](https://supabase.com/dashboard) for a new project (table, RLS, RPCs, validation triggers).
2. If participant rows are created but saves fail with “stored in this browser only”, run **`supabase/fix-participants-rls.sql`** (deploys `update_participant` RPC and fixes UPDATE RLS). Same RLS section lives in `supabase/migrations/fix-update-rls-after-security.sql`.
3. Verify with `node scripts/verify-participants-db.mjs` — it should print `All participant security checks passed.`
4. Copy `.env.example` → `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Rebuild (`npm run build`) before deploying so env vars are embedded for GitHub Pages.

**Instructor analysis**

- Browser route `/instructor` shows the dashboard UI and attempts to load cohort data. With deny-select RLS (the default from `setup.sql`), browser reads fail—this is expected.
- **Recommended:** use the Supabase **Table Editor** (→ `participants`) to view and export cohort data. The dashboard displays this guidance when RLS blocks reads.
- Do **not** add a permissive anon SELECT policy for browser reads — participant rows must stay private to the service role / dashboard.

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

## Notes

- Vite `base` is set for GitHub Pages at:
  - `/HCI520-MTG-learning-site/`
