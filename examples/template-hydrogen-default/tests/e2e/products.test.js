import {startHydrogenServer} from '../utils';
import Product from '../../src/routes/products/[handle].server';

describe('products', () => {
  let hydrogen;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    hydrogen.watchForUpdates(Product);
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('shows the correct product title', async () => {
    await hydrogen.visit('/products/snowboard');
    const heading = await hydrogen.page.$('h1');
    expect(heading).not.toBeNull();

    const text = await hydrogen.page.evaluate((h1) => h1.textContent, heading);
    expect(text).toBe('The Hydrogen');
  }, 60000);
});
