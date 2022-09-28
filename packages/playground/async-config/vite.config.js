const hydrogen = require('@shopify/hydrogen/plugin.cjs');

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    hydrogen({
      // disable boundary optimization to get experimental imports to work on e2e tests
      // import {Script} from  @shopify/hydrogen/experimental
      optimizeBoundaries: false,
    }),
  ],
};
