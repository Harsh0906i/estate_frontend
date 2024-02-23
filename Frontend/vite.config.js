import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-08cc.onrender.com',
        secure: false,
      },
    },
    "functions": {
      "api/*": {
        "maxDuration": 30
      }
    }  
  },
  plugins: [react()],
});
