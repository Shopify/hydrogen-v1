import {withCli} from '../../../../../testing';

describe('hydrogen', () => {
  it('fails when hydrogen is not latest version', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write(
        'package.json',
        `
            {
              "dependencies": {
                "@shopify/hydrogen": "0.0.2"
              }
            }
          `
      );
      const result = await run('check');
      expect(result.output.stdout.join('')).toMatch(/✕ Has latest hydrogen/);
    });
  });

  it('passes when hydrogen is latest version', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write(
        'package.json',
        `
            {
              "dependencies": {
                "@shopify/hydrogen": "0.0.6"
              }
            }
          `
      );
      const result = await run('check');
      expect(result.output.stdout.join('')).toMatch(/✕ Has latest hydrogen/);
    });
  });
});
