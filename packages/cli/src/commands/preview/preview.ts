import type {Env} from 'types';
import {MiniOxygen} from './mini-oxygen/core';
import path from 'path';

export async function preview(env: Env) {
  const {ui, workspace} = env;
  const root = workspace.root();
  const port = 3000;

  // We should get these from a config file, along with env variables
  const workerPath = 'dist/worker/index.js';
  const assetsDir = 'dist/client';

  const mf = new MiniOxygen({
    buildCommand: 'yarn build',
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
