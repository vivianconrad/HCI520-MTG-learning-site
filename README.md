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

After the post-test, results are sent to Supabase (`learning_sessions`). Instructors use:

- **Dashboard:** `https://<your-username>.github.io/HCI520-MTG-learning-site/instructor`
- **SQL setup:** run `supabase/schema.sql` once in the Supabase SQL editor
- **Metrics guide:** `docs/evaluation.md`

Rebuild and redeploy after changing `.env.local` so GitHub Pages includes the Supabase keys.

## Notes

- Vite `base` is set for GitHub Pages at:
  - `/HCI520-MTG-learning-site/`
