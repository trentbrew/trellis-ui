import type { TrellisDb } from 'trellis/browser'
import { TrellisProvider } from './provider.js'

export function getTrellisClient(el: HTMLElement): TrellisDb | null {
  const provider = el.closest('trellis-provider') as TrellisProvider | null
  return provider?.client ?? null
}
