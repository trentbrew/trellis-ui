export interface Icon {
  name: string
  category: 'core' | 'entity' | 'action' | 'status' | 'brand'
  tags: string[]
  svg: string
  variant?: 'filled' | 'outline' | 'duotone'
  author?: string
  license?: 'MIT' | 'CC0' | 'custom'
}

class IconRegistry {
  private icons = new Map<string, Icon>()

  get(name: string): Icon | undefined {
    return this.icons.get(name)
  }

  findByTag(tag: string): Icon[] {
    return Array.from(this.icons.values()).filter(i => i.tags.includes(tag))
  }

  findByCategory(category: Icon['category']): Icon[] {
    return Array.from(this.icons.values()).filter(i => i.category === category)
  }

  search(query: string): Icon[] {
    const lower = query.toLowerCase()
    return Array.from(this.icons.values()).filter(
      i => i.name.includes(lower) || i.tags.some(t => t.includes(lower)),
    )
  }

  register(pack: Icon[]): void {
    for (const icon of pack) {
      this.icons.set(icon.name, icon)
    }
  }
}

export const registry = new IconRegistry()
