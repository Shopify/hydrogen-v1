import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    // globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
  },
});
