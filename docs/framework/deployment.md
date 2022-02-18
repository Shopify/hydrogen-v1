---
title: Deploying to Production
sidebar_position: 8
---

To run the Hydrogen dev environment in production, first build the framework and then the dev project. You can run Hydrogen on the following platforms:

### Platform: Node.js

Runs the Hydrogen dev project on the port specified as `$PORT`, defaulting to `8080`.

```bash
yarn build

yarn serve
```

> Note:
> Depending on the platform you deploy to (for example, Heroku, Google Cloud Platform, or Vercel), you might need to modify the configuration of `server.js`.

If you're using the default port, then the production version of your app will be running at http://localhost:8080.

### Platform: Docker

Runs the Hydrogen dev project on the port specified as `$PORT`, defaulting to `8080`.

Inside your app directory:

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
entry-point = "."

[build]
upload.format = "service-worker"
command = "yarn && yarn build"
```

For more information about the configurable properties in the `wrangler.toml` file, refer to Cloudflare's [configuration](https://developers.cloudflare.com/workers/cli-wrangler/configuration) and [compatibility dates](https://developers.cloudflare.com/workers/platform/compatibility-dates) documentation.

Install Cloudflare's KV asset handler:

```bash
npm install @cloudflare/kv-asset-handler
```

Your static files are now uploaded to Workers KV. To handle the asset requests in the worker entry point, update `worker.js` to include a new `handleAsset` function and call it before falling back to `handleRequest`:

```js
import handleRequest from './src/App.server';
// eslint-disable-next-line node/no-missing-import
import indexHtml from './dist/client/index.html?raw';
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

async function handleAsset(event) {
  const url = new URL(event.request.url);
  if (/\.(png|jpe?g|gif|css|js|svg|ico|map)$/i.test(url.pathname)) {
    const response = await getAssetFromKV(event, {});
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
}

async function handleEvent(event) {
  try {
    return (
      (await handleAsset(event)) ||
      (await handleRequest(event.request, {
        indexTemplate: indexHtml,
        cache: caches.default,
        context: event,
      }))
    );
  } catch (error) {
    return new Response(error.message || error.toString(), {status: 500});
  }
}

addEventListener('fetch', (event) => event.respondWith(handleEvent(event)));
```

Finally, update `package.json` to include a `main` key pointing to the generated worker file:

```
"main": "dist/worker/worker.js"
```

Then you can deploy your project with [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update):

```bash
CF_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCT_ID> wrangler publish
```
