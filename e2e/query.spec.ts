import { describe, it, expect } from 'vitest'

describe('trellix-query', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/trellix-query.js')
    expect(mod.TrellixQuery).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/trellix-query.js')
    expect(customElements.get('trellix-query')).toBeDefined()
  })
})
