import {Plugin} from 'vite';

export default () => {
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
        __WORKER__: !!process.env.WORKER,
      },

      envPrefix: ['VITE_', 'PUBLIC_'],
    }),

    // TODO: Remove when react-dom/fizz is fixed
    generateBundle: process.env.WORKER
      ? (options, bundle) => {
          // There's only one key in bundle, normally `worker.js`
          const [bundleKey] = Object.keys(bundle);
          const workerBundle = bundle[bundleKey];
          // It's always a chunk, this is just for TypeScript
          if (workerBundle.type === 'chunk') {
            // React fizz and flight try to access an undefined value.
            // This puts a guard before accessing it.
            workerBundle.code = workerBundle.code.replace(
              /\((\w+)\.locked\)/gm,
              '($1 && $1.locked)'
            );

            // `renderToReadableStream` is bugged in React.
            // This adds a workaround until these issues are fixed:
            // https://github.com/facebook/react/issues/22772
            // https://github.com/facebook/react/issues/23113
            workerBundle.code = workerBundle.code.replace(
              /var \w+\s*=\s*(\w+)\.completedRootSegment;/g,
              'if($1.status===5)return\n$1.status=5;\n$&'
            );
            workerBundle.code = workerBundle.code.replace(
              /(\w+)\.allPendingTasks\s*={2,3}\s*0\s*\&\&\s*\w+\.pingedTasks\.length/g,
              '$1.status=0;\n$&'
            );
          }
        }
      : undefined,
  } as Plugin;
};
