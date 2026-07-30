import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'

export class TrellixQuery extends LitElement {
  @property({ type: String, reflect: true })
  accessor query: string = ''

  @property({ type: Boolean, reflect: true })
  accessor expanded: boolean = true

  @property({ type: String, reflect: true })
  accessor view: 'list' | 'grid' = 'list'

  @property({ type: Number })
  accessor maxResults: number = 50

  private _chips: string[] = []

  connectedCallback() {
    super.connectedCallback()
  }

  updated(changed: PropertyValues) {
    if (changed.has('query')) {
      const term = this.query.trim()
      if (term && !this._chips.includes(term)) {
        this._chips = [...this._chips, term]
      }
    }
  }

  _handleSearchInput(event: InputEvent) {
    const input = event.target as HTMLInputElement
    const value = input.value.trim()
    if (value && !this._chips.includes(value)) {
      this._chips = [...this._chips, value]
      this.query = this._chips.join(' ')
    }
    input.value = ''
  }

  _removeChip(chip: string) {
    this._chips = this._chips.filter(c => c !== chip)
    this.query = this._chips.join(' ')
  }

  _clearAll() {
    this._chips = []
    this.query = ''
  }

  _toggleView() {
    this.view = this.view === 'list' ? 'grid' : 'list'
  }

  _toggleExpanded() {
    this.expanded = !this.expanded
  }

  render() {
    return html`
      <div class="query-container">
        <div class="query-search" role="search">
          <input
            class="query-input"
            type="search"
            placeholder="Search entities, milestones, branches..."
            aria-label="Search"
            @input=${this._handleSearchInput}
          />
          <div class="query-chips" role="list" aria-label="Active search filters">
            ${this._chips.map(
              chip => html`
                <span class="query-chip" role="listitem">
                  ${chip}
                  <button
                    class="query-chip-remove"
                    aria-label="Remove filter: ${chip}"
                    @click=${() => this._removeChip(chip)}
                  >
                    ×
                  </button>
                </span>
              `
            )}
          </div>
          <div class="query-actions">
            <button
              class="query-view-toggle"
              aria-label="Toggle view mode"
              @click=${this._toggleView}
            >
              ${this.view === 'list' ? 'Grid' : 'List'}
            </button>
            ${this._chips.length > 0
              ? html`
                  <button
                    class="query-clear"
                    aria-label="Clear all filters"
                    @click=${this._clearAll}
                  >
                    Clear all
                  </button>
                `
              : html``}
          </div>
        </div>

        ${this.expanded
          ? html`
              <div class="query-body">
                <div class="query-sidebar">
                  <slot name="facets"></slot>
                </div>
                <div class="query-results" aria-live="polite">
                  <slot name="results"></slot>
                </div>
              </div>
            `
          : html``}
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      color: var(--text, #e8e8e8);
      background: var(--surface-bg, #101010);
    }

    .query-container {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--search-border, var(--border, rgba(255, 255, 255, 0.195)));
      border-radius: var(--radius-md, 8px);
      background: var(--search-bg, var(--surface-raised, #1c1c1c));
      overflow: hidden;
    }

    .query-search {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      padding: var(--space-3, 0.75rem);
      border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.195));
    }

    .query-input {
      flex: 1;
      min-width: 200px;
      height: 40px;
      padding: 0 var(--space-3, 0.75rem);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.195));
      border-radius: var(--radius-sm, 4px);
      background: var(--surface-bg, #101010);
      color: var(--text, #e8e8e8);
      font-size: var(--font-size-base, 1rem);
      font-family: inherit;
      outline: none;
    }

    .query-input:focus {
      border-color: var(--border-focus, var(--text-interactive, #9dbefe));
    }

    .query-input::placeholder {
      color: var(--text-tertiary, #6f6f6f);
    }

    .query-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1, 0.25rem);
      flex: 1;
      min-width: 100px;
    }

    .query-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1, 0.25rem);
      padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
      background: var(--surface-inset, rgba(255, 255, 255, 0.06));
      border-radius: var(--radius-sm, 4px);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-secondary, #9e9e9e);
      white-space: nowrap;
    }

    .query-chip-remove {
      background: none;
      border: none;
      color: var(--text-tertiary, #6f6f6f);
      cursor: pointer;
      font-size: var(--font-size-base, 1rem);
      padding: 0;
      line-height: 1;
      min-width: 16px;
    }

    .query-chip-remove:hover {
      color: var(--text, #e8e8e8);
    }

    .query-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
    }

    .query-view-toggle {
      padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
      background: var(--toolbar-track, #1e1e1e);
      border: 1px solid var(--border, rgba(255, 255, 255, 0.195));
      border-radius: var(--radius-sm, 4px);
      color: var(--text-secondary, #9e9e9e);
      cursor: pointer;
      font-size: var(--font-size-xs, 0.75rem);
      font-family: inherit;
    }

    .query-view-toggle:hover {
      background: var(--toolbar-active, #1c1c1c);
      color: var(--text-interactive, #9dbefe);
    }

    .query-clear {
      padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
      background: none;
      border: 1px solid var(--border, rgba(255, 255, 255, 0.195));
      border-radius: var(--radius-sm, 4px);
      color: var(--text-tertiary, #6f6f6f);
      cursor: pointer;
      font-size: var(--font-size-xs, 0.75rem);
      font-family: inherit;
    }

    .query-clear:hover {
      color: var(--text, #e8e8e8);
      border-color: var(--text-interactive, #9dbefe);
    }

    .query-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .query-sidebar {
      width: var(--sidebar-w, var(--sidebar-expanded-w, 200px));
      min-width: var(--sidebar-min-w, 140px);
      max-width: var(--sidebar-max-w, 360px);
      border-right: 1px solid var(--border, rgba(255, 255, 255, 0.195));
      overflow-y: auto;
      padding: var(--space-3, 0.75rem);
      flex-shrink: 0;
    }

    .query-results {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3, 0.75rem);
    }

    @media (max-width: 768px) {
      .query-body {
        flex-direction: column;
      }

      .query-sidebar {
        width: 100%;
        max-width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.195));
      }
    }
  `
}

customElements.define('trellix-query', TrellixQuery)