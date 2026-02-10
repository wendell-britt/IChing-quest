import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // For GitHub Pages we set VITE_BASE="/<repo>/" in CI.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
})
