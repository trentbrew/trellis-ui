import { describe, it, expect } from 'vitest'

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
