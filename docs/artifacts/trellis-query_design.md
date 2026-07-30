---
version: alpha
name: trellis-query
layer: design
repo: trellis-ui

# Trellis query component design

## Overview

The trellis-query component implements search and view-toggle functionality extracted from admin.html to establish a reusable search/search-results interface for the Trellis UI.

## Components

### Primary UI Elements

- **Search input** — full-width text input with filter chips, inline clear
- **View toggle** — two-state controls (list vs grid) integrated into search bar
- **Results area** — conditional rendering of entity results, loading states, empty state
- **Facet panel** — optional sliding sidebar for advanced filters (powered by <trellis-sidebar>)

### Structure

```
<trellis-shell>
  <header>
    <trellis-query />
  </header>
  <div class="content">
    <trellis-sidebar>
      <facet-panel />
    </trellis-sidebar>
    <div class="results">
      <trellis-entity-list />
    </div>
  </div>
</trellis-shell>
```

## Colors

```yaml
typography:
  body:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
    fontSize: 13px
    fontWeight: 400
  heading:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
```

## Layout

Search bar sits above results, with optional facet sidebar on left/right.

- Search bar height: 48px
- Result column width: 600px min, 800px max
- Sidebar width: 224px (expanded), 48px (collapsed)

## Components

### Search Input

```yaml
search:
  container:
    background: var(--search-bg, var(--surface-raised, #1c1c1c))
    border: 1px solid var(--search-border, var(--border, rgba(255,255,255,0.195)))
    borderRadius: var(--radius-md, 8px)
    height: 48px
  input:
    fontFamily: inherit
    fontSize: 14px
    color: var(--text, #e8e8e8)
    background: transparent
    border: none
    padding: 0 var(--space-4, 1rem)
    width: 100%
  chips:
    background: var(--search-chip-bg, var(--surface-inset, rgba(255,255,255,0.06)))
    color: var(--text-secondary, #9e9e9e)
    borderRadius: var(--radius-sm, 4px)
    padding: 0 var(--space-2, 0.5rem)
    fontSize: 12px
  clearButton:
    color: var(--text-tertiary, #6f6f6f)
    hover:
      color: var(--text, #e8e8e8)
```

### View Toggle

```yaml
viewToggle:
  container:
    background: var(--toolbar-bg, var(--surface-inset, #161616))
    borderRadius: var(--radius-sm, 4px)
    padding: 2px
  button:
    color: var(--text-secondary, #9e9e9e)
    background: transparent
    border: none
    borderRadius: var(--radius-sm, 4px)
    padding: 6px
    fontSize: 12px
    width: 32px
    height: 24px
    hover:
      background: var(--toolbar-active, var(--surface-raised, #1e1e1e))
    active:
      background: var(--surface-raised, #1e1e1e)
      color: var(--text-interactive, #9dbefe)
    iconSize: 16px
```

### Results Area

```yaml
results:
  background: var(--surface-bg, #101010)
  borderRadius: var(--radius-md, 8px)
  padding: var(--space-4, 1rem)
  gap: var(--space-3, 0.75rem)
  item:
    background: var(--card-bg, var(--surface-raised, #1c1c1c))
    border: 1px solid var(--card-border, var(--border, rgba(255,255,255,0.195)))
    borderRadius: var(--radius-md, 8px)
    padding: var(--space-3, 0.75rem)
    hover:
      background: var(--card-hover, rgba(255,255,255,0.04))
      borderColor: var(--card-border-hover, var(--border-strong, rgba(255,255,255,0.266)))
```

### Facet Panel (sidebar)

```yaml
facetPanel:
  container:
    background: var(--sidebar-bg, var(--surface-bg, #101010))
    borderRight: 1px solid var(--sidebar-border, var(--border, rgba(255,255,255,0.195)))
  header:
    fontSize: 13px
    fontWeight: 600
    color: var(--text-secondary, #9e9e9e)
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem)
  group:
    marginBottom: var(--space-4, 1rem)
  label:
    fontSize: 12px
    color: var(--text-tertiary, #6f6f6f)
    marginBottom: var(--space-2, 0.5rem)
  option:
    padding: var(--space-2, 0.5rem)
    borderRadius: var(--radius-sm, 4px)
    hover:
      background: var(--sidebar-item-hover, rgba(255,255,255,0.06))
    active:
      background: var(--sidebar-item-active, color-mix(in oklch, var(--text-interactive) 12%, transparent))
      color: var(--text-interactive, #9dbefe)
```

## Interaction matrix

| State | User Action | Result |
| ----- | ----------- | ------|
| **Search** | Type in input | Debounced search (|500ms|) triggers API call, shows loading indicator |
| **Search** | Click chip | Filters updated, results refreshed |
| **Search** | Clear button | Input cleared, all filters removed |
| **View** | Click list view | Results rendered as entity list layout (compact cards) |
| **View** | Click grid view | Results rendered as expanded card grid with preview image |
| **Facet** | Expand sidebar | Sliding panel opens from side, shows filter groups |
| **Facet** | Toggle filter | Active filters applied immediately, results updated |
| **Result** | Click entity | Navigates to entity detail page |
| **Result** | Hover entity | Shows quick actions (edit, duplicate, delete), preview tooltip |

## Accessibility

- **Keyboard navigation:** Tab through search input, chips, view toggle, results. Use Arrow keys to navigate within results list
- **Screen reader:** Search input has aria-label "Search entities", results region has aria-live region for announcements
- **Focus management:** Focus returns to search input after results update
- **Reduced motion:** respects prefers-reduced-motion for transitions
- **Color contrast:** All text meets WCAG 2.1 AA standards against background colors

## Open for Architect

```
Open issues for technical implementation (trellis-agent-architect):
- [ ] Integrate search API endpoint (IDPL query/get)
- [ ] Connect results to entity-list component (existing component)
- [ ] Implement facet panel data binding to search state
- [ ] Create search service (debounce, request caching, pagination)
- [ ] Add search analytics tracking (click, query)
- [ ] Implement server-side rendering for search results to improve SEO
- [ ] Add keyboard shortcut for focus to search (Ctrl+K)
- [ ] Implement search history/autocomplete (optional future enhancement)
```

Note: design component tokens adopt the three-layer token architecture from TRL-25 (foundation → semantic → components), flat naming (--search-bg, not --trellis-query-search-bg), and font-overridable system-ui default.