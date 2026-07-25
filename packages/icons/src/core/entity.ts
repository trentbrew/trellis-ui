import { registry } from '../registry.js'

registry.register([
  {
    name: 'entity-issue',
    category: 'entity',
    tags: ['issue', 'task', 'ticket'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 13v1" stroke="white" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'entity-lane',
    category: 'entity',
    tags: ['lane', 'stream'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M3 10h14" stroke="white" stroke-width="1.5" fill="none"/></svg>',
  },
  {
    name: 'entity-project',
    category: 'entity',
    tags: ['project', 'workspace'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/></svg>',
  },
  {
    name: 'entity-person',
    category: 'entity',
    tags: ['person', 'user', 'member'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>',
  },
  {
    name: 'entity-note',
    category: 'entity',
    tags: ['note', 'memo'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3h10a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M7 7h6M7 10h6M7 13h4" stroke="white" stroke-width="1" fill="none"/></svg>',
  },
  {
    name: 'entity-doc',
    category: 'entity',
    tags: ['doc', 'document', 'file'],
    svg: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 2h5l5 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M11 2v5h5" fill="none" stroke="white" stroke-width="1"/></svg>',
  },
])
