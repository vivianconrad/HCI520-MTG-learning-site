# register_participant

Creates a new row in `public.participants`. Replaces open anon `INSERT`.

## Signature

```sql
register_participant(
  p_participant_id     text,
  p_session_id         text,
  p_session_secret     text,
  p_selected_questions jsonb
) returns text
```

## Grants

- `EXECUTE` for `anon`, `authenticated`
- `SECURITY DEFINER` — runs with owner privileges to INSERT despite revoked table INSERT

## Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `p_participant_id` | Yes | Must **equal** `p_session_id` (legacy column mirrors save code) |
| `p_session_id` | Yes | Anonymous session identifier (8–64 chars after trim) |
| `p_session_secret` | Yes | Plaintext secret from client; stored as **SHA-256 hash** |
| `p_selected_questions` | Yes | JSON array of **exactly 10** question objects |

### `p_selected_questions` shape

Each element must include:

```json
{
  "id": "lo1_q3",
  "lo": "LO1",
  "question": "…",
  "options": ["…", "…"],
  "correctIndex": 2
}
```

The client adds `correctIndex` server-side via `attachAnswerKeys()` in `src/lib/questionKeys.js` before RPC — keys are not shown during the test UI.

## Returns

- **Success:** `p_session_id` (text)
- **Error `23505`:** `session_id already registered`
- **Error `P0001`:** `participant_id must match session_id` or rate limit (`registration rate limit exceeded` — 200 rows/hour project-wide)

## Side effects

Inserts row with:

- `screens_time` = `{}`
- `lessons_completed` = false (default)
- `scenarios_attempted` = 0 (default)

Trigger `validate_participant_row` runs on INSERT.

## Client usage

```javascript
// src/lib/db.js — createParticipantRow()
await supabase.rpc('register_participant', {
  p_participant_id: sessionId,
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
  p_selected_questions: questionsForServer,
})
```

On `session_id` conflict, client returns `{ conflict: true }` and may call `rotateSessionCredentials()`.

## When it runs

Once per session, typically on the **Intro** screen after questions are drawn and the participant has copied their save code.
