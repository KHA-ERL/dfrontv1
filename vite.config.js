import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    allowedHosts: [
      'empty-tiger-20.loca.lt',
      'localhost',
      '127.0.0.1'
    ],
  },
});
