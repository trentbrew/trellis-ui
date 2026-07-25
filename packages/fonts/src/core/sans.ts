import { registry } from '../registry.js'

registry.register([
  {
    role: 'sans',
    family: 'Inter',
    category: 'sans',
    weights: [400, 500, 600, 700],
    styles: ['normal'],
    source: 'google',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    fallback: ['system-ui', '-apple-system', 'sans-serif'],
  },
])
