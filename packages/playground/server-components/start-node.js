// @ts-check
const fs = require('fs');
const path = require('path');
const express = require('express');
const {loadProdEnv} = require('./utils');

const {hydrogenMiddleware} = require('@shopify/hydrogen/middleware');

async function createServer(root = process.cwd()) {
  // Mock Oxygen
  globalThis.Oxygen = {env: await loadProdEnv()};

  const indexProd = fs.readFileSync(
    path.resolve(root, 'dist/client/index.html'),
    'utf-8'
  );

  const app = express();

  app.use(require('compression')());
  app.use(
    require('serve-static')(path.resolve(root, 'dist/client'), {
      index: false,
    })
  );

  app.use('*', express.raw({type: '*/*'}));

  app.use(
    '*',
    hydrogenMiddleware({
      getServerEntrypoint: () =>
        require(path.resolve(root, 'dist/server/entry-server.js')),
      indexTemplate: indexProd,
    })
  );

  return {app};
}

if (require.main === module) {
  createServer().then(({app}) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Hydrogen running at http://localhost:${port}`);
    });
  });
}

// for test use
exports.createServer = createServer;
