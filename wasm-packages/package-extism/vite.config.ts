import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ExtismPlugin',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['extism'],
      output: {
        globals: {
          'extism': 'ExtismSDK'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  }
}); 