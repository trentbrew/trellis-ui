import { registry } from '../registry.js'

registry.register([
  {
    name: 'core-chevron-down',
    category: 'core',
    tags: ['chevron', 'down', 'expand', 'arrow'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    name: 'core-menu',
    category: 'core',
    tags: ['menu', 'hamburger', 'nav'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'core-close',
    category: 'core',
    tags: ['close', 'x', 'dismiss'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'core-search',
    category: 'core',
    tags: ['search', 'find', 'magnify'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="9" cy="9" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 13l4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'core-plus',
    category: 'core',
    tags: ['plus', 'add', 'new'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  },
])
