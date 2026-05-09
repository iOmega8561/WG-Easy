import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import backendConfig from './config.js';

export default defineConfig({
  plugins: [react()],
  root: './www',
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${backendConfig.PORT}`,
        changeOrigin: true,
      },
    },
  },
});