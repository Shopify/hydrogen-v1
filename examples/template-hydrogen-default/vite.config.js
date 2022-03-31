import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

import shopifyConfig from './shopify.config';
import hydrogenConfig from './hydrogen.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen(hydrogenConfig, shopifyConfig)],
  optimizeDeps: {include: ['@headlessui/react']},
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
