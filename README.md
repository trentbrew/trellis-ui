# trellis-ui

UI components and design tokens for the [Trellis](https://github.com/anomalyco/trellis) graph OS — built with Web Components (Lit) and design-token-driven theming.

## Packages

| Package | Description |
|---|---|
| `packages/core` | Web components: `trellis-provider`, `trellis-entity`, `trellis-entity-list`, `resolveShell`, signal bindings |
| `packages/core/editor` | Rich text editor: `trellis-editor`, `trellis-mention-chip`, and ProseMirror node views |
| `packages/icons` | SVG icon registry with packs (action, chrome, entity, status) |
| `packages/fonts` | Font registry with packs (display, mono, sans, serif) |
| `tokens/` | Design tokens — colors, spacing, typography, design tokens as CSS custom properties |

## Install

```bash
pnpm install
```

## Build

```bash
pnpm build          # build all packages
pnpm -r build       # same, via workspace
```

## Scripts

| Script | Description |
|---|---|
| `build` | Build all packages with Vite |
| `check` | TypeScript type-check all packages |
| `typecheck` | Alias for `check` |
| `lint` | Run `tsc --noEmit` across all packages |

## Usage

```html
<trellis-provider url="http://localhost:8080" api-key="...">
  <trellis-entity id="issue-42" type="issue" vantage="8" editable></trellis-entity>
</trellis-provider>
```

## Design Tokens

Tokens are organized into four files under `tokens/`:

- **colors.css** — Background, brand, state, and entity-type color palette (oklch)
- **spacing.css** — Spacing scale, border radii, and shadows
- **typography.css** — Font families, sizes, weights, and line heights
- **design-tokens.css** — Consolidated design-token entry point

## Tech Stack

- **Lit** — Web component framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **pnpm** — Workspace package manager

## License

Private — Turtle Labs LLC