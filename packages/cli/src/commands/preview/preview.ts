import type {Env} from 'types';
import {MiniOxygen} from './mini-oxygen/core';
import path from 'path';
import {tree, HelpfulError} from '../../utilities';

export async function preview(env: Env) {
  const {fs, ui, workspace} = env;
  const root = workspace.root();
  const port = 3000;

  if (!(await fs.exists('dist/worker/index.js'))) {
    throw new HelpfulError({
      title: 'worker.js not found',
      content: 'A worker build is required for this command.',
      suggestion: ({workspace}) =>
        `Run \`${workspace.packageManager} run build\` to generate a worker build and try again.`,
    });
  }

  const {files} = await tree(fs.join(root, 'dist/client'), {
    recursive: true,
  });

  const mf = new MiniOxygen({
    buildCommand: 'yarn build',
    globals: {Oxygen: {}},
    scriptPath: path.resolve(root, 'dist/worker/index.js'),
    sitePath: path.resolve(root, 'dist/client'),
  });

  const app = await mf.createServer({assets: files});

  app.listen(port, () => {
    ui.say(
      `\nStarted miniOxygen server. Listening at http://localhost:${port}\n`
    );
  });
}
