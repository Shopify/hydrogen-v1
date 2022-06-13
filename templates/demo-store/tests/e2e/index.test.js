import {startHydrogenServer} from '../utils';
import Index from '../../src/routes/index.server';

describe('index', () => {
  let hydrogen;
  let session;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
    hydrogen.watchForUpdates(Index);
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should have the correct title', async () => {
    await session.visit('/');
    const heading = await session.page.locator('h1').first();
    expect(heading).not.toBeNull();

    const text = await heading.textContent();
    expect(text).toBe('Hello, Hydrogen');
  }, 60000);
});
