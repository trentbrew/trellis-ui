# trellis-editor Scope Document

## Goal

Build `<trellis-editor>` — a Lit Web Component that brings rich-text editing to trellis-ui, using tiptap (ProseMirror) as the editing engine but rendering all content through existing/reusable trellis-ui components. The editor is not a separate system — it is a projection surface that reuses the same entities, containers, and vantage logic as every other surface in Trellis.

## Architecture

```
<trellis-provider>
  <trellis-editor
    id="main-doc"
    type="document"
    vantage="{{vantage}}"
    editable
  ></trellis-editor>
</trellis-provider>
```

The editor is a single Lit element that bootstraps a tiptap Editor instance internally. It does NOT use React or Vue — tiptap is used in its standalone/Vue-free mode via `@tiptap/core` directly. NodeViews are Lit elements, not React components.

### Layer Split

| Layer | What it is | Status |
|---|---|---|
| **Editing engine** | tiptap core + ProseMirror schema — marks, nodes, commands, input rules | New — adds `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/pm` as deps |
| **Lit NodeViews** | Lit elements that render each ProseMirror node type | New — one per content type |
| **Trellis entities** | `trellis-entity`, `trellis-provider`, `resolveShell` — reused as-is | Existing |
| **Content components** | Mention chip, tabs, toggle, code block, entity embed, etc. | New — follow `trellis-entity` pattern |
| **Collaboration** | `RealtimeText` from `trellis` dependency, integrated as a tiptap extension | New — thin adapter |

### Why tiptap (not Plate or custom Slate)

- Plate is React-only — incompatible with Lit
- Custom Slate would require rebuilding ProseMirror-level infrastructure (schema, input rules, collaboration protocol)
- tiptap's NodeView API maps cleanly to Lit elements: each NodeView just needs `dom` element + update lifecycle
- tiptap is framework-agnostic at the Core layer — only the rendering shell (NodeViews, suggestions) is framework-specific

## Existing Foundation in trellis-ui

The trellis-ui library already provides the projection pattern:

### `trellis-entity` (`packages/core/src/entity.ts`)
- Attributes: `id`, `type`, `vantage`, `lane`, `editable`
- Renders `data.title` + `<slot>` for children
- CSS driven by `--vantage` custom property + `data-shell` attribute
- Uses `liveEntity()` from `trellis/browser` for reactive subscriptions

### `resolveShell()` (`packages/core/src/shells.ts`)
- `vantage 0-4` → `'node'` (compact inline, `font-size: 0.75rem`)
- `vantage 5-7` → `'row'` (standard row, `font-size: 0.875rem`)
- `vantage 8+` → `'card'` (expanded card, `padding: 1rem`)

### `trellis-provider` (`packages/core/src/provider.ts`)
- Provides `TrellisDb` client context via DOM traversal (`getTrellisClient()`)
- Child components find it via `element.closest('trellis-provider')`

### `RealtimeText` (trellis@3.4.0 peer dep)
- RGA-style sequence CRDT for collaborative text editing
- Supports insert/delete ops, room broadcasting, deterministic convergence
- Not yet wrapped in any trellis-ui component

## Phased Implementation

### Phase 1: Foundation (week 1-2)
**Goal**: Working editor shell with basic prose, headings, bold/italic, bullet lists, and entity mentions.

#### Files to create
```
packages/core/src/editor/
  index.ts                      # barrel export + customElements.define()
  trellis-editor.ts             # <trellis-editor> Lit element
  editor-node-map.ts            # maps ProseMirror node names → Lit NodeView factories
```

#### Files to modify
```
packages/core/package.json      # add @tiptap/core, @tiptap/starter-kit, @tiptap/pm deps
packages/core/src/index.ts      # export TrellisEditor + editor-node-map
```

