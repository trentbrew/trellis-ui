import { describe, it, expect } from 'vitest'
import { fixture } from '@open-wc/testing'

describe('trellis-header', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/header.js')
    expect(mod.TrellisHeader).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/header.js')
    expect(customElements.get('trellis-header')).toBeDefined()
  })

  it('renders with slots', async () => {
    await import('../packages/core/src/header.js')
    const el: any = await fixture('<trellis-header></trellis-header>')
    const header = el.shadowRoot?.querySelector('header')
    expect(header).toBeTruthy()
  })

  it('reflects sticky attribute', async () => {
    await import('../packages/core/src/header.js')
    const el: any = await fixture('<trellis-header sticky></trellis-header>')
    expect(el.hasAttribute('sticky')).toBe(true)
  })

  it('reflects variant attribute', async () => {
    await import('../packages/core/src/header.js')
    const el: any = await fixture('<trellis-header variant="inset"></trellis-header>')
    expect(el.getAttribute('variant')).toBe('inset')
  })
})

describe('trellis-breadcrumb', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/breadcrumb.js')
    expect(mod.TrellisBreadcrumb).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/breadcrumb.js')
    expect(customElements.get('trellis-breadcrumb')).toBeDefined()
  })

  it('renders segments', async () => {
    await import('../packages/core/src/breadcrumb.js')
    const el: any = await fixture('<trellis-breadcrumb></trellis-breadcrumb>')
    el.segments = [
      { label: 'Root', id: 'root' },
      { label: 'Child', id: 'child' },
    ]
    await el.updateComplete
    const items = el.shadowRoot?.querySelectorAll('.breadcrumb-item')
    expect(items?.length).toBe(2)
  })

  it('marks last segment as current', async () => {
    await import('../packages/core/src/breadcrumb.js')
    const el: any = await fixture('<trellis-breadcrumb></trellis-breadcrumb>')
    el.segments = [
      { label: 'Root', id: 'root' },
      { label: 'Last', id: 'last' },
    ]
    await el.updateComplete
    const current = el.shadowRoot?.querySelector('[aria-current="page"]')
    expect(current?.textContent?.trim()).toBe('Last')
  })

  it('dispatches navigate event on click', async () => {
    await import('../packages/core/src/breadcrumb.js')
    const el: any = await fixture('<trellis-breadcrumb></trellis-breadcrumb>')
    el.segments = [
      { label: 'Root', id: 'root' },
      { label: 'Last', id: 'last' },
    ]
    await el.updateComplete
    const firstBtn = el.shadowRoot?.querySelector('button.segment')
    let fired = false
    el.addEventListener('trellis-breadcrumb-navigate', () => { fired = true })
    firstBtn?.dispatchEvent(new MouseEvent('click'))
    expect(fired).toBe(true)
  })
})

describe('trellis-search', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/search.js')
    expect(mod.TrellisSearch).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/search.js')
    expect(customElements.get('trellis-search')).toBeDefined()
  })

  it('renders input and clear button', async () => {
    await import('../packages/core/src/search.js')
    const el: any = await fixture('<trellis-search></trellis-search>')
    const input = el.shadowRoot?.querySelector('input')
    expect(input).toBeTruthy()
    const clear = el.shadowRoot?.querySelector('.search-clear')
    expect(clear).toBeTruthy()
  })

  it('reflects placeholder', async () => {
    await import('../packages/core/src/search.js')
    const el: any = await fixture('<trellis-search placeholder="Find..."></trellis-search>')
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    expect(input.placeholder).toBe('Find...')
  })

  it('dispatches input event on value change', async () => {
    await import('../packages/core/src/search.js')
    const el: any = await fixture('<trellis-search></trellis-search>')
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    let detail: any = null
    el.addEventListener('trellis-search-input', (e: Event) => {
      detail = (e as CustomEvent).detail
    })
    input.value = 'hello'
    input.dispatchEvent(new InputEvent('input'))
    expect(detail?.value).toBe('hello')
  })

  it('dispatches clear event', async () => {
    await import('../packages/core/src/search.js')
    const el: any = await fixture('<trellis-search></trellis-search>')
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement
    input.value = 'text'
    input.dispatchEvent(new InputEvent('input'))
    await el.updateComplete
    let cleared = false
    el.addEventListener('trellis-search-clear', () => { cleared = true })
    const clearBtn = el.shadowRoot?.querySelector('.search-clear') as HTMLButtonElement
    clearBtn.click()
    expect(cleared).toBe(true)
  })
})

