/// <reference types="vitest" />
import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  return {
    build: {
      outDir: `dist/${mode === 'devbuild' ? 'dev' : 'prod'}/`,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'hydrogen-ui',
        fileName: (format) => `[name].${format === 'cjs' ? 'c' : ''}js`,
        formats: ['es', 'cjs'],
      },
      sourcemap: true,
      minify: false,
      rollupOptions: {
        // don't bundle these packages into our lib
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          // keep the folder structure of the components in the dist folder
          preserveModules: true,
        },
      },
    },
    define: {
      __HYDROGEN_DEV__: mode === 'devbuild',
      __HYDROGEN_TEST__: false,
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './vitest.setup.ts',
      restoreMocks: true,
      define: {
        __HYDROGEN_DEV__: true,
        __HYDROGEN_TEST__: true,
      },
    },
  };
});
