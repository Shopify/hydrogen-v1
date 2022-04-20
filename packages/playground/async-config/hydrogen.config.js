const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

export default {
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: async (url) => {
    await sleep();

    return {
      defaultLocale: url.pathname.startsWith('/es') ? 'es-es' : 'en-us',
      storeDomain: 'hydrogen-preview.myshopify.com',
      storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
      storefrontApiVersion: '2022-04',
    };
  },
  plugins: [
    {
      name: 'my-redirects',
      willHandleRequest(url, request, ctx) {
        ctx.redirects = url.pathname.startsWith('/es')
          ? {'/es/products': '/es/productos'}
          : {'/en/productos': '/en/products'};
      },
    },
  ],
};
