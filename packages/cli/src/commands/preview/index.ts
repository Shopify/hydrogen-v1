import type {Env} from 'types';
import {MiniOxygen} from './mini-oxygen/core';
import path from 'path';

export default async function preview(env: Env) {
  start();

  async function start({root = process.cwd(), port = 3000} = {}) {
    // TODO: Check to see if dist/worker/worker.js exists, and give instructions to build if not.

    const mf = new MiniOxygen({
      buildCommand: 'yarn build',
      globals: {Oxygen: {}},
      scriptPath: path.resolve(root, 'dist/worker/worker.js'),
      sitePath: path.resolve(root, 'dist/client'),
    });

    const app = await mf.createServer();

    app.listen(port, () => {
      console.log(
        `\nStarted miniOxygen server. Listening at http://localhost:${port}\n`
      );
    });
  }
}
