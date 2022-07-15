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
  },
});
