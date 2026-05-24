import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import backendConfig from './lib/config/env';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({}), 
    svgr(),
    tailwindcss(),
  ],
  root: './www',
  build: {
    outDir: '../dist/www',
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