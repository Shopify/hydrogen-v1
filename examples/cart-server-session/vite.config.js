import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen()],
  resolve: {
    alias: [
      {
        find: /^~\/(.*)/,
        replacement: '/src/$1',
      },
    ],
  },
});
