# ADR 0001: Agent & Workflow Ontology

**Title:** Agent & Workflow Ontology
**Status:** draft
**Date:** 2026-07-26
**Author:** trentbrew

## Context

The agent infrastructure currently spans three fragmented layers:

1. **Workflow definitions** live as markdown files in `.devin/workflows/` and `.trellis/agents/workflows/`. They are prompt-level reference guides with no machine-readable format, no execution runtime, and no graph integration.

2. **Agent role definitions** live in `.cursor/skills/trellis-agent-*.md` files. They are IDE-specific, not versionable as data, and not queryable via TQL.

3. **Handoff protocol** is serialized as YAML footers in issue descriptions. The `HANDOFF_ROLES` and `HANDOFF_STATUSES` constants in `src/protocol/envelope.ts` are hardcoded, not schema-driven.

Meanwhile, the graph kernel already has:
- A mature ontology system (`core:Thing`, `core:Record`, etc.) with `@id`/`@type` JSON-LD patterns
- An agent harness that loads agents from the graph (`src/core/agents/harness.ts`)
- A `core:Workflow` schema that is defined but unused (only has `name`, `trigger`, `steps`, `active`)
- Orchestration types (`Route`, `SupervisorConfig`, `Orchestrator`) that are skeletal

The result: agents, workflows, and handoffs exist as **code and files** rather than **graph entities**. They cannot be queried, composed, versioned, or shared through the graph.

## Decision

Extend the existing ontology with formal schemas for workflows, agents, and handoffs. Make them first-class graph entities using `defineType()` and JSON-LD `@id`/`@type` patterns consistent with the existing schema set.

### Workflow Ontology

Extend the existing `core:Workflow` schema with structured step, edge, and gate entities:

- `core:Workflow` — extended with `turbo` field (`none | partial | all`)
- `core:WorkflowStep` — atomic unit: name, description, commands, turbo flag, layer (pre_flight | setup | implement | review | closure), optional subworkflow reference
- `core:WorkflowEdge` — routing rule: from step, to step, condition text, status (HANDOFF | CLARIFY | REJECT | BLOCKED | DECISION)
- `core:WorkflowGate` — quality gate: type (test | manual | ac_check | semantic_diff), criteria, onFail action (stop | retry | route_to), optional retryStep and failRoute

### Agent Ontology

Formalize agents, tools, and handoffs as graph entities mapping directly to existing types:

- `core:Agent` — name, role (9 selectOptions from HANDOFF_ROLES), description, workflow reference, inbox TQL query, model policy, status (active | inactive | deprecated), capabilities
- `core:Tool` — name, description, JSON schema for input, optional HTTP endpoint
- `core:Handoff` — name, status (5 selectOptions from HANDOFF_STATUSES), body, refs, timestamp, from/to agent relations, optional re (entity reference)

### Pipeline-as-Data

A `trellis:Pipeline` type composes workflows into a full orchestration model. Pipeline is not a mutation of `core:Workflow` but a new type that links multiple agent workflows together with routing logic and gate enforcement.

## Consequences

- Workflows become queryable via TQL: `SELECT ?w WHERE { [?w "type" "Workflow"] }`
- The `// turbo` convention becomes a first-class schema field, not a comment annotation
- Gates enforce quality checks (test pass, AC pass) before pipeline advancement
- Edges encode routing logic that the pipeline can follow programmatically
- Subworkflows enable composition (a feature-dev workflow can include a bug-fix workflow as a step)
- Agent model policy (cheap models for QA, strong models for reviewer) becomes graph-stored configuration
- Handoffs are auditable graph entities, not just YAML footers in issue descriptions
- IDE adapters (`.cursor/skills/`, `.devin/`) become consumers of graph data, not sources of truth

## Open Questions

1. **Schema tier** — Should `core:Agent` and `core:Handoff` be core tier (immutable, shipped with kernel) or system tier (versioned with releases, mutable)? Recommended: system.
2. **Workflow vs Pipeline** — Should `core:Workflow` be replaced by `trellis:Pipeline` as the top-level orchestration type? Recommended: new `trellis:Pipeline` type, keeping `core:Workflow` as the atomic step unit.
3. **Existing `core:Workflow` migration** — The current `core:Workflow` has `steps: multi_select` (string array). Recommendation: deprecate in favor of the richer step/edge/gate schema; existing entities get migrated or archived.
4. **Affordance formalization** — Should affordances get a formal `core:Affordance` schema? Recommendation: defer until UI work drives the need.
