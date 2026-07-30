---
version: alpha
name: tokens-formalization
description: Design artifact for TRL-5 — three-layer token architecture for @trellis.computer/tokens
source:
  tool: greenfield
colors:
  background: "#101010"
  surface: "#1c1c1c"
  surface-inset: "#161616"
  text: "rgba(255,255,255,0.936)"
  text-secondary: "rgba(255,255,255,0.618)"
  text-tertiary: "rgba(255,255,255,0.422)"
  accent: "#9dbefe"
  green: "#12c905"
  yellow: "#fcd53a"
  red: "#fc533a"
  border: "rgba(255,255,255,0.195)"
typography:
  body:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 11px
    fontWeight: 500
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  sidebar:
    bg: "{surface-bg}"
    border: "{border}"
    itemHover: "rgba(255,255,255,0.06)"
    itemActive: "color-mix(in oklch, {text-interactive} 12%, transparent)"
    railW: 56px
    expandedW: 200px
    minW: 140px
    maxW: 360px
  header:
    bg: "{glass-surface}"
    border: "{border}"
    height: 56px
  secondary:
    bg: "{surface-inset}"
    w: 224px
    railW: 48px
    minW: 160px
    maxW: 360px
  oplog:
    bg: "{surface-inset}"
    border: "{border}"
    w: 280px
    minW: 200px
    maxW: 560px
  toolbar:
    track: "#1e1e1e"
    active: "#1c1c1c"
    controlH: 34px
  card:
    bg: "{surface-raised}"
    border: "{border}"
    radius: 10px
  kanban:
    colW: 300px
    gap: 16px
  search:
    bg: "{surface-raised}"
    border: "{border}"
  toast:
    bg: "{surface-raised}"
    border: "{border}"
  dialog:
    bg: "{surface-raised}"
    border: "{border}"
    radius: 14px
  resizeHandle:
    hover: "color-mix(in oklch, {text-interactive} 35%, transparent)"
  progress:
    color: "{green}"
---

# Design: Token Formalization

**Status:** Design complete (handoff to Architect)
**Parent:** TRL-5
**Mock:** N/A — token-only wedge, no layout change

---

## Overview

The token system needs formalization from a flat CSS file into a three-layer architecture that both `@trellis.computer/ui` Lit components and `trellis-node` admin UI can consume. The current `runtime-theme.css` (admin) and `design-tokens.css` (trellis-ui) use different naming conventions and color spaces. This design establishes a single canonical token set with foundation → semantic → component layering.

**Posture:** Dense, technical, developer-facing. Tokens are the API contract between the design system and consuming code.

**Who this serves:** Component authors (Lit), admin UI maintainers, future OS shell / TUI builders.

---

## Colors

### Token naming reconciliation

The admin UI and trellis-ui use different names for the same semantic roles:

