import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // En desarrollo, /api va a la API local (npm run start:dev en RedNexus-Backend).
    // Si tu API corre en otro puerto: API_PROXY=http://localhost:3010 npm run dev
    proxy: {
      '/api': process.env.API_PROXY ?? 'http://localhost:3000',
    },
  },
})
