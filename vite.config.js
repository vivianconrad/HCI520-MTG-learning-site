import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/HCI520-MTG-learning-site/',
  build: {
    outDir: 'docs',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            },
            {
              name: 'vendor-supabase',
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            },
          ],
        },
      },
    },
  },
  plugins: [react()],
})
