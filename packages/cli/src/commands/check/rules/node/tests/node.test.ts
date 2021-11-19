import {withCli} from '../../../../../testing';

describe('node', () => {
  it('fails when node version is unsupported', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write(
        'package.json',
        `
          {
            "engines": {
              "node":"10.0.0"
            }
          }
        `
      );
      const result = await run('check');
      expect(result.output.stdout.join('')).toMatch(/✕ Has min node version/);
    });
  });

  it('passes when node version is supported', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write(
        'package.json',
        `
          {
            "engines": {
              "node":"14.0.0"
            }
          }
        `
      );
      const result = await run('check');

      expect(result.output.stdout.join('')).toMatch(/✓ Has min node version/);
    });
  });
});
