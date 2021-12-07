import type {Plugin} from 'vite';

export default () => {
  return {
    name: 'vite-plugin-hydrogen-config',

    config: (_, env) => ({
      resolve: {
        alias: {
          /**
           * For some reason, when building in a worker, Vite always
           * pulls the client version instead of the server version of these
           * dependencies. We intentially force it to load the server versions.
           */
          'html-dom-parser': process.env.WORKER
            ? 'html-dom-parser/lib/server/html-to-dom'
            : 'html-dom-parser',
        },
      },

      build: {
        sourcemap: true,
        /**
         * By default, SSR dedupe logic gets bundled which runs `require('module')`.
         * We don't want this in our workers runtime, because `require` is not supported.
         */
        rollupOptions: process.env.WORKER
          ? {
              output: {
                format: 'es',
              },
            }
          : {},
      },

      ssr: {
        external: ['isomorphic-dompurify'],
        /**
         * Tell Vite to bundle everything when we're building for Workers.
         */
        noExternal: Boolean(process.env.WORKER),
        target: process.env.WORKER ? 'webworker' : 'node',
      },

      // Reload when updating local Hydrogen lib
      server: process.env.LOCAL_DEV && {
        watch: {
          ignored: ['!**/node_modules/@shopify/hydrogen/**'],
        },
      },

      optimizeDeps: {
        exclude: ['@shopify/hydrogen/client', '@shopify/hydrogen/entry-client'],
        include: [
          /**
           * Additionally, the following dependencies have trouble loading the
           * correct version of the dependency (server vs client). This tells Vite to take the
           * server versions and optimize them for ESM.
           */
          'html-dom-parser',
          'html-react-parser',
          'react-helmet-async',
          /**
           * Vite cannot find the following dependencies since they might be
           * required in RSC asynchronously. This tells Vite to optimize them
           * at server start to avoid posterior page reloads and issues (#429 #430).
           */
          'react',
          'react-dom',
          'react-router-dom',
        ],
      },

      define: {
        __DEV__: env.mode !== 'production',
      },
    }),
  } as Plugin;
};
