# Deploy a Hydrogen app

{% include hydrogen/developer-preview.md %}

You can deploy a Hydrogen app to most [Node.js and Worker runtimes](/custom-storefronts/hydrogen/framework#request-workflow-for-hydrogen-apps). This guide describes how to deploy a Hydrogen app to [Oxygen](#deploy-to-oxygen), [Node.js](#deploy-to-node-js), [Docker](#deploy-to-docker), [Cloudflare Workers](#deploy-to-cloudflare-workers), and [Netlify](#deploy-to-netlify).

## Requirements

You're using the [most recent version of Hydrogen](https://github.com/Shopify/hydrogen/releases). The latest release gives you the benefits of performance enhancements, new components, and other best practices.

## Deploy to Oxygen

Oxygen is Shopify's recommended deployment platform for Hydrogen apps. This is because Oxygen is co-located with your shop's data in Shopify's data centers around the world.

> Note:
> Shopify is currently working on Oxygen, but it's not available yet.

## Deploy to Node.js

You can deploy your Hydrogen app to [Node.js](https://nodejs.org/en/), an open-source JavaScript runtime environment.

1. Check the port (`$PORT`) that's specified in the [`server.js`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/server.js) file.

2. Run your Hydrogen app on the port specified by executing the following commands:

   {% codeblock terminal %}

   ```bash

   yarn build

   yarn serve
   ```

   {% endcodeblock %}

   If you're using the default port, then the production version of your app will be running at http://localhost:8080.

### Apply extra middleware

If you're using the default server entry point in the `build:server` script (`@shopify/hydrogen/platforms/node`), then the generated server bundle (`dist/server/index.js`) consists of a simple Node.js server that uses [Connect](https://github.com/senchalabs/connect) middleware.

This bundle also exports the `createServer` function, which you can call programmatically to apply extra middleware:

{% codeblock %}

```js
const {createServer} = require('./dist/server');

// This function accepts an optional
// `cache` instance parameter: https://developer.mozilla.org/en-US/docs/Web/API/Cache.
createServer({
  cache: customCacheImplementation,
}).then(({app}) => {
  app.use(/* ... */);

  app.listen(3000, () => {
    console.log(`Server ready`);
  });
});
```

{% endcodeblock %}

### Use a different Node.js framework

If you want to use a different Node.js framework like [Express](https://expressjs.com/) or [Fastify](https://www.fastify.io/), then complete the following steps:

1. Create a new server entry point (for example, `server.js`) and import `hydrogenMiddleware`:

   {% codeblock file, filename: 'server.js' %}

   ```js
   import {hydrogenMiddleware} from '@shopify/hydrogen/middleware';
   import serveStatic from 'serve-static';
   import compression from 'compression';
   import bodyParser from 'body-parser';
   import connect from 'connect';
   import path from 'path';

   const port = process.env.PORT || 8080;

   // Initialize your own server framework like connect
   const app = connect();

   // Add desired middlewares and handle static assets
   app.use(compression());
   app.use(
     serveStatic(path.resolve(__dirname, '../', 'client'), {index: false})
   );
   app.use(bodyParser.raw({type: '*/*'}));

   app.use(
     '*',
     hydrogenMiddleware({
       getServerEntrypoint: () => import('./src/App.server'),
       indexTemplate: () => import('./dist/client/index.html?raw'),
       // Optional: Provide a strategy for caching in production
       cache: customCacheImplementation,
     })
   );

   app.listen(port, () => {
     console.log(`Hydrogen server running at http://localhost:${port}`);
   });
   ```

   {% endcodeblock %}

2. Update the scripts in `package.json` to specify your new entry point. If the scripts are located in `<root>/server.js`, then the changes would look like the following:

   ```json
   // Remove this line
   - "build:server": "vite build --outDir dist/server --ssr @shopify/hydrogen/platforms/node",

   // Add this line
   + "build:server": "vite build --outDir dist/server --ssr server",
   ```

3. Run the server bundle:

   {% codeblock terminal %}

   ```bash?title: 'yarn'
   yarn serve
   ```

   ```bash?title: 'node'
   node dist/server
   ```

   {% endcodeblock %}

### Use `App.server.jsx` as the server entry point

If your server isn't compatible with [Connect](https://github.com/senchalabs/connect) middleware or you're deploying to a serverless platform, then you can directly use the `App.server.jsx` file as the server entry point.

Update the scripts in `package.json` to specify your new entry point:

```json
// Remove this line
- "build:server": "vite build --outDir dist/server --ssr @shopify/hydrogen/platforms/node",

// Add this line
+ "build:server": "vite build --outDir dist/server --ssr src/App.server",
```

This exposes a `handleRequest` function that can be imported in your server or serverless function:

{% codeblock %}

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

{% endcodeblock %}

## Deploy to Docker

You can deploy your project to any platform that supports Docker-based hosting, like [Google Cloud Run](https://cloud.google.com/run), [Fly.io](https://fly.io/), and [Heroku](https://heroku.com/). If you've [generated a Node.js server](#deploy-to-node-js), then you can run it inside a Docker container.

1. Install [Docker](https://www.docker.com/).

2. Add a Docker file to the root of your project:

   {% codeblock file, filename: 'Dockerfile' %}

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

   {% endcodeblock %}

3. Run Docker inside your app directory by executing the following commands:

   {% codeblock terminal %}

   ```bash
   docker build .

   docker run -p 8080:8080
   ```

   {% endcodeblock %}

   The production version of your app will be running at http://localhost:8080.

## Deploy to Cloudflare Workers

You can deploy your Hydrogen app to Cloudflare Workers, a serverless application platform. For the Cloudflare Workers' Cache API to work, you need to meet the following requirements:

- You have a Cloudflare domain. The domain can't be `worker.dev`, because Cloudflare owns this domain.
- You have a DNS record for the Cloudflare domain. For example, `A example.dev 192.0.2.1 Proxied`.
- You have a worker route that points to the Cloudflare domain.

> Note:
> Requirements might be different for Cloudflare enterprise accounts.

1. [Create a Hydrogen app locally](/custom-storefronts/hydrogen/getting-started/create).

2. Create a `wrangler.toml` file in the root of your project.

   For more information about the configurable properties in the `wrangler.toml` file, refer to Cloudflare's [configuration](https://developers.cloudflare.com/workers/cli-wrangler/configuration) and [compatibility dates](https://developers.cloudflare.com/workers/platform/compatibility-dates) documentation.

   {% codeblock file, filename: 'wrangler.toml' %}

   ```
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

   {% endcodeblock %}

   Your static files are now uploaded to Workers KV.

3. Install Cloudflare's KV asset handler:

   ```bash
   npm install @cloudflare/kv-asset-handler
   ```

4. Create a new Worker entry file (for example, `worker.js`) in your project:

   {% codeblock file, filename: 'worker.js' %}

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
         // Buyer IP varies by hosting provider and runtime. You should provide this
         // as an argument to the `handleRequest` function for your runtime.
         // Defaults to `x-forwarded-for` header value.
         buyerIpHeader: 'cf-connecting-ip',
       });
     } catch (error) {
       return new Response(error.message || error.toString(), {status: 500});
     }
   }

   addEventListener('fetch', (event) => event.respondWith(handleEvent(event)));
   ```

   {% endcodeblock %}

5. Update `package.json` to specify the new Worker entry point. If the entry point is in `<root>/worker.js`, then the changes look like the following:

   ```json

   // Remove this line
   - "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr @shopify/hydrogen/platforms/worker",

   // Add this line
   + "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr worker",
   ```

6. Deploy your project with [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update):

   ```bash
   CF_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCT_ID> wrangler publish
   ```

## Deploy to Netlify

You can deploy your Hydrogen app to Netlify by following the instructions outlined in the [Hydrogen on Netlify guide](https://docs.netlify.com/integrations/frameworks/hydrogen/).
