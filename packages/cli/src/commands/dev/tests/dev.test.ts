import {withCli} from '../../../testing';

describe('dev', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log');
    consoleLogSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('provides a helpful message when vite is not found', async () => {
    await withCli(async ({run}) => {
      const {output} = await run('dev');

      expect(output.stdout.join('')).toContain('Missing the `vite` dependency');
    });
  });

  it('runs the local vite binary', async () => {
    await withCli(
      async ({run, fs}) => {
        await fs.write(
          'node_modules/.bin/vite',
          'console.log("hello from vite");'
        );

        const result = await run('dev');
        const output = result.output.stdout.join('');

        expect(output).toContain('Starting Hydrogen server in dev..');
        expect(output).toContain('hello from vite');
      },
      {debug: true}
    );
  });
});
