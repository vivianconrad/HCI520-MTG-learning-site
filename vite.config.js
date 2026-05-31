import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/HCI520-MTG-learning-site/',
  plugins: [react()],
})
