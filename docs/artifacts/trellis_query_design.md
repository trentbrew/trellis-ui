---
version: "0.1.0"
name: "trellis-query"
description: "Live TQL query component for rendering EQL-S query results as a list or custom template"
colors:
  background: "{--bg}"
  surface: "{--bg-surface}"
  hover: "{--bg-hover}"
  border: "{--border}"
  primary: "{--primary}"
  muted: "{--muted}"
  muted-content: "{--muted-content}"
  destructive: "{--destructive}"
  info: "{--info}"
  success: "{--success}"
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
rounded:
  sm: "{--radius-sm}"
  md: "{--radius-md}"
  lg: "{--radius-lg}"
components:
  trellis-query:
    display: "block"
    font-family: "{--font-sans}"
  query-container:
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
  query-item:
    display: "flex"
    align-items: "center"
    gap: "{--space-2}"
    padding: "{--space-2} {--space-3}"
    border-radius: "{--radius-sm}"
    cursor: "pointer"
    transition: "background-color 150ms ease"
  query-item:hover:
    background: "{--bg-hover}"
  query-empty:
    padding: "{--space-4}"
    text-align: "center"
    color: "{--muted-content}"
    font-size: "{--font-size-sm}"
  query-loading:
    display: "flex"
    align-items: "center"
    justify-content: "center"
    padding: "{--space-4}"
    color: "{--muted-content}"
    font-size: "{--font-size-sm}"
  query-error:
    padding: "{--space-3}"
    color: "{--destructive}"
    font-size: "{--font-size-xs}"
    border: "1px solid {--destructive}"
    border-radius: "{--radius-sm}"
  query-slot-container:
    display: "contents"
---

# trellis-query Design Spec

## Overview

The `<trellis-query>` component renders the results of an EQL-S query string as a list or via a custom template. It is query-driven (not type-driven, unlike `<trellis-entity-list>`) and uses `liveQuery()` from `trellis/browser` for reactive updates. Attributes: `query` (EQL-S string), `resolve` (JSON). Slots: default (per-item), loading, empty, error.

## Colors

Uses canonical design tokens from `tokens/design-tokens.css`:
- **Background**: `var(--bg)` — Query container background
- **Surface**: `var(--bg-surface)` — Item backgrounds
- **Hover**: `var(--bg-hover)` — Item hover and selected states
- **Border**: `var(--border)` — Query container border
- **Primary**: `var(--primary)` — Focus ring, selected state accent
- **Muted**: `var(--muted)` — Empty states
- **Muted Content**: `var(--muted-content)` — Empty state text
- **Destructive**: `var(--destructive)` — Error states
- **Info**: `var(--info)` — Loading indicator
- **Success**: `var(--success)` — Query success indicator

## Typography

Uses canonical typography tokens:
- **Family**: `var(--font-sans)` — Inter stack
- **Sizes**: xs (0.75rem), sm (0.875rem), base (1rem)
- **Weights**: normal (400), medium (500)

## Layout

Vertical flex layout with `--space-2` gap between items. Container has max-height 40rem with overflow-y auto. Each result item is a flex row aligned center with `--space-2` gap. Slots allow custom per-item rendering.

## Elevation & Depth

No elevation — uses border and background only. Consistent with flat design system and entity-list pattern.

## Shapes

- **Query container**: `--radius-md` (0.375rem) with 1px border
- **Items**: `--radius-sm` (0.25rem) for hover/selection states
- **Error banner**: `--radius-sm` (0.25rem)

## Components

| Component | Anatomy | States | Maps to codebase |
|-----------|---------|--------|------------------|
| trellis-query | Host element wrapping query-container, slot containers | idle, loading, loaded, error, empty | `packages/core/src/query.ts` (to be created) |
| query-container | Flex column, gap 0.5rem, border, bg, max-height 40rem overflow-y auto | — | CSS custom properties from design tokens |
| query-item | Flex row, padding, hover bg, cursor pointer, transition | hover, selected, focus-visible | Delegates to `<trellis-entity>` or custom slot |
| query-empty | Padding, center text, muted color | — | Empty slot fallback |
| query-loading | Flex center, spinner, muted text | — | Loading slot fallback |
| query-error | Padding, destructive color, border | — | Error slot fallback |
| slot container | Default slot for per-item, named slots for loading/empty/error | — | Lit `<slot>` elements |

## Interaction Matrix

| State | Visual | Interaction | Keyboard | ARIA |
|-------|--------|-------------|----------|------|
| Loading | Spinner + text | None | None | `aria-busy="true"` on container |
| Empty | "No results" message | None | None | `role="status"` |
| Error | Error message border | None | None | `role="alert"` |
| Loaded | List of query results | Click item → `trellis-query-result-click` event | Tab through items, Enter/Space to select | `role="list"` on container, `role="listitem"` on items |
| Hover | Background highlight | Mouse hover | N/A | — |
| Focus | Focus ring (2px solid primary) | None | Tab navigation | `aria-selected` reflects selection |
| Selected | Left border accent + bg | Click toggles selection | Enter/Space toggles | `aria-selected="true/false"` |
| Refetch | Skeleton loading | None | None | `aria-busy="true"` during refetch |

## Accessibility

- **Focus order**: Tab navigates through result items in DOM order
- **Labels**: Container has `aria-label` passed via attribute (defaults to "Query results")
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

1. **liveQuery() API**: Need to confirm exact API from `trellis/browser` — entity-list uses `liveEntities()` for collections; query component uses `liveQuery()` with EQL-S string. Verify the return type and signal shape.

2. **Slot rendering pattern**: `<slot name="item">` for per-item custom rendering — need Lit slot implementation guidance and fallback behavior when slot is empty.

3. **EQL-S query parsing**: `query` attribute is a raw EQL-S string — validate in `willUpdate` or `connectedCallback`? Error handling for malformed queries.

4. **resolve attribute**: JSON string attribute for resolve parameters — parse in `willUpdate` with error handling for malformed JSON.

5. **Selection model**: Single-select only, or multi-select? If multi-select, need `aria-multiselectable` and shift-click range selection.

6. **Virtual scrolling**: For large result sets (>50 items), should we virtualize? The max-height suggests scrolling but no virtual scroll implementation.

## Do's and Don'ts

**Do**
- Use canonical design tokens for all visual properties
- Respect `prefers-reduced-motion` for transitions and animations
- Provide loading, empty, and error slot fallbacks
- Use `aria-live="polite"` on the container for dynamic updates

**Don't**
- Hardcode colors — always use CSS custom properties
- Assume query results are always arrays — handle null/undefined gracefully
- Block the main thread with query parsing — use lightweight validation

## Design Verification

- refs: docs/artifacts/trellis_query_design.md, docs/artifacts/trellis_query_mockup.html (read)
- interaction matrix: 8 rows, 0 empty cells
- a11y: focus order + prefers-reduced-motion documented
- token parity: YAML ↔ mock :root verified (canonical tokens used)
- design.md lint: N/A (token-only wedge)
- design critique: 1 round, 0 blockers remaining
