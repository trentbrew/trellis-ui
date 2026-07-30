import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

export interface BreadcrumbSegment {
  label: string
  icon?: string
  href?: string
  id?: string
}

export class TrellisBreadcrumb extends LitElement {
  @property({ type: Array })
  accessor segments: BreadcrumbSegment[] = []

  @property({ type: String, reflect: true })
  accessor separator: 'slash' | 'chevron' | 'dot' = 'chevron'

  _handleSegmentClick(segment: BreadcrumbSegment, index: number) {
    if (index === this.segments.length - 1) return
    if (segment.href) return

    this.dispatchEvent(new CustomEvent('trellis-breadcrumb-navigate', {
      bubbles: true,
      composed: true,
      detail: { segment, index }
    }))
  }

  _handleKeyDown(e: KeyboardEvent, segment: BreadcrumbSegment, index: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._handleSegmentClick(segment, index)
    }
  }

  _separatorTemplate(index: number) {
    if (index === 0) return ''
    switch (this.separator) {
      case 'slash':
        return html`<span class="sep" aria-hidden="true">/</span>`
      case 'dot':
        return html`<span class="sep dot" aria-hidden="true"></span>`
      default:
        return html`<span class="sep chevron" aria-hidden="true"></span>`
    }
  }

  render() {
    if (this.segments.length === 0) {
      return html`<nav class="breadcrumb" aria-label="Breadcrumb"><slot></slot></nav>`
    }

    return html`
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          ${repeat(this.segments, (seg, i) => seg.id || i, (segment, index) => {
            const isLast = index === this.segments.length - 1
            return html`
              <li class="breadcrumb-item">
                ${this._separatorTemplate(index)}
                ${isLast
                  ? html`
                      <span class="segment current" aria-current="page">
                        ${segment.icon ? html`<span class="seg-icon" aria-hidden="true">${segment.icon}</span>` : ''}
                        <span class="seg-label">${segment.label}</span>
                      </span>
                    `
                  : segment.href
                    ? html`
                        <a class="segment" href=${segment.href}>
                          ${segment.icon ? html`<span class="seg-icon" aria-hidden="true">${segment.icon}</span>` : ''}
                          <span class="seg-label">${segment.label}</span>
                        </a>
                      `
                    : html`
                        <button
                          class="segment"
                          @click=${() => this._handleSegmentClick(segment, index)}
                          @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, segment, index)}
                        >
                          ${segment.icon ? html`<span class="seg-icon" aria-hidden="true">${segment.icon}</span>` : ''}
                          <span class="seg-label">${segment.label}</span>
                        </button>
                      `
                }
              </li>
            `
          })}
        </ol>
        <slot></slot>
      </nav>
    `
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      color: var(--text-secondary, #9e9e9e);
      font-size: var(--font-size-sm, 0.875rem);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--space-1, 0.25rem);
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: var(--space-1, 0.25rem);
    }

    .segment {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1, 0.25rem);
      padding: var(--space-0, 0) var(--space-1, 0.25rem);
      background: none;
      border: none;
      border-radius: var(--radius-sm, 6px);
      color: var(--text-secondary, #9e9e9e);
      cursor: pointer;
      font-family: inherit;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      text-decoration: none;
      line-height: 2;
      transition: color 150ms ease, background-color 150ms ease;
    }

    .segment:hover {
      color: var(--text, #e8e8e8);
      background: var(--sidebar-item-hover, rgba(255, 255, 255, 0.06));
    }

    .segment:focus-visible {
      outline: 2px solid var(--border-focus, var(--color-blue-500));
      outline-offset: 2px;
    }

    .segment.current {
      color: var(--text, #e8e8e8);
      font-weight: 600;
      cursor: default;
      background: none;
    }

    a.segment {
      color: var(--text-interactive, #9dbefe);
    }

    a.segment:hover {
      color: var(--text-interactive, #9dbefe);
      text-decoration: underline;
    }

    .seg-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      font-size: 14px;
    }

    .seg-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sep {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-tertiary, #6f6f6f);
      user-select: none;
      flex-shrink: 0;
    }

    .sep.chevron::after {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-right: 1.5px solid var(--text-tertiary, #6f6f6f);
      border-bottom: 1.5px solid var(--text-tertiary, #6f6f6f);
      transform: rotate(-45deg);
    }

    .sep.dot::after {
      content: '';
      display: block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--text-tertiary, #6f6f6f);
    }

    @media (prefers-reduced-motion: reduce) {
      .segment {
        transition: none;
      }
    }
  `
}

customElements.define('trellis-breadcrumb', TrellisBreadcrumb)
