import {withCli} from '../../../../../testing';

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
