import { defineConfig } from 'vite';

// base './' = funktioniert auf GitHub Pages unabhängig vom Repo-Namen
export default defineConfig({
  base: './',
  server: { host: true, port: 5173 },
  build: { outDir: 'dist', chunkSizeWarningLimit: 900 },
});
