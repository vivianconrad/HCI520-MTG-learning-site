# Privacy notice

Participant-facing privacy copy is maintained in **`public/privacy.md`**. It is copied to the deployed site at:

**[/HCI520-MTG-learning-site/privacy.md](https://vivianconrad.github.io/HCI520-MTG-learning-site/privacy.md)**

The consent screen links to that notice. Researchers should treat `public/privacy.md` as the canonical participant text; edit that file when retention or collection language changes.

## Summary for contributors

- **No PII** in the application database (anonymous `session_id` only).
- Data stored in **Supabase** (`participants` table) with deny-select RLS for anon.
- **`session_secret`** is hashed at rest; never export or log plaintext secrets.
- Retention configured in `study_privacy_config` — see `supabase/setup.sql`.
- Cohort export for analysis: Supabase Table Editor (service role), not the public browser.

## Researcher erasure and retention

Full runbook (backups, processor role, purge SQL): read `public/privacy.md` in the repository.

After schema changes affecting stored fields, update both `public/privacy.md` and the consent screen copy in `src/screens/Consent.jsx` if the participant-visible list changes.
