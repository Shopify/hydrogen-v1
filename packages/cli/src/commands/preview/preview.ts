import type {Env} from 'types';
import {MiniOxygen} from './mini-oxygen/core';
import path from 'path';
import {HelpfulError} from '../../utilities';

export async function preview(env: Env) {
  const {fs, ui, workspace} = env;
  const root = workspace.root();
  const port = 3000;

  // We should get these from a config file, along with env variables
  const workerPath = 'dist/worker/index.js';
  const assetsDir = 'dist/client';

  if (!(await fs.exists(workerPath))) {
    throw new HelpfulError({
      title: 'worker not found',
      content: 'A worker build is required for this command.',
      suggestion: ({workspace}) =>
        `Run \`${workspace.packageManager} run build\` to generate a worker build and try again.`,
    });
  }

  const mf = new MiniOxygen({
    buildCommand: 'yarn build',
    // I think globals requires the Bindings Plugin, so we'll have to do this a different way
    globals: {Oxygen: {}},
    scriptPath: path.resolve(root, workerPath),
    watch: true,
    buildWatchPaths: ['./src'],
  });

  const app = await mf.createServer({assetsDir});

  app.listen(port, () => {
    ui.say(
      `\nStarted miniOxygen server. Listening at http://localhost:${port}\n`
    );
  });
}
