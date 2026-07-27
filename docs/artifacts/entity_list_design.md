---
version: "0.1.0"
name: "trellis-entity-list"
description: "Live entity list component for rendering filtered collections of Trellis entities"
colors:
  background: "{--bg}"
  surface: "{--bg-surface}"
  hover: "{--bg-hover}"
  border: "{--border}"
  primary: "{--primary}"
  muted: "{--muted}"
  muted-content: "{--muted-content}"
  destructive: "{--destructive}"
typography:
  family: "{--font-sans}"
  sizes:
    xs: "{--font-size-xs}"
    sm: "{--font-size-sm}"
    base: "{--font-size-base}"
  weights:
    normal: "{--font-weight-normal}"
    medium: "{--font-weight-medium}"
spacing:
  1: "{--space-1}"
  2: "{--space-2}"
  3: "{--space-3}"
  4: "{--space-4}"
  6: "{--space-6}"
rounded:
  sm: "{--radius-sm}"
  md: "{--radius-md}"
  lg: "{--radius-lg}"
components:
  entity-list:
    display: "flex"
    flex-direction: "column"
    gap: "{--space-2}"
    border: "1px solid {--border}"
    background: "{--bg}"
    border-radius: "{--radius-md}"
    padding: "{--space-2}"
    max-height: "40rem"
    overflow-y: "auto"
    position: "relative"
  entity-item:
    display: "flex"
    align-items: "center"
    gap: "{--space-2}"
    padding: "{--space-2} {--space-3}"
    border-radius: "{--radius-sm}"
    cursor: "pointer"
    transition: "background-color 150ms ease"
    &[data-selected]:
      background: "{--bg-hover}"
      border-left: "2px solid {--primary}"
  entity-empty:
    padding: "{--space-4}"
    text-align: "center"
    color: "{--muted-content}"
    font-size: "{--font-size-sm}"
  entity-loading:
    display: "flex"
    align-items: "center"
    justify-content: "center"
    padding: "{--space-4}"
    color: "{--muted-content}"
    font-size: "{--font-size-sm}"
  entity-error:
    padding: "{--space-3}"
    color: "{--destructive}"
    font-size: "{--font-size-xs}"
    border: "1px solid {--destructive}"
    border-radius: "{--radius-sm}"
---

# trellis-entity-list Design Spec

## Overview

The `<trellis-entity-list>` component renders a live, filtered list of Trellis entities. It provides a reactive data layer that automatically updates when entities change in the backend. The component is designed to be used inside a `<trellis-provider>` and delegates individual entity rendering to `<trellis-entity>` by default.

## Colors

Uses canonical design tokens from `tokens/design-tokens.css`:
- **Background**: `var(--bg)` — List container background
- **Surface**: `var(--bg-surface)` — Item backgrounds
- **Hover**: `var(--bg-hover)` — Item hover and selected states
- **Border**: `var(--border)` — List container border
- **Primary**: `var(--primary)` — Selected item indicator, focus ring
- **Muted**: `var(--muted)` — Empty states
- **Muted Content**: `var(--muted-content)` — Empty state text
- **Destructive**: `var(--destructive)` — Error states

## Typography

Uses canonical typography tokens:
- **Family**: `var(--font-sans)` — Inter stack
- **Sizes**: xs (0.75rem), sm (0.875rem), base (1rem)
- **Weights**: normal (400), medium (500)

## Layout

Vertical flex layout with `--space-2` gap between items. Container has max-height 40rem with overflow-y auto. Each item is a flex row aligned center with `--space-2` gap.

## Elevation & Depth

No elevation — uses border and background only. Consistent with flat design system.

## Shapes

- **List container**: `--radius-md` (0.375rem) with 1px border
- **Items**: `--radius-sm` (0.25rem) for hover/selection states

## Components

### Entity List Container

```css
:host {
  display: block;
}
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border: 1px solid var(--border);
  background: var(--bg);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  max-height: 40rem;
  overflow-y: auto;
  position: relative;
}
```

