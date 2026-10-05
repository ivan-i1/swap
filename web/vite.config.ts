import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // Assets stay where the ActionScript project keeps them (../assets, ../src/org/flixel/data).
  server: { fs: { allow: ['..'] } },
  build: { target: 'es2022' },
});
