import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // @ts-expect-error maybe a version mismatch?
  plugins: [react()],
  test: {
    include: ['**/*.vitest.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'happy-dom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    restoreMocks: true,
  },
  define: {
    __HYDROGEN_DEV__: true,
    __HYDROGEN_TEST__: true,
    __HYDROGEN_CACHE_ID__: '"__QUERY_CACHE_ID__"',
  },
});
