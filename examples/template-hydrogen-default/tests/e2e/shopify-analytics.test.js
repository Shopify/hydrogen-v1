import {startHydrogenServer} from '../utils';

const SHOPIFY_ANALYTICS_ENDPOINT = '/__event?Shopify';

describe('analytics', () => {
  let hydrogen;
  let analyticEndpoint;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    analyticEndpoint = hydrogen.url(SHOPIFY_ANALYTICS_ENDPOINT);
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should emit page_view', async () => {
    const [request] = await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.visit('/'),
    ]);

    const analyticEvent = request.postDataJSON().events[0].payload;
    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticEvent.event_type).toEqual('page_view');
    expect(analyticEvent.normalized_page_url).toEqual(hydrogen.url('/'));
  }, 60000);

  it('should emit page_view on sub load', async () => {
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

    const analyticEvent = request.postDataJSON().events[0].payload;
    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticEvent.event_type).toEqual('page_view');
    expect(analyticEvent.normalized_page_url).toEqual(
      hydrogen.url(collectionPath),
    );
  }, 60000);

  it('should emit viewed_product event', async () => {
    const productPath = '/products/snowboard';
    // page load
    const [request] = await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.visit(productPath),
    ]);

    const analyticEvent = request.postDataJSON();
    const analyticPageEvent = analyticEvent.events[0].payload;
    const analyticProductEvent = analyticEvent.events[1].payload;

    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticPageEvent.event_type).toEqual('page_view');
    expect(analyticPageEvent.normalized_page_url).toEqual(
      hydrogen.url(productPath),
    );

    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticProductEvent.event_type).toEqual('viewed_product');
    expect(analyticProductEvent.normalized_page_url).toEqual(
      hydrogen.url(productPath),
    );

    const viewedProduct = analyticProductEvent.products[0];
    expect(viewedProduct).toEqual({
      product_gid: 'gid://shopify/Product/6730850828344',
      name: 'The Hydrogen',
      brand: 'Snowdevil',
      variant_gid: 'gid://shopify/ProductVariant/41007289630776',
      variant: 'Morning / 154',
      quantity: 1,
      price: '600.0',
      currency: 'USD',
      id: '6730850828344',
      variant_id: '41007289630776',
    });
  }, 60000);

  it('should emit added_product event', async () => {
    const productPath = '/products/snowboard';
    // page load
    await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.visit(productPath),
    ]);

    // On add to cart
    const [request] = await Promise.all([
      hydrogen.page.waitForRequest(analyticEndpoint),
      hydrogen.page.locator('button:has-text("Add to bag")').click(),
    ]);

    const analyticEvent = request.postDataJSON().events[0].payload;
    expect(request.url()).toEqual(analyticEndpoint);
    expect(analyticEvent.event_type).toEqual('added_product');
    expect(analyticEvent.normalized_page_url).toEqual(
      hydrogen.url(productPath),
    );

    const addedProduct = analyticEvent.products[0];
    expect(addedProduct).toEqual({
      name: 'The Hydrogen',
      brand: 'Snowdevil',
      variant_gid: 'gid://shopify/ProductVariant/41007289630776',
      variant: 'Morning / 154',
      quantity: 1,
      price: '600.0',
      currency: 'USD',
    });
  }, 60000);
});
