import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import type { TrellisDb } from 'trellis/browser'
import type { LiveResource } from 'trellis/browser'
import { liveEntity } from 'trellis/browser'
import { getTrellisClient } from './context.js'
import { resolveShell } from './shells.js'

export class TrellisEntity extends LitElement {
  @property({ type: String, reflect: true })
  accessor id: string = ''

  @property({ type: String, reflect: true })
  accessor type: string = ''

  @property({ type: Number, reflect: true })
  accessor vantage: number = 8

  @property({ type: String, reflect: true })
  accessor lane: string = 'main'

  @property({ type: Boolean, reflect: true })
  accessor editable: boolean = false

  private _client: any | null = null
  private _live: any | null = null
  private _unsub: (() => void) | null = null

  get data(): unknown | null {
    return this._live?.signal.value.data ?? null
  }

  get loading(): boolean {
    return this._live?.signal.value.loading ?? true
  }

  get error(): Error | null {
    return this._live?.signal.value.error ?? null
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('id') || changed.has('type')) {
      this._fetch()
    }
    if (changed.has('vantage')) {
      this._updateShell()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this._connect()
    this._updateShell()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._stop()
  }

  private _connect() {
    this._client = getTrellisClient(this)
    if (this._client && this.id && this.type) {
      this._fetch()
    }
  }

  private _fetch() {
    if (!this._client || !this.id) return

    this._stop()

    this._live = liveEntity(this._client, this.type, this.id)
    this._unsub = this._live.signal.subscribe((state: any) => {
      if (state.error) {
        this._dispatch('trellis-error')
      }
      this._dispatch('trellis-entity-update')
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

  private _updateShell() {
    this.setAttribute('data-shell', resolveShell(this.vantage))
    this.style.setProperty('--vantage', String(this.vantage))
  }

  private _dispatch(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }))
  }

  render() {
    if (this.loading) {
      return html`<slot></slot>`
    }

    if (this.error) {
      return html`<span class="missing">— error loading —</span><slot></slot>`
    }

    const shell = resolveShell(this.vantage)
    const d = this.data as Record<string, unknown> | null

    return html`<div class="entity" data-shell=${shell}>
      ${d?.title ? html`<span class="title">${d.title as string}</span>` : html`<span class="missing">— not present in ${this.lane} —</span>`}
      <slot></slot>
    </div>`
  }

  static styles = css`
    .entity {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      border: 1px solid var(--border);
      background: var(--bg);
      font-family: var(--font-sans);
    }
    .entity[data-shell='node'] {
      width: max-content;
      padding: var(--space-1) var(--space-2);
      font-size: var(--font-size-xs);
    }
    .entity[data-shell='row'] {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
    }
    .entity[data-shell='card'] {
      flex-direction: column;
      align-items: flex-start;
      padding: var(--space-4);
      min-width: 14rem;
    }
    .title {
      font-weight: var(--font-weight-medium);
      color: var(--primary);
    }
    .missing {
      font-size: var(--font-size-xs);
      color: var(--muted-content);
    }
  `
}

customElements.define('trellis-entity', TrellisEntity)
