import {createContext, useContext, useMemo, type ReactNode} from 'react';
import type {LanguageCode, CountryCode, Shop} from './storefront-api-types.js';

const SFAPI_VERSION = '2022-07';

const ShopifyContext = createContext<ShopifyContextValue>({
  storeDomain: 'test.myshopify.com',
  storefrontToken: 'abc123',
  storefrontApiVersion: SFAPI_VERSION,
  country: {
    defaultIsoCode: 'CA',
    isoCode: 'CA',
  },
  language: {
    defaultIsoCode: 'EN',
    isoCode: 'EN',
  },
  locale: 'en-CA',
});

/**
 * The `<ShopifyProvider/>` component should wrap your app and enables use of the `useShop()` and `useLocalization()` hooks.
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
      `This version of Hydrogen-UI is built for Shopify's Storefront API version ${SFAPI_VERSION}, but it appears you're using version ${shopifyConfig.storefrontApiVersion}. There may be issues or bugs if you use a mismatched version of Hydrogen-UI and the Storefront API.`
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
  /** The host name of the domain (eg: `store.myshopify.com`). If a URL with a scheme (for example `https://`) is passed in, the scheme will be removed. */
  storeDomain: Shop['primaryDomain']['host'];
  /** The Storefront API access token. See [Authentication](https://shopify.dev/api/storefront#authentication) documentation for more details. */
  storefrontToken: string;
  /** The Storefront API version. This should almost always be the same as the version Hydrogen-UI was built for. See [Shopify API Versioning](https://shopify.dev/api/usage/versioning) for more details.  */
  storefrontApiVersion: string;
  country: {
    /**
     * The code designating a country, which generally follows ISO 3166-1 alpha-2 guidelines. If a territory doesn't have a country code value in the `CountryCode` enum, it might be considered a subdivision of another country. For example, the territories associated with Spain are represented by the country code `ES`, and the territories associated with the United States of America are represented by the country code `US`.
     *
     * This value can change depending on the customer's active country.
     */
    isoCode: CountryCode;
    /**
     * The code designating a country, which generally follows ISO 3166-1 alpha-2 guidelines. If a territory doesn't have a country code value in the `CountryCode` enum, it might be considered a subdivision of another country. For example, the territories associated with Spain are represented by the country code `ES`, and the territories associated with the United States of America are represented by the country code `US`.
     *
     * This value remains the same depsite changes in the customer's active country.
     */
    defaultIsoCode: CountryCode;
  };
  language: {
    /**
     * `ISO 369` language codes supported by Shopify.
     *
     * This value can change depending on the customer's active language.
     */
    isoCode: LanguageCode;
    /**
     * `ISO 369` language codes supported by Shopify.
     *
     * This value remains the same despite changes in the customer's active language.
     */
    defaultIsoCode: LanguageCode;
  };
  locale: string;
};
