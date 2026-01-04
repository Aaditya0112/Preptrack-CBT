import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // Ensure Vite pre-bundles framer-motion and the JSX runtime so imports like
  // "react/jsx-runtime" used by some libraries (framer-motion) resolve correctly.
  optimizeDeps: {
    include: ["framer-motion", "react/jsx-runtime"],
  },
  resolve: {
    dedupe: ["react", "react-dom"]
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          if (process.env.VITE_API_URL) {
            return path;
          }
          return path;
        },
      },
    },
  },
})
