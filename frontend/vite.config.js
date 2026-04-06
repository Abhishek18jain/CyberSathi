import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/session': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
      '/passport': 'http://localhost:5000',
      '/compress': 'http://localhost:5000',
      '/pdf': 'http://localhost:5000',
      '/signature': 'http://localhost:5000',
      '/files': 'http://localhost:5000',
    }
  }
})
