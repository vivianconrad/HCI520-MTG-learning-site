# Development workflow

## Daily commands

| Task | Command |
| ---- | ------- |
| Dev server | `npm run dev` |
| Production build (app → `docs/`) | `npm run build` |
| Preview production build | `npm run preview` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Wiki dev server | `npm run docs:dev` |
| Wiki production build | `npm run docs:build` |

Prefer **scoped** commands when validating a single change:

```bash
npx eslint src/screens/CardAnatomy.jsx
npx prettier --check src/screens/CardAnatomy.jsx
npx vitest run src/lib/scoring.test.js
```

## Adding a learner screen

1. Create `src/screens/YourScreen.jsx` (accept `session` prop from `useSessionStore`).
2. Lazy-import in `App.jsx` and register a `<Route>`.
3. Wrap with `GuardedRoute` / `RequireSessionStep` using the correct `require` array from `sessionGate.js`.
4. Call `recordScreenEnter` / `recordScreenExit` if the screen is timed.
5. Update README learner path if the route is new (rare).

## Saving participant data

Use helpers in `src/lib/db.js` — they all route through `update_participant`:

| Milestone | Function |
| --------- | -------- |
| Intro (row create) | `createParticipantRow` → `register_participant` |
| Pre-test submit | `savePretest` |
| Lesson complete | `saveLessonComplete` |
| Post-test submit | `savePosttest` |
| Screen times | `saveScreenTime` |
| Curiosity choice | `saveCuriosityFocus` |

Every save needs `sessionId` and `sessionSecret` from the session store.

## Question bank changes

- **Prompts/options**: `src/data/questionBank.js` (no answer keys in this file).
- **Keys**: `src/data/questionAnswerKeys.js` — keep in sync when adding or reordering options.
- **Sampling**: `pickQuestions()` draws 2 random items per topic (`LO0`–`LO4`) in `useSessionStore.js`.

Server validation requires exactly **10** questions with `id` and `correctIndex` on registration.

## Supabase changes

1. Edit `supabase/setup.sql` (source of truth for fresh deploys).
2. Add a focused migration under `supabase/migrations/` for existing projects.
3. Run `npm run verify:db` against your project.
4. Update [API docs](/api/) if RPC signatures or patch keys change.

## Pull request checklist

CI (`.github/workflows/ci.yml`) runs lint, unit tests, Supabase integration tests, and build on every PR. Deploy workflow also runs E2E.

Before opening a PR:

- [ ] Lint and relevant unit tests pass
- [ ] No answer keys imported into pre/post test UI
- [ ] Session gates still match the learner path
- [ ] Wiki builds: `npm run docs:build` (if you changed `documentation/`)
