# ADR 0003: Themes, Projections & Affordances

**Title:** Themes, Projections & Affordances
**Status:** draft
**Date:** 2026-07-26
**Author:** trentbrew
**Depends on:** ADR 0002 (Registry Architecture)

## Context

trellis-ui currently has a token system (oklch CSS custom properties, light/dark/high-contrast themes) and component packages (core, icons, fonts). But there is no formal contract that ties them together for third-party consumption:

1. **Themes** — a theme is currently just a CSS file with custom properties. There is no schema defining what variables a theme must provide, no versioning, and no way for a third party to publish an alternative theme that components can consume.

2. **Projections** — a projection is a rendering strategy (e.g., how a card renders vs a row vs a node). Currently, `resolveShell(vantage)` in `shells.ts` hardcodes the mapping. There is no contract that lets a third party define a new projection (e.g., a "timeline" projection or a "board" projection) that components render against.

3. **Affordances** — an affordance is an interaction pattern (e.g., edit, inspect, promote). Currently affordances are implicit in component event handling (`trellis-entity-click`, etc.). There is no formal concept of a "whole app" that bundles its own components, ontologies, projections, and theme overrides.

The goal: make themes, projections, and affordances first-class, discoverable, composable concepts with formal contracts.

## Decision

### Theme Contract

A theme is a package (`@trellis.computer/themes`) that provides a CSS custom property map on `:root`. The contract:

```css
/* Required: any theme must provide these variable groups */
:root {
  /* Color tokens */
  --color-bg: oklch(...);
  --color-fg: oklch(...);
  --color-primary: oklch(...);
  --color-destructive: oklch(...);
  --color-muted-content: oklch(...);
  /* ... (full color group) */

  /* Spacing tokens */
  --space-1: ...;
  --space-2: ...;
  /* ... */

  /* Typography tokens */
  --font-sans: ...;
  --font-size-xs: ...;
  /* ... */

  /* Structural tokens */
  --border: ...;
  --radius-md: ...;
  --shadow-sm: ...;
  /* ... */
}
```

A projection that renders a card reads `--color-primary`, `--space-2`, `--font-sans`, etc. from the theme. If a variable is missing, the projection uses a fallback or reports a visible error. The theme author defines what exists; the projection author defines what it reads.

### Projection Contract

A projection is a rendering strategy that takes an entity (or list of entities) and renders it against a theme. A projection is defined as a JSON-LD entity with:

- **name** — human-readable title
- **component** — the custom element tag that implements the projection (e.g., `trellis-entity-list`)
- **shellMap** — maps vantage ranges to shell types (e.g., `0-4: node, 5-7: row, 8+: card`)
- **themeReads** — list of CSS custom properties the projection reads (enables validation)
- **themeWrites** — list of CSS custom properties the projection sets (e.g., for dynamic theming)

Projections are registered in the `@trellis.computer/projections` registry. A user's theme dictates how every projection looks. The projection author dictates what is allowed to project upon it (e.g., a "kanban" projection may require `status` and `priority` fields on entities).

### Affordance Contract

An affordance is a self-contained app that bundles its own:
- **Components** — custom elements from the registry
- **Ontologies** — entity types and relationships it operates on
- **Projections** — how it renders entities
- **Theme overrides** — CSS custom property overrides for this specific affordance

The affordance is the top-level composition unit — a whole application built from registry pieces, with the user's theme flowing down through overrides.

Affordances are registered in `@trellis.computer/affordances`. Examples:
- "task manager" — bundles entity-list, form-input, and card projection
- "knowledge graph" — bundles graph-view, entity-detail, and node projection
- "project board" — bundles kanban projection, entity-list, and status badges

### Composition Model

```
User's Theme (CSS custom properties on :root)
  │
  ├── Projection A (reads --color-primary, --space-2)
  │     └── Renders entities using theme tokens
  │
  ├── Projection B (reads --color-bg, --font-sans)
  │     └── Renders entities using theme tokens
  │
  └── Affordance X (bundles projections A + B)
        └── Overrides --color-primary for this affordance only
```

All projections and affordances share the same theme contract. An affordance can override theme variables locally (scoped to its DOM subtree), but the base theme applies everywhere.

## Consequences

- **Themes become versioned packages** — `@trellis.computer/themes@1.0.0` can be installed and swapped without touching components
- **Projections are composable** — a kanban projection and a table projection can coexist, both reading from the same theme
- **Affordances are "whole apps"** — a user installs a theme, a projection, and an affordance, and gets a working application
- **Component authors write against a contract** — they declare which CSS variables they read, making it clear what a theme must provide
- **Theme authors define the contract** — they decide which variables exist and what they mean
- **No coupling between projections and themes** — a projection works with any theme that provides the variables it reads

## Open Questions

1. **Theme variable validation** — Should the projection declare its `themeReads` as optional (with defaults) or required (theme must provide them)? Recommendation: optional with component-level defaults.
2. **Affordance scope isolation** — How does a theme override in an affordance scope to its DOM subtree without bleeding to siblings? Recommendation: CSS `@layer` or shadow DOM encapsulation. Defer to implementation.
3. **Projection discovery** — How does a component know which projections are available? Recommendation: runtime registry query (`IconRegistry`-style API). The kernel provides a `getProjection(name)` call.
4. **Animation tokens** — Should animation parameters (duration, easing) be part of the theme contract? Recommendation: yes, as `--motion-duration-fast`, `--motion-ease-default`, etc.
