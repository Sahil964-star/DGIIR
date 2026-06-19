import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@dashboard': path.resolve(__dirname, './src/dashboard'),
      '@citizen': path.resolve(__dirname, './src/citizen'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
