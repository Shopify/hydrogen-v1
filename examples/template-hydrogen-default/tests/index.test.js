import {startHydrogenNodeServer} from './utils';

describe('product', async () => {
  let hydrogen;

  beforeAll(async () => {
    hydrogen = await startHydrogenNodeServer();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  test('should have the correct title', async () => {
    await hydrogen.visit('/');
    const heading = await hydrogen.page.$('h1');
    expect(heading).not.toBeNull();

    const text = await hydrogen.page.evaluate((h1) => h1.textContent, heading);
    expect(text).toBe('Hello, Hydrogen');
  }, 60000);
});