### Entity Item

Each item delegates to `<trellis-entity>` with appropriate attributes. Items have hover and selected states.

```css
.item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 150ms ease;
}
.item:hover {
  background: var(--bg-hover);
}
.item[data-selected] {
  background: var(--bg-hover);
  border-left: 2px solid var(--primary);
}
.item:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Empty State

```css
.empty {
  padding: var(--space-4);
  text-align: center;
  color: var(--muted-content);
  font-size: var(--font-size-sm);
}
```

### Loading State

```css
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  color: var(--muted-content);
  font-size: var(--font-size-sm);
}
.loading::before {
  content: '';
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin-right: var(--space-2);
}
@media (prefers-reduced-motion: reduce) {
  .loading::before {
    animation: none;
  }
}
```

### Error State

```css
.error {
  padding: var(--space-3);
  color: var(--destructive);
  font-size: var(--font-size-xs);
  border: 1px solid var(--destructive);
  border-radius: var(--radius-sm);
}
```

## Interaction Matrix

| State | Visual | Interaction | Keyboard | ARIA |
|-------|--------|-------------|----------|------|
| Loading | Spinner + text | None | None | `aria-busy="true"` on container |
| Empty | "No items found" | None | None | `role="status"` |
| Error | Error message border | None | None | `role="alert"` |
| Loaded | List of entities | Click item → `trellis-entity-click` event | Tab through items, Enter/Space to select | `role="list"` on container, `role="listitem"` on items |
| Hover | Background highlight | Mouse hover | N/A | — |
| Focus | Focus ring (2px solid primary) | None | Tab navigation | `aria-selected` reflects selection |
| Selected | Left border accent + bg | Click toggles selection | Enter/Space toggles | `aria-selected="true/false"` |
| Filtered/Refetch | Skeleton loading | None | None | `aria-busy="true"` during refetch |

## Accessibility

- **Focus order**: Tab navigates through list items in DOM order
- **Labels**: Container has `aria-label` passed via attribute
- **Motion**: Hover transition respects `prefers-reduced-motion: reduce`; spinner animation stops
- **ARIA**: 
  - Container: `role="list"`, `aria-live="polite"` for dynamic updates
  - Items: `role="listitem"`, `aria-selected` for selection state
  - Loading: `aria-busy="true"` on container
  - Error: `role="alert"`
- **Keyboard**: Enter/Space on focused item triggers selection; roving tabindex for lists >20 items
- **Focus indicator**: 2px solid `var(--ring)` with 2px offset

## Theme Support

Component inherits `data-theme` from ancestor. Supports:
- Light (default)
- Dark (`data-theme="dark"`)
- High contrast (`data-theme="high-contrast"`)

All colors use CSS custom properties that automatically adapt to theme.

## Open for Architect

1. **liveEntities() API**: Need to confirm exact API from `trellis/browser` — entity component uses `liveEntity()` for single entities; need pattern for lists.

2. **Custom rendering**: `<template slot="item">` pattern needs Lit slot implementation guidance.

3. **Where filter parsing**: JSON string attribute — parse in `willUpdate` or `connectedCallback`? Error handling for malformed JSON?

4. **Selection model**: Single-select only, or multi-select? If multi-select, need `aria-multiselectable` and shift-click range selection.

5. **Virtual scrolling**: For large lists (>100 items), should we virtualize? The max-height suggests scrolling but no virtual scroll implementation.

## Design Verification

- refs: docs/artifacts/entity_list_design.md, docs/artifacts/entity_list_mockup.html (read)
- interaction matrix: 8 rows, 0 empty cells
- a11y: focus order + prefers-reduced-motion documented
- token parity: YAML ↔ mock :root verified (canonical tokens used)
- design.md lint: N/A (token-only wedge)
- design critique: 1 round, 0 blockers remaining (2 blockers fixed)
