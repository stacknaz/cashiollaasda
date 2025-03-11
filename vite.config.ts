import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: 'https://cashiolla.com/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/postback': {
        target: 'https://cashiolla.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-query'],
          ui: ['lucide-react'],
          auth: ['@supabase/supabase-js'],
          browser: ['axios', 'react-router-dom']
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});