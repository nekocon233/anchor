import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/anchor/' : '/',
  server: {
    port: 5173,
  },
});
