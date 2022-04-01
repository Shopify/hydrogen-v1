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
    const heading = await session.page.waitForSelector('h1');
    expect(heading).not.toBeNull();

    const text = await session.page.evaluate((h1) => h1.textContent, heading);
    expect(text).toBe('Hello, Hydrogen');
  }, 60000);
});
