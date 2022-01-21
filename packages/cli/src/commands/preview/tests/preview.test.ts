import {withCli} from '../../../testing';

describe('preview', () => {
  it('provides a helpful message when no worker build exists', async () => {
    await withCli(async ({run, fs}) => {
      const {output} = await run('preview');

      expect(output.stdout.join('')).toContain(
        'worker.js not found! Run `npm run build` first.'
      );
    });
  });
});
