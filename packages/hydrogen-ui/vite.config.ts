/// <reference types="vitest" />
import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  if (mode.includes('umdbuild')) {
    // config for our UMD builds, which are distinct enough that they need their own
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'hydrogenui',
          fileName: () =>
            `hydrogen-ui.${mode === 'umdbuilddev' ? 'dev' : 'prod'}.js`,
          formats: ['umd'],
        },
        sourcemap: true,
        minify: mode !== 'umdbuilddev',
        emptyOutDir: false,
        outDir: `dist/umd/`,
        rollupOptions: {
          // don't bundle these packages into our lib
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
      define: {
        __HYDROGEN_DEV__: mode === 'umdbuilddev',
        __HYDROGEN_TEST__: false,
      },
      plugins: [
        react({
          // use classic runtime so that it can rely on the global 'React' variable to createElements
          jsxRuntime: 'classic',
        }),
      ],
    };
  }

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
      __HYDROGEN_DEV__: mode === 'devbuild' || mode === 'test',
      __HYDROGEN_TEST__: mode === 'test',
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './vitest.setup.ts',
      restoreMocks: true,
    },
  };
});
