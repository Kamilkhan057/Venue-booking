import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),

      
    },
  },

   server: {
    host: '0.0.0.0',    // ✅ allows access from local network
    port: 5173,          // optional: change if needed
  },
})
