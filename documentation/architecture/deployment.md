# Deployment

## GitHub Pages layout

After deploy to `main`, two static sites share one origin:

| Path | Content |
| ---- | ------- |
| `/HCI520-MTG-learning-site/` | React study app (`npm run build` → `docs/`) |
| `/HCI520-MTG-learning-site/wiki/` | VitePress wiki (`npm run docs:build` → copied to `docs/wiki/`) |
| `/HCI520-MTG-learning-site/privacy.md` | From `public/privacy.md` |

## CI pipeline (pull requests)

`.github/workflows/ci.yml`:

1. `npm run lint`
2. `npm test`
3. Supabase sync + `npm run test:supabase`
4. `npm run build` (app)
5. `npm run docs:build` (wiki)

E2E runs in a dependent job (rebuilds app locally; wiki build is validated in the `verify` job).

## Deploy pipeline (`main`)

`.github/workflows/deploy.yml`:

1. Same verification as CI
2. `npm run build` (overwrites `docs/` with the app bundle)
3. `npm run docs:build` + copy to `docs/wiki/`
4. Upload `docs/` as Pages artifact

### Required GitHub secrets

| Secret | Used for |
| ------ | -------- |
| `VITE_SUPABASE_URL` | Build-time Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Build-time anon key |
| `SUPABASE_DB_URL` | CI schema sync + integration tests |

### One-time Pages setup

**Settings → Pages → Source:** GitHub Actions (not “Deploy from branch”).

## Local production preview

```bash
npm run build
npm run docs:build
# Copy wiki into docs/wiki/ manually on Windows:
# New-Item -ItemType Directory -Force docs/wiki | Out-Null; Copy-Item -Recurse documentation/.vitepress/dist/* docs/wiki/
npm run preview
```

Or run wiki alone: `npm run docs:dev`.

## Vite `base` path

`vite.config.js` sets `base: '/HCI520-MTG-learning-site/'`. All asset URLs and `BrowserRouter` basename must stay aligned.

## Database deployment

SQL is **not** auto-deployed to production on every app deploy unless CI `apply:db-security` runs in your workflow. Researchers apply `supabase/setup.sql` and migrations manually in the Supabase SQL editor for schema changes.

Verify after SQL changes:

```bash
npm run verify:db
```

## Build output and git

`docs/` is build output. CI rebuilds on deploy; committing `docs/` is optional. Wiki source of truth is `documentation/`.
