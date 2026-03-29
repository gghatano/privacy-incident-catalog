import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import generateCaseIndex from './plugins/generate-case-index'

export default defineConfig({
  plugins: [react(), tailwindcss(), generateCaseIndex()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: ['tests/**', 'e2e/**', 'node_modules/**'],
  },
})
