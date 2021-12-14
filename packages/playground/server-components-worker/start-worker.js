// @ts-check
const path = require('path');
const {Miniflare} = require('miniflare');

const isDev = process.env.DEV;

async function createServer(root = process.cwd()) {
  const mf = new Miniflare({
    scriptPath: path.resolve(root, 'dist/worker/worker.js'),
    sitePath: path.resolve(root, 'dist/client'),
    bindings: {
      PRIVATE_VARIABLE: '42-private',
    },
  });

  const app = mf.createServer();

  return {app};
}

if (isDev) {
  createServer().then(({app}) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000');
    })
  );
}

// for test use
exports.createServer = createServer;
