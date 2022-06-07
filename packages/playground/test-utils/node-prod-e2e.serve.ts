// This is automtically detected by scripts/jest-e2e-setup-test.ts and will replace
// the default e2e test serve behavior

import {execSync} from 'child_process';
import {createServer} from './start-node';

export const port = 9428;

export async function serve(root: string, isProd: boolean) {
  // we build first, regardless of whether it's prod/build mode
  // because Vite doesn't support the concept of a "webworker server"
  execSync('yarn build:server', {cwd: root});

  // @ts-ignore
  const {app} = await createServer({cwd: root});

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
