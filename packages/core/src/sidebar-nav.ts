import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { repeat } from 'lit/directives/repeat.js'

export interface NavItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  href?: string
  count?: number
}

export interface NavZone {
  id: string
  label: string
  items: NavItem[]
  collapsed?: boolean
}

export class TrellisSidebarNav extends LitElement {
  @property({ type: Array })
  accessor zones: NavZone[] = []

  @property({ type: String, reflect: true })
  accessor activeId: string = ''

  @property({ type: Boolean, reflect: true })
  accessor disabled: boolean = false

  private _collapsedZones: Set<string> = new Set()

  _toggleZone(zoneId: string) {
    if (this._collapsedZones.has(zoneId)) {
      this._collapsedZones.delete(zoneId)
    } else {
      this._collapsedZones.add(zoneId)
    }
    this.requestUpdate()
  }

  _handleNavClick(item: NavItem) {
    if (this.disabled || item.disabled) return
    if (item.href) return

    this.activeId = item.id
    this.dispatchEvent(new CustomEvent('trellis-nav-select', {
      bubbles: true,
      composed: true,
      detail: { item }
    }))
  }

  _handleKeyDown(e: KeyboardEvent, item: NavItem) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._handleNavClick(item)
    }
  }

  render() {
    if (this.zones.length === 0) {
      return html`
        <nav class="nav" aria-label="Sidebar navigation">
          <slot></slot>
        </nav>
      `
    }

    return html`
      <nav class="nav" aria-label="Sidebar navigation">
        ${repeat(this.zones, zone => zone.id, zone => {
          const zoneCollapsed = this._collapsedZones.has(zone.id) ?? zone.collapsed
          return html`
            <div class="zone" role="group" aria-label="${zone.label}">
              <button
                class="zone-toggle"
                aria-expanded="${!zoneCollapsed}"
                aria-controls="zone-${zone.id}"
                @click=${() => this._toggleZone(zone.id)}
              >
                <span class="zone-label">${zone.label}</span>
                <span class="zone-chevron" data-open=${!zoneCollapsed}></span>
              </button>
              <div class="zone-items" id="zone-${zone.id}" ?hidden=${zoneCollapsed} role="list">
                ${zone.items.map(item => {
                  const isActive = this.activeId === item.id
                  const isDisabled = !!(this.disabled || item.disabled)

                  if (item.href) {
                    return html`
                      <a
                        class="nav-item ${classMap({ active: isActive, disabled: isDisabled })}"
                        href=${item.href}
                        role="listitem"
                        aria-current=${isActive ? 'page' : undefined}
                        aria-disabled=${isDisabled}
                      >
                        ${item.icon ? html`<span class="nav-icon">${item.icon}</span>` : html`<span class="nav-dot"></span>`}
                        <span class="nav-label">${item.label}</span>
                        ${item.count != null ? html`<span class="nav-count">${item.count}</span>` : ''}
                      </a>
                    `
                  }

                  return html`
                    <button
                      class="nav-item ${classMap({ active: isActive, disabled: isDisabled })}"
                      role="listitem"
                      ?disabled=${isDisabled}
                      aria-current=${isActive ? 'page' : undefined}
                      @click=${() => this._handleNavClick(item)}
                      @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, item)}
                    >
                      ${item.icon ? html`<span class="nav-icon">${item.icon}</span>` : html`<span class="nav-dot"></span>`}
                      <span class="nav-label">${item.label}</span>
                      ${item.count != null ? html`<span class="nav-count">${item.count}</span>` : ''}
                    </button>
                  `
                })}
              </div>
            </div>
          `
        })}
        <slot></slot>
      </nav>
    `
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
      color: var(--text, #e8e8e8);
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-1, 0.25rem);
      padding: var(--space-2, 0.5rem) 0;
    }

    .zone {
      display: flex;
      flex-direction: column;
    }

    .zone-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
      background: none;
      border: none;
      color: var(--text-tertiary, #6f6f6f);
      cursor: pointer;
      font-family: inherit;
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 2;
      transition: color 150ms ease;
    }

    .zone-toggle:hover {
      color: var(--text-secondary, #9e9e9e);
    }

    .zone-label {
      flex: 1;
      text-align: left;
    }

    .zone-chevron {
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid var(--text-tertiary, #6f6f6f);
      transition: transform 150ms ease;
    }

    .zone-chevron[data-open='false'] {
      transform: rotate(-90deg);
    }

    .zone-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-0, 0);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      width: 100%;
      padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
      background: none;
      border: none;
      border-radius: var(--radius-sm, 6px);
      color: var(--text-secondary, #9e9e9e);
      cursor: pointer;
      font-family: inherit;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
      text-align: left;
      text-decoration: none;
      line-height: 2;
      transition: background-color 150ms ease, color 150ms ease;
    }

    .nav-item:hover {
      background: var(--sidebar-item-hover, rgba(255, 255, 255, 0.06));
      color: var(--text, #e8e8e8);
    }

    .nav-item:focus-visible {
      outline: 2px solid var(--border-focus, var(--color-blue-500));
      outline-offset: -2px;
    }

    .nav-item.active {
      background: var(--sidebar-item-active, color-mix(in oklch, var(--text-interactive) 12%, transparent));
      color: var(--text-interactive, #9dbefe);
    }

    .nav-item.disabled {
      opacity: 0.4;
      cursor: default;
      pointer-events: none;
    }

    .nav-item:disabled {
      opacity: 0.4;
      cursor: default;
      pointer-events: none;
    }

    .nav-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-tertiary, #6f6f6f);
      flex-shrink: 0;
    }

    .nav-item.active .nav-dot {
      background: var(--text-interactive, #9dbefe);
    }

    .nav-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      font-size: 16px;
      color: var(--text-tertiary, #6f6f6f);
    }

    .nav-item.active .nav-icon {
      color: var(--text-interactive, #9dbefe);
    }

    .nav-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-count {
      font-size: var(--font-size-xs, 0.75rem);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 500;
      color: var(--text-tertiary, #6f6f6f);
      padding: 1px 6px;
      border-radius: var(--radius-full, 999px);
      background: var(--badge-neutral-bg, color-mix(in oklch, var(--text-tertiary) 15%, transparent));
      flex-shrink: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .zone-toggle,
      .nav-item {
        transition: none;
      }
      .zone-chevron {
        transition: none;
      }
    }
  `
}

customElements.define('trellis-sidebar-nav', TrellisSidebarNav)
