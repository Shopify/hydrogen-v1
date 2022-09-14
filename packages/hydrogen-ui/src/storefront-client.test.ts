import {createStorefrontClient} from './storefront-client.js';
import {SFAPI_VERSION} from './storefront-api-constants.js';

describe(`createStorefrontClient`, () => {
  describe(`getStorefrontApiUrl`, () => {
    it(`generates a URL`, () => {
      const client = createStorefrontClient(generatePrivateConfig());

      expect(client.getStorefrontApiUrl()).toBe(
        `https://testing.myshopify.com/api/${SFAPI_VERSION}/graphql.json`
      );
    });

    it(`allows overrides`, () => {
      const client = createStorefrontClient(generatePrivateConfig());

      expect(
        client.getStorefrontApiUrl({
          storeDomain: 'newdomain',
          storefrontApiVersion: '2000-01',
        })
      ).toBe(`https://newdomain.myshopify.com/api/2000-01/graphql.json`);
    });
  });
});

function generatePrivateConfig(): Parameters<typeof createStorefrontClient>[0] {
  return {
    storefrontApiVersion: SFAPI_VERSION,
    storeDomain: 'testing',
  };
}