#### What gets built
- **`<trellis-editor>`** element:
  - Creates a tiptap `Editor` instance internally (no React/Vue)
  - Mounts into its shadow DOM slot element
  - Accepts `vantage`, `editable`, `id`, `type` attributes (same as `trellis-entity`)
  - Passes `--vantage` CSS custom property to all child NodeViews

- **Basic prose extension**: paragraph, heading (h1-h4), bold, italic, strike, code, bullet list, ordered list, blockquote, hard break
  - Uses `@tiptap/starter-kit` as base

- **`<trellis-mention>`** component:
  - Lit element that renders `@entityName` as a chip
  - Uses `--vantage` to control size (chip at low vantage, full card at high vantage)
  - Follows `trellis-entity` pattern: attributes `id`, `type`, `vantage`, inline `editable`

- **Mention slash command**: `/` triggers mention menu, inserts entity reference node

#### What does NOT get built yet
- Tables, code blocks, tabs, file embeds, todos, diagrams
- Collaboration (RealtimeText)
- Suggestion popups with tippy
- Drag handles, table of contents, etc.

#### NodeView adapter interface
```typescript
// packages/core/src/editor/editor-node-map.ts

import type { Node } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'

export interface TrellisNodeViewProps {
  node: Node
  view: EditorView
  getPos: () => number
  selected: boolean
  editable: boolean
  vantage: number
}

export type NodeViewFactory = (props: TrellisNodeViewProps) => LitElement
```

### Phase 2: Richer content nodes (week 3-4)
**Goal**: Mention chips, embedded entities, tables, code blocks, todos, image/file embeds.

#### New components
- **`<trellis-entity-embed>`** — renders any Trellis entity inline, reusing `trellis-entity` rendering logic
  - Attributes: `id`, `type`, `vantage`
  - At low vantage: icon chip only
  - At high vantage: full entity card with metadata

- **`<trellis-code-block>`** — container for code blocks (pre + code)
  - Reuses `MonacoEditor` or `turtlecode` at high vantage (dense projection)
  - At low vantage: line count + language badge

- **`<trellis-table>`** — table container
  - Table rows/ cells rendered as Lit elements
  - Follows `trellis-entity` pattern with `data-shell` variants

- **`<trellis-todo>`** — todo item entity with checked/unchecked state
  - Reuses the `trellis-entity` pattern with a checkbox
  - State mutation via `trellis-provider` client