describe('trellis-view-toggle', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/view-toggle.js')
    expect(mod.TrellisViewToggle).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/view-toggle.js')
    expect(customElements.get('trellis-view-toggle')).toBeDefined()
  })

  it('renders default views', async () => {
    await import('../packages/core/src/view-toggle.js')
    const el: any = await fixture('<trellis-view-toggle></trellis-view-toggle>')
    const buttons = el.shadowRoot?.querySelectorAll('.toggle-option')
    expect(buttons?.length).toBe(3)
  })

  it('renders custom views', async () => {
    await import('../packages/core/src/view-toggle.js')
    const el: any = await fixture('<trellis-view-toggle></trellis-view-toggle>')
    el.views = [
      { id: 'list', label: 'List' },
      { id: 'grid', label: 'Grid' },
    ]
    await el.updateComplete
    const buttons = el.shadowRoot?.querySelectorAll('.toggle-option')
    expect(buttons?.length).toBe(2)
  })

  it('selects a view and dispatches event', async () => {
    await import('../packages/core/src/view-toggle.js')
    const el: any = await fixture('<trellis-view-toggle></trellis-view-toggle>')
    let detail: any = null
    el.addEventListener('trellis-view-toggle', (e: Event) => {
      detail = (e as CustomEvent).detail
    })
    const buttons = el.shadowRoot?.querySelectorAll('.toggle-option')
    buttons?.[1]?.dispatchEvent(new MouseEvent('click'))
    expect(detail?.view).toBe('kanban')
  })

  it('reflects disabled attribute', async () => {
    await import('../packages/core/src/view-toggle.js')
    const el: any = await fixture('<trellis-view-toggle disabled></trellis-view-toggle>')
    expect(el.hasAttribute('disabled')).toBe(true)
  })
})

describe('trellis-sidebar-nav', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/sidebar-nav.js')
    expect(mod.TrellisSidebarNav).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/sidebar-nav.js')
    expect(customElements.get('trellis-sidebar-nav')).toBeDefined()
  })

  it('renders zones and items', async () => {
    await import('../packages/core/src/sidebar-nav.js')
    const el: any = await fixture('<trellis-sidebar-nav></trellis-sidebar-nav>')
    el.zones = [
      {
        id: 'main',
        label: 'Main',
        items: [
          { id: 'home', label: 'Home' },
          { id: 'settings', label: 'Settings' },
        ],
      },
    ]
    await el.updateComplete
    const items = el.shadowRoot?.querySelectorAll('.nav-item')
    expect(items?.length).toBe(2)
  })

  it('sets active item', async () => {
    await import('../packages/core/src/sidebar-nav.js')
    const el: any = await fixture('<trellis-sidebar-nav activeId="settings"></trellis-sidebar-nav>')
    el.zones = [
      {
        id: 'main',
        label: 'Main',
        items: [
          { id: 'home', label: 'Home' },
          { id: 'settings', label: 'Settings' },
        ],
      },
    ]
    await el.updateComplete
    const active = el.shadowRoot?.querySelector('.nav-item.active')
    expect(active?.textContent?.trim()).toContain('Settings')
  })

  it('dispatches nav-select on click', async () => {
    await import('../packages/core/src/sidebar-nav.js')
    const el: any = await fixture('<trellis-sidebar-nav></trellis-sidebar-nav>')
    el.zones = [
      {
        id: 'main',
        label: 'Main',
        items: [
          { id: 'home', label: 'Home' },
        ],
      },
    ]
    await el.updateComplete
    let detail: any = null
    el.addEventListener('trellis-nav-select', (e: Event) => {
      detail = (e as CustomEvent).detail
    })
    const btn = el.shadowRoot?.querySelector('.nav-item') as HTMLElement
    btn.click()
    expect(detail?.item?.id).toBe('home')
  })

  it('renders fallback slot when no zones', async () => {
    await import('../packages/core/src/sidebar-nav.js')
    const el: any = await fixture('<trellis-sidebar-nav><span slot>fallback</span></trellis-sidebar-nav>')
    const slot = el.shadowRoot?.querySelector('slot')
    expect(slot).toBeTruthy()
  })
})
