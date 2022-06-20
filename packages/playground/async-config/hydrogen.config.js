import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

export default defineConfig({
  routes: '/src/routes',
  shopify: async (request) => {
    await sleep();

    const url = new URL(request.normalizedUrl);

    return {
      defaultLocale: url.pathname.startsWith('/es') ? 'es-es' : 'en-us',
      storeDomain: 'hydrogen-preview.myshopify.com',
      storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
      storefrontApiVersion: '2022-07',
    };
  },
  __EXPERIMENTAL__devTools: true,
  logger: {
    trace() {},
    debug() {},
  },
  session: CookieSessionStorage('__session', {
    expires: new Date(1749343178614),
  }),
  poweredByHeader: false,
});
