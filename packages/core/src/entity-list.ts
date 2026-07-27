import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import type { LiveResource } from 'trellis/browser'
import { liveEntities } from 'trellis/browser'
import { getTrellisClient } from './context.js'

export class TrellisEntityList extends LitElement {
  @property({ type: String, reflect: true })
  accessor type: string = ''

  @property({ type: String, reflect: true })
  accessor where: string = ''

  @property({ type: String, reflect: true })
  accessor resolve: string = ''

  @property({ type: Number, reflect: true })
  accessor vantage: number = 8

  @property({ type: String, reflect: true, attribute: 'aria-label' })
  accessor ariaLabel: string = 'Entity list'

  private _client: any | null = null
  private _live: LiveResource<any[]> | null = null
  private _unsub: (() => void) | null = null
  private _selectedId: string | null = null

  get data(): any[] | null {
    return this._live?.signal.value.data ?? null
  }

  get loading(): boolean {
    return this._live?.signal.value.loading ?? true
  }

  get error(): Error | null {
    return this._live?.signal.value.error ?? null
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('type') || changed.has('where') || changed.has('resolve')) {
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
    if (this._client && this.type) {
      this._fetch()
    }
  }

  private _fetch() {
    if (!this._client || !this.type) return

    this._stop()

    const whereObj = this.where ? JSON.parse(this.where) : undefined
    const resolveObj = this.resolve ? JSON.parse(this.resolve) : undefined

    const opts: any = {}
    if (whereObj) opts.where = whereObj
    if (resolveObj) opts.resolve = resolveObj

    this._live = liveEntities(this._client, this.type, Object.keys(opts).length > 0 ? opts : undefined)
    this._unsub = this._live.signal.subscribe((state: any) => {
      if (state.error) {
        this._dispatch('trellis-error')
      }
      this._dispatch('trellis-entity-list-update')
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

  private _handleItemClick(entity: any) {
    const id = entity.id || entity.ID
    if (id) {
      this._selectedId = id
      this.dispatchEvent(new CustomEvent('trellis-entity-click', {
        bubbles: true,
        composed: true,
        detail: { entity }
      }))
    }
  }

  private _handleKeyDown(e: KeyboardEvent, entity: any) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._handleItemClick(entity)
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="list" role="list" aria-label="${this.ariaLabel}" aria-busy="true">
          <div class="loading" role="status">Loading...</div>
        </div>
      `
    }

    if (this.error) {
      return html`
        <div class="list" role="list" aria-label="${this.ariaLabel}">
          <div class="error" role="alert">${this.error.message}</div>
        </div>
      `
    }

    const items = this.data ?? []

    if (items.length === 0) {
      return html`
        <div class="list" role="list" aria-label="${this.ariaLabel}">
          <div class="empty" role="status">No items found</div>
        </div>
      `
    }

    return html`
      <div class="list" role="list" aria-label="${this.ariaLabel}">
        ${items.map((entity, index) => {
          const id = entity.id || entity.ID || `item-${index}`
          const isSelected = this._selectedId === id
          const title = entity.title || entity.name || String(id)
          const type = entity.type || this.type

          return html`
            <div
              class="item"
              role="listitem"
              tabindex="0"
              aria-selected="${isSelected}"
              ?data-selected="${isSelected}"
              @click="${() => this._handleItemClick(entity)}"
              @keydown="${(e: KeyboardEvent) => this._handleKeyDown(e, entity)}"
            >
              <span class="entity-type">${type}</span>
              <span class="entity-title">${title}</span>
            </div>
          `
        })}
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .list {
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

    .item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background-color 150ms ease;
    }

    .item:hover {
      background: var(--bg-hover);
    }

    .item:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: 2px;
    }

    .item[data-selected] {
      background: var(--bg-hover);
      border-left: 2px solid var(--primary);
    }

    .entity-title {
      font-weight: var(--font-weight-medium);
      color: var(--primary);
    }

    .entity-type {
      font-size: var(--font-size-xs);
      color: var(--muted-content);
      padding: var(--space-1) var(--space-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
    }

    .empty {
      padding: var(--space-4);
      text-align: center;
      color: var(--muted-content);
      font-size: var(--font-size-sm);
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      color: var(--muted-content);
      font-size: var(--font-size-sm);
    }

    .loading::before {
      content: '';
      width: 1rem;
      height: 1rem;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: var(--radius-full);
      animation: spin 1s linear infinite;
      margin-right: var(--space-2);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .loading::before {
        animation: none;
      }
    }

    .error {
      padding: var(--space-3);
      color: var(--destructive);
      font-size: var(--font-size-xs);
      border: 1px solid var(--destructive);
      border-radius: var(--radius-sm);
    }
  `
}

customElements.define('trellis-entity-list', TrellisEntityList)
