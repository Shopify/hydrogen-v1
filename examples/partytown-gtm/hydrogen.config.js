import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: () => ({
    defaultLanguageCode: 'EN',
    defaultCountryCode: 'GB',
    storeDomain: Oxygen.env.SHOPIFY_STORE_DOMAIN,
    storefrontToken: Oxygen.env.SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN,
    storefrontApiVersion: '2022-07',
  }),
});
