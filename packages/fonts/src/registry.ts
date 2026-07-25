export interface FontEntry {
  role: string
  family: string
  category: 'sans' | 'serif' | 'mono' | 'display' | 'handwriting'
  weights: number[]
  styles: Array<'normal' | 'italic'>
  source: 'google' | 'self-hosted' | 'system'
  url?: string
  fallback: string[]
}

class FontRegistry {
  private entries = new Map<string, FontEntry>()

  get(role: string): FontEntry | undefined {
    return this.entries.get(role)
  }

  resolve(role: string): string | undefined {
    const entry = this.entries.get(role)
    if (!entry) return undefined

    if (entry.source === 'google' && entry.url) {
      return `@import url('${entry.url}');`
    }

    return [
      `@font-face {`,
      `  font-family: '${entry.family}';`,
      `  font-weight: ${entry.weights.join(', ')};`,
      `  src: url('${entry.url}') format('woff2');`,
      `}`,
    ].join('\n')
  }

  load(role: string): HTMLLinkElement | undefined {
    const entry = this.entries.get(role)
    if (!entry || !entry.url) return undefined

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = entry.url
    document.head.appendChild(link)
    return link
  }

  register(entries: FontEntry[]): void {
    for (const entry of entries) {
      this.entries.set(entry.role, entry)
    }
  }
}

export const registry = new FontRegistry()