- **`<trellis-image-embed>`**/**`<trellis-file-embed>`** — for pasted URLs that self-enrich
  - Auto-extraction of metadata via trellis graph

#### Updated tiptap extensions
- Table extension (`@tiptap/extension-table`)
- Task list extension (`@tiptap/extension-task-list`)
- Custom extensions for:
  - `mention` (entity reference node type)
  - `embed` (URL embed that enriches via graph)
  - `code-block` (with language attribute)
  - `todo-item` / `todo-list`

### Phase 3: Advanced containers (week 5-6)
**Goal**: Tabs, toggles/collapsibles, headers, and other structural containers inside the editor — all using shared trellis-ui components.

#### New components
- **`<trellis-tabs>`** — EXACT SAME component used in admin chrome, browser affordances
  - Not editor-specific — a container entity type
  - Renders tab bar with `trellis-entity`-style chips
  - Supports add/rename/remove via ProseMirror transactions

- **`<trellis-toggle>`** / `<trellis-collapsible>` — same toggle used in file explorer tree views
  - Collapses/expands content at different vantages
  - `--vantage` CSS drives disclosure level

- **`<trellis-header>`** — same header used in readonly views throughout the system
  - Renders heading text with consistent typography tokens

#### Tiptap extensions as wrappers
Each container becomes a ProseMirror node type with a Lit NodeView that renders the corresponding trellis-ui container component. The node type carries `attrs` (e.g., tab id, active tab, collapsed state) that the Lit element reads in its render.

### Phase 4: Collaboration & Realtime (week 7-8)
**Goal**: Live collaborative editing via `RealtimeText`.

#### Integration
- Custom tiptap extension wrapping `RealtimeText`
- Extension intercepts ProseMirror transactions and maps them to `RealtimeText` ops
- `RealtimeText` broadcasts via `joinPresence()` / `createPresenceTransport()`
- Peer ops applied as ProseMirror transactions on the local editor

#### What it replaces
- The basic `doc` + `undo` extension still works for local-first editing
- `RealtimeText` becomes the transport layer for remote edits
- Editor falls back to local-only if no peer is connected

### Phase 5: Fractal awareness + edge cases (ongoing)
**Goal**: Vantage-driven progressive disclosure, read-only below threshold, seamless cross-view transitions.

#### Features
- `--vantage` CSS variable propagated to all NodeViews via the editor's viewport check
- NodeViews use `data-shell` attribute + CSS to progressive-disclose content
- `editable` attribute on `<trellis-entity>` maps to `readOnly` at low vantage
- ProseMirror content survives crossfade transitions (single editor instance, teleport mount)
- `data-vantage` attribute on each NodeView for CSS-level control

## Extension API (for consumers)

Treis-ui nodes should be extensible by Trellis app developers. The pattern:

```typescript
import { TrellisEditorExtension } from '@trellis.computer/ui'

// Register a custom node type that renders via a Lit element
TrellisEditorExtension.registerNode({
  name: 'custom-card',
  nodeView: CustomCardNodeView,  // extends LitElement
  schema: { ... },               // ProseMirror node spec
})
```

This lets Trellis apps add domain-specific content types (e.g., a kanban card inside a doc) withoutforking the editor.

## Open Questions / Decisions Needed

1. **tiptap version**: Use latest stable standalone (`@tiptap/core` + `@tiptap/starter-kit`) — no framework packages
2. **Lit version**: trellis-ui already uses `lit ^3.2.0` — keep consistent
3. **trellis dependency**: `>=3.4.0` already in peer deps — `RealtimeText` is available
4. **Collaboration scope**: Phase 4 scope may be trimmed depending on whether the Trellis graph sync layer is needed first
5. **NodeView props interface**: The `TrellisNodeViewProps` above is proposed; may need adjustment based on actual tiptap internals
6. **Shadow DOM**: trellis components use shadow DOM. ProseMirror NodeViews need `dom` reference — the Lit element's `renderRoot` works inside shadow DOM by default. Confirm tiptap can accept a shadow DOM element as the mount target (it creates a `<div>` and appends to `editorEl`, which can be inside shadow DOM).
7. **Styling**: tiptap injects default ProseMirror styles. These need to be scoped to the shadow DOM or overridden completely with trellis-ui tokens.

## Component Contract Summary

### `<trellis-editor>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | `string` | `''` | Document entity ID |
| `type` | `string` | `''` | Document entity type in the graph |
| `vantage` | `number` | `8` | Current vantage level |
| `editable` | `boolean` | `false` | Whether content is editable |
| `prose` | `boolean` | `true` | Use prose-shaped layout (max-width, line-height) |
| `placeholder` | `string` | `'Start writing…'` | Placeholder text when empty |
| `realtime` | `boolean` | `false` | Enable RealtimeText collaboration |

### Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `trellis-editor-ready` | Yes | `{ editor: Editor }` |
| `trellis-error` | Yes | `{ error: Error }` |

## Dependencies

```json
{
  "peerDependencies": {
    "trellis": ">=3.4.0",
    "lit": ">=3.2.0"
  },
  "dependencies": {
    "@tiptap/core": "^3.27.0",
    "@tiptap/starter-kit": "^3.27.0",
    "@tiptap/pm": "^3.27.0"
  },
  "devDependencies": {
    "@tiptap/extension-table": "^3.27.0",
    "@tiptap/extension-task-list": "^3.27.0",
    "@tiptap/extension-mention": "^3.27.0",
    "@tiptap/suggestion": "^3.27.0"
  }
}
```
