export default {
  routes: import.meta.globEager('./routes/**/*.server.[jt](s|sx)'),
  shopify: {
    storeDomain: 'hydrogen-preview.myshopify.com',
    storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
    storefrontApiVersion: '2022-04',
  },
};
