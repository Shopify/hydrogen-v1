import '../utilities/web-api-polyfill';
import type {RequestHandler} from '../types';
import path from 'path';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__HYDROGEN_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__HYDROGEN_HTML_TEMPLATE__';
import {hydrogenMiddleware} from '../framework/middleware';

// @ts-ignore
import serveStatic from 'serve-static';
// @ts-ignore
import compression from 'compression';
import bodyParser from 'body-parser';
import connect, {NextHandleFunction} from 'connect';
import {InMemoryCache} from '../framework/cache/in-memory';

const handleRequest = entrypoint as RequestHandler;

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
    serveStatic(path.resolve(__dirname, '__HYDROGEN_RELATIVE_CLIENT_BUILD__'), {
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
