# API overview

The browser integrates with Supabase **only through RPC functions** on the `participants` table. Direct table `INSERT`, `UPDATE`, or `SELECT` from the anon role is blocked in production.

**Source of truth:** `supabase/setup.sql`  
**Client wrapper:** `src/lib/db.js`

## Callable by anon (browser)

| RPC | Purpose |
| --- | ------- |
| [`register_participant`](/api/register-participant) | Create session row at intro |
| [`update_participant`](/api/update-participant) | Patch answers, scores, progress |
| [`get_participant_progress`](/api/get-participant-progress) | Read progress flags for current session |

## Not callable by anon

| Function | Role |
| -------- | ---- |
| `compute_test_score` | Used by triggers; revokes anon execute in hardened deploys |
| `validate_participant_row` | Trigger function |
| `private.hash_session_secret` | Internal hashing |
| `private.purge_expired_participants` | Retention job (SQL editor / cron) |

See [Server-side validation](/api/validation).

## Client invocation pattern

```javascript
const { data, error } = await supabase.rpc('update_participant', {
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
  p_patch: { pretest_answers: answers, pretest_score: score },
})
```

`update_participant` returns `boolean`: `true` if exactly one row matched id + secret.

## Authentication model

There is no user login. Authorization is **possession of `(session_id, session_secret)`**:

- `session_id` — shown to participant as save code
- `session_secret` — stored in browser only; hashed in DB via `private.hash_session_secret`

Wrong secret: RPC returns `false` (no row updated).

## Error handling in the app

| Symptom | Likely cause |
| ------- | ------------- |
| `register` unique violation | Session ID collision — app rotates credentials |
| `update` returns false | Wrong secret, missing row, or RPC not deployed |
| Rate limit exception | >200 registrations/hour (project-wide) |
| Score mismatch exception | Client score ≠ server recompute (should not happen if keys align) |

## See also

- [Containers: Supabase boundary](/architecture/containers)
- [Session gating](/architecture/session-flow)
- [Evaluation metrics](/guide/evaluation)
