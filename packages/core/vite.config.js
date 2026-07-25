import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    target: 'es2022',
  },
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'signal-utils': 'src/signal-utils.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['trellis', 'lit'],
      output: {
        entryFileNames: '[name].mjs',
      },
    },
    outDir: 'dist',
  },
})
