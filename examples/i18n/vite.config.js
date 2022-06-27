import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen()],
  optimizeDeps: {
    include: ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
  },
});
