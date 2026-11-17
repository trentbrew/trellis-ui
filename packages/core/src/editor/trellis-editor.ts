import { LitElement, html, css } from 'lit'
import { property, state } from 'lit/decorators.js'
import type { PropertyValues } from 'lit'
import { Editor } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { liveEntity } from 'trellis/browser'
import { getTrellisClient } from '../context.js'
import { createSaveQueue, type SaveQueue } from './save-queue.js'

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

  /** Entity attribute holding the rich text. */
  @property({ type: String, reflect: true })
  accessor field: string = 'body'

  @property({ type: Number, reflect: true })
  accessor vantage: number = 8

  @property({ type: Boolean, reflect: true })
  accessor editable: boolean = false

  @property({ type: String, reflect: true })
  accessor placeholder: string = 'Start writing…'

  @state()
  private accessor _empty: boolean = true

  private _editor: Editor | null = null
  private _client: any | null = null
  private _live: any | null = null
  private _unsub: (() => void) | null = null
  private _queue: SaveQueue<string> | null = null

  connectedCallback() {
    super.connectedCallback()
    this._connect()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    // Flush before teardown: an edit still inside the settle window would
    // otherwise be lost when the window closes.
    void this._queue?.flush()
    this._stop()
    this._destroyEditor()
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('id') || changed.has('type')) {
      this._connect()
    }
    if (changed.has('editable')) {
      this._editor?.setEditable(this.editable)
    }
  }

  firstUpdated() {
    this._createEditor()
  }

  private _createEditor() {
    if (this._editor) return

    const mount = this.shadowRoot?.querySelector<HTMLElement>('.editor-content')
    if (!mount) return

    this._editor = new Editor({
      element: mount,
      content: '',
      extensions: [StarterKit],
      editable: this.editable,
      onUpdate: () => {
        const current = this._editor?.getHTML() ?? ''
        this._empty = this._editor?.isEmpty ?? current === ''
        this._dispatch('trellis-editor-update', { html: current })
        this._queue?.push(current)
      },
      onFocus: () => this._dispatch('trellis-editor-focus'),
      onBlur: () => {
        // Leaving the field is an explicit "done" — do not sit on the edit.
        void this._queue?.flush()
        this._dispatch('trellis-editor-blur')
      },
    })

    this._dispatch('trellis-editor-ready', { editor: this._editor })
    this._applyRemote(this._remoteContent())
  }

  private _destroyEditor() {
    this._editor?.destroy()
    this._editor = null
  }

  private _connect() {
    this._stop()

    this._client = getTrellisClient(this)
    if (!this._client || !this.id || !this.type) return

    this._queue = createSaveQueue<string>({
      save: (value) => this._save(value),
      onError: (error) => this._dispatch('trellis-error', { error }),
    })

    this._live = liveEntity(this._client, this.type, this.id)
    this._unsub = this._live.signal.subscribe((state: any) => {
      if (state.error) {
        this._dispatch('trellis-error', { error: state.error })
        return
      }
      this._applyRemote(this._readField(state.data))
    })
    this._live.start()
  }

  private _stop() {
    this._unsub?.()
    this._unsub = null
    this._live = null
    this._queue?.cancel()
    this._queue = null
  }

  private _remoteContent(): string | null {
    return this._readField(this._live?.signal.value?.data)
  }

  private _readField(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null
    const value = (data as Record<string, unknown>)[this.field]
    return typeof value === 'string' ? value : null
  }

  /**
   * Remote state is applied only when it actually differs. `setContent` resets
   * the selection, so echoing back the value we just saved would yank the
   * caret to the start of the document mid-sentence.
   */
  private _applyRemote(incoming: string | null) {
    if (incoming === null || !this._editor) return
    if (incoming === this._editor.getHTML()) return

    this._editor.commands.setContent(incoming, { emitUpdate: false })
    this._empty = this._editor.isEmpty
  }

  private async _save(value: string) {
    if (!this._client || !this.id) return
    await this._client.update(this.id, { [this.field]: value })
    this._dispatch('trellis-editor-save', { html: value })
  }

  public getHTML(): string {
    return this._editor?.getHTML() ?? ''
  }

  public setContent(content: string) {
    this._editor?.commands.setContent(content)
    this._empty = this._editor?.isEmpty ?? content === ''
  }

  /** Persist any pending edit now rather than at the end of the settle window. */
  public save(): Promise<void> {
    return this._queue?.flush() ?? Promise.resolve()
  }

  private _dispatch(name: string, detail?: unknown) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }))
  }

  render() {
    return html`<div class="editor-container">
      <div class="editor-content"></div>
      <slot name="toolbar"></slot>
      ${this._empty ? html`<div class="placeholder">${this.placeholder}</div>` : null}
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
