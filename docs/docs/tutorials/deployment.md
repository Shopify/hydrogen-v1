# Deploy a Hydrogen storefront


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



You can deploy a Hydrogen storefront to most [Worker and Node.js runtimes](https://shopify.dev/docs/custom-storefronts/hydrogen#request-workflow-for-hydrogen-apps). This guide describes how to deploy a Hydrogen storefront to [Oxygen](#deploy-to-oxygen), [Netlify](#deploy-to-netlify), [Vercel](#deploy-to-vercel), [Node.js](#deploy-to-node-js), [Docker](#deploy-to-docker), and [Cloudflare Workers](#deploy-to-cloudflare-workers).

## Requirements

- You're using the [most recent version of Hydrogen](https://github.com/Shopify/hydrogen/releases). The latest release gives you the benefits of performance enhancements, new components, and other best practices.

- If you're deploying to a non-Oxygen runtime, then you've retrieved a [delegate access token for server requests](#avoid-rate-limiting-in-production) and stored it in a private variable.

## Deploy to Oxygen

Oxygen is Shopify's recommended deployment platform for Hydrogen storefronts. To learn how to deploy a Hydrogen storefront to Oxygen, refer to [Getting started with Oxygen](https://shopify.dev/docs/custom-storefronts/oxygen/getting-started).

## Deploy to Netlify

To learn how to deploy your Hydrogen storefront to Netlify, refer to the [Hydrogen on Netlify](https://docs.netlify.com/integrations/frameworks/hydrogen/) documentation.

## Deploy to Vercel

To learn how to deploy your Hydrogen storefront to Vercel Edge Functions, refer to the [Vercel Hydrogen template](https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fhydrogen&template=hydrogen) documentation.

## Deploy to Node.js

By default, Hydrogen targets a Workers runtime like Oxygen. However, you can also deploy your Hydrogen storefront to [Node.js](https://nodejs.org/en/), an open-source JavaScript runtime environment.

Hydrogen provides a [built-in Node entrypoint](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/node.ts) which suits basic production use cases. You can run and preview your Hydrogen storefront in Node.js by building your Hydrogen storefront for production and previewing the app locally:

```bash


yarn build --target node

yarn preview --target node
```



The production version of your app will be running at http://localhost:3000. You can inspect and deploy the compiled version of your Node.js Hydrogen storefront from `dist/node`.

### Apply extra middleware

If you're using the default server entry point in the `build --target node` script (`@shopify/hydrogen/platforms/node`), then the generated server bundle (`dist/node/index.js`) consists of a simple Node.js server that uses [Connect](https://github.com/senchalabs/connect) middleware.

This bundle also exports the `createServer` function, which you can call programmatically to apply extra middleware:

```js
// server.js

const {createServer} = require('./dist/node');

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



### Use a different Node.js framework

If you want to use a different Node.js framework like [Express](https://expressjs.com/) or [Fastify](https://www.fastify.io/), then complete the following steps:

1. Create a new server entry point (for example, `server.js`) and import `hydrogenMiddleware`:

    ```js
    // server.js

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
    app.use(serveStatic(path.resolve(__dirname, '../', 'client'), {index: false}));
    app.use(bodyParser.raw({type: '*/*'}));

    app.use(
      '*',
      hydrogenMiddleware({
        getServerEntrypoint: () => import('./src/App.server'),
        indexTemplate: () => import('./dist/client/index.html?raw'),
        // Optional: Provide a custom strategy for caching in production. Defaults to in-memory.
        cache: customCacheImplementation,
      })
    );

    app.listen(port, () => {
      console.log(`Hydrogen server running at http://localhost:${port}`);
    });
    ```



2. Use the new file as the entry point for your build command. For example, if the script is located in `<root>/server.js`, then you would run the following command:


    ```bash

    yarn build --entry server --target node
    ```



3. Preview the server bundle:


    ```bash?title: 'Yarn'
    yarn preview --target node
    ```

    ```bash?title: 'node'
    node dist/node
    ```



### Use `App.server.jsx` as the server entry point

If your server isn't compatible with [Connect](https://github.com/senchalabs/connect) middleware or you're deploying to a serverless platform, then you can directly use the `App.server.jsx` file as the server entry point.

Update the scripts in `package.json` to specify your new entry point:

```json
// Remove this line
- "build": "shopify hydrogen build",

// Add this line
+ "build": "shopify hydrogen build --entry src/App.server --target node",
```

This exposes a `handleRequest` function that can be imported in your server or serverless function:

```js
// server.js

// Polyfill Web APIs like `fetch` and `ReadableStream`
require('@shopify/hydrogen/web-polyfills');

const fs = require('fs');
const handleRequest = require('./dist/node');

const indexTemplate = fs.readFileSync('./dist/client/index.html', 'utf-8');

module.exports = function (request, response) {
  handleRequest(request, {
    indexTemplate,
    streamableResponse: response,
  });
};
```



## Deploy to Docker

You can deploy your project to any platform that supports Docker-based hosting, like [Google Cloud Run](https://cloud.google.com/run), [Fly.io](https://fly.io/), and [Heroku](https://heroku.com/). If you've [generated a Node.js server](#deploy-to-node-js), then you can run it inside a Docker container.

1. Install [Docker](https://www.docker.com/).

2. Add a Docker file to the root of your project:

    ```dockerfile
    FROM node:16 AS build-env
    ADD . /app

    WORKDIR /app
    RUN yarn
    RUN yarn build --target node

    FROM gcr.io/distroless/nodejs:16 AS run-env
    ENV NODE_ENV production
    COPY --from=build-env /app /app

    EXPOSE ${PORT:-8080}

    WORKDIR /app
    CMD ["dist/node/index.js"]
    ```



1. Run Docker inside your app directory by executing the following commands:


    ```bash
    docker build . --tag hydrogen-sample-app:latest

    docker run -d -p 8080:8080 hydrogen-sample-app
    ```



    The production version of your app will be running at http://localhost:8080.

## Deploy to Cloudflare Workers

You can deploy your Hydrogen storefront to Cloudflare Workers, a serverless application platform. For the Cloudflare Workers' Cache API to work, you need to meet the following requirements:

- You have a Cloudflare domain. The domain can't be `worker.dev`, because Cloudflare owns this domain.
- You have a DNS record for the Cloudflare domain. For example, `A example.dev 192.0.2.1 Proxied`.
- You have a worker route that points to the Cloudflare domain.

> Note:
> Requirements might be different for Cloudflare enterprise accounts.

1. [Create a Hydrogen storefront locally](/tutorials/getting-started/quickstart/).

1. Create a `wrangler.toml` file in the root of your project.

    For more information about the configurable properties in the `wrangler.toml` file, refer to Cloudflare's [configuration](https://developers.cloudflare.com/workers/cli-wrangler/configuration) and [compatibility dates](https://developers.cloudflare.com/workers/platform/compatibility-dates) documentation.

    ```toml
    # wrangler.toml

    account_id = ""
    compatibility_date = "2022-01-28"
    compatibility_flags = ["streams_enable_constructors"]
    main = "dist/worker/index.js"
    name = "PROJECT_NAME"
    route = ""
    workers_dev = true

    [site]
    bucket = "dist/client"

    [build]
    command = "yarn && yarn build"
    ```



    Your static files are now uploaded to Workers KV.

1. Install Cloudflare's KV asset handler:

    ```bash
    npm install @cloudflare/kv-asset-handler
    ```

1. Create a new Worker entry file (for example, `worker.js`) in your project:

    ```js
    // worker.js

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



1. Update `package.json` to specify the new Worker entry point. If the entry point is in `<root>/worker.js`, then the changes look like the following:

    ```json

    // Remove this line
    - "build": "shopify hydrogen build",

    // Add this line
    + "build": "shopify hydrogen build --entry worker",
    ```

1. Deploy your project with [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update):

    ```bash
    CF_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCT_ID> wrangler publish
    ```

## Avoid rate limiting in production

If you're deploying to a non-Oxygen runtime, then this is a necessary step to avoid rate-limiting in production. [Learn more](/tutorials/environment-variables/#use-storefront-api-server-tokens) about why it's required.

> Note:
> In the following example, environment variables are stored in `Oxygen.env`. If you're not deploying to Oxygen, then you can choose a different storage location.

1. Create a [delegate access token](http://shopify.dev/apps/auth/oauth/delegate-access-tokens) for the Storefront API.

1. [Store the token](https://vitejs.dev/guide/env-and-mode.html#env-files) in a private environment variable called `PRIVATE_STOREFRONT_API_TOKEN`.

1. In the Hydrogen configuration file, set the private token using the variable `PRIVATE_STOREFRONT_API_TOKEN`.

    ```tsx
    // hydrogen.config.ts

    export default defineConfig({
      privateStorefrontToken:
      /* In this example, the environment variable is stored in `Oxygen.env`.
         If you're not deploying to Oxygen, then you can choose a different storage location.*/
        Oxygen?.env?.PRIVATE_STOREFRONT_API_TOKEN,
    });
    ```


