---
layout: home

hero:
  name: HCI520 MTG Learning Site
  text: Project documentation
  tagline: Architecture, Supabase RPC contracts, and contributor onboarding for the MTG e-learning study instrument.
  actions:
    - theme: brand
      text: Contributor guide
      link: /guide/getting-started
    - theme: alt
      text: Architecture
      link: /architecture/
    - theme: alt
      text: API reference
      link: /api/

features:
  - title: Guided study flow
    details: Fifteen gated learner steps from consent through lessons, pre/post tests, and results. Session state persists in the browser and Supabase.
  - title: Data layer
    details: Deny-select RLS, RPC-only writes, server-side score validation, and hashed session secrets. The client does not REST PATCH participant rows.
  - title: Study exports
    details: Evaluation metrics, cohort CSV patterns, and privacy/retention notes for instructors who export from Supabase.
---

## Quick links

| Audience | Start here |
| -------- | ---------- |
| New contributor | [Getting started](/guide/getting-started) |
| System design | [Architecture overview](/architecture/) |
| Backend / Supabase | [RPC API reference](/api/) |
| Instructor / analyst | [Evaluation & reporting](/guide/evaluation) |
| Participant privacy | [Privacy notice](/guide/privacy) (also on the live site) |

## Repository docs map

| Path | Role |
| ---- | ---- |
| `documentation/` | This wiki (VitePress source) |
| `README.md` | Quick setup and deploy |
| `AGENTS.md` | AI agent conventions |
| `design-system/MASTER.md` | UI tokens and layout patterns |
| `supabase/setup.sql` | Database schema, RLS, RPCs |

After each deploy to `main`, the built wiki is at `/HCI520-MTG-learning-site/wiki/` on GitHub Pages.
