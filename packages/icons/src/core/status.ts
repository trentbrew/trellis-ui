import { registry } from '../registry.js'

registry.register([
  {
    name: 'status-todo',
    category: 'status',
    tags: ['todo', 'pending', 'backlog'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    name: 'status-in-progress',
    category: 'status',
    tags: ['in-progress', 'active', 'doing'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 5v5l3 3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    name: 'status-done',
    category: 'status',
    tags: ['done', 'completed', 'finished'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/><path d="M6 10l3 3 5-5" stroke="white" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'status-blocked',
    category: 'status',
    tags: ['blocked', 'stuck'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/><path d="M7 10h6" stroke="white" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'status-cancelled',
    category: 'status',
    tags: ['cancelled', 'abandoned'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
])
