const hydrogen = require('@shopify/hydrogen/plugin').default;

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    hydrogen(
      {},
      {
        locale: 'en-us',
        storeDomain: 'hydrogen-preview.myshopify.com',
        storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
        storefrontApiVersion: '2022-04',
      }
    ),
  ],
};
