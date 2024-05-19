import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true
  },
  resolve: {
    alias: {
      '@caho/schemas': path.join(__dirname, '../../packages/schemas/src'),
      '@caho/contracts': path.join(__dirname, '../../packages/contracts/src')
    }
  },
  plugins: [tsconfigPaths()]
});
