# MTG Learning Site: Design System (Master)

Source of truth for the HCI520 study instrument UI. Page-specific overrides belong in `design-system/pages/<page>.md` when they intentionally diverge.

## Product pattern

**Guided assessment flow**: linear steps with session guards, one primary action per screen, no global navigation. Participants move: consent → welcome → intro → pre-test → lessons → post-test → results.

- Use on-screen Back / Continue; browser back is blocked on most study screens.
- Deep links via React Router (`basename` for GitHub Pages).
- Copy session ID on Intro before the pre-test.

## Visual style

**Scholastic tabletop**: dark navy canvas, parchment content frames, gold accents. Evokes Magic: The Gathering without using Wizards brand assets incorrectly.

| Role | Token | Hex |
|------|-------|-----|
| Canvas | `--color-navy` | `#1a1a2e` |
| Content surface | `--color-parchment` | `#f5e6c8` |
| Surface muted | `--color-parchment-dark` | `#e8d5a3` |
| Accent | `--color-gold` | `#c9a84c` |
| Accent muted | `--color-gold-muted` | `#a89060` |
| Accent on parchment | `--color-gold-on-parchment` | `#645319` |
| Text primary | `--color-text-dark` | `#1a1a2e` |
| Text on navy | `--color-text-light` | `#ffffff` |
| Text secondary | `--color-text-secondary` | `#524010` |
| Text muted | `--color-ink-muted` | `#4a4540` |
| Disabled text | `--color-disabled-text` | `#4a4540` |
| Error | `--color-error` | `#8b1a1a` |

Implementation: `src/styles/tokens.css`.

## Typography

| Use | Token | Stack |
|-----|-------|-------|
| Display (headings, buttons) | `--font-display` | Cinzel, Palatino Linotype, serif |
| Body | `--font-body` | Inter, sans-serif |

- Base body size: **16px** minimum on interactive controls.
- Line height: **1.4–1.5** for body copy.
- Breadcrumbs: display font, ~13–14px, letter-spacing `0.08em`.

## Layout

- **Frame pattern**: centered parchment card, max-width ~680px (lessons up to ~860px), 1.5px gold border, 8px radius.
- **Spacing rhythm**: 4/8px increments; section gaps 16 / 24 / 32 / 48px.
- **Viewport**: prefer `100dvh` over `100vh` on full-height screens; safe-area insets on mobile (`env(safe-area-inset-*)`).
- **Breakpoint**: primary mobile adjustments at **640px** (`src/styles/responsive.css`).

## Motion

| Token | Value |
|-------|-------|
| `--transition-fast` | `200ms ease` |

- Micro-interactions: 150–300ms.
- Respect `prefers-reduced-motion` (`src/styles/a11y.css`).
- Route and content loading: skeleton shimmer, not blocking spinners alone.

## Interaction

| Rule | Standard |
|------|----------|
| Touch target | `--touch-target-min: 44px` |
| Focus | `:focus-visible`: 2px gold outline, 2px offset |
| Disabled | Explicit colors, not opacity-only (`a11y.css`) |
| Primary CTA | One gold-bordered button per screen |
| Cursor | `cursor: pointer` on clickable non-button controls |

## Components

| Pattern | Location |
|---------|----------|
| Page shell + skip link | `PageLayout.jsx` |
| Progress indicator | `ProgressDots.jsx` |
| Test question UI | `TestQuestionFlow.jsx` + `PreTest.css` |
| Session help | `SessionRecoveryGuide.jsx` |
| Loading skeleton | `ParchmentFrameSkeleton.jsx` |
| Confirm dialogs | `ConfirmDialog.jsx` |

## Performance

- Route-level code splitting (`React.lazy` in `App.jsx`).
- Below-fold images: `loading="lazy"`, `decoding="async"`, explicit dimensions where possible.
- Google Fonts: `display=swap` in `index.html`.
- Reserve space for async images (fixed slots or aspect-ratio) to limit CLS.

## Accessibility (must have)

- Skip to main content link on every page.
- Sequential heading hierarchy (h1 → h2, no skips for styling).
- Form options as buttons with `role="radio"` during tests; keyboard 1–9, arrows, Space, Enter.
- `aria-live="polite"` for progress and loading status.
- `role="alert"` for errors.
- Color is never the only indicator (markers, text, icons).
- Modal overlays: focus trap, Escape to close, restore focus to trigger.

## Anti-patterns (avoid)

- Playful/comic fonts, neon SaaS palettes, emoji as structural icons.
- Opacity-only disabled states.
- Placeholder-only form labels.
- Hover-only critical information (provide panel/keyboard path).
- Raw hex in component CSS. Use tokens instead.
- Mixing unrelated layout patterns (sidebar + bottom nav at same level).

## File map

```
src/styles/tokens.css      color, type, motion tokens
src/styles/a11y.css        contrast helpers, reduced motion, disabled states
src/styles/responsive.css  mobile breakpoint, safe areas, focus rings
src/index.css              global imports
design-system/MASTER.md    this file
design-system/pages/       optional per-page overrides
```

## Pre-delivery checklist

- [ ] Tokens used; no ad-hoc hex in new CSS
- [ ] Touch targets ≥ 44px
- [ ] Focus visible on keyboard tab
- [ ] Text contrast ≥ 4.5:1 on parchment
- [ ] `prefers-reduced-motion` honored
- [ ] Images lazy-loaded when below fold
- [ ] Loading states use skeleton, not blank frames
- [ ] Tested at 375px width and landscape
