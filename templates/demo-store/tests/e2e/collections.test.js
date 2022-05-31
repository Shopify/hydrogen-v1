import {startHydrogenServer} from '../utils';
import Collections from '../../src/routes/collections/[handle].server';

describe('collections', () => {
  let hydrogen;
  let session;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    hydrogen.watchForUpdates(Collections);
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should have the correct title', async () => {
    await session.visit('/collections/freestyle-collection');
    const heading = await session.page.locator('h1').first();
    expect(heading).not.toBeNull();

    const text = await heading.textContent();
    expect(text).toBe('Freestyle Collection');
  }, 60000);
});
