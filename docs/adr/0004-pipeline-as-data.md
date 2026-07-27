# ADR 0004: Pipeline-as-Data

**Title:** Pipeline-as-Data
**Status:** draft
**Date:** 2026-07-26
**Author:** trentbrew
**Depends on:** ADR 0001 (Agent & Workflow Ontology), ADR 0002 (Registry Architecture)

## Context

The current pipeline orchestration is IDE-specific:

- **Pipeline steps** are defined as Cursor skill files in `.cursor/skills/trellis-agent-*.md`
- **Handoff routing** is encoded in YAML footers in issue descriptions (`from:`, `to:`, `re:`, `status:`)
- **Session bindings** (lane IDs, last decision, pipeline auto-advance) are stored in `~/.cursor/trellis-profiles/sessions/`
- **Stop hooks** (`trellis-pipeline-stop.mjs`) enforce verification gates and auto-advance

The result: the pipeline is **Cursor-specific**. It cannot run in a different IDE (Devin, Claude Code, etc.) without reimplementing all of these pieces. The pipeline logic — who does what, when, and how they hand off — is scattered across markdown files, JSON state files, and shell scripts.

## Decision

Make the pipeline a graph-stored data structure, not an IDE-specific configuration. Define a `trellis:Pipeline` type that captures the full orchestration model: roles, workflows, routing rules, and quality gates. IDE adapters consume this graph data and generate their own config files.

### Pipeline Type

`trellis:Pipeline` — the top-level orchestration entity. References agent workflows and defines routing between them.

```
trellis:Pipeline
  name: title (required)
  description: rich_text
  active: checkbox
  
  agents: relation → core:Agent[]    (roles participating in this pipeline)
  workflow: relation → trellis:Workflow (the orchestration workflow)
  startStep: relation → core:WorkflowStep (entry point)
```

### Workflow Type (pipeline-specific)

A `trellis:Workflow` for pipeline orchestration is a state machine that defines how work moves through stages:

```
trellis:Workflow (pipeline type)
  name: title (required)
  steps: relation → core:WorkflowStep[]  (ordered stages)
  edges: relation → core:WorkflowEdge[]  (routing rules)
  gates: relation → core:WorkflowGate[]  (quality checks between stages)
```

### Stage Steps (pipeline-specific)

Each `core:WorkflowStep` in a pipeline represents a stage:

| Stage | Role | What happens |
|-------|------|-------------|
| pre_flight | agent:strategist | Triage graph, state what landed, recommend pathway |
| design | agent:designer | Full Design Studio, design-critic if needs-design-deep |
| spec | agent:architect | Write spec with machine AC |
| impl | agent:executor | Implement, run verification ladder |
| review | agent:reviewer | Tiers 0–4 review, record outcome |
| route | agent:strategist | Acknowledge pass, triage, recommend next move |
| ship | agent:strategist | Close impl, promote lane, handle kernel touch-surface |

### Edge Routing

Edges define how work moves between stages:

```
core:WorkflowEdge
  from: core:WorkflowStep (e.g., "review")
  to: core:WorkflowStep (e.g., "route")
  condition: "REVIEW: PASS in review child"
  status: HANDOFF
```

When a review passes, the edge says HANDOFF to route → strategist gets the pass, triages the graph, and recommends the next move.

When a review rejects, the edge says HANDOFF back to impl → executor gets the rework feedback and fixes.

### Gate Enforcement

Gates are enforced at edge transitions:

```
core:WorkflowGate
  name: "Verify before route"
  step: core:WorkflowStep (the "review" step)
  type: ac_check
  criteria: "trellis issue check TRL-SPEC: all AC pass"
  onFail: stop
```

If the gate fails (ACs not passing), the pipeline stops. The reviewer is blocked from handing off to strategist until the gate passes.

### IDE Adapter Generation

Each IDE adapter (cursor, devin, claude) reads the pipeline graph and generates its own config:

```
Cursor adapter reads:
  core:Agent (role: strategist) → .cursor/skills/trellis-agent-strategist.md
  core:Agent (role: executor) → .cursor/skills/trellis-agent-executor.md
  trellis:Pipeline → .cursor/settings.json (pipeline config)

Devin adapter reads:
  core:Agent (role: strategist) → .devin/agents/strategist.md
  core:Agent (role: executor) → .devin/agents/executor.md
  trellis:Pipeline → .devin/pipeline.yaml
```

The adapters are consumers, not sources of truth. The pipeline lives in the graph.

## Consequences

- **Portable across IDEs** — the pipeline definition is graph-stored, not IDE-specific. Any adapter can consume it.
- **No "looks fine" passes** — gate enforcement is data-driven, not convention-driven. A gate says "run pnpm check" — if it doesn't pass, the pipeline stops.
- **Auditable routing** — every handoff is a graph entity with from/to/status/body. The full routing history is queryable.
- **Composable pipelines** — a team can define a custom pipeline (e.g., a "design-only" pipeline that skips impl and review) and register it as an npm package.
- **IDE adapters become thin** — they just translate graph data to IDE-specific config formats. No logic duplication.

## Open Questions

1. **Pipeline definition format** — Should pipeline definitions be JSON-LD files or TQL queries? Recommendation: JSON-LD for portability, TQL for querying.
2. **Gate evaluation** — Who evaluates gates? The orchestrator (kernel) or the IDE adapter? Recommendation: the orchestrator in the kernel evaluates gates and reports results; the adapter displays them.
3. **Existing adapter migration** — The `.cursor/skills/` files are currently hand-written. Should they be generated from graph data, or coexist with it during transition? Recommendation: generate from graph, keep the hand-written files as a fallback during migration.
4. **trellis:Pipeline vs core:Workflow** — Should pipeline orchestration be a separate type or just a specialized use of `core:Workflow`? Recommendation: new `trellis:Pipeline` type — it has specific semantics (stages, routing, gates) that don't fit a general workflow.
