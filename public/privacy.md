# Privacy notice — HCI520 MTG learning site

This document describes how participant data is handled for the DePaul HCI 520 graduate research project (Magic: The Gathering e-learning study).

## Purpose

The site measures whether the lesson flow helps new players learn core MTG concepts. Data is used only for this class project and related analysis.

## What we collect (no PII)

We do **not** collect names, email addresses, IP addresses in the application database, or other directly identifying information.

For each anonymous session we may store:

| Field | Description |
| ----- | ----------- |
| `session_id` | Anonymous save code shown to the participant |
| `session_secret` | Server-side credential (stored as a SHA-256 hash, not plaintext) |
| `participant_id` | Same value as `session_id` (legacy column name) |
| `selected_questions` | Which test questions were assigned |
| `pretest_answers` / `posttest_answers` | Multiple-choice responses |
| `pretest_score` / `posttest_score` | Computed scores |
| `screens_time` | Time spent on each screen (milliseconds) |
| `curiosity_focus` | Optional learner choice: which topic to explore first |
| `posttest_readiness` | Optional self-reported readiness before the post-test |
| `lessons_completed` | Whether the lesson path was finished |
| `scenarios_attempted` | Count of practice scenarios attempted in Lesson 4 |
| `completed_at` | Timestamp when the post-test was submitted |

## Where data is stored

Research responses are saved to **Supabase** (managed PostgreSQL). Supabase acts as the **data processor** hosting the database. The site does not load third-party advertising or analytics scripts.

Fonts are bundled with the site (not loaded from Google’s CDN), so typography does not send visitor IPs to Google.

Closing the browser tab does **not** delete data already saved on the server. Clearing site data in the browser or using **Start over** on the results page only removes the local copy in that browser.

## Retention and backups

Retention is configured in the `study_privacy_config` table:

- **`study_end_date`** — last day of active data collection (update before your study ends).
- **`retention_days_after_study_end`** — default **90** days after that date.

After `study_end_date + retention_days`, run `purge_expired_participants()` (manually in the SQL editor, or on a schedule with pg_cron on Supabase Pro) to delete all rows in `participants`.

**Backups:** Include Supabase backup settings in your plan. Enable point-in-time recovery (PITR) with an expiry aligned to your retention policy, or export and delete the Supabase project when the study is fully complete.

## Participant data export

On the **Results** screen, participants can download a JSON file of their session data (scores, answers, screen times, and learner choices) from data already held in the browser.

## Researcher runbook: remove one participant

To erase a single participant before automatic purge:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Table Editor** → `participants`.
2. Find the row where **`session_id`** matches the participant’s save code (shown on the results page).
3. Delete that row.

No other tables hold participant responses for this study.

To adjust retention settings:

1. Table Editor → `study_privacy_config` (single row, `id = 1`).
2. Set `study_end_date` and `retention_days_after_study_end` as needed.

## Security summary

- Row-level security denies anonymous `SELECT` on participant rows.
- Updates use RPCs that verify the session secret (hashed server-side).
- The Supabase anon key is public by design; RLS and RPCs protect rows.

## Questions

For questions about this study or your data, contact the course instructor or project lead listed in your study invitation.
