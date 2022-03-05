import {esbuildCommonjs, viteCommonjs} from '@originjs/vite-plugin-commonjs';
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

import shopifyConfig from './shopify.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteCommonjs(), hydrogen(shopifyConfig)],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(['node-html-parser'])], // the problematic cjs module - https://github.com/vitejs/vite/issues/2579
    },
    include: ['@headlessui/react', 'node-html-parser'],
  },
});
