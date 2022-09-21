import {createStorefrontClient} from './storefront-client.js';
import {SFAPI_VERSION} from './storefront-api-constants.js';
import {vi} from 'vitest';

describe(`createStorefrontClient`, () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe(`constructor`, () => {
    it(`defaults to "application/json" for the content-type`, () => {
      const client = createStorefrontClient(
        generateConfig(
          generateConfig({
            privateStorefrontToken: 'privateToken',
            publicStorefrontToken: 'public',
          })
        )
      );

      expect(client.getPrivateTokenHeaders()['content-type']).toBe(
        'application/json'
      );
      expect(client.getPublicTokenHeaders()['content-type']).toBe(
        'application/json'
      );
    });

    it(`allows override for content-type`, () => {
      const client = createStorefrontClient(
        generateConfig(
          generateConfig({
            publicStorefrontToken: 'public',
            privateStorefrontToken: 'privateToken',
            contentType: 'graphql',
          })
        )
      );

      expect(client.getPrivateTokenHeaders()['content-type']).toBe(
        'application/graphql'
      );
      expect(client.getPublicTokenHeaders()['content-type']).toBe(
        'application/graphql'
      );
    });
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
        'content-type': 'application/json',
      });
    });

    it(`allows overrides`, () => {
      const client = createStorefrontClient(
        generateConfig({privateStorefrontToken: 'privateToken'})
      );

      expect(
        client.getPrivateTokenHeaders({
          privateStorefrontToken: 'newPrivate',
          buyerIp: '1.1.1.1',
          contentType: 'graphql',
        })
      ).toEqual({
        'Shopify-Storefront-Buyer-IP': '1.1.1.1',
        'Shopify-Storefront-Private-Token': 'newPrivate',
        'X-SDK-Variant': 'hydrogen-ui',
        'X-SDK-Version': '2022-07',
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
        'X-SDK-Version': '2022-07',
        'X-SDK-Variant': 'hydrogen-ui',
        'content-type': 'application/json',
      });
    });

    it(`allows overrides`, () => {
      const client = createStorefrontClient(
        generateConfig({publicStorefrontToken: 'publicToken'})
      );

      expect(
        client.getPublicTokenHeaders({
          publicStorefrontToken: 'newPublic',
          contentType: 'graphql',
        })
      ).toEqual({
        'X-Shopify-Storefront-Access-Token': 'newPublic',
        'X-SDK-Version': '2022-07',
        'X-SDK-Variant': 'hydrogen-ui',
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
