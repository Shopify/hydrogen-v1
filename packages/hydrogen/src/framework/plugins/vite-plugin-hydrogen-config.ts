import {Plugin} from 'vite';
import type {BuildOptions} from 'vite';

export default () => {
  const rollupOptions: BuildOptions['rollupOptions'] = {
    output: {},
  };

  const isWorker =
    Boolean(process.env.WORKER) && process.env.WORKER !== 'undefined';

  if (isWorker) {
    /**
     * By default, SSR dedupe logic gets bundled which runs `require('module')`.
     * We don't want this in our workers runtime, because `require` is not supported.
     */
    rollupOptions.output = {
      format: 'es',
    };
  }

  if (process.env.NODE_ENV !== 'development' && !process.env.LOCAL_DEV) {
    /**
     * Ofuscate production asset name - To prevent ad blocker logics that blocks
     * certain files due to how it is named.
     */
    rollupOptions.output = {
      ...rollupOptions.output,
      chunkFileNames: 'assets/[hash].js',
    };
  }

  return {
    name: 'vite-plugin-hydrogen-config',
    config: async (config, env) => ({
      resolve: {
        alias: {
          // This library is currently included as a compiled vendor lib, not published yet to NPM
          'react-server-dom-vite/client-proxy': require.resolve(
            '@shopify/hydrogen/vendor/react-server-dom-vite/esm/react-server-dom-vite-client-proxy.js'
          ),
        },
      },

      build: {
        minify:
          config.build?.minify ?? (process.env.LOCAL_DEV ? false : 'esbuild'),
        sourcemap: true,
        rollupOptions: config.build?.rollupOptions
          ? Object.assign(rollupOptions, config.build.rollupOptions)
          : rollupOptions,
        target: config.build?.ssr
          ? isWorker
            ? 'es2022' // CFW (Updates weekly to latest V8)
            : 'es2020' // Node (Support for v14.19 used in SB)
          : 'modules', // Browsers (Vite default value)
      },

      ssr: {
        /**
         * Tell Vite to bundle everything when we're building for Workers.
         * Otherwise, bundle RSC plugin as a workaround to apply the vendor alias above.
         */
        noExternal: isWorker || [/react-server-dom-vite/],
        target: isWorker ? 'webworker' : 'node',
      },

      // Reload when updating local Hydrogen lib
      server: process.env.LOCAL_DEV && {
        watch: {
          ignored: [
            '!**/node_modules/@shopify/hydrogen/**',
            '!**/node_modules/@shopify/hydrogen-ui/**',
          ],
        },
      },

      optimizeDeps: {
        exclude: [
          '@shopify/hydrogen',
          '@shopify/hydrogen/client',
          '@shopify/hydrogen/entry-client',
          '@shopify/hydrogen-ui',
        ],
        include: [
          /**
           * Additionally, the following dependencies have trouble loading the
           * correct version of the dependency (server vs client). This tells Vite to take the
           * server versions and optimize them for ESM.
           */
          'react-helmet-async',
          'react-error-boundary',
          /**
           * Vite cannot find the following dependencies since they might be
           * required in RSC asynchronously. This tells Vite to optimize them
           * at server start to avoid posterior page reloads and issues (#429 #430).
           */
          'react',
          'react-dom/client',
          'react-server-dom-vite/client-proxy',
          // https://github.com/vitejs/vite/issues/6215
          'react/jsx-runtime',
          // https://github.com/nfriedly/set-cookie-parser/issues/50
          'set-cookie-parser',
          'undici',
        ],
      },

      define: {
        __HYDROGEN_DEV__: env.mode !== 'production',
        __HYDROGEN_WORKER__: isWorker,
        __HYDROGEN_TEST__: false, // Used in unit tests
      },

      envPrefix: ['VITE_', 'PUBLIC_'],
      base: process.env.HYDROGEN_ASSET_BASE_URL,
    }),
  } as Plugin;
};
