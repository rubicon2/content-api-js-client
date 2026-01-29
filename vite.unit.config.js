import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: 'test/unit.setup.js',
    include: 'test/index.test.js',
  },
});
