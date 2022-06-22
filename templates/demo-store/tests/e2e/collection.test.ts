import {
  startHydrogenServer,
  type HydrogenServer,
  type HydrogenSession,
} from '../utils';
import Collections from '../../src/routes/collections/[handle].server';

const COLLECTION_URL = '/collections/freestyle';

describe('collections', () => {
  let hydrogen: HydrogenServer;
  let session: HydrogenSession;

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

  it('should have collection title', async () => {
    await session.visit(COLLECTION_URL);

    const heading = await session.page.locator('h1').first();
    expect(heading).not.toBeNull();
  });

  it('should have collection description', async () => {
    await session.visit(COLLECTION_URL);

    const description = await session.page
      .locator('#mainContent header p')
      .first();
    expect(description).not.toBeNull();
  });

  it('should have collection product tiles', async () => {
    await session.visit(COLLECTION_URL);

    const products = await session.page.locator('#mainContent section a');
    expect(await products.count()).not.toEqual(0);
  });
});
