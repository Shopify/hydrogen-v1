import {withCli} from '../../../../../testing';
import {HYDROGEN_MIN_VERSION} from '../checkHydrogenVersion';

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

      expect(result.output.stdout.join('')).toStrictEqual(
        expect.stringContaining(
          `Didn’t find latest version of hydrogen (${HYDROGEN_MIN_VERSION}\), found 0.0.2`
        )
      );
    });
  });

  it('passes when hydrogen is latest version', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write(
        'package.json',
        `
            {
              "dependencies": {
                "@shopify/hydrogen": "${HYDROGEN_MIN_VERSION}"
              }
            }
          `
      );
      const result = await run('check');
      expect(result.output.stdout.join('')).toMatch(
        /Has latest hydrogen version/
      );
    });
  });
});
