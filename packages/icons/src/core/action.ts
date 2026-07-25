import { registry } from '../registry.js'

registry.register([
  {
    name: 'action-create',
    category: 'action',
    tags: ['create', 'add', 'new', 'plus'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'action-edit',
    category: 'action',
    tags: ['edit', 'pencil', 'write'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M14 2l4 4-8 8H6v-4l8-8z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    name: 'action-delete',
    category: 'action',
    tags: ['delete', 'remove', 'trash'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 7h10l-1 10H6L5 7zM8 2h4l1 2H7l1-2zM4 5h12" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    name: 'action-duplicate',
    category: 'action',
    tags: ['duplicate', 'copy', 'clone'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><rect x="6" y="6" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="3" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  },
  {
    name: 'action-move',
    category: 'action',
    tags: ['move', 'drag', 'reorder'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2v16M2 10h16" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="6" cy="6" r="1.5"/><circle cx="14" cy="6" r="1.5"/><circle cx="6" cy="14" r="1.5"/><circle cx="14" cy="14" r="1.5"/></svg>',
  },
])
