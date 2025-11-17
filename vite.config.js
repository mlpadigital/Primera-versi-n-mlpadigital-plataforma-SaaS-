// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@apps': path.resolve(__dirname, 'src/apps'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@admin': path.resolve(__dirname, 'src/apps/admin'),
      '@auth': path.resolve(__dirname, 'src/apps/auth'),
      '@public': path.resolve(__dirname, 'src/apps/public'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    historyApiFallback: true, // 👈 esto es clave para rutas SPA

  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});