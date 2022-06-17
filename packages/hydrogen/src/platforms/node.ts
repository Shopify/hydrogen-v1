import '../utilities/web-api-polyfill';
import type {InlineHydrogenConfig, RequestHandler} from '../types';
import path from 'path';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__SERVER_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__INDEX_TEMPLATE__?raw';
import {hydrogenMiddleware} from '../framework/middleware';

// @ts-ignore
import serveStatic from 'serve-static';
// @ts-ignore
import compression from 'compression';
import bodyParser from 'body-parser';
import connect, {NextHandleFunction} from 'connect';

const handleRequest = entrypoint as RequestHandler;

type CreateServerOptions = {
  cache?: Cache;
};

export async function createServer({cache}: CreateServerOptions = {}) {
  const {default: inlineHydrogenConfig} = (await import(
    // @ts-ignore
    // eslint-disable-next-line node/no-missing-import
    'virtual__hydrogen.config.ts'
  )) as {default: InlineHydrogenConfig};
  // @ts-ignore
  globalThis.Oxygen = {env: process.env};

  const app = connect();

  app.use(compression() as NextHandleFunction);

  app.use(
    serveStatic(path.resolve(__dirname, '../client'), {
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

  if (inlineHydrogenConfig.middleware?.length ?? -1 > 0) {
    for (const middleware of inlineHydrogenConfig.middleware!) {
      app.use(middleware);
    }
  }

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
