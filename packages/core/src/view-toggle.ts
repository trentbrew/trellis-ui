import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

export interface ViewOption {
  id: string
  label: string
  icon?: string
}

export class TrellisViewToggle extends LitElement {
  @property({ type: Array })
  accessor views: ViewOption[] = []

  @property({ type: String, reflect: true })
  accessor value: string = ''

  @property({ type: Boolean, reflect: true })
  accessor disabled: boolean = false

  _handleSelect(viewId: string) {
    if (this.disabled || viewId === this.value) return
    this.value = viewId
    this.dispatchEvent(new CustomEvent('trellis-view-toggle', {
      bubbles: true,
      composed: true,
      detail: { view: viewId }
    }))
  }

  _handleKeyDown(e: KeyboardEvent, index: number) {
    const len = this.views.length
    let nextIndex = -1

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (index + 1) % len
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (index - 1 + len) % len
    }

    if (nextIndex >= 0) {
      const next = this.views[nextIndex]
      if (next) {
        this._handleSelect(next.id)
        const el = this.shadowRoot?.querySelector(`[data-view-id="${next.id}"]`) as HTMLElement
        el?.focus()
      }
    }
  }

  render() {
    const options = this.views.length > 0 ? this.views : [
      { id: 'grid', label: 'Grid' },
      { id: 'kanban', label: 'Kanban' },
      { id: 'table', label: 'Table' }
    ]

    return html`
      <div class="toggle" role="radiogroup" aria-label="View mode">
        ${options.map((view, index) => {
          const isSelected = this.value === view.id || (!this.value && index === 0)
          const isDisabled = this.disabled

          return html`
            <button
              class="toggle-option ${classMap({ selected: isSelected, disabled: isDisabled })}"
              role="radio"
              aria-checked=${isSelected}
              aria-label=${view.label}
              ?disabled=${isDisabled}
              data-view-id=${view.id}
              tabindex=${isSelected ? '0' : '-1'}
              @click=${() => this._handleSelect(view.id)}
              @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, index)}
            >
              ${view.icon
                ? html`<span class="option-icon" aria-hidden="true">${view.icon}</span>`
                : ''}
              <span class="option-label">${view.label}</span>
            </button>
          `
        })}
        <div class="toggle-indicator" style="transform: translateX(${this._indicatorOffset()}px); width: ${this._indicatorWidth()}px;"></div>
      </div>
    `
  }

  private _indicatorOffset(): number {
    const selected = this.value || this.views[0]?.id || 'grid'
    const idx = this.views.findIndex(v => v.id === selected)
    if (idx < 0) return 0
    return idx * 100
  }

  private _indicatorWidth(): number {
    return this.views.length > 0 ? 100 / this.views.length : 33.33
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    .toggle {
      position: relative;
      display: inline-flex;
      background: var(--toolbar-track, #1e1e1e);
      border-radius: var(--radius-md, 8px);
      padding: 2px;
      gap: 0;
    }

    .toggle-option {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1, 0.25rem);
      padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
      background: none;
      border: none;
      border-radius: var(--radius-sm, 6px);
      color: var(--text-tertiary, #6f6f6f);
      cursor: pointer;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 500;
      line-height: 2;
      white-space: nowrap;
      transition: color 150ms ease;
    }

    .toggle-option:hover {
      color: var(--text-secondary, #9e9e9e);
    }

    .toggle-option:focus-visible {
      outline: 2px solid var(--border-focus, var(--color-blue-500));
      outline-offset: 2px;
    }

    .toggle-option.selected {
      color: var(--text, #e8e8e8);
    }

    .toggle-option.disabled {
      opacity: 0.4;
      cursor: default;
      pointer-events: none;
    }

    .toggle-option:disabled {
      opacity: 0.4;
      cursor: default;
      pointer-events: none;
    }

    .option-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      font-size: 14px;
    }

    .toggle-indicator {
      position: absolute;
      top: 2px;
      left: 2px;
      height: calc(100% - 4px);
      background: var(--toolbar-active, #1c1c1c);
      border-radius: var(--radius-sm, 6px);
      z-index: 0;
      transition: transform 200ms ease, width 200ms ease;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .toggle-option {
        transition: none;
      }
      .toggle-indicator {
        transition: none;
      }
    }
  `
}

customElements.define('trellis-view-toggle', TrellisViewToggle)
