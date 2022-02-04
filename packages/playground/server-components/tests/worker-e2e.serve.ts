// This is automtically detected by scripts/jest-e2e-setup-test.ts and will replace
// the default e2e test serve behavior

import {resolve} from 'path';
import {build} from 'vite';

export const port = 9528;

export async function serve(root: string, isProd: boolean) {
  // we build first, regardless of whether it's prod/build mode
  // because Vite doesn't support the concept of a "webworker server"

  process.env.PUBLIC_VARIABLE = '42-public';

  // client build
  await build({
    root,
    logLevel: 'silent',
    build: {
      outDir: 'dist/client',
      manifest: true,
    },
  });

  process.env.WORKER = 'true';

  // worker build
  await build({
    root,
    logLevel: 'silent',
    build: {
      ssr: 'worker.js',
      outDir: 'dist/worker',
    },
  });

  delete process.env.WORKER;
  delete process.env.PUBLIC_VARIABLE;

  const {createServer} = await import(resolve(root, 'start-worker.js'));
  const {app} = await createServer(root, isProd);

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        resolve({
          // for test teardown
          async close() {
            await new Promise((resolve) => {
              server.close(resolve);
            });
          },
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
