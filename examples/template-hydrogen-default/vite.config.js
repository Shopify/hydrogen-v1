import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

import shopifyConfig from './shopify.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen(shopifyConfig)],
  optimizeDeps: {include: ['@headlessui/react']},
  test: {
    globals: true,
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
