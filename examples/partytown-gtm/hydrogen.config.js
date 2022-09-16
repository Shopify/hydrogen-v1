import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  shopify: () => ({
    defaultLanguageCode: 'EN',
    defaultCountryCode: 'GB',
    storeDomain: Hydrogen.env.SHOPIFY_STORE_DOMAIN,
    storefrontToken: Hydrogen.env.SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN,
    storefrontApiVersion: '2022-07',
  }),
});
