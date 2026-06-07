# Pre-Test page overrides

Inherits `design-system/MASTER.md` unless noted below.

## Layout

- Reuses `pretest` screen class and `pretest__frame` for question UI (`TestQuestionFlow`).
- Question loading: `ParchmentFrameSkeleton` with `compact` variant — no keyword dictionary on this screen.

## Interaction

- No glossary highlights during assessment (`assessmentNote` explains this).
- Keyboard: 1–9, arrows, Space to select; Enter to advance.
- Browser back blocked; `BrowserBackNotice` visible.
- Session bootstrap: inline status with pulse dot while `canSave` is false.

## States

| State | UI |
|-------|-----|
| Questions loading | Full-page parchment skeleton |
| Questions error | Alert message + Try again / Go to Welcome |
| Saving answers | Disabled options, `aria-busy`, button label "Saving your answers…" |
| Save failure | `role="alert"` block with continue-without-saving path |

## Images

- Question card images: lazy-loaded with reserved slot (160×224 or 16:10 wide).
- Shimmer placeholder until `onLoad`.
