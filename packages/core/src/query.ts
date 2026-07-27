import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import type { LiveResource } from 'trellis/browser'
import { liveQuery } from 'trellis/browser'
import { getTrellisClient } from './context.js'

export class TrellisQuery extends LitElement {
  @property({ type: String, reflect: true })
  accessor query: string = ''

  @property({ type: String, reflect: true })
  accessor resolve: string = ''

  @property({ type: String, reflect: true, attribute: 'aria-label' })
  accessor ariaLabel: string = 'Query results'

  private _client: any | null = null
  private _live: LiveResource<any[]> | null = null
  private _unsub: (() => void) | null = null
  private _selectedId: string | null = null
  private _parseError: Error | null = null

  get data(): any[] | null {
    return this._live?.signal.value.data ?? null
  }

  get loading(): boolean {
    return this._live?.signal.value.loading ?? true
  }

  get error(): Error | null {
    return this._live?.signal.value.error ?? this._parseError
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('query') || changed.has('resolve')) {
      this._fetch()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this._connect()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._stop()
  }

  private _connect() {
    this._client = getTrellisClient(this)
    if (this._client && this.query) {
      this._fetch()
    }
  }

  private _fetch() {
    if (!this._client || !this.query) return

    this._stop()
    this._parseError = null

    let resolveObj: any = undefined
    if (this.resolve) {
      try {
        resolveObj = JSON.parse(this.resolve)
      } catch (e) {
        this._parseError = e instanceof Error ? e : new Error('Invalid JSON in resolve attribute')
        this.requestUpdate()
        return
      }
    }

    this._live = liveQuery(this._client, this.query)
    this._unsub = this._live.signal.subscribe((state: any) => {
      if (state.error) {
        this._dispatch('trellis-error')
      }
      this._dispatch('trellis-query-update')
      this.requestUpdate()
    })

    this._live.start()
  }

  private _stop() {
    if (this._unsub) {
      this._unsub()
      this._unsub = null
    }
    this._live = null
  }

  private _dispatch(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }))
  }

  private _handleItemClick(item: any, index: number) {
    const id = item.id || item.ID || `item-${index}`
    this._selectedId = id
    this.dispatchEvent(new CustomEvent('trellis-query-result-click', {
      bubbles: true,
      composed: true,
      detail: { item, index }
    }))
  }

  private _handleKeyDown(e: KeyboardEvent, item: any, index: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._handleItemClick(item, index)
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="query-container" role="list" aria-label="${this.ariaLabel}" aria-busy="true">
          <slot name="loading">
            <div class="query-loading" role="status">Loading results...</div>
          </slot>
        </div>
      `
    }

    if (this.error) {
      return html`
        <div class="query-container" role="list" aria-label="${this.ariaLabel}">
          <slot name="error">
            <div class="query-error" role="alert">${this.error.message}</div>
          </slot>
        </div>
      `
    }

    const items = this.data ?? []

    if (items.length === 0) {
      return html`
        <div class="query-container" role="list" aria-label="${this.ariaLabel}">
          <slot name="empty">
            <div class="query-empty" role="status">No results found</div>
          </slot>
        </div>
      `
    }

    return html`
      <div class="query-container" role="list" aria-label="${this.ariaLabel}" aria-live="polite">
        ${items.map((item, index) => {
          const id = item.id || item.ID || `item-${index}`
          const isSelected = this._selectedId === id

          return html`
            <div
              class="query-item"
              role="listitem"
              tabindex="0"
              aria-selected="${isSelected}"
              ?data-selected="${isSelected}"
              @click="${() => this._handleItemClick(item, index)}"
              @keydown="${(e: KeyboardEvent) => this._handleKeyDown(e, item, index)}"
            >
              <slot name="item">${this._defaultItemTemplate(item)}</slot>
            </div>
          `
        })}
      </div>
    `
  }

  private _defaultItemTemplate(item: any) {
    const title = item.title || item.name || item.text || JSON.stringify(item)
    const type = item.type || 'item'

    return html`
      <span>${title}</span>
      <span class="badge">${type}</span>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .query-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      border: 1px solid var(--border);
      background: var(--bg);
      border-radius: var(--radius-md);
      padding: var(--space-2);
      max-height: 40rem;
      overflow-y: auto;
      position: relative;
    }

    .query-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background-color 150ms ease;
      border-left: 2px solid transparent;
    }

    .query-item:hover {
      background: var(--bg-hover);
    }

    .query-item:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: 2px;
    }

    .query-item[data-selected] {
      background: var(--bg-hover);
      border-left-color: var(--primary);
    }

    .query-empty {
      padding: var(--space-4);
      text-align: center;
      color: var(--muted-content);
      font-size: var(--font-size-sm);
    }

    .query-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      color: var(--muted-content);
      font-size: var(--font-size-sm);
    }

    .query-loading::before {
      content: '';
      width: 1rem;
      height: 1rem;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: var(--radius-full);
      animation: spin 1s linear infinite;
      margin-right: var(--space-2);
    }

    .query-error {
      padding: var(--space-3);
      color: var(--destructive);
      font-size: var(--font-size-xs);
      border: 1px solid var(--destructive);
      border-radius: var(--radius-sm);
    }

    .badge {
      font-size: var(--font-size-xs);
      padding: 2px 6px;
      border-radius: var(--radius-full);
      background: var(--muted);
      color: var(--muted-content);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .query-item {
        transition: none;
      }
      .query-loading::before {
        animation: none;
      }
    }
  `
}

customElements.define('trellis-query', TrellisQuery)