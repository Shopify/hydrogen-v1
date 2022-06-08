let __unconfig_data;
let __unconfig_stub = function (data) {
  __unconfig_data = data;
};
__unconfig_stub.default = (data) => {
  __unconfig_data = data;
};
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

// https://vitejs.dev/config/
const __unconfig_default = defineConfig({
  plugins: [hydrogen()],
  optimizeDeps: {include: ['@headlessui/react']},
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});

if (typeof __unconfig_default === 'function')
  __unconfig_default(...[{command: 'serve', mode: 'development'}]);
export default __unconfig_data;
