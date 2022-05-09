import {startHydrogenServer} from '../utils';

const SHOPIFY_EVENTS_ENDPOINT = '/__event?performance';

describe('Performance metrics', () => {
  let hydrogen;
  let eventsEndpoint;
  let session;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    eventsEndpoint = hydrogen.url(SHOPIFY_EVENTS_ENDPOINT);
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should emit performance event', async () => {
    const [request] = await Promise.all([
      session.page.waitForRequest(eventsEndpoint),
      session.visit('/'),
    ]);

    const performanceEvent = request.postDataJSON();
    expect(request.url()).toEqual(eventsEndpoint);
    expect(performanceEvent.page_load_type).toEqual('full');
    expect(performanceEvent.store_domain).toEqual(
      'hydrogen-preview.myshopify.com',
    );
    expect(performanceEvent.url).toEqual(hydrogen.url('/'));
  }, 60000);

  it('should emit performance on sub load', async () => {
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

    const performanceEvent = request.postDataJSON();
    expect(request.url()).toEqual(eventsEndpoint);
    expect(performanceEvent.page_load_type).toEqual('sub');
    expect(performanceEvent.url).toEqual(hydrogen.url(collectionPath));
  }, 60000);
});
