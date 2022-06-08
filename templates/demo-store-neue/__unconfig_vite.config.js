let __unconfig_data;
let __unconfig_stub = function (data) {
  __unconfig_data = data;
};
__unconfig_stub.default = (data) => {
  __unconfig_data = data;
};
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

const __unconfig_default = defineConfig({
  plugins: [hydrogen()],
  resolve: {
    alias: [{find: /^~\/(.*)/, replacement: '/src/$1'}],
  },
});

if (typeof __unconfig_default === 'function')
  __unconfig_default(...[{command: 'serve', mode: 'development'}]);
export default __unconfig_data;
