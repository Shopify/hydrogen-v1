// @ts-check
import path from 'path';
import {MiniOxygen} from './mini-oxygen/core.mjs';

start();

async function start({root = process.cwd(), port = 3000} = {}) {
  const mf = new MiniOxygen({
    buildCommand: 'yarn build',
    globals: {Oxygen: {}},
    scriptPath: path.resolve(root, 'dist/worker/worker.js'),
    sitePath: path.resolve(root, 'dist/client'),
  });

  const app = await mf.createServer();

  app.listen(port, () => {
    console.log(`Started miniOxygen server on port ${port}`);
  });
}
