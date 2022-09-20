import {SFAPI_VERSION} from './storefront-api-constants.js';

/**
 * The `createStorefrontClient()` function creates helpers that enable you to quickly query the Shopify Storefront API.
 *
 * When used on the server, it is recommended to use the `privateStorefrontToken` prop. When used on the client, it is recommended to use the `publicStorefrontToken` prop.
 */
export function createStorefrontClient({
  storeDomain,
  privateStorefrontToken,
  publicStorefrontToken,
  storefrontId,
  storefrontApiVersion,
}: StorefrontClientProps): StorefrontClientReturn {
  if (storefrontApiVersion !== SFAPI_VERSION) {
    console.warn(
      `StorefrontClient: The Storefront API version that you're using is different than the version this build of Hydrogen-UI is targeting. You may run into unexpected errors if these versions don't match. Received verion: "${storefrontApiVersion}"; expected version ${SFAPI_VERSION}`
    );
  }

  // only warn if not in a browser environment
  if (__HYDROGEN_DEV__ && !privateStorefrontToken && !globalThis.document) {
    console.warn(
      `StorefrontClient: Using a private storefront token is recommended for server environments.  Refer to the authentication https://shopify.dev/api/storefront#authentication documentation for more details. `
    );
  }

  // only warn if in a browser environment and you're using the privateStorefrontToken
  if (__HYDROGEN_DEV__ && privateStorefrontToken && globalThis) {
    console.warn(
      `StorefrontClient: You are attempting to use a private token in an environment where it can be easily accessed by anyone. This is a security risk; please use the public token and the 'publicStorefrontToken' prop`
    );
  }

  return {
    getStorefrontApiUrl(overrideProps) {
      return `https://${
        overrideProps?.storeDomain ?? storeDomain
      }.myshopify.com/api/${
        overrideProps?.storefrontApiVersion ?? storefrontApiVersion
      }/graphql.json`;
    },
    getPrivateTokenHeaders(overrideProps) {
      if (!privateStorefrontToken && !overrideProps?.privateStorefrontToken) {
        throw new Error(
          `StorefrontClient: You did not pass in a 'privateStorefrontToken' while using 'getPrivateTokenHeaders()'`
        );
      }

      if (__HYDROGEN_DEV__ && !overrideProps?.buyerIp) {
        console.warn(
          `StorefrontClient: it is recommended to pass in the 'buyerIp' property which improves analytics and data in the admin.`
        );
      }

      return {
        'content-type': 'application/graphql',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version':
          overrideProps?.storefrontApiVersion ?? storefrontApiVersion,
        'Shopify-Storefront-Private-Token':
          overrideProps?.privateStorefrontToken ?? privateStorefrontToken ?? '',
        ...(overrideProps?.storefrontId || storefrontId
          ? {
              'Shopify-Storefront-Id':
                overrideProps?.storefrontId ?? storefrontId,
            }
          : {}),
        ...(overrideProps?.buyerIp
          ? {'Shopify-Storefront-Buyer-IP': overrideProps.buyerIp}
          : {}),
      };
    },
    getPublicTokenHeaders(overrideProps) {
      if (!publicStorefrontToken && !overrideProps?.publicStorefrontToken) {
        throw new Error(
          `StorefrontClient: You did not pass in a 'publicStorefrontToken' while using 'getPublicTokenHeaders()'`
        );
      }

      if (__HYDROGEN_DEV__ && !overrideProps?.buyerIp && !globalThis.document) {
        console.warn(
          `StorefrontClient: when making a request from the server it is recommended to pass in the 'buyerIp' property which improves analytics and data in the admin.`
        );
      }

      return {
        'content-type': 'application/graphql',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version':
          overrideProps?.storefrontApiVersion ?? storefrontApiVersion,
        'X-Shopify-Storefront-Access-Token':
          overrideProps?.publicStorefrontToken ?? publicStorefrontToken ?? '',
        ...(overrideProps?.storefrontId || storefrontId
          ? {
              'Shopify-Storefront-Id':
                overrideProps?.storefrontId ?? storefrontId,
            }
          : {}),
        ...(overrideProps?.buyerIp
          ? {'Shopify-Storefront-Buyer-IP': overrideProps.buyerIp}
          : {}),
      };
    },
  };
}

type StorefrontClientProps = {
  /** The host name of the domain (eg: `{shop}.myshopify.com`). */
  storeDomain: string;
  /** The Storefront API delegate access token. Refer to the [authentication](https://shopify.dev/api/storefront#authentication) and [delegate access token](https://shopify.dev/apps/auth/oauth/delegate-access-tokens) documentation for more details. */
  privateStorefrontToken?: string;
  /** The Storefront API access token. Refer to the [authentication](https://shopify.dev/api/storefront#authentication) documentation for more details. */
  publicStorefrontToken?: string;
  /** The globally-unique identifier for the Shop */
  storefrontId?: string;
  /** The Storefront API version. This should almost always be the same as the version Hydrogen-UI was built for. Learn more about Shopify [API versioning](https://shopify.dev/api/usage/versioning) for more details.  */
  storefrontApiVersion: string;
};

type OverrideTokenHeaderProps = Partial<
  Pick<
    StorefrontClientProps,
    'storeDomain' | 'storefrontId' | 'storefrontApiVersion'
  >
> & {
  /**
   * The client's IP address. Passing this to the Storefront API when using a server-to-server token will help improve your store's analytics data.
   */
  buyerIp?: string;
};

type StorefrontClientReturn = {
  /**
   * Creates the fully-qualified URL to your store's GraphQL endpoint.
   *
   * By default, it will use the config you passed in when calling `createStorefrontClient()`. However, you can override any of those settings on any invocation of `getStorefrontApiUrl()` by passing in an optional prop with any customizations you need.
   */
  getStorefrontApiUrl: (
    props?: Partial<
      Pick<StorefrontClientProps, 'storeDomain' | 'storefrontApiVersion'>
    >
  ) => string;
  /**
   * Returns an object that contains headers that are needed for each query to Storefront API GraphQL endpoint. This method uses the private Server-to-Server token which reduces the chance of throttling but must not be exposed to clients. Server-side calls should prefer using this over `getPublicTokenHeaders()`.
   *
   * By default, it will use the config you passed in when calling `getPrivateTokenHeaders()`. However, you can override any of those settings on any invocation of `getStorefrontApiUrl()` by passing in an optional prop with any customizations you need.
   */
  getPrivateTokenHeaders: (
    props?: OverrideTokenHeaderProps &
      Pick<StorefrontClientProps, 'privateStorefrontToken'>
  ) => Record<string, string>;
  /**
   * Returns an object that contains headers that are needed for each query to Storefront API GraphQL endpoint. This method uses a public token which has a higher chance of running into throttling errors, but can be exposed to clients. Server-side calls should prefer using `getPrivateTokenHeaders()` instead.
   *
   * By default, it will use the config you passed in when calling `getPrivateTokenHeaders()`. However, you can override any of those settings on any invocation of `getStorefrontApiUrl()` by passing in an optional prop with any customizations you need.
   */
  getPublicTokenHeaders: (
    props?: OverrideTokenHeaderProps &
      Pick<StorefrontClientProps, 'publicStorefrontToken'>
  ) => Record<string, string>;
};
