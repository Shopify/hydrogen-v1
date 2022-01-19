import {Command, withCli} from '../testing';

describe('CLI', () => {
  it('runs local commands from .hydrogen directory', async () => {
    await withCli(async ({run, fs}) => {
      await fs.write(
        '.hydrogen/commands/foo.js',
        `module.exports = function foo({ui}) {
            ui.say('hello from local foo command');
          };
          `
      );

      const result = await run('foo' as Command);

      expect(result.output.stdout).toStrictEqual(
        expect.arrayContaining([
          expect.stringMatching('hello from local foo command'),
        ])
      );
    });
  });

  it('throws when command doesn’t exist', async () => {
    await withCli(async ({run, fs}) => {
      const result = await run('foo' as Command);

      expect(result.output.stdout).toStrictEqual(
        expect.arrayContaining([
          expect.stringMatching('Command module not found'),
        ])
      );
    });
  });
});
