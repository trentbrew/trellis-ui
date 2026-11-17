import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * A client shaped like TrellisDbClient, driving the real `liveEntity` binding
 * rather than mocking it — the point is to prove the editor works against the
 * actual read path, not against a stand-in for it.
 */
function fakeClient(row: Record<string, unknown> | null) {
  let push: ((rows: unknown[], diff: unknown, meta: unknown) => void) | null = null

  return {
    read: vi.fn(async () => row),
    subscribe: vi.fn((_query: unknown, cb: typeof push) => {
      push = cb
      return () => {
        push = null
      }
    }),
    update: vi.fn(async () => undefined),
    emit(next: Record<string, unknown>) {
      push?.([next], null, undefined)
    },
    get subscribed() {
      return push !== null
    },
  }
}

async function mount(
  client: ReturnType<typeof fakeClient>,
  attrs: Record<string, string> = {},
) {
  await import('../packages/core/src/editor/trellis-editor.js')

  const provider = document.createElement('trellis-provider')
  ;(provider as unknown as { client: unknown }).client = client

  const el = document.createElement('trellis-editor') as HTMLElement & {
    getHTML(): string
    setContent(html: string): void
    save(): Promise<void>
    updateComplete: Promise<unknown>
  }
  el.setAttribute('type', 'CollectionRecord')
  el.setAttribute('id', 'collectionRecord:note-1')
  el.setAttribute('editable', '')
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)

  provider.appendChild(el)
  document.body.appendChild(provider)
  await el.updateComplete
  // let the client.read promise settle into the signal
  await new Promise((r) => setTimeout(r, 0))
  await el.updateComplete

  return { el, provider }
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('trellis-editor binding', () => {
  it('reads the entity it names', async () => {
    const client = fakeClient({ body: '<p>hello</p>' })
    await mount(client)

    expect(client.read).toHaveBeenCalledWith('collectionRecord:note-1')
    expect(client.subscribed).toBe(true)
  })

  it('loads the field into the document', async () => {
    const client = fakeClient({ body: '<p>loaded from the graph</p>' })
    const { el } = await mount(client)

    expect(el.getHTML()).toContain('loaded from the graph')
  })

  it('reads a custom field when told to', async () => {
    const client = fakeClient({ body: '<p>wrong</p>', summary: '<p>right</p>' })
    const { el } = await mount(client, { field: 'summary' })

    expect(el.getHTML()).toContain('right')
    expect(el.getHTML()).not.toContain('wrong')
  })

  it('saves edited content back to the entity field', async () => {
    const client = fakeClient({ body: '<p>start</p>' })
    const { el } = await mount(client)

    el.setContent('<p>edited</p>')
    await el.save()

    expect(client.update).toHaveBeenCalledTimes(1)
    const [id, attrs] = client.update.mock.calls[0] as [string, Record<string, string>]
    expect(id).toBe('collectionRecord:note-1')
    expect(attrs.body).toContain('edited')
  })

  it('writes nothing when the document was never edited', async () => {
    const client = fakeClient({ body: '<p>untouched</p>' })
    const { el } = await mount(client)

    await el.save()

    expect(client.update).not.toHaveBeenCalled()
  })

  it('flushes a pending edit when disconnected', async () => {
    const client = fakeClient({ body: '<p>start</p>' })
    const { el, provider } = await mount(client)

    el.setContent('<p>unsent</p>')
    provider.remove()
    await new Promise((r) => setTimeout(r, 0))

    expect(client.update).toHaveBeenCalledTimes(1)
    const [, attrs] = client.update.mock.calls[0] as [string, Record<string, string>]
    expect(attrs.body).toContain('unsent')
  })
})
