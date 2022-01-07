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
          // This library is currently included as a compiled vendor lib, not published yet to NPM
          'react-server-dom-vite/client-proxy': require.resolve(
            '@shopify/hydrogen/vendor/react-server-dom-vite/esm/react-server-dom-vite-client-proxy.js'
          ),
        },
      },

      build: {
        sourcemap: true,
      },

      ssr: {
        external: ['isomorphic-dompurify'],
        /**
         * Tell Vite to bundle everything when we're building for Workers.
         * Otherwise, bundle RSC plugin as a workaround to apply the vendor alias above.
         */
        noExternal: Boolean(process.env.WORKER) || [/react-server-dom-vite/],
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
          'react-server-dom-vite/client-proxy',
        ],
      },

      define: {
        __DEV__: env.mode !== 'production',
      },
    }),
  } as Plugin;
};
