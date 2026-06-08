# update_participant

Patches an existing participant row. Replaces REST `PATCH` (which fails under deny-select RLS because PostgreSQL requires row visibility for UPDATE).

## Signature

```sql
update_participant(
  p_session_id     text,
  p_session_secret text,
  p_patch          jsonb
) returns boolean
```

## Grants

- `EXECUTE` for `anon`, `authenticated`
- `SECURITY DEFINER`

## Parameters

| Parameter | Description |
| --------- | ----------- |
| `p_session_id` | Session save code |
| `p_session_secret` | Plaintext secret (hashed and compared server-side) |
| `p_patch` | JSON object with **only keys to change** |

Returns `false` when id/secret/patch invalid or no row updated. Returns `true` when one row updated.

## Allowed patch keys

| Patch key | Type | Set by (client) |
| --------- | ---- | --------------- |
| `pretest_answers` | object | `savePretest` |
| `pretest_score` | integer | `savePretest` |
| `posttest_answers` | object | `savePosttest` |
| `posttest_score` | integer | `savePosttest` |
| `screens_time` | object | `saveScreenTime`, `saveLessonComplete` |
| `lessons_completed` | boolean | `saveLessonProgress`, `saveLessonComplete` |
| `scenarios_attempted` | integer | `saveLessonProgress`, `saveLessonComplete` |
| `completed_at` | ISO timestamp string | `savePosttest` |
| `curiosity_focus` | string | `saveCuriosityFocus` |
| `posttest_readiness` | integer 1–5 | `savePosttestReadiness`, `saveLessonComplete` |

Unlisted keys in `p_patch` are **ignored** (not merged generically).

### Answer object shape

```json
{
  "lo0_q1": 0,
  "lo1_q3": 2
}
```

Keys are question `id` strings; values are 0-based option indices.

## Validation (trigger)

After RPC applies the patch, `validate_participant_row`:

- Recomputes `pretest_score` / `posttest_score` from answers
- Rejects `posttest_answers` without `pretest_answers` and `lessons_completed`
- Enforces `curiosity_focus` enum and `posttest_readiness` range
- Prevents `scenarios_attempted` from decreasing

See [Server-side validation](/api/validation).

## Client usage

```javascript
// src/lib/db.js — patchParticipant()
await supabase.rpc('update_participant', {
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
  p_patch: payload,
})
```

## Common save sequences

| Milestone | Typical patch |
| --------- | ------------- |
| Pre-test done | `pretest_answers`, `pretest_score` |
| Lesson complete | `lessons_completed`, `scenarios_attempted`, `screens_time`, optional `posttest_readiness` |
| Post-test done | `posttest_answers`, `posttest_score`, `completed_at` |

## Troubleshooting

| Observation | Action |
| ----------- | ------ |
| Always `false` | Verify `session_secret` matches row; re-run `supabase/setup.sql` |
| Exception on save | Check trigger message (progress order, score mismatch) |
| DEV warning “0 rows updated” | RPC missing or wrong secret |
