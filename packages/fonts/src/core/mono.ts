import { registry } from '../registry.js'

registry.register([
  {
    role: 'mono',
    family: 'JetBrains Mono',
    category: 'mono',
    weights: [400, 500, 600],
    styles: ['normal', 'italic'],
    source: 'google',
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
    fallback: ['Fira Code', 'Cascadia Code', 'monospace'],
  },
])
