import { describe, it, expect, vi } from 'vitest'
import { createSaveQueue } from '../packages/core/src/editor/save-queue.js'

/** Drives the queue's timer by hand so nothing waits on wall clock. */
function manualTimers() {
  let next = 1
  const pending = new Map<number, () => void>()
  return {
    setTimer: (fn: () => void) => {
      const handle = next++
      pending.set(handle, fn)
      return handle
    },
    clearTimer: (handle: unknown) => {
      pending.delete(handle as number)
    },
    fire() {
      const entries = [...pending.entries()]
      pending.clear()
      for (const [, fn] of entries) fn()
    },
    get scheduled() {
      return pending.size
    },
  }
}

describe('save queue', () => {
  it('writes once for a burst of keystrokes, keeping the last value', async () => {
    const timers = manualTimers()
    const save = vi.fn().mockResolvedValue(undefined)
    const queue = createSaveQueue<string>({ save, ...timers })

    queue.push('h')
    queue.push('he')
    queue.push('hello')
    expect(save).not.toHaveBeenCalled()
    expect(timers.scheduled).toBe(1)

    timers.fire()
    await Promise.resolve()

    expect(save).toHaveBeenCalledTimes(1)
    expect(save).toHaveBeenCalledWith('hello')
  })

  it('flush writes a pending value immediately', async () => {
    const timers = manualTimers()
    const save = vi.fn().mockResolvedValue(undefined)
    const queue = createSaveQueue<string>({ save, ...timers })

    queue.push('unsent sentence')
    expect(queue.pending).toBe(true)

    await queue.flush()

    expect(save).toHaveBeenCalledWith('unsent sentence')
    expect(queue.pending).toBe(false)
  })

  it('flush is a no-op when nothing is pending', async () => {
    const timers = manualTimers()
    const save = vi.fn().mockResolvedValue(undefined)
    const queue = createSaveQueue<string>({ save, ...timers })

    await queue.flush()

    expect(save).not.toHaveBeenCalled()
  })

  it('cancel drops the pending value without writing', async () => {
    const timers = manualTimers()
    const save = vi.fn().mockResolvedValue(undefined)
    const queue = createSaveQueue<string>({ save, ...timers })

    queue.push('discard me')
    queue.cancel()
    timers.fire()
    await Promise.resolve()

    expect(save).not.toHaveBeenCalled()
    expect(queue.pending).toBe(false)
  })

  it('an edit arriving during a slow write is not swallowed by it', async () => {
    const timers = manualTimers()
    let release: (() => void) | null = null
    const save = vi.fn().mockImplementation(
      () => new Promise<void>((resolve) => { release = resolve }),
    )
    const queue = createSaveQueue<string>({ save, ...timers })

    queue.push('first')
    timers.fire() // write starts, awaits

    queue.push('second') // arrives mid-flight
    expect(queue.pending).toBe(true)

    release?.()
    await Promise.resolve()

    timers.fire()
    await Promise.resolve()

    expect(save).toHaveBeenNthCalledWith(1, 'first')
    expect(save).toHaveBeenNthCalledWith(2, 'second')
  })

  it('a failing write is reported and does not throw into the caller', async () => {
    const timers = manualTimers()
    const onError = vi.fn()
    const save = vi.fn().mockRejectedValue(new Error('offline'))
    const queue = createSaveQueue<string>({ save, onError, ...timers })

    queue.push('value')
    await queue.flush()

    expect(onError).toHaveBeenCalledTimes(1)
    expect((onError.mock.calls[0][0] as Error).message).toBe('offline')
  })
})

describe('trellis-editor', () => {
  it('can be imported', async () => {
    const mod = await import('../packages/core/src/editor/trellis-editor.js')
    expect(mod.TrellisEditor).toBeDefined()
  })

  it('defines custom element', async () => {
    await import('../packages/core/src/editor/trellis-editor.js')
    expect(customElements.get('trellis-editor')).toBeDefined()
  })
})
