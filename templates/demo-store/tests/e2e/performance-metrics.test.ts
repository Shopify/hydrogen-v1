import {
  startHydrogenServer,
  type HydrogenServer,
  type HydrogenSession,
} from '../utils';

const SHOPIFY_EVENTS_ENDPOINT =
  'https://monorail-edge.shopifysvc.com/v1/produce';

describe('Performance metrics', () => {
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

  it('should emit performance event', async () => {
    const [request] = await Promise.all([
      session.page.waitForRequest(SHOPIFY_EVENTS_ENDPOINT),
      session.visit('/'),
    ]);

    const performanceEvent = request.postDataJSON().payload;
    expect(request.url()).toEqual(SHOPIFY_EVENTS_ENDPOINT);
    expect(performanceEvent.page_load_type).toEqual('full');
    expect(performanceEvent.url).toEqual(hydrogen.url('/'));
  });

  it('should emit performance on sub load', async () => {
    const collectionPath = '/collections/freestyle';
    // Full load
    await Promise.all([
      session.page.waitForRequest(SHOPIFY_EVENTS_ENDPOINT),
      session.visit('/'),
    ]);

    // Sub load
    const [request] = await Promise.all([
      session.page.waitForRequest(SHOPIFY_EVENTS_ENDPOINT),
      session.page.click(`a[href="${collectionPath}"]`),
    ]);

    const performanceEvent = request.postDataJSON().payload;
    expect(request.url()).toEqual(SHOPIFY_EVENTS_ENDPOINT);
    expect(performanceEvent.page_load_type).toEqual('sub');
    expect(performanceEvent.url).toEqual(hydrogen.url(collectionPath));
  });
});
