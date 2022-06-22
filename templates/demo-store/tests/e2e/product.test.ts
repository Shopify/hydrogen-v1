import {type Response as PlaywrightResponse} from 'playwright';
import {
  startHydrogenServer,
  type HydrogenServer,
  type HydrogenSession,
} from '../utils';
import Product from '../../src/routes/products/[handle].server';

const PRODUCT_URL = '/products/the-hero-snowboard';

describe('products', () => {
  let hydrogen: HydrogenServer;
  let session: HydrogenSession;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    hydrogen.watchForUpdates(Product);
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should have product title', async () => {
    await session.visit(PRODUCT_URL);
    const heading = await session.page.locator('h1').first();
    expect(heading).not.toBeNull();
  });

  it('can be added to cart', async () => {
    await session.visit(PRODUCT_URL);

    // Click on add to cart button
    const [cartResponse] = await Promise.all([
      session.page.waitForResponse((response: PlaywrightResponse) =>
        /graphql\.json/.test(response.url()),
      ),
      session.page.locator('text=Add to bag').click(),
    ]);

    const cartEvent = await cartResponse.json();
    expect(cartEvent.data).not.toBeNull();
  });
});
