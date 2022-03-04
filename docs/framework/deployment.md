---
title: Deploying to Production
sidebar_position: 8
---

To run a Hydrogen app in production, first build the framework and then the app. You can run Hydrogen on the following platforms:

### Platform: Node.js

Runs the Hydrogen app on the port specified as `$PORT`, defaulting to `8080`.

```bash
yarn build

yarn serve
```

If you're using the default server entry point in the `build:server` script (`@shopify/hydrogen/platforms/node`), then the generated server bundle (`dist/server/index.js`) consists of a simple Node.js server that uses [Connect](https://github.com/senchalabs/connect) middleware. This bundle also exports the `createServer` function, which you can call programmatically to apply extra middleware:

```js
const {createServer} = require('./dist/server');

createServer().then(({app}) => {
  app.use(/* ... */);

  app.listen(3000, () => {
    console.log(`Server ready`);
  });
});
```

If you want to use a different Node.js framework like [Express](https://expressjs.com/) or [Fastify](https://www.fastify.io/), create a new server entry point (for example, `server.js`) and import `hydrogenMiddleware`:

```js
import {hydrogenMiddleware} from '@shopify/hydrogen/middleware';
import serveStatic from 'serve-static';
import compression from 'compression';
import bodyParser from 'body-parser';
// ...

const app = new MyServerFramework();

// Add desired middlewares and handle static assets
app.use(compression());
app.use(serveStatic(path.resolve(__dirname, 'dist', 'client'), {index: false}));
app.use(bodyParser.raw({type: '*/*'}));

app.use(
  '*',
  hydrogenMiddleware({
    getServerEntrypoint: () => import('./src/App.server'),
    indexTemplate: () => import('./dist/client/index.html?raw'),
  })
);

app.listen(/* ... */);
```

Update the scripts in `package.json` to specify your new entry point. If the scripts are located in `<root>/server.js`, then the changes would look like the following:

```diff
- "build:server": "vite build --outDir dist/server --ssr @shopify/hydrogen/platforms/node",
+ "build:server": "vite build --outDir dist/server --ssr server",
```

Run the server bundle with `yarn serve` or `node dist/server`.

Alternatively, if your server isn't compatible with [Connect](https://github.com/senchalabs/connect) middleware or you're deploying to a serverless platform, then you can directly use the `App.server.jsx` file as the server entry point:

```diff
- "build:server": "vite build --outDir dist/server --ssr @shopify/hydrogen/platforms/node",
+ "build:server": "vite build --outDir dist/server --ssr src/App.server",
```

This exposes a `handleRequest` function that can be imported in your server or serverless function:

```js
// Polyfill Web APIs like `fetch` and `ReadableStream`
require('@shopify/hydrogen/web-polyfills');

const fs = require('fs');
const handleRequest = require('./dist/server');

const indexTemplate = fs.readFileSync('./dist/client/index.html', 'utf-8');

module.exports = function (request, response) {
  handleRequest(request, {
    indexTemplate,
    streamableResponse: response,
  });
};
```

### Platform: Docker

If you've [generated a Node.js server](#platform:-node-js), then you can run it inside a Docker container.

Install [Docker](https://www.docker.com/) and create a `Dockerfile` in your project root with the following content:

```
FROM node:16 AS build-env
ADD . /app

WORKDIR /app
RUN yarn
RUN yarn build

FROM gcr.io/distroless/nodejs:16 AS run-env
ENV NODE_ENV production
COPY --from=build-env /app /app

EXPOSE ${PORT:-8080}

WORKDIR /app
CMD ["dist/server/index.js"]
```

Run Docker inside your app directory:

```bash
docker build .

docker run -p 8080:8080
```

Visit the project running at http://localhost:8080.

### Platform: Cloudflare Workers

First, [create a Hydrogen app locally](https://shopify.dev/custom-storefronts/hydrogen/getting-started).

Then, create a `wrangler.toml` in the root of your project:

```toml
name = "PROJECT_NAME"
type = "javascript"
account_id = ""
workers_dev = true
route = ""
zone_id = ""
compatibility_date = "2022-01-28"
compatibility_flags = ["streams_enable_constructors"]

[site]
bucket = "dist/client"
entry-point = "dist/worker"

[build]
upload.format = "service-worker"
command = "yarn && yarn build"
```

For more information about the configurable properties in the `wrangler.toml` file, refer to Cloudflare's [configuration](https://developers.cloudflare.com/workers/cli-wrangler/configuration) and [compatibility dates](https://developers.cloudflare.com/workers/platform/compatibility-dates) documentation. Your static files are now uploaded to Workers KV.

Install Cloudflare's KV asset handler:

```bash
npm install @cloudflare/kv-asset-handler
```

Create a new Worker entry file (for example, `worker.js`) in your project.

```js
// If the request path matches any of your assets, then use the `getAssetFromKV`
// function from `@cloudflare/kv-asset-handler` to serve it. Otherwise, call the
// `handleRequest` function, which is imported from your `App.server.jsx` file,
// to return a Hydrogen response.
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';
import handleRequest from './src/App.server';
import indexTemplate from './dist/client/index.html?raw';

function isAsset(url) {
  // Update this RE to fit your assets
  return /\.(png|jpe?g|gif|css|js|svg|ico|map)$/i.test(url.pathname);
}

async function handleAsset(url, event) {
  const response = await getAssetFromKV(event, {});

  // Custom cache-control for assets
  if (response.status < 400) {
    const filename = url.pathname.split('/').pop();

    const maxAge =
      filename.split('.').length > 2
        ? 31536000 // hashed asset, will never be updated
        : 86400; // favicon and other public assets

    response.headers.append('cache-control', `public, max-age=${maxAge}`);
  }

  return response;
}

async function handleEvent(event) {
  try {
    const url = new URL(event.request.url);

    if (isAsset(url)) {
      return await handleAsset(url, event);
    }

    return await handleRequest(event.request, {
      indexTemplate,
      cache: caches.default,
      context: event,
    });
  } catch (error) {
    return new Response(error.message || error.toString(), {status: 500});
  }
}

addEventListener('fetch', (event) => event.respondWith(handleEvent(event)));
```

Update `package.json` to specify the new Worker entry point. If the entry point is in `<root>/worker.js`, then the changes look like the following:

```diff
- "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr @shopify/hydrogen/platforms/worker-event",
+ "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr worker",
```

Then you can deploy your project with [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update):

```bash
CF_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCT_ID> wrangler publish
```
