// @ts-check
const path = require('path');
const {Miniflare} = require('miniflare');
const {loadProdEnv} = require('./utils');

async function createServer(root = process.cwd()) {
  const mf = new Miniflare({
    scriptPath: path.resolve(root, 'dist/worker/index.js'),
    sitePath: path.resolve(root, 'dist/client'),
    bindings: await loadProdEnv(),
  });

  const app = mf.createServer();

  return {app};
}

if (require.main === module) {
  createServer().then(({app}) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000');
    })
  );
}

// for test use
exports.createServer = createServer;
