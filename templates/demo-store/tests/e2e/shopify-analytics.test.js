import {DEFAULT_DELAY, startHydrogenServer} from '../utils';

const SHOPIFY_ANALYTICS_ENDPOINT = '/__event?shopify';

describe('analytics', () => {
  let hydrogen;
  let eventsEndpoint;
  let session;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    eventsEndpoint = hydrogen.url(SHOPIFY_ANALYTICS_ENDPOINT);
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it(
    'should emit page-view event',
    async () => {
      const [request] = await Promise.all([
        session.page.waitForRequest(eventsEndpoint),
        session.visit('/'),
      ]);

      const shopifyEvents = request.postDataJSON();
      expect(request.url()).toEqual(eventsEndpoint);

      const event = shopifyEvents.events[0];
      const payload = event.payload;

      expect(event.schema_id).toContain('trekkie_storefront_page_view');
      expect(payload.shopId).not.toEqual(0);
      expect(payload.pageType).toEqual('index');
      expect(payload.isMerchantRequest).toEqual(true);
    },
    DEFAULT_DELAY,
  );

  it(
    'should emit page-view on sub load',
    async () => {
      const collectionPath = '/collections/freestyle-collection';
      // Full load
      await Promise.all([
        session.page.waitForRequest(eventsEndpoint),
        session.visit('/'),
      ]);

      // Sub load
      const [request] = await Promise.all([
        session.page.waitForRequest(eventsEndpoint),
        session.page.click(`a[href="${collectionPath}"]`),
      ]);

      const shopifyEvents = request.postDataJSON();
      expect(request.url()).toEqual(eventsEndpoint);

      const event = shopifyEvents.events[0];
      const payload = event.payload;

      expect(event.schema_id).toContain('trekkie_storefront_page_view');
      expect(payload.shopId).not.toEqual(0);
      expect(payload.pageType).toEqual('collection');
      expect(payload.resourceType).toEqual('collection');
      expect(payload.isMerchantRequest).toEqual(true);
    },
    DEFAULT_DELAY,
  );
});
