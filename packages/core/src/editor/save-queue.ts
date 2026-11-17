/**
 * Coalesces editor keystrokes into one write.
 *
 * Typing emits an update per character; persisting each one would turn a
 * sentence into dozens of writes. The queue holds the latest value and writes
 * once the typing settles, and `flush()` exists so a value never dies with the
 * component — closing a window mid-sentence must not lose the sentence.
 */
export interface SaveQueue<T> {
  /** Replace the pending value and restart the settle timer. */
  push(value: T): void
  /** Write any pending value immediately. */
  flush(): Promise<void>
  /** Drop any pending value without writing it. */
  cancel(): void
  readonly pending: boolean
}

export interface SaveQueueOptions<T> {
  save: (value: T) => Promise<void> | void
  /** Quiet period before a write; typing bursts are longer than drag frames. */
  delay?: number
  onError?: (error: unknown) => void
  /** Injectable so tests do not wait on wall clock. */
  setTimer?: (fn: () => void, ms: number) => unknown
  clearTimer?: (handle: unknown) => void
}

export function createSaveQueue<T>({
  save,
  delay = 500,
  onError,
  setTimer = (fn, ms) => setTimeout(fn, ms),
  clearTimer = (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
}: SaveQueueOptions<T>): SaveQueue<T> {
  let handle: unknown = null
  let has = false
  let value: T | undefined

  const clear = () => {
    if (handle !== null) {
      clearTimer(handle)
      handle = null
    }
  }

  const write = async () => {
    if (!has) return
    // Taken before awaiting: an edit arriving mid-write must queue a new write
    // rather than be swallowed by the one already in flight.
    const next = value as T
    has = false
    value = undefined
    try {
      await save(next)
    } catch (error) {
      onError?.(error)
    }
  }

  return {
    push(next: T) {
      value = next
      has = true
      clear()
      handle = setTimer(() => {
        handle = null
        void write()
      }, delay)
    },

    async flush() {
      clear()
      await write()
    },

    cancel() {
      clear()
      has = false
      value = undefined
    },

    get pending() {
      return has
    },
  }
}
