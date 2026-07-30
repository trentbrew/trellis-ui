import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { live } from 'lit/directives/live.js'

export class TrellisSearch extends LitElement {
  @property({ type: String, reflect: true })
  accessor value: string = ''

  @property({ type: String, reflect: true })
  accessor placeholder: string = 'Search...'

  @property({ type: Boolean, reflect: true })
  accessor disabled: boolean = false

  @property({ type: Boolean, reflect: true })
  accessor autofocus: boolean = false

  private _inputEl: HTMLInputElement | null = null

  get _hasValue(): boolean {
    return this.value.length > 0
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.autofocus) {
      this.updateComplete.then(() => this._inputEl?.focus())
    }
  }

  _handleInput(e: InputEvent) {
    const input = e.target as HTMLInputElement
    this.value = input.value
    this.dispatchEvent(new CustomEvent('trellis-search-input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }))
  }

  _handleClear() {
    this.value = ''
    this._inputEl?.focus()
    this.dispatchEvent(new CustomEvent('trellis-search-clear', {
      bubbles: true,
      composed: true
    }))
    this.dispatchEvent(new CustomEvent('trellis-search-input', {
      bubbles: true,
      composed: true,
      detail: { value: '' }
    }))
  }

  _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this._hasValue) {
      this._handleClear()
    }
  }

  focus() {
    this._inputEl?.focus()
  }

  clear() {
    this._handleClear()
  }

  render() {
    return html`
      <div class="search ${classMap({ focused: this._hasValue })}" role="search">
        <span class="search-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input
          class="search-input"
          type="search"
          .value=${live(this.value)}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          aria-label=${this.placeholder}
          @input=${this._handleInput}
          @keydown=${this._handleKeyDown}
        />
        <button
          class="search-clear"
          ?hidden=${!this._hasValue}
          aria-label="Clear search"
          @click=${this._handleClear}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .search {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      height: var(--toolbar-control-h, 34px);
      padding: 0 var(--space-3, 0.75rem);
      background: var(--search-bg, var(--surface-raised, #1c1c1c));
      border: 1px solid var(--search-border, var(--border, rgba(255, 255, 255, 0.195)));
      border-radius: var(--radius-md, 8px);
      transition: border-color 150ms ease;
    }

    .search:focus-within {
      border-color: var(--border-focus, var(--color-blue-500));
    }

    .search.focused {
      border-color: var(--border-focus, var(--color-blue-500));
    }

    .search-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--text-tertiary, #6f6f6f);
      pointer-events: none;
    }

    .search-input {
      flex: 1;
      min-width: 0;
      padding: 0;
      background: none;
      border: none;
      outline: none;
      color: var(--text, #e8e8e8);
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      line-height: 1;
    }

    .search-input::placeholder {
      color: var(--text-tertiary, #6f6f6f);
      font-weight: 400;
    }

    .search-input:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .search-clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      background: none;
      border: none;
      border-radius: var(--radius-full, 999px);
      color: var(--text-tertiary, #6f6f6f);
      cursor: pointer;
      flex-shrink: 0;
      transition: color 150ms ease, background-color 150ms ease;
    }

    .search-clear:hover {
      color: var(--text, #e8e8e8);
      background: var(--sidebar-item-hover, rgba(255, 255, 255, 0.06));
    }

    .search-clear:focus-visible {
      outline: 2px solid var(--border-focus, var(--color-blue-500));
      outline-offset: 2px;
    }

    .search-clear[hidden] {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .search {
        transition: none;
      }
      .search-clear {
        transition: none;
      }
    }
  `
}

customElements.define('trellis-search', TrellisSearch)
