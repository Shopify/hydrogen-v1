import {withCli} from '../../../testing';

// Some tests in this file are finishing before
// the stream is closed. This is a known issue.
// We should investigate and remove this increase.
jest.setTimeout(30000);

describe('check', () => {
  describe('eslint', () => {
    it('fails in an empty project', async () => {
      await withCli(async ({run}) => {
        const result = await run('check');

        expect(result.output.stdout.join()).toMatch(
          /✕ Has hydrogen eslint config/
        );
        expect(result.output.stdout.join()).toMatch(/✕ Has eslint config/);
      });
    });
    it('passes when there is a eslint config', async () => {
      await withCli(async ({run, fs}) => {
        await fs.write(
          '.eslintrc',
          `
            {
              "env": {
                "browser": true,
                "node": true
              }
            }
          `
        );
        const result = await run('check');
        expect(result.output.stdout.join('')).toMatch(/✓ Has eslint config/);
      });
    });
    it('fails when not use hydrogen eslint config', async () => {
      await withCli(async ({run, fs}) => {
        await fs.write(
          'package.json',
          `
            {}
          `
        );
        await fs.write(
          '.eslintrc',
          `
            {
              "env": {
                "browser": true,
                "node": true
              }
            }
          `
        );
        const result = await run('check');
        expect(result.output.stdout.join('')).toMatch(
          /✕ Has hydrogen eslint config/
        );
      });
    });
    it('passes when using hydrogen eslint config', async () => {
      await withCli(async ({run, fs}) => {
        await fs.write(
          'package.json',
          `
            {
              "devDependencies": {
                "eslint-plugin-hydrogen": "0.0.1"
              }
            }
          `
        );
        await fs.write(
          '.eslintrc',
          `
            {
              "extends": [
                "plugin:hydrogen/recommended"
              ]
            }
          `
        );
        const result = await run('check');
        expect(result.output.stdout.join('')).toMatch(
          /✓ Has hydrogen eslint config/
        );
      });
    });
  });
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
                "node":"14"
              }
            }
          `
        );
        const result = await run('check');

        expect(result.output.stdout.join('')).toMatch(/✓ Has min node version/);
      });
    });
  });
});
