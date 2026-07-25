import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import type { TrellisDb } from 'trellis/browser'

export class TrellisProvider extends LitElement {
  @property({ type: String, reflect: true })
  accessor url: string | null = null

  @property({ type: String, reflect: true, attribute: 'api-key' })
  accessor apiKey: string | null = null

  @property({ type: String, reflect: true, attribute: 'tenant-id' })
  accessor tenantId: string | null = null

  private _client: TrellisDb | null = null

  get client(): TrellisDb | null {
    return this._client
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('url') || changed.has('apiKey')) {
      this._reconnect()
    }
  }

  private async _reconnect() {
    if (!this.url) return

    this._dispatch('trellis-disconnected')

    const { TrellisDb } = await import('trellis/browser')
    this._client = new TrellisDb({ url: this.url, apiKey: this.apiKey ?? undefined, tenantId: this.tenantId ?? undefined })

    this._dispatch('trellis-connected')
  }

  private _dispatch(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }))
  }

  render() {
    return html`<slot></slot>`
  }
}

customElements.define('trellis-provider', TrellisProvider)
