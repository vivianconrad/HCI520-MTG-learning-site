# get_participant_progress

Read-only progress snapshot for the **current session** after verifying `session_secret`. Does not return full row data or cohort information.

## Signature

```sql
get_participant_progress(
  p_session_id     text,
  p_session_secret text
) returns jsonb
```

## Grants

- `EXECUTE` for `anon`, `authenticated`
- `SECURITY DEFINER` (reads row despite deny-select RLS)

## Returns

`null` if session not found or secret mismatch.

Otherwise:

```json
{
  "pretest_completed": true,
  "posttest_completed": false,
  "lessons_completed": true,
  "scenarios_attempted": 2,
  "pretest_score": 7,
  "posttest_score": null
}
```

| Field | Meaning |
| ----- | ------- |
| `pretest_completed` | `pretest_answers IS NOT NULL` |
| `posttest_completed` | `posttest_answers IS NOT NULL` |
| `lessons_completed` | Boolean column (coalesce false) |
| `scenarios_attempted` | Integer count |
| `pretest_score` / `posttest_score` | Stored integers or null |

Does **not** return: answers, `selected_questions`, `screens_time`, or other participants.

## Client usage

```javascript
// src/lib/db.js — fetchParticipantProgress()
const { data } = await supabase.rpc('get_participant_progress', {
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
})
```

Called from `useSessionStore` when `participantRowReady` to sync local flags after refresh.

## Use cases

- Recover gate state when localStorage says incomplete but server has saves
- Display scores on results after cross-device recovery (with valid secret)

## Not a cohort API

Researchers cannot enumerate participants through this RPC. Use Supabase Table Editor with service role for exports.