| Role | Admin UI (`runtime-theme.css`) | trellis-ui (`design-tokens.css`) | Canonical |
|------|-------------------------------|----------------------------------|-----------|
| Interactive / accent | `--text-interactive-base` (#9dbefe) | `--primary` (oklch blue) | `--text-interactive` |
| Warm accent | `--accent` (#9dbefe, aliased) | `--accent` (oklch orange) | `--accent` = warm; `--text-interactive` = blue |
| Surface | `--surface-raised-base` | `--bg-surface` | `--surface-raised` |
| Background | `--background-base` | `--bg` | `--surface-bg` |
| Border | `--border-base` | `--border` | `--border` |
| Success | `--surface-success-strong` | `--success` | `--green` |

The canonical names above are used throughout this design. Legacy aliases (`--bg`, `--text`, `--accent`) are preserved for backward compatibility but deprecated.

### Foundation layer (raw palette)

Primitive oklch values that never change across themes. These are the "source of truth" for the color system.

```css
:root {
  /* Blue scale (accent / interactive) */
  --color-blue-400: oklch(0.7 0.15 240);
  --color-blue-500: oklch(0.6 0.2 240);
  --color-blue-600: oklch(0.5 0.2 240);

  /* Green scale (success) */
  --color-green-400: oklch(0.7 0.15 150);
  --color-green-500: oklch(0.55 0.2 150);

  /* Yellow scale (warning) */
  --color-yellow-400: oklch(0.8 0.15 80);
  --color-yellow-500: oklch(0.65 0.2 80);

  /* Red scale (critical) */
  --color-red-400: oklch(0.65 0.2 25);
  --color-red-500: oklch(0.5 0.25 25);

  /* Purple scale (info) */
  --color-purple-400: oklch(0.7 0.15 300);
  --color-purple-500: oklch(0.55 0.15 300);

  /* Neutral scale (text, surfaces, borders) */
  --color-gray-50: oklch(0.98 0.005 260);
  --color-gray-100: oklch(0.95 0.008 260);
  --color-gray-200: oklch(0.85 0.01 260);
  --color-gray-300: oklch(0.7 0.01 260);
  --color-gray-400: oklch(0.55 0.01 260);
  --color-gray-500: oklch(0.45 0.01 260);
  --color-gray-600: oklch(0.35 0.015 260);
  --color-gray-700: oklch(0.25 0.015 260);
  --color-gray-800: oklch(0.18 0.015 260);
  --color-gray-900: oklch(0.12 0.01 260);
  --color-gray-950: oklch(0.08 0.01 260);
}
```

### Semantic layer (aliases)

Map intent to foundation values. These change per theme (dark/light/high-contrast).

```css
:root {
  /* Surfaces */
  --surface-bg: var(--color-gray-950);           /* #101010 */
  --surface-raised: var(--color-gray-800);       /* #1c1c1c */
  --surface-inset: var(--color-gray-900);        /* #161616 */
  --surface-overlay: var(--color-gray-700);      /* overlays */

  /* Text */
  --text: var(--color-gray-50);                  /* primary text */
  --text-secondary: var(--color-gray-300);       /* secondary text */
  --text-tertiary: var(--color-gray-400);        /* disabled/hint */
  --text-interactive: var(--color-blue-400);     /* links, active states */

  /* Borders */
  --border: rgba(255, 255, 255, 0.195);          /* default border */
  --border-strong: rgba(255, 255, 255, 0.266);   /* emphasis border */
  --border-focus: var(--color-blue-500);          /* focus ring */

  /* State */
  --green: var(--color-green-500);
  --yellow: var(--color-yellow-500);
  --red: var(--color-red-500);
  --blue: var(--color-purple-400);

  /* Entity types */
  --entity-file: #00ceb9;
  --entity-milestone: #2090f5;
  --entity-issue: #edb2f1;
  --entity-branch: #fcd53a;
  --entity-default: var(--text-secondary);

  /* Glass / inset */
  --glass-surface: rgba(22, 22, 22, 0.75);
  --glass-border: rgba(255, 255, 255, 0.04);
  --kanban-body-inset: rgba(255, 255, 255, 0.02);

  /* Badge backgrounds */
  --badge-success-bg: color-mix(in oklch, var(--green) 15%, transparent);
  --badge-success-border: color-mix(in oklch, var(--green) 30%, transparent);
  --badge-warning-bg: color-mix(in oklch, var(--yellow) 15%, transparent);
  --badge-warning-border: color-mix(in oklch, var(--yellow) 25%, transparent);
  --badge-critical-bg: color-mix(in oklch, var(--red) 15%, transparent);
  --badge-neutral-bg: color-mix(in oklch, var(--text-tertiary) 15%, transparent);
  --accent-glow: color-mix(in oklch, var(--text-interactive) 12%, transparent);
}
```

### Component layer (scoped tokens)

These are consumed by specific components. They reference semantic tokens. This layer is what's missing today and is required for shell/sidebar extraction.

```css
:root {
  /* Sidebar */
  --sidebar-bg: var(--surface-bg);
  --sidebar-border: var(--border);
  --sidebar-item-hover: rgba(255, 255, 255, 0.06);
  --sidebar-item-active: color-mix(in oklch, var(--text-interactive) 12%, transparent);
  --sidebar-rail-w: 56px;
  --sidebar-expanded-w: 200px;
  --sidebar-min-w: 140px;
  --sidebar-max-w: 360px;

  /* Header */
  --header-bg: var(--glass-surface);
  --header-border: var(--border);
  --header-height: 56px;

  /* Secondary sidebar */
  --secondary-bg: var(--surface-inset);
  --secondary-w: 224px;
  --secondary-rail-w: 48px;
  --secondary-min-w: 160px;
  --secondary-max-w: 360px;

  /* Oplog */
  --oplog-bg: var(--surface-inset);
  --oplog-border: var(--border);
  --oplog-w: 280px;
  --oplog-min-w: 200px;
  --oplog-max-w: 560px;

  /* Toolbar */
  --toolbar-track: #1e1e1e;
  --toolbar-active: #1c1c1c;
  --toolbar-control-h: 34px;

  /* Cards */
  --card-bg: var(--surface-raised);
  --card-border: var(--border);
  --card-radius: 10px;

  /* Kanban */
  --kanban-col-w: 300px;
  --kanban-gap: 16px;

  /* Search */
  --search-bg: var(--surface-raised);
  --search-border: var(--border);

  /* Toast */
  --toast-bg: var(--surface-raised);
  --toast-border: var(--border);

  /* Dialog */
  --dialog-bg: var(--surface-raised);
  --dialog-border: var(--border);
  --dialog-radius: 14px;

  /* Resize handle */
  --resize-hover: color-mix(in oklch, var(--text-interactive) 35%, transparent);

  /* Progress spin */
  --progress-color: var(--green);
}
```

---

## Typography

The admin UI uses a system font stack with two roles:

| Role | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Body | system-ui | 13px | 400–600 | All UI text |
| Mono | ui-monospace | 11px | 500 | IDs, timestamps, badges, stats |

**Hierarchy:**
- **Brand text** — 700 13px, `--text`
- **Nav items** — 500 13px, `--text-secondary`
- **Zone labels** — 600 10px mono, uppercase, `--text-tertiary`
- **Card titles** — 600 13px, `--text`
- **Meta text** — 500 11px mono, `--text-tertiary`
- **Badge text** — 500–600 10px mono, entity-specific color

The `@trellis.computer/ui` tokens use Inter + JetBrains Mono. The admin UI uses system fonts. The canonical token set should support both by making font families overridable.

---

## Layout

The admin shell uses a CSS Grid with four named regions:

```
grid-template-columns: var(--sidebar-w) var(--secondary-w) minmax(0, 1fr)
grid-template-rows: var(--header-height) minmax(0, 1fr)
```

When oplog is pinned, a fourth column is added:
```
grid-template-columns: var(--sidebar-w) var(--secondary-w) minmax(0, 1fr) var(--oplog-w)
```

**Breakpoints:**
- `< 820px` — hide labels in header stats
- `< 1100px` — hide low-priority stats, collapse to 3-column grid
- `< 1100px` with inspector-pinned — oplog moves to bottom row

**Panel resize** is handled by drag handles that update CSS custom properties. The min/max values are defined in the component tokens above.

---

## Elevation & Depth

The inset ladder provides containment depth without shadows:

```css
--surface-1: color-mix(in oklch, var(--card) 25%, var(--background));
--surface-2: color-mix(in oklch, var(--card) 50%, var(--background));
--surface-3: var(--card);
```

Glass surfaces use backdrop-filter blur for the header and oplog head:
```css
--glass-surface: rgba(22, 22, 22, 0.75);
backdrop-filter: blur(12px);
```

Shadows are reserved for elevated overlays (dialogs, toasts):
```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.15);
```

---

## Shapes

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 4px | Inline badges |
| `--radius-sm` | 6px | Toggle buttons, sidebar items |
| `--radius-md` | 8px | Nav items, search, toolbar controls |
| `--radius-lg` | 10px | Cards, kanban columns |
| `--radius-pill` | 999px | Status badges, live dot |

Icon sizing: 16px for nav/toolbar, 14px for header stats, 12px for inline meta.

---

## Components

| Component | Anatomy | States | Maps to codebase |
|-----------|---------|--------|------------------|
| `<trellis-shell>` | CSS Grid host with named slots: sidebar, secondary, header, main, oplog | collapsed, expanded, inspector-pinned, embed | `admin.html:2042-2629` (inline) |
| `<trellis-sidebar>` | Brand block + zone labels + nav items + resize handle | collapsed (rail), expanded, embed-hidden | `admin.html:2043-2128` (inline) |
| `<trellis-sidebar-nav>` | Zone-grouped nav items with active/disabled states | active, disabled, hover | `admin.html:2049-2125` (inline) |
| `<trellis-header>` | Breadcrumb slot + stats slot + action slot | — | `admin.html:2214-2302` (inline) |
| `<trellis-breadcrumb>` | Segmented path with icon + label per segment | — | `admin.html:2229-2267` (inline) |
| `<trellis-search>` | Search icon + input + clear button | focused, has-value | `admin.html:2343-2351` (inline) |
| `<trellis-view-toggle>` | Radio group for projection switching | grid, kanban, table | `admin.html:2316-2341` (inline) |

**Note:** These components are extracted from the admin HTML but not yet implemented as Lit. The component tokens above define their CSS custom property API.

**Motion:** All components must respect `prefers-reduced-motion: reduce`. Transitions on resize handles, panel collapses, and view toggles should be disabled. The progress spin animation should be replaced with a static indicator.

---

## Interaction matrix

| Input | States | Output |
|-------|--------|--------|
| Sidebar toggle click | collapsed ↔ expanded | Toggles `sidebar-collapsed` class on `<html>`, persists to localStorage |
| Resize handle drag | idle → dragging → idle | Updates CSS custom property (e.g. `--sidebar-w`), persists width |
| Zone toggle click | expanded ↔ collapsed | Toggles `collapsed` class on `.secondary-zone`, persists |
| Nav item click | default → active | Sets `aria-current="page"`, updates breadcrumb, switches view panel |
| View toggle click | radio unchecked → checked | Switches active view panel, updates URL params |
| Search input | empty → has-value | Shows/hides clear button, filters visible items |
| Oplog toggle | pinned ↔ unpinned | Toggles `inspector-pinned` on `<html>`, shows/hides oplog column |

---

## Accessibility

- **Focus order:** Sidebar nav → header toggle → breadcrumb → search → view toggle → main content
- **Labels:** All interactive elements have `aria-label` or visible label
- **Keyboard:** Resize handles support arrow keys via `role="separator"` + `keydown`
- **Motion:** `prefers-reduced-motion: reduce` disables all transitions and animations
- **Live regions:** Header stats use `aria-live="polite"` for status updates
- **Collapse states:** All toggle buttons use `aria-expanded` and `aria-controls`

---

## Do's and Don'ts

**Do**
- Use semantic tokens (`--text`, `--border`) in component CSS, never hardcode values
- Reference component tokens (`--sidebar-bg`) for scoped styling
- Support `prefers-reduced-motion` on all transitions
- Persist layout state (collapsed, pinned, widths) to localStorage
- Use `aria-expanded` on all toggle buttons

**Don't**
- Hardcode colors in component styles (always use tokens)
- Skip `prefers-reduced-motion` checks
- Use shadow DOM for layout components (they need to respond to `:root` class changes)
- Couple TML bindings to Lit component internals
- Mix oklch and hex values in the same token layer

---

## Open for Architect

- **Token package structure:** Should `@trellis.computer/tokens` be a separate npm package, or a sub-path export of `@trellis.computer/ui`? Recommendation: separate package (ADR-005 already specifies this).
- **Migration path:** How does `runtime-theme.css` transition to importing from `@trellis.computer/tokens`? Should it be a breaking change or a gradual alias?
- **Component token prefix:** Should component tokens use a prefix (e.g. `--trellis-sidebar-bg`) or stay flat (`--sidebar-bg`)? Flat is simpler but risks collisions.
- **Theme switching:** The admin UI currently uses `:root` variables only (dark theme). The token system supports `data-theme` switching. Should the admin UI adopt `data-theme` now, or defer?
- **Font family divergence:** Admin uses system fonts, trellis-ui tokens use Inter. The canonical tokens should make font families overridable. Which is the default?

---

## Handoff checklist

- [x] `docs/artifacts/tokens_formalization_design.md` (this file, DESIGN.md format)
- [ ] `docs/artifacts/tokens_formalization_mockup.html` — N/A (token-only wedge)
- [x] Paths in design issue `describe` SUMMARY
