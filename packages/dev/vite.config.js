import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';
import replace from '@rollup/plugin-replace';

import shopifyConfig from './shopify.config';

const buildTimestamp = +new Date();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen(shopifyConfig)],
  optimizeDeps: {include: ['@headlessui/react']},
  build: {
    rollupOptions: {
      plugins: [
        replace({
          __buildTimestamp__: buildTimestamp,
        }),
      ],
    },
  },
});
