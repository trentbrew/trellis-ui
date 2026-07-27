# ADR 0002: Registry Architecture

**Title:** Registry Architecture
**Status:** draft
**Date:** 2026-07-26
**Author:** trentbrew
**Depends on:** ADR 0001 (Agent & Workflow Ontology)

## Context

The trellis ecosystem currently has two problems:

1. **No publish/discover mechanism** — agent configurations, workflow definitions, and ontology schemas live as files in each repo. There is no way for a user to discover and install a community-authored workflow or agent role.

2. **No shared contract for UI theming** — themes (fonts, colors, spacing, tokens), projections (renderers for different view modes), and affordances (interaction patterns) are defined ad hoc per package. There is no registry contract that lets third parties publish alternative themes or projections and have them compose together.

The `@trellis.computer` npm org already exists for the UI library (`@trellis.computer/ui`, `@trellis.computer/icons`, `@trellis.computer/fonts`). The registry approach extends this org to cover the broader ecosystem.

## Decision

Adopt a two-level registry architecture:

### 1. npm org for ecosystem packages

All community-publishable artifacts live under `@trellis.computer/*`:

| Package | Contents | Example |
|---------|----------|---------|
| `@trellis.computer/ui` | Web Component library | `@trellis.computer/ui@2.4.0` |
| `@trellis.computer/workflows` | Workflow definitions (JSON-LD) | feature-development, bug-fix, release |
| `@trellis.computer/agents` | Agent role definitions | strategist, executor, reviewer |
| `@trellis.computer/ontologies` | Schema definitions | design-system, project-management |
| `@trellis.computer/adapters` | IDE adapter generators | cursor, devin, claude |
| `@trellis.computer/projections` | UI projection definitions | kanban, table, graph |
| `@trellis.computer/affordances` | UI affordance definitions | edit, inspect, promote |
| `@trellis.computer/themes` | Theme contracts (fonts, colors, tokens, animations) | default, dark, high-contrast |

### 2. Theme contract as the composition anchor

Themes are not just a UI concern — they are the shared contract that everything renders against. A theme package (`@trellis.computer/themes`) defines:

- **Tokens** — oklch color palette, spacing scale, typography scale, shadow tokens
- **Fonts** — font family declarations and weight ranges
- **Icons** — icon set variant (same shape, different color/size for the theme)
- **Animations** — duration, easing, motion preferences

The theme contract is a single interface: a CSS custom property map on `:root` with a known set of variables. Any projection or affordance that renders against a theme reads from this map. The author of a theme dictates what variables exist; the author of a projection dictates what variables it reads (and what happens if a variable is missing — falls back to a default or errors visibly).

### 3. `trellis add` as the unified entry point

```bash
trellis add workflow feature-development   # from @trellis.computer/workflows
trellis add agent strategist               # from @trellis.computer/agents
trellis add ontology design-system         # from @trellis.computer/ontologies
trellis add adapter cursor                  # from @trellis.computer/adapters
trellis add theme default                   # from @trellis.computer/themes

trellis list workflows                     # list installed
trellis list agents                        # list installed
trellis list themes                        # list installed

trellis remove workflow feature-development  # uninstall
```

### 4. Installation flow

1. `trellis add <type> <name>`
2. CLI resolves `@trellis.computer/<type>-<name>` (npm package)
3. Downloads package, extracts JSON-LD entities (or CSS/theme files)
4. Registers entities in the local graph via entity creation, or writes theme files to `.trellis/themes/`
5. Updates `.trellis/agent-manifest.json` (unified architecture manifest)

## Consequences

- **Independent versioning** — a workflow update (`@trellis.computer/workflows@1.2.0`) does not require a kernel release
- **Community publishing** — third parties can publish workflows, agents, ontologies, themes without forking the kernel
- **Discovery gap** — npm is a package registry, not a discovery surface. Curated listing or TQL-based search over published metadata is a future concern
- **Theme composability** — projections and affordances compose through the theme contract, not through direct coupling. A projection designed for the default theme can be used with any theme that provides the expected CSS variables
- **Affordance as app** — each affordance bundles its own contracts and ontologies from the registry, with the user's theme overriding visual appearance

## Open Questions

1. **Package granularity** — Should `@trellis.computer/workflows` be a single package with all workflows, or per-workflow packages (`@trellis.computer/workflow-feature-development`)? Recommendation: single package for simplicity; per-workflow packages create npm sprawl.
2. **Registry discovery** — How do users discover available packages? npm search is insufficient. A curated website or `trellis search <type> <query>` CLI command is needed. Defer to Phase 2.
3. **Theme versioning** — Should themes be versioned independently of the UI library? Recommendation: yes, themes are independent packages with their own semver.
4. **Projection contract** — What is the exact interface a projection must implement? Recommendation: a `render(entity, theme, options)` function contract, with the theme providing CSS variable lookups and the projection defining layout behavior. Defer to formalization when UI projections are implemented.
