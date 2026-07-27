import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'

export class TrellisMentionChip extends LitElement {
  @property({ type: String })
  accessor id: string = ''

  @property({ type: String })
  accessor type: string = ''

  @property({ type: Number })
  accessor vantage: number = 8

  render() {
    return html`<span class="mention-chip" data-vantage=${this.vantage}>
      @${this.type || 'entity'}
    </span>`
  }

  static styles = css`
    .mention-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      background: var(--mention-bg, #e0e0e0);
      border-radius: var(--radius-sm, 4px);
      font-size: 0.75rem;
      color: var(--mention-text, #161616);
    }
  `
}

customElements.define('trellis-mention-chip', TrellisMentionChip)

export { TrellisMentionChip }