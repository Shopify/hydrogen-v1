import {withCli} from '../../../../testing';

describe.skip('create', () => {
  it('scaffolds a basic app with default snow-devil name', async () => {
    await withCli(async ({run}) => {
      const app = await run('create');

      await app.withServer(async ({page}) => {
        await page.view('/');
        await page.screenshot('home.png');

        const heading = await page.textContent('h1');

        expect(heading).toContain('Welcome to Hydrogen');
      });
    });
  }, 30000);
});
