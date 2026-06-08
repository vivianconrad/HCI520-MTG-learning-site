# Evaluation and reporting

This page describes how test scores are computed, which fields to export for analysis, and caveats when interpreting cohort results. It complements [Privacy](/guide/privacy) and the instructor dashboard at `/instructor`.

## Study design (summary)

Each participant completes the same lesson path, then takes a **pre-test** and **post-test** with the **same question set** drawn at session start. The primary outcome is **learning gain**: post-test score minus pre-test score on a fixed-length multiple-choice instrument.

Secondary signals include per-topic scores, optional practice-scenario engagement, screen-time telemetry, and self-reported curiosity/readiness fields.

## Test instrument

| Property | Value |
| -------- | ----- |
| Total questions per test | **10** (`DEFAULT_TEST_QUESTION_COUNT`) |
| Questions per topic | **2** (`QUESTIONS_PER_TOPIC`) |
| Topics | **5** learning objectives (`LO0`–`LO4`) |
| Format | Single-answer multiple choice (0-based option index stored in JSON) |
| Question order | Fixed topic order (`LO0` → `LO4`); within each topic, 2 questions are **randomly sampled** from the bank |

### Learning objectives (internal keys)

| Key | Label (learner-facing) | Primary lesson content |
| --- | ---------------------- | ---------------------- |
| `LO0` | MTG Basics | What Is MTG (`/what-is-mtg`) |
| `LO1` | How to Read a Card | Card Anatomy (`/lesson/1`); some LO1 items are card-type identification taught in Card Types (`/lesson/2`) |
| `LO2` | How a Turn Works | Turn Structure (`/lesson/3`) |
| `LO3` | Turn Steps in Detail | Turn Structure (`/lesson/3`) |
| `LO4` | Card Timing | Putting It Together (`/lesson/4`) |

Question pools: `src/data/questionBank.js`. Answer keys are not shipped during active tests; scoring uses `src/data/questionAnswerKeys.js` on save and is **recomputed server-side** (`compute_test_score` in `supabase/setup.sql`).

## Scoring

### Total score

- **Range:** 0–10 per test
- **Stored columns:** `pretest_score`, `posttest_score`
- **Gain:** `posttest_score - pretest_score` (derive in analysis)

### Per-topic score

For each `LO*`, count correct answers among the two questions in `selected_questions` (0–2 pre, 0–2 post). Recompute via `calculateScores()` in `src/lib/scoring.js`; this is not stored as a dedicated DB column.

### Incomplete sessions

Filter to `completed_at IS NOT NULL` for finished participants.

## Export workflows

Use the Supabase Table Editor (`participants`) and export CSV. Deny-select RLS blocks browser cohort reads by default.

The instructor dashboard CSV (`sessionsToCsv`) works only if anon SELECT is allowed, which is not the production setup.

Participant JSON on Results is for self-recovery, not cohort analysis.

## Reporting caveats

1. Random item sampling per topic: totals are always /10; topic items differ across participants.
2. Same question set pre and post (paired design, not independent samples).
3. LO1 card-type items are taught in Lesson 2 but tagged LO1 in the bank.
4. Trust server `pretest_score` / `posttest_score` over manual counts.
5. No PII; `session_id` is anonymous.
6. `screens_time` is exploratory; pauses and tab switches add noise.

## Code references

| Concern | Location |
| ------- | -------- |
| Cohort stats, CSV | `src/lib/scoring.js` |
| Client saves | `src/lib/db.js` |
| Question draw | `src/store/useSessionStore.js` → `pickQuestions()` |
| Server validation | `supabase/setup.sql` |

See also [API validation](/api/validation) and [session gating](/architecture/session-flow).
