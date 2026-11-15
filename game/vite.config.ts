import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // La tipografía de la marca se toma de los recursos del launcher, sin copiarla.
  server: { fs: { allow: ['..'] } },
  build: { target: 'chrome67', outDir: 'dist', assetsInlineLimit: 0 },
});
