import {startHydrogenServer} from '../utils';
import Product from '../../src/routes/products/[handle].server';

describe('products', () => {
  let hydrogen;
  let session;

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

  it('shows the correct product title', async () => {
    await session.visit('/products/snowboard');
    const heading = await session.page.locator('h1').first();
    expect(heading).not.toBeNull();

    const text = await heading.getAttribute('data-test-id');
    expect(text).toBe('gid://shopify/Product/6730850828344');
  }, 60000);
});
