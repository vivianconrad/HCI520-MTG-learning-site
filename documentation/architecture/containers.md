# C4 — Containers

Deployable units and how they communicate.

```mermaid
flowchart TB
  participant([Participant browser])

  subgraph Pages["GitHub Pages"]
    spa[React SPA<br/>Vite · React 19 · Router]
    wiki[Documentation wiki<br/>VitePress]
    privacy[privacy.md]
  end

  subgraph Supabase["Supabase project"]
    rpc[PostgREST / RPC]
    db[(Postgres<br/>participants)]
  end

  storage[(localStorage<br/>session state)]

  participant --> spa
  participant --> wiki
  spa <--> storage
  spa -->|supabase-js .rpc| rpc
  rpc --> db
```

## React SPA (`docs/` after build)

| Aspect | Detail |
| ------ | ------ |
| **Built by** | `npm run build` → `docs/` |
| **Base path** | `/HCI520-MTG-learning-site/` (`vite.config.js`) |
| **Routing** | Client-side `BrowserRouter` with same basename |
| **Config** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` baked in at build time |

The SPA bundles React screens, the session store, question bank (without keys during tests), and Supabase client calls.

## Browser local storage

`src/store/sessionStorage.js` persists:

- `sessionId`, `sessionSecret`
- Selected questions, answers, progress flags
- Screen time aggregates

Allows refresh recovery without re-drawn questions. `get_participant_progress` RPC reconciles server flags on load.

## Supabase Postgres

| Artifact | Purpose |
| -------- | ------- |
| `participants` | One row per anonymous session |
| `study_privacy_config` | Retention settings (not client-readable) |
| Triggers | `validate_participant_row` (shape, scores, progress ordering) |
| Private functions | `hash_session_secret`, `purge_expired_participants` |

## Documentation wiki

| Aspect | Detail |
| ------ | ------ |
| **Source** | `documentation/` |
| **Built by** | `npm run docs:build` |
| **Deployed to** | `docs/wiki/` (copied after app build in CI) |
| **Base path** | `/HCI520-MTG-learning-site/wiki/` |

## Communication rules

```mermaid
flowchart LR
  subgraph Client
    UI[React screens]
    Store[useSessionStore]
    DBLib[src/lib/db.js]
  end
  subgraph Supabase
    RPC[RPC layer]
    T[Triggers]
    PG[(participants)]
  end

  UI --> Store
  UI --> DBLib
  DBLib -->|rpc only| RPC
  RPC --> PG
  PG --> T
```

Not used in production: `supabase.from('participants').insert()`, `.update()`, or `.select()` for cohort reads.
