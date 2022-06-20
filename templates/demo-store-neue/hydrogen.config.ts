import {
  defineConfig,
  CookieSessionStorage,
  PerformanceMetricsServerAnalyticsConnector,
  ShopifyServerAnalyticsConnector,
} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: {
    // Customize the domain and token values for your Shopify store
    storeDomain: 'hydrogen-preview.myshopify.com',
    storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
    storefrontApiVersion: '2022-07',
  },
  // (Not to hard to parse what's going on here, but might be helpful to just explain in plain language):
  // Store a secure, HTTP-only session cookie for 30 days
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
  serverAnalyticsConnectors: [
    PerformanceMetricsServerAnalyticsConnector,
    ShopifyServerAnalyticsConnector,
  ],
});
