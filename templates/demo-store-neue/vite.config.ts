import {defineConfig} from 'vite';
// More a structural/framework question: why name it just "plugin" when it's specifically related to vite?
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen()],
  resolve: {
    // Could be nice to quickly explain what this regex is doing.
    // Not that complex but still, I'm not sure why it's here
    alias: [{find: /^~\/(.*)/, replacement: '/src/$1'}],
  },
  optimizeDeps: {
    include: ['@headlessui/react', 'clsx', 'react-use', 'typographic-base'],
  },
});
