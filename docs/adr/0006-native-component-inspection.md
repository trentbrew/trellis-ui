# ADR 0006: Native Component Inspection

**Title:** Native Component Inspection and Observability
**Status:** draft
**Date:** 2026-07-30
**Author:** trentbrew
**Depends on:** ADR 0005 (UI Component Registry), ADR 0003 (Themes/Projections/Affordances)

## Context

trellis-ui uses Lit Web Components with shadow DOM. This provides encapsulation but creates an observability gap: agents (including the developer) cannot programmatically inspect component state, detect visual changes, or understand layout dynamics without a full browser renderer (Playwright, Playwright + Chromium, Browserbase, etc.).

Current inspection methods have friction:
- **Screenshots** — require a browser, a display, or a cloud service; only capture a single frame; cannot be diffed structurally
- **DevTools** — manual, not scriptable across the full component tree
- **Attribute reading via CDP** — requires connecting to a live browser process

The goal is for agents to inspect the entire component tree programmatically from within the Lit runtime itself — no external browser process needed.

## Decision

Add a structured, machine-readable inspection API to every trellis-ui component. The API has three layers:

### Layer 1: State Reflection (already partially in place)

Every component already reflects its state as HTML attributes and ARIA properties on the host element:
- `aria-selected`, `aria-expanded`, `aria-current="page"`
- `data-selected`, `data-shell`, `data-vantage`, `data-theme`
- Reflected `@property({ reflect: true })` values

This is the foundation. An agent reading the DOM can already determine a component's current state without rendering it.

### Layer 2: Structured State Export (new)

Add a standard `toState()` method on every LitElement subclass that returns a serializable plain-object snapshot of the component's complete state:

```typescript
// Proposed interface every component implements
interface Inspectable {
  toState(): ComponentState;
}

interface ComponentState {
  tag: string;           // e.g. "trellis-sidebar-nav"
  attributes: Record<string, string>;
  properties: Record<string, unknown>;
  slots: Record<string, SlotState[]>;
  children: ComponentState[];
  events: string[];      // registered event listeners
  animations: AnimationState[]; // if applicable
}

interface SlotState {
  name: string;
  assignedNodes: number;  // count of nodes in this slot
}

interface AnimationState {
  name: string;
  phase: 'idle' | 'running' | 'paused' | 'finished';
  duration: number;
  currentTime: number;
}
```

### Layer 3: Component Tree Diff (new)

A utility function that snapshots the full component tree and diffs it between two points in time:

```typescript
import { snapshotTree, diffTrees } from '@trellis.computer/ui/inspect';

const before = snapshotTree(document.body);
// ... user interaction ...
const after = snapshotTree(document.body);
const changes = diffTrees(before, after);

// changes includes:
// - added/removed components
// - changed attributes (old → new)
// - changed slots (assigned nodes count changed)
// - animation state transitions
```

## Implementation Plan

### Phase 1: Utility module (week 1)
- Add `packages/core/src/inspect/index.ts` — `snapshotTree()`, `diffTrees()`, `toState()`
- Add a `TrellisInspectable` mixin that Lit components can extend to get `toState()` for free
- Export from `packages/core/src/index.ts`

### Phase 2: Attribute conventions (week 1)
- Establish naming conventions for data attributes used in inspection:
  - `data-trellis-role` — semantic role (e.g., `navigation`, `search`, `toggle`)
  - `data-trellis-state` — current binary state (`active`, `expanded`, `selected`, etc.)
  - `data-trellis-payload` — JSON-serialized state detail (for complex values like selected item ID)

### Phase 3: Animation metadata (week 2)
- Components that use CSS transitions/animations declare their animation contracts via a static `animations` getter
- The `snapshotTree` utility reads `getAnimations()` from the element and records phase/duration

### Phase 4: Dev overlay (week 2)
- Optional `<trellis-inspect>` component that renders the tree as a collapsible JSON tree in an overlay panel
- Toggle with `Ctrl+Shift+I` (keyboard shortcut)
- Useful for debugging and for agents running inside a live browser context

## What Does NOT Change
- Shadow DOM encapsulation — components still hide their internals; the inspection API reads only what's exposed through the host element
- Rendering pipeline — no visual changes to any component
- Build output — inspection code is tree-shaken in production builds (dead code elimination)

## Why This Matters
- **Agents can assert without rendering** — verify component state (selected, expanded, disabled) by reading DOM attributes, not by comparing screenshots
- **Animations and jank are detectable** — the tree diff captures animation state transitions between frames, exposing dropped frames or stutters
- **Regression testing without screenshots** — structural assertions (`element has 3 nav items`, `sidebar is collapsed`) are cheaper and more reliable than pixel comparisons
- **Self-describing components** — the `toState()` output is a complete contract of what a component knows about itself at any moment

## Backward Compatibility
- `toState()` is a new method; no existing attributes or behaviors change
- `data-trellis-*` attributes are opt-in conventions; existing components without them still work
- The inspect module is dynamically importable; zero overhead if not used

## Open Questions
1. **`data-trellis-payload` size** — should we cap the JSON payload to avoid bloating the DOM with large state? Recommendation: serialize only primitives and short arrays; reference IDs for large objects.
2. **`getAnimations()` reliability** — the Web Animations API is well-supported but `getAnimations()` may not capture CSS `@keyframes` animations that are purely declarative. Should we also track a manual animation state machine for complex transitions?
3. **Production vs. dev build** — should the inspect module be automatically excluded in production builds via Vite's `define` or `resolve.alias`? Yes — tree-shake it in production.
4. **`trellis-inspect` overlay** — does this belong in `@trellis.computer/ui` core or as a separate dev-only package? Recommendation: in core but tree-shaken; the overlay is a dev-only convenience that has zero runtime cost when not rendered.