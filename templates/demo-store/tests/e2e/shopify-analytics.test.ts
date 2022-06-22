import {
  startHydrogenServer,
  type HydrogenServer,
  type HydrogenSession,
} from '../utils';

const SHOPIFY_ANALYTICS_ENDPOINT =
  'https://monorail-edge.shopifysvc.com/unstable/produce_batch';

describe('analytics', () => {
  let hydrogen: HydrogenServer;
  let session: HydrogenSession;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should emit page-view event', async () => {
    const [request] = await Promise.all([
      session.page.waitForRequest(SHOPIFY_ANALYTICS_ENDPOINT),
      session.visit('/'),
    ]);

    const shopifyEvents = request.postDataJSON();
    expect(request.url()).toEqual(SHOPIFY_ANALYTICS_ENDPOINT);

    const event = shopifyEvents.events[0];
    const payload = event.payload;

    expect(event.schema_id).toContain('trekkie_storefront_page_view');
    expect(payload.shopId).not.toEqual(0);
    expect(payload.pageType).toEqual('index');
    expect(payload.isMerchantRequest).toEqual(true);
  });

  it('should emit page-view on sub load', async () => {
    const collectionPath = '/collections/freestyle';
    // Full load
    await Promise.all([
      session.page.waitForRequest(SHOPIFY_ANALYTICS_ENDPOINT),
      session.visit('/'),
    ]);

    // Sub load
    const [request] = await Promise.all([
      session.page.waitForRequest(SHOPIFY_ANALYTICS_ENDPOINT),
      session.page.click(`a[href="${collectionPath}"]`),
    ]);

    const shopifyEvents = request.postDataJSON();
    expect(request.url()).toEqual(SHOPIFY_ANALYTICS_ENDPOINT);

    const event = shopifyEvents.events[0];
    const payload = event.payload;

    expect(event.schema_id).toContain('trekkie_storefront_page_view');
    expect(payload.shopId).not.toEqual(0);
    expect(payload.pageType).toEqual('collection');
    expect(payload.resourceType).toEqual('collection');
    expect(payload.isMerchantRequest).toEqual(true);
  });
});
