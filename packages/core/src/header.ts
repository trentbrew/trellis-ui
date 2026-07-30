import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'

export class TrellisHeader extends LitElement {
  @property({ type: Boolean, reflect: true })
  accessor sticky: boolean = false

  @property({ type: String, reflect: true })
  accessor variant: 'default' | 'glass' | 'inset' = 'glass'

  render() {
    return html`
      <header class="header" part="header">
        <div class="header-start" part="header-start">
          <slot name="breadcrumb"></slot>
        </div>
        <div class="header-center" part="header-center">
          <slot name="stats"></slot>
        </div>
        <div class="header-end" part="header-end">
          <slot name="actions"></slot>
        </div>
        <slot></slot>
      </header>
    `
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      color: var(--text, #e8e8e8);
    }

    :host([sticky]) {
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header {
      display: flex;
      align-items: center;
      height: var(--header-height, 56px);
      padding: 0 var(--space-4, 1rem);
      gap: var(--space-3, 0.75rem);
      border-bottom: 1px solid var(--header-border, var(--border, rgba(255, 255, 255, 0.195)));
      flex-shrink: 0;
    }

    .header-start {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
      gap: var(--space-2, 0.5rem);
    }

    .header-center {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
    }

    .header-end {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      flex-shrink: 0;
    }

    :host([variant='glass']) .header {
      background: var(--header-bg, var(--glass-surface, rgba(22, 22, 22, 0.75)));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    :host([variant='default']) .header {
      background: var(--surface-bg, #101010);
    }

    :host([variant='inset']) .header {
      background: var(--surface-inset, #161616);
    }

    @media (max-width: 820px) {
      .header-center {
        display: none;
      }
    }
  `
}

customElements.define('trellis-header', TrellisHeader)
