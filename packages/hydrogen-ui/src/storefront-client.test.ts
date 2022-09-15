import {createStorefrontClient} from './storefront-client.js';
import {SFAPI_VERSION} from './storefront-api-constants.js';
import {vi} from 'vitest';

describe(`createStorefrontClient`, () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe(`getStorefrontApiUrl`, () => {
    it(`generates a URL`, () => {
      const client = createStorefrontClient(generateConfig());

      expect(client.getStorefrontApiUrl()).toBe(
        `https://testing.myshopify.com/api/${SFAPI_VERSION}/graphql.json`
      );
    });

    it(`allows overrides`, () => {
      const client = createStorefrontClient(generateConfig());

      expect(
        client.getStorefrontApiUrl({
          storeDomain: 'newdomain',
          storefrontApiVersion: '2000-01',
        })
      ).toBe(`https://newdomain.myshopify.com/api/2000-01/graphql.json`);
    });
  });

  describe(`getPrivateTokenHeaders`, () => {
    it(`generates the headers`, () => {
      const client = createStorefrontClient(
        generateConfig({privateStorefrontToken: 'privateToken'})
      );

      expect(client.getPrivateTokenHeaders()).toEqual({
        'Shopify-Storefront-Private-Token': 'privateToken',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version': '2022-07',
        'content-type': 'application/graphql',
      });
    });

    it(`allows overrides`, () => {
      const client = createStorefrontClient(
        generateConfig({privateStorefrontToken: 'privateToken'})
      );

      expect(
        client.getPrivateTokenHeaders({
          privateStorefrontToken: 'newPrivate',
          storefrontApiVersion: '2000-01',
          buyerIp: '1.1.1.1',
        })
      ).toEqual({
        'Shopify-Storefront-Buyer-IP': '1.1.1.1',
        'Shopify-Storefront-Private-Token': 'newPrivate',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version': '2000-01',
        'content-type': 'application/graphql',
      });
    });
  });

  describe(`getPublicTokenHeaders`, () => {
    it(`generates the headers`, () => {
      const client = createStorefrontClient(
        generateConfig({publicStorefrontToken: 'publicToken'})
      );

      expect(client.getPublicTokenHeaders()).toEqual({
        'X-Shopify-Storefront-Access-Token': 'publicToken',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version': '2022-07',
        'content-type': 'application/graphql',
      });
    });

    it(`allows overrides`, () => {
      const client = createStorefrontClient(
        generateConfig({publicStorefrontToken: 'publicToken'})
      );

      expect(
        client.getPublicTokenHeaders({
          publicStorefrontToken: 'newPublic',
          storefrontApiVersion: '2000-01',
          buyerIp: '1.1.1.1',
        })
      ).toEqual({
        'Shopify-Storefront-Buyer-IP': '1.1.1.1',
        'X-Shopify-Storefront-Access-Token': 'newPublic',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version': '2000-01',
        'content-type': 'application/graphql',
      });
    });
  });
});

type StorefrontClientProps = Parameters<typeof createStorefrontClient>[0];

function generateConfig(
  props?: Partial<StorefrontClientProps>
): StorefrontClientProps {
  return {
    storefrontApiVersion: SFAPI_VERSION,
    storeDomain: 'testing',
    ...props,
  };
}
