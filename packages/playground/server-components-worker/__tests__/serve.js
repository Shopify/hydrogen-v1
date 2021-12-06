// @ts-check
// this is automtically detected by scripts/jest-e2e-setup-test.ts and will replace
// the default e2e test serve behavior

const path = require('path');

const port = (exports.port = 9528);

/**
 * @param {string} root
 * @param {boolean} isProd
 */
exports.serve = async function serve(root, isProd) {
  // we build first, regardless of whether it's prod/build mode
  // because Vite doesn't support the concept of a "webworker server"
  const {build} = require('vite');

  process.env.HYDROGEN_PUBLIC_TEST = '42-public';

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
  delete process.env.HYDROGEN_PUBLIC_TEST;

  const {createServer} = require(path.resolve(root, 'start-worker.js'));
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
};
