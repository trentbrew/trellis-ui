# trellis-ui

UI components and design tokens for the [Trellis](https://github.com/anomalyco/trellis) graph OS — built with Web Components (Lit) and design-token-driven theming.

## Packages

| Package | Description |
|---|---|---|
| `packages/core` | Web components: `trellis-provider`, `trellis-entity`, `trellis-entity-list`, `trellis-query`, `trellis-shell`, `trellis-sidebar`, `trellis-sidebar-nav`, `trellis-header`, `trellis-breadcrumb`, `trellis-search`, `trellis-view-toggle`, `trellix-query`, `resolveShell`, signal bindings |
| `packages/core/editor` | Rich text editor: `trellis-editor`, `trellis-mention-chip`, and ProseMirror node views |
| `packages/icons` | SVG icon registry with packs (action, chrome, entity, status) |
| `packages/fonts` | Font registry with packs (display, mono, sans, serif) |
| `tokens/` | Design tokens — foundation, semantic, and component layers as CSS custom properties |

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
| `test:e2e` | Run e2e tests |
| `dev` | Start the dev playground (Vite) |

## Dev Playground

```bash
just run          # start dev server on :5173
just run --port 3000  # custom port
just stop             # kill dev server
```

The playground at `http://localhost:5173` demos all layout components. Mock server for `trellis` peer dependency is configured in `vite.config.js`.

## Usage

```html
<trellis-provider url="http://localhost:8080" api-key="...">
  <trellis-entity id="issue-42" type="issue" vantage="8" editable></trellis-entity>
  <trellis-entity-list type="issue" where='{"lane":"main"}'></trellis-entity-list>
</trellis-provider>
```

### Layout components

```html
<trellis-shell>
  <trellis-header slot="header">
    <trellis-breadcrumb slot="breadcrumb" .segments=${[
      { label: 'Projects', id: 'root' },
      { label: 'Trellis', id: 'trellis' },
    ]}></trellis-breadcrumb>
    <trellis-search slot="actions"></trellis-search>
    <trellis-view-toggle slot="actions"></trellis-view-toggle>
  </trellis-header>
  <trellis-sidebar slot="sidebar" position="left">
    <trellis-sidebar-nav slot="main" .zones=${zones}></trellis-sidebar-nav>
  </trellis-sidebar>
  <div slot="main">
    <trellis-entity id="doc-1" type="document" vantage="8"></trellis-entity>
  </div>
</trellis-shell>
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