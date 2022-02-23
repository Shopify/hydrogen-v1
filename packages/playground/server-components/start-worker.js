// @ts-check
const path = require('path');
const {Miniflare} = require('miniflare');
const {loadProdEnv} = require('./utils');

async function createServer({port = 8080, root = process.cwd()} = {}) {
  const mf = new Miniflare({
    scriptPath: path.resolve(root, 'dist/worker/index.js'),
    sitePath: path.resolve(root, 'dist/client'),
    bindings: await loadProdEnv(),
  });

  const app = mf.createServer();

  return {app, port};
}

if (require.main === module) {
  createServer().then(({app, port}) =>
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    })
  );
}

// for test use
exports.createServer = createServer;
