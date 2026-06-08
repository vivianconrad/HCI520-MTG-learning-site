# Testing

## Unit tests (Vitest)

Colocated as `*.test.js` beside source. Default suite excludes Supabase integration:

```bash
npm test
npx vitest run src/lib/scoring.test.js
```

## Supabase integration

Requires `.env.local` with live project credentials and `SUPABASE_DB_URL` for schema sync in CI:

```bash
npm run test:supabase
```

CI applies `supabase/setup.sql` via `scripts/ci-supabase.mjs` before integration tests.

## Database security verification

```bash
npm run verify:db
```

Checks deny-SELECT, deny direct INSERT, RPC behavior, and score rejection. Run after RLS/RPC changes.

## End-to-end (Playwright)

```bash
npm run test:e2e
npm run test:a11y
```

E2E uses dummy Supabase env in CI for flows that do not require live saves.

## Accessibility

```bash
npm run test:a11y
npm run audit:a11y   # scripted audit helper
```

## Pre-commit expectations

Match CI locally when touching routing, session flow, or Supabase:

```bash
npm run lint && npm test && npm run build
```

Optional full gate before merge:

```bash
npm run test:supabase && npm run test:e2e
```
