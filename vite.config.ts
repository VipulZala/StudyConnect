// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // if using react plugin

export default defineConfig({
  plugins: [react()],
  define: {
    // Replace `global` with browser globalThis
    global: 'globalThis'
  }
})
