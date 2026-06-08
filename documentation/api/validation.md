# Server-side validation

Postgres triggers and functions enforce data integrity independent of the client.

**Primary trigger:** `validate_participant_row` on `participants` BEFORE INSERT OR UPDATE  
**Score helper:** `public.compute_test_score(selected_questions, answers)`

## compute_test_score

Counts answers where `answers->questionId` equals `correctIndex` on the matching question in `selected_questions`.

Used by the trigger to **overwrite** client-supplied scores with the recomputed value. Mismatch raises an exception.

## selected_questions rules

On insert/update when array present:

- Must be JSON array of length **10**
- Each item requires `id` and `correctIndex`

## Session identity (INSERT only)

- `session_id` length 8–64 (trimmed)
- `session_secret` hashed length ≥ 32 (plaintext minimum before hash)
- `participant_id` length ≥ 6

## Score bounds

- `pretest_score` / `posttest_score`: 0–20 allowed in trigger (instrument uses 0–10)

## Progress ordering

| Rule | Enforcement |
| ---- | ----------- |
| Post-test requires lessons | `posttest_answers` → `lessons_completed` must be true |
| Post-test requires pre-test | `posttest_answers` → `pretest_answers` not null |

## Learner choice fields

| Field | Constraint |
| ----- | ---------- |
| `curiosity_focus` | `reading_cards`, `card_types`, `turns`, `guide` |
| `posttest_readiness` | 1–5 |
| `scenarios_attempted` | 0–11; cannot decrease on UPDATE |

## Rate limiting

`register_participant` rejects when more than **200** rows created in the trailing hour (project-wide count).

## Hardening scripts

| Script | Purpose |
| ------ | ------- |
| `supabase/revoke-internal-rpc-execute.sql` | Remove anon execute on internal functions |
| `scripts/verify-participants-db.mjs` | Automated security checks (`npm run verify:db`) |

## Client implications

- Do not skip `attachAnswerKeys` before registration.
- Client pre-computes score for UX; server is authoritative.
- Partial patches are fine; omitted keys keep their existing column values.

## Related RPCs

- [register_participant](/api/register-participant)
- [update_participant](/api/update-participant)
