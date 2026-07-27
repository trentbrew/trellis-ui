# Daydream Musings: Code as Everything

Captured July 26, 2026. Not a prescription — a sketch for future consideration.

---

## Code as a Rich Editor

The projection + theme + affordance model works for prose. But code is different.

A prose projection renders read-only. A code projection needs **interaction state**: cursor position, selection, scroll offset, autocomplete widget, completion items. The projection contract (`render(entity, theme) → DOM`) doesn't cover mutation.

What if interactive projections are a separate type? `projection.mode: readonly | interactive`. Interactive projections get an `events` contract and can write back to the entity.

Or simpler: code is a **shell**, not a projection. `resolveShell(vantage)` already maps vantage numbers to rendering strategies. A code shell would be `shell: 'code'` — same routing logic, different rendering and interaction.

## Multi-Cursor in Notion

The inverse of prose annotations. In Notion, multi-cursor lets you sketch code blocks — multiple cursors for parallel editing, bracket matching across lines, inline math.

The opposite direction: highlighting and formatting prose or code comments, pasting embedded images/references next to code, hand-drawn annotations on top of code.

This implies a unified editing surface where code and prose share the same canvas. Notion gets this right because it's a block editor — blocks can be code, text, images, or embedded references. Trellis could treat blocks as entities with a `block` type.

## Code as Entities & Links

Every function mentioned in docs should be traceable. Every doc that references a function should update in realtime when the function changes.

If code decomposes into entities just like everything else:
- A function is an entity with type `func`
- A doc that references it has a relationship `references → func`
- A change to the func entity triggers a notification to all referencing docs
- The entity-list projection renders func entities with their reference count
- The projection shows a live diff as references change

This is the trellis model applied to code. The graph already tracks relationships — code is just another entity type in the graph.

## Mouse as Entity

The mouse has its own projection (cursor) and its own state (position, velocity, button state). Lower-level affordances handle mouse interactions. The OS shell treats the mouse as a first-class entity in the graph — its position is a field, its click events are relations to the entity it's hovering over.

This is a shell-level architectural decision, not a UI component decision. When we get to the shell design, cursor entities become natural.

## Running Code in Notes

A note entity should be able to execute code blocks. Notebooks, markdown files, and code comments all live in the same graph. Triggering a workflow from anywhere — a note, an entity, a reference — is just another relation edge.

## Monaco as Near-Term

For the near term, using Monaco as the code editor shell is pragmatic. It handles syntax highlighting, completion, errors, multi-cursor, and embedded images without building any of that from scratch. The shell just needs to:
1. Mount Monaco in a projection
2. Wire Monaco's model to the graph entity (sync on edit)
3. Use the theme for token coloring
4. Let Monaco's events write back to the entity

This lets us ship a code editor today while the projection/affordance model matures.

---

## Status

None of these are planned issues. This is a capture doc for future ADRs or proposals. No entity IDs, no ACs, no milestones.
