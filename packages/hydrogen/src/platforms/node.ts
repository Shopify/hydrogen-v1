import '../utilities/web-api-polyfill.js';
import path from 'path';
import {
  handleRequest,
  indexTemplate,
  relativeClientBuildPath,
} from './virtual.js';
import {hydrogenMiddleware} from '../framework/middleware.js';

// @ts-ignore
import serveStatic from 'serve-static';
// @ts-ignore
import compression from 'compression';
import bodyParser from 'body-parser';
import connect, {NextHandleFunction} from 'connect';
import {InMemoryCache} from '../framework/cache/in-memory.js';

type CreateServerOptions = {
  cache?: Cache;
};

export async function createServer({
  cache = new InMemoryCache(),
}: CreateServerOptions = {}) {
  // @ts-ignore
  globalThis.Oxygen = {env: process.env};

  const app = connect();

  app.use(compression() as NextHandleFunction);

  app.use(
    serveStatic(path.resolve(__dirname, relativeClientBuildPath), {
      index: false,
    }) as NextHandleFunction
  );

  app.use(bodyParser.raw({type: '*/*'}));

  app.use(
    hydrogenMiddleware({
      getServerEntrypoint: () => handleRequest,
      indexTemplate,
      cache,
    })
  );

  return {app};
}

if (require.main === module) {
  createServer().then(({app}) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Hydrogen server running at http://localhost:${port}`);
    });
  });
}
