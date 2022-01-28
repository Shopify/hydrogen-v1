import {withCli} from '../../../testing';

describe('preview', () => {
  it('provides a helpful message when no worker build exists', async () => {
    await withCli(async ({run, fs}) => {
      const result = await run('preview');
      const output = result.output.stdout.join('');

      expect(output).toContain('worker.js not found');
      expect(output).toContain(
        'Run `yarn run build` to generate a worker build and try again.'
      );
    });
  });
});
