// @ts-check
const fs = require('fs');
const path = require('path');
const express = require('express');

const {hydrogenMiddleware} = require('@shopify/hydrogen/middleware');

const resolve = (p) => path.resolve(__dirname, p);

async function createServer() {
  const indexProd = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8');

  const app = express();

  app.use(require('compression')());
  app.use(
    require('serve-static')(resolve('dist/client'), {
      index: false,
    }),
  );

  app.use(
    '*',
    hydrogenMiddleware({
      getServerEntrypoint: () =>
        require('./dist/server/entry-server.js').default,
      indexTemplate: indexProd,
    }),
  );

  return {app};
}

createServer().then(({app}) => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Hydrogen running at http://localhost:${port}`);
  });
});
