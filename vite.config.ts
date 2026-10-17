import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  base: '/AnilineProduction-Lab/',
  plugins: [react(), tailwindcss()],
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
});
