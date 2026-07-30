import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'

export class TrellisSidebar extends LitElement {
  @property({ type: Boolean, reflect: true })
  accessor expanded: boolean = true

  @property({ type: String, reflect: true })
  accessor position: 'left' | 'right' = 'left'

  @property({ type: Number })
  accessor width: number = 200

  @property({ type: Boolean, reflect: true })
  accessor rail: boolean = false

  connectedCallback() {
    super.connectedCallback()
    this._applyWidth()
  }

  updated(changed: PropertyValues) {
    if (changed.has('width') || changed.has('expanded')) {
      this._applyWidth()
    }
  }

  private _applyWidth() {
    if (!this.expanded && this.rail) {
      this.style.setProperty('--sidebar-w', '0px')
    } else {
      this.style.setProperty('--sidebar-w', `${this.width}px`)
    }
  }

  toggle() {
    this.expanded = !this.expanded
  }

  render() {
    return html`
      <aside class="sidebar" part="sidebar">
        <div class="sidebar-rail" @click=${this.toggle}>
          <slot name="rail"></slot>
        </div>
        <div class="sidebar-content">
          <slot></slot>
        </div>
      </aside>
    `
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      color: var(--text, #e8e8e8);
      background: var(--sidebar-bg, var(--surface-bg, #101010));
      border-right: 1px solid var(--sidebar-border, var(--border, rgba(255, 255, 255, 0.195)));
      transition: width 0.2s ease;
      overflow: hidden;
      flex-shrink: 0;
    }

    :host([position='right']) {
      border-right: none;
      border-left: 1px solid var(--sidebar-border, var(--border, rgba(255, 255, 255, 0.195)));
    }

    .sidebar {
      display: flex;
      width: var(--sidebar-w, var(--sidebar-expanded-w, 200px));
      min-width: var(--sidebar-min-w, 140px);
      max-width: var(--sidebar-max-w, 360px);
      height: 100%;
    }

    .sidebar-rail {
      width: var(--sidebar-rail-w, 56px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: var(--space-2, 0.5rem);
      border-right: 1px solid var(--sidebar-border, var(--border, rgba(255, 255, 255, 0.195)));
      cursor: pointer;
      flex-shrink: 0;
      overflow-y: auto;
    }

    .sidebar-rail::part(rail-item) {
      height: var(--sidebar-rail-w, 56px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-2, 0.5rem);
    }

    :host(:hover) .sidebar-content {
      background: var(--sidebar-item-hover, rgba(255, 255, 255, 0.06));
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 100;
      }
    }
  `
}

customElements.define('trellis-sidebar', TrellisSidebar)