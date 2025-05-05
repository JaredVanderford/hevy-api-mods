import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['node_modules', 'main.js'],
    coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules', 'main.js', 'vitest.config.ts', 'src/printRoutine.js'],
      },
    
  },
})