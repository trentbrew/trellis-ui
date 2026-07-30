import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import { Editor } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { getTrellisClient } from '../context.js'

export interface TrellisEditorExport {
  id?: string
  type?: string
  vantage?: number
  editable?: boolean
}

export class TrellisEditor extends LitElement {
  @property({ type: String, reflect: true })
  accessor id: string = ''

  @property({ type: String, reflect: true })
  accessor type: string = ''

  @property({ type: Number, reflect: true })
  accessor vantage: number = 8

  @property({ type: Boolean, reflect: true })
  accessor editable: boolean = false

  @property({ type: String, reflect: true })
  accessor placeholder: string = 'Start writing…'

  private _editor: Editor | null = null
  private _content: string = ''

  connectedCallback() {
    super.connectedCallback()
    this._createEditor()
    this._updateVantage()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._destroyEditor()
  }

  private _createEditor() {
    const container = document.createElement('div')
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(container)
    }

    this._editor = new Editor({
      content: '',
      extensions: [StarterKit],
      editable: this.editable,
      onUpdate: () => {
        this._content = this._editor?.getHTML() || ''
        this._dispatch('trellis-editor-update', { html: this._content })
      },
      onFocus: () => {
        this._dispatch('trellis-editor-focus')
      },
      onBlur: () => {
        this._dispatch('trellis-editor-blur')
      },
    })

    this._dispatch('trellis-editor-ready', { editor: this._editor })
  }

  private _destroyEditor() {
    if (this._editor) {
      this._editor.destroy()
      this._editor = null
    }
  }

  private _updateVantage() {
    if (this._editor) {
      this._editor.setEditable(this.editable)
    }
  }

  public getHTML(): string {
    return this._editor?.getHTML() || ''
  }

  public setContent(html: string) {
    if (this._editor) {
      this._editor.commands.setContent(html)
    }
  }

  private _dispatch(name: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail,
    }))
  }

  render() {
    return html`<div class="editor-container">
      <div class="editor-content" id="editor-content"></div>
      <slot name="toolbar"></slot>
      ${this._content === '' ? html`<div class="placeholder">${this.placeholder}</div>` : null}
    </div>`
  }

  static styles = css`
    .editor-container {
      position: relative;
      min-height: 2rem;
      width: 100%;
    }
    .editor-content {
      min-height: inherit;
      width: 100%;
      padding: 0.5rem;
      outline: none;
    }
    .placeholder {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      color: var(--muted-foreground, #6f6f6f);
      pointer-events: none;
    }
  `
}

customElements.define('trellis-editor', TrellisEditor)