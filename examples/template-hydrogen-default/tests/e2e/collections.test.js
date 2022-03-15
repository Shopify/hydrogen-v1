import {startHydrogenServer} from '../utils';
import Collections from '../../src/routes/collections/[handle].server';

describe('collections', () => {
  let hydrogen;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    hydrogen.watchForUpdates(Collections);
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should have the correct title', async () => {
    await hydrogen.visit('/collections/freestyle-collection');
    const heading = await hydrogen.page.waitForSelector('h1');
    expect(heading).not.toBeNull();

    const text = await hydrogen.page.evaluate((h1) => h1.textContent, heading);
    expect(text).toBe('Freestyle Collection');
  }, 60000);
});
