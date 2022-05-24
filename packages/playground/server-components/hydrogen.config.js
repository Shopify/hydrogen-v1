import {CookieSessionStorage} from '@shopify/hydrogen';
import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: {
    defaultLocale: 'en-us',
    storeDomain: 'hydrogen-preview.myshopify.com',
    storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
    storefrontApiVersion: '2022-07',
  },
  session: CookieSessionStorage('__session', {
    expires: new Date(1749343178614),
  }),
  enableStreaming: (req) => {
    return req.headers.get('user-agent') !== 'custom bot';
  },
});
