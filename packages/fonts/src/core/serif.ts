import { registry } from '../registry.js'

registry.register([
  {
    role: 'serif',
    family: 'Georgia',
    category: 'serif',
    weights: [400, 700],
    styles: ['normal', 'italic'],
    source: 'system',
    fallback: ['Times New Roman', 'serif'],
  },
])
