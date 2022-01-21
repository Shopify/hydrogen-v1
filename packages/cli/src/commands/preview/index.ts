import type {Env} from 'types';
import {MiniOxygen} from './mini-oxygen/core';
import path from 'path';
import {tree} from '../../utilities';

export default async function preview(env: Env) {
  const {fs, ui, workspace} = env;
  const root = workspace.root();
  const port = 3000;

  if (!(await fs.exists('dist/worker/worker.js'))) {
    ui.say('worker.js not found! Run `npm run build` first.');
    return;
  }

  const {files} = await tree(fs.join(root, 'dist/client'), {
    recursive: true,
  });

  const mf = new MiniOxygen({
    buildCommand: 'yarn build',
    globals: {Oxygen: {}},
    scriptPath: path.resolve(root, 'dist/worker/worker.js'),
    sitePath: path.resolve(root, 'dist/client'),
  });

  const app = await mf.createServer({assets: files});

  app.listen(port, () => {
    ui.say(
      `\nStarted miniOxygen server. Listening at http://localhost:${port}\n`
    );
  });
}
