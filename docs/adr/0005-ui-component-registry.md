# ADR 0005: UI Component Registry

**Title:** UI Component Registry
**Status:** draft
**Date:** 2026-07-26
**Author:** trentbrew
**Depends on:** ADR 0002 (Registry Architecture)

## Context

trellis-ui currently ships as a single npm package (`@trellis.computer/ui`) containing three sub-packages:
- `packages/core` — Web Components (provider, entity, entity-list)
- `packages/icons` — Icon registry (21 core icons, 4 categories)
- `packages/fonts` — Font registry (4 roles, core font entries)

Design tokens live in `tokens/` as CSS files. The `trellis add` CLI command does not yet exist. There is no formal component registry — components are discovered by importing the package directly.

The question is: should trellis-ui adopt the registry model proposed in ADR 0002, where ecosystem artifacts are discoverable and installable via `trellis add`?

## Decision

Adopt the registry model for trellis-ui with the following structure:

### Package Structure

| Package | Scope | What it contains |
|---------|-------|------------------|
| `@trellis.computer/ui` | core | All Web Components (provider, entity, entity-list, and future components) |
| `@trellis.computer/icons` | icons | Icon registry + all icon packs (core + extended) |
| `@trellis.computer/fonts` | fonts | Font registry + all font packs (core + extended) |
| `@trellis.computer/tokens` | tokens | Design token CSS (oklch, themes, typography, spacing) |
| `@trellis.computer/projections` | projections | Projection definitions (kanban, table, graph, etc.) |
| `@trellis.computer/affordances` | affordances | Pre-built affordance apps (task manager, knowledge graph, etc.) |

### Why Split Tokens?

Tokens (`@trellis.computer/tokens`) are separated from the UI package because:
- A theme (e.g., a dark corporate theme) may override tokens without changing components
- Projections and affordances read tokens directly from the theme, not from the UI package
- The `trellis add theme default` command installs tokens that become the `:root` CSS custom property map

### Component Registration

New components are registered via a standard pattern:

1. **Create the component** as a LitElement in `packages/core/src/`
2. **Define it** with `customElements.define('trellis-<name>', ComponentClass)`
3. **Export it** from `packages/core/src/index.ts`
4. **Register it** in the component registry (a JSON manifest mapping tag names to entry points)
5. **Add tests** (e2e smoke at minimum)
6. **Version bump** the parent package

### trellis add Integration

```bash
# Install the UI library
trellis add ui
# → @trellis.computer/ui (installs all components)

# Install a specific component only
trellis add ui component entity-list
# → cherry-picks just the entity-list component + its deps

# Install projections
trellis add projection kanban
# → @trellis.computer/projections/kanban

# Install a theme
trellis add theme dark
# → @trellis.computer/themes/dark (css custom property overrides)

# Install an affordance
trellis add affordance task-manager
# → @trellis.computer/affordances/task-manager (bundle of components + projections)
```

### trellis list Integration

```bash
trellis list components        # list all registered components
trellis list projections       # list available projections
trellis list themes            # list installed/available themes
trellis list affordances       # list available affordances
```

### Component Contract

Every component in `@trellis.computer/ui` must satisfy a contract:

1. **LitElement subclass** — uses the Lit framework, no framework-specific dependencies (no React, no Vue)
2. **CSS custom properties** — uses design tokens from `@trellis.computer/tokens`, never hardcodes colors/sizes
3. **Accessibility** — semantic HTML, ARIA attributes, keyboard navigation, `prefers-reduced-motion`
4. **Events** — dispatches CustomEvents with `bubbles: true, composed: true` for cross-shadow-boundary communication
5. **Attributes** — all configurable properties are reflected as HTML attributes (using `@property({ reflect: true })`)
6. **Tests** — at minimum, an e2e smoke test verifying the component is importable and defines its custom element
7. **Documentation** — a DESIGN.md artifact with component description, interaction matrix, accessibility notes, and token dependencies

## Consequences

- **Components are discoverable** — `trellis list components` shows what's available without reading source
- **Theming is pluggable** — a dark theme overrides tokens; components just read them
- **Projections are composable** — a kanban projection + a card shell = working board without touching component code
- **Affordances are whole apps** — a task manager affordance bundles components, projections, and theme overrides into a single install
- **Sub-package split adds publish overhead** — each package (`ui`, `icons`, `fonts`, `tokens`, etc.) needs its own version, CI, and npm publish. Mitigation: use a monorepo workspace with a single CI pipeline that publishes all packages
- **Component cherry-picking** — `trellis add ui component entity-list` allows users to install only what they need, reducing bundle size

## Open Questions

1. **Monorepo vs multi-repo** — Should all `@trellis.computer/*` packages be in a single monorepo, or separate repos per package? Recommendation: monorepo for now. Multi-repo when community contributions require independent release cycles.
2. **Versioning strategy** — Should all packages share a semver version (lockstep) or version independently? Recommendation: independent semver for now; lockstep if the release process demands it.
3. **Cherry-pick granularity** — `trellis add ui component entity-list` — how does dependency resolution work? If entity-list depends on provider, should provider be auto-installed too? Recommendation: yes, auto-install transitive dependencies (like pnpm does for workspaces).
4. **The `trellis add` registry source** — Does `trellis add` pull from the npm registry directly, or from a curated index that reviews/publishes packages? Recommendation: npm registry directly for v1; curated index for v2 when governance is in place.
