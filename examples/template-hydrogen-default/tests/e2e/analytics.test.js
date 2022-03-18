import {startHydrogenServer} from '../utils';

const ANALYTICS_ENDPOINT = '/__event';

describe('analytics', () => {
  let hydrogen;
  let analyticEndpoint;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    analyticEndpoint = hydrogen.url(ANALYTICS_ENDPOINT);
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should emit page-view', async () => {
    const [request] = await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.visit('/'),
    ]);

    const analyticEvent = request.postDataJSON();
    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticEvent.eventname).toEqual('page-view');
    expect(analyticEvent.payload.normailizedRscUrl).toEqual(hydrogen.url('/'));
  }, 60000);

  it('should emit page-view on sub load', async () => {
    const collectionPath = '/collections/freestyle-collection';
    // Full load
    await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.visit('/'),
    ]);

    // Sub load
    const [request] = await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.page.click(`a[href="${collectionPath}"]`),
    ]);

    const analyticEvent = request.postDataJSON();
    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticEvent.eventname).toEqual('page-view');
    expect(analyticEvent.payload.normailizedRscUrl).toEqual(
      hydrogen.url(collectionPath),
    );
    expect(analyticEvent.payload.url).toContain(
      `?state=${encodeURIComponent(`{"pathname":"${collectionPath}"}`)}`,
    );
  }, 60000);
});
