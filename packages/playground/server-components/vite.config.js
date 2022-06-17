const hydrogen = require('@shopify/hydrogen/plugin.cjs');
const path = require('path');

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [hydrogen({})],
  resolve: {
    alias: [
      {find: /^~\/(.*)/, replacement: '/src/$1'},
      {find: /^@\/(.*)/, replacement: path.join(__dirname, 'src/$1')},
    ],
  },
};
