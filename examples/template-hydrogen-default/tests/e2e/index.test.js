import {startHydrogenServer} from '../utils';
import Index from '../../src/routes/index.server';

describe('index', () => {
  let hydrogen;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    hydrogen.watchForUpdates(Index);
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should have the correct title', async () => {
    await hydrogen.visit('/');
    const heading = await hydrogen.page.waitForSelector('h1');
    expect(heading).not.toBeNull();

    const text = await hydrogen.page.evaluate((h1) => h1.textContent, heading);
    expect(text).toBe('Hello, Hydrogen');
  }, 60000);
});
