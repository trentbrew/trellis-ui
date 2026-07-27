import { describe, it, expect } from 'vitest'

describe('trellis-provider', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/provider.js')
    expect(mod.TrellisProvider).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/provider.js')
    expect(customElements.get('trellis-provider')).toBeDefined()
  })
})

describe('trellis-entity', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/entity.js')
    expect(mod.TrellisEntity).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/entity.js')
    expect(customElements.get('trellis-entity')).toBeDefined()
  })
})

describe('trellis-entity-list', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/entity-list.js')
    expect(mod.TrellisEntityList).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/entity-list.js')
    expect(customElements.get('trellis-entity-list')).toBeDefined()
  })
})

describe('resolveShell', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/shells.js')
    expect(mod.resolveShell).toBeDefined()
  })
})

describe('signal-utils', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/signal-utils.js')
    expect(mod.bindText).toBeDefined()
    expect(mod.bindClass).toBeDefined()
    expect(mod.bindAttr).toBeDefined()
    expect(mod.bindVisible).toBeDefined()
    expect(mod.bindList).toBeDefined()
  })
})

describe('icons registry', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/icons/src/registry.js')
    expect(mod.registry).toBeDefined()
  })
})

describe('fonts registry', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/fonts/src/registry.js')
    expect(mod.registry).toBeDefined()
  })
})