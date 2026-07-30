import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'

export class TrellisShell extends LitElement {
  @property({ type: Boolean, reflect: true })
  accessor collapsible: boolean = false

  @property({ type: String, reflect: true })
  accessor theme: 'light' | 'dark' | 'high-contrast' = 'light'

  connectedCallback() {
    super.connectedCallback()
    if (this.theme) {
      this.setAttribute('data-theme', this.theme)
    }
  }

  updated(changed: PropertyValues) {
    if (changed.has('theme')) {
      if (this.theme) {
        this.setAttribute('data-theme', this.theme)
      } else {
        this.removeAttribute('data-theme')
      }
    }
  }

  render() {
    return html`
      <div class="shell">
        <header class="shell-header">
          <slot name="header"></slot>
        </header>
        <div class="shell-body">
          <div class="shell-main">
            <slot name="main"></slot>
          </div>
          <slot name="sidebar"></slot>
          <slot name="oplog"></slot>
        </div>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      color: var(--text, #e8e8e8);
      background: var(--surface-bg, #101010);
      min-height: 100vh;
    }

    .shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .shell-header {
      height: var(--header-height, 56px);
      background: var(--header-bg, rgba(22, 22, 22, 0.75));
      border-bottom: 1px solid var(--header-border, var(--border, rgba(255, 255, 255, 0.195)));
      display: flex;
      align-items: center;
      padding: 0 var(--space-4, 1rem);
      flex-shrink: 0;
    }

    .shell-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .shell-main {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-4, 1rem);
      background: var(--surface-bg, #101010);
    }

    @media (max-width: 768px) {
      .shell-body {
        flex-direction: column;
      }
    }
  `
}

customElements.define('trellis-shell', TrellisShell)