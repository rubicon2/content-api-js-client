import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/int.test.js', 'test/readme.test.ts'],
    fileParallelism: false,
  },
});
