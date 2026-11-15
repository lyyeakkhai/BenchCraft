import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.{ts,tsx,js,jsx}'],
    exclude: ['node_modules/**', '.agents/**', '.claude/**', '.next/**'],
  },
});
