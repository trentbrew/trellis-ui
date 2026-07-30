import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@trellis.computer/ui': path.resolve(__dirname, 'packages/core/src'),
      'trellis/browser': path.resolve(__dirname, 'dev/trellis-browser-mock.ts'),
      'trellis': path.resolve(__dirname, 'dev/trellis-mock.ts'),
    },
  },
})
