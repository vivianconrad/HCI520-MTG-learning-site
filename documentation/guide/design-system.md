# Design system

The learner UI uses a small, token-driven design system extracted from repeated screen patterns. Tokens live in `src/styles/tokens.css`; shared layout and component styles are imported globally from `src/index.css`.

## Design intent

See [`.impeccable.md`](https://github.com/vivianconrad/HCI520-MTG-learning-site/blob/main/.impeccable.md) in the repo root for brand personality and principles. In short: scholarly and welcoming, navy backdrop with parchment content cards, Cinzel headings, Literata body copy.

## Tokens (`src/styles/tokens.css`)

| Category | Examples |
| -------- | -------- |
| Color | `--color-navy`, `--color-gold`, `--color-parchment`, `--color-error` |
| Surface | `--surface-callout-bg`, `--surface-hint-*`, `--surface-on-navy-*` |
| Typography | `--font-display`, `--font-body`, `--text-sm` … `--text-3xl` |
| Spacing | `--space-xs` … `--space-5xl` (4pt scale) |
| Layout | `--viewport-min-height`, `--touch-target-min`, `--measure-prose` |

All core colors use **OKLCH**. Prefer semantic surface tokens over raw `color-mix` in screen CSS.

## Shared styles

Imported in `src/index.css` after tokens:

| File | Role |
| ---- | ---- |
| `layout.css` | `.screen-shell` — centered navy screens; `.screen-shell--stacked` for pre-test |
| `parchment-frame.css` | Parchment card frame, breadcrumb, heading, rule, paragraph rhythm, actions row, muted hints |
| `buttons.css` | Shared `.btn` and `*__button` patterns (back, next, decline, compact) |
| `responsive.css` | Mobile overrides for frames, headings, actions, buttons |

Screen CSS files should only contain **screen-specific** rules (heroes, forms, lesson content). Do not duplicate frame, heading, or button base styles.

## BEM class naming

Screens use block prefixes (`welcome__`, `lesson-intro__`, etc.). Shared parchment-frame rules group equivalent selectors:

```css
/* parchment-frame.css */
.consent__frame,
.welcome__frame,
.lesson-intro__frame { … }
```

When adding a new centered learner screen:

1. Add the root class to `layout.css` (and `screen-shell` alias if appropriate).
2. Add `__frame`, `__breadcrumb`, `__heading`, `__actions`, `__button` selectors to the grouped lists in `parchment-frame.css` and `buttons.css`.
3. Keep unique layout or content rules in `src/screens/YourScreen.css`.

## Reusable components

| Component | Use for |
| --------- | ------- |
| `CuriosityNote` | Optional curiosity prompts on lesson screens |
| `LessonActions` | Back / next navigation with per-screen `classPrefix` |
| `PageLayout` | Shell with keyword dictionary padding on lesson frames |
| `KeywordTooltip` | Inline MTG term definitions |
| `ParchmentFrameSkeleton` | Loading placeholder matching frame dimensions |

## Hint surfaces

Use shared tokens for gold-tinted callouts:

- On parchment: `--surface-hint-warm-bg`, `--surface-hint-border`, `--surface-callout-*`
- On navy: `--surface-on-navy-bg`, `--surface-on-navy-border`
- Strong borders: `--surface-hint-strong-border`

Class `parchment-frame__muted-hint` applies the standard muted helper text style inside frames.

## Buttons

Base styles come from `buttons.css`. Screen-specific variants:

- `consent__button` — rounded; default border uses `--color-gold-on-parchment`; `--decline` is outline-only
- `welcome__button--reset` — error-colored reset control
- `pretest__button` — lives on stacked navy layout; session recovery uses `--surface-on-navy-*`

Hover/focus for primary buttons: gold fill, navy text (defined once in `buttons.css`).

## Responsive behavior

`responsive.css` targets attribute selectors (`[class*='__frame']`, etc.) so new screens inherit mobile padding and typography adjustments when their BEM blocks are registered in the shared files.

## Wiki and agent context

- **`.impeccable.md`** — design principles and aesthetic direction for AI-assisted UI work
- **This page** — file locations, tokens, and extraction conventions for contributors
