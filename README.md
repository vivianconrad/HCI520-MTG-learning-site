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

Edit `.env.local` with your Supabase project URL and anon key. Optional: set `VITE_INSTRUCTOR_PASSWORD` for the `/instructor` dashboard gate.

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

| When | What is saved |
|------|----------------|
| Intro screen | New row with session ID, question set, participant ID |
| Pre-test complete | Answers and score |
| Lesson complete | Screen times, lessons completed, scenarios attempted |
| Post-test complete | Answers, score, completion timestamp |

**Setup**

1. Run `supabase/participants.sql` in the [Supabase SQL editor](https://supabase.com/dashboard). If rows insert but later columns stay null, also run `supabase/fix-participants-rls.sql` (anon `UPDATE` was blocked).
2. Verify with `node scripts/verify-participants-db.mjs` — it should print `OK: anon INSERT + UPDATE works`.
3. Copy `.env.example` → `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Rebuild (`npm run build`) before deploying so env vars are embedded for GitHub Pages.

**Instructor analysis**

- Browser dashboard: `/instructor` (optional; run `supabase/instructor-select-policy.sql` because default RLS blocks reads)
- Or use the Supabase **Table Editor** (recommended with deny-select policy)

See `docs/evaluation.md` for reporting metrics.

## Security

- The Supabase **anon key** is public by design; row-level security (RLS) protects participant data.
- Participant **updates** require a per-session `session_secret` header enforced by RLS.
- **Instructor** participant reads are not available from the browser when deny-select RLS is applied.
- Do **not** commit `.env.local` or other files containing secrets.

## Notes

- Vite `base` is set for GitHub Pages at:
  - `/HCI520-MTG-learning-site/`
