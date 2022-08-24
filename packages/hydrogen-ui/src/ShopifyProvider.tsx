import {createContext, useContext, useMemo, type ReactNode} from 'react';
import type {LanguageCode, CountryCode, Shop} from './storefront-api-types.js';

const SFAPI_VERSION = '2022-07';

const ShopifyContext = createContext<ShopifyContextValue>({
  storeDomain: 'test.myshopify.com',
  storefrontToken: 'abc123',
  storefrontApiVersion: SFAPI_VERSION,
  country: {
    isoCode: 'US',
  },
  language: {
    isoCode: 'EN',
  },
  locale: 'EN-US',
});

/**
 * The `<ShopifyProvider/>` component enables use of the `useShop()` hook. The component should wrap your app.
 */
export function ShopifyProvider({
  children,
  shopifyConfig,
}: {
  children: ReactNode;
  shopifyConfig: ShopifyContextValue;
}) {
  if (!shopifyConfig) {
    throw new Error(
      `The 'shopifyConfig' prop must be passed to '<ShopifyProvider/>'`
    );
  }

  if (shopifyConfig.storefrontApiVersion !== SFAPI_VERSION) {
    console.warn(
      `This version of Hydrogen-UI is built for Shopify's Storefront API version ${SFAPI_VERSION}, but it looks like you're using version ${shopifyConfig.storefrontApiVersion}. There may be issues or bugs if you use a mismatched version of Hydrogen-UI and the Storefront API.`
    );
  }

  const finalConfig = useMemo<ShopifyContextValue>(
    () => ({
      ...shopifyConfig,
      storeDomain: shopifyConfig.storeDomain.replace(/^https?:\/\//, ''),
    }),
    [shopifyConfig]
  );

  return (
    <ShopifyContext.Provider value={finalConfig}>
      {children}
    </ShopifyContext.Provider>
  );
}

/**
 * Provides access to the `shopifyConfig` prop of `<ShopifyProvider/>`. Must be a descendent of `<ShopifyProvider/>`.
 */
export function useShop() {
  const shopContext = useContext(ShopifyContext);
  if (!shopContext) {
    throw new Error(`'useShop()' must be a descendent of <ShopifyProvider/>`);
  }
  return shopContext;
}

/**
 * Shopify-specific values that are used in various Hydrogen-UI components and hooks.
 */
export type ShopifyContextValue = {
  /** The globally-unique identifier for the Shop */
  storefrontId?: Shop['id'];
  /** The host name of the domain (eg: `{shop}.myshopify.com`). If a URL with a scheme (for example `https://`) is passed in, then the scheme is removed. */
  storeDomain: Shop['primaryDomain']['host'];
  /** The Storefront API access token. Refer to the [authentication](https://shopify.dev/api/storefront#authentication) documentation for more details. */
  storefrontToken: string;
  /** The Storefront API version. This should almost always be the same as the version Hydrogen-UI was built for. Learn more about Shopify [API versioning](https://shopify.dev/api/usage/versioning) for more details.  */
  storefrontApiVersion: string;
  country: {
    /**
     * The code designating a country, which generally follows ISO 3166-1 alpha-2 guidelines. If a territory doesn't have a country code value in the `CountryCode` enum, it might be considered a subdivision of another country. For example, the territories associated with Spain are represented by the country code `ES`, and the territories associated with the United States of America are represented by the country code `US`.
     */
    isoCode: CountryCode;
  };
  language: {
    /**
     * `ISO 369` language codes supported by Shopify.
     */
    isoCode: LanguageCode;
  };
  /**
   * The locale string based on `country` and `language`.
   */
  locale: string;
};
