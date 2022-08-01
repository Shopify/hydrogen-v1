/// <reference types="vitest" />
import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  return {
    build: {
      outDir: mode === 'devbuild' ? 'dist/dev/' : 'dist/prod/',
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'hydrogen-ui',
        fileName: () => `[name]${mode === 'devbuild' ? '.dev' : ''}.js`,
        formats: ['es'],
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
