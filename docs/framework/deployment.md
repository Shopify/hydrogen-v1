---
title: Deploying to Production
sidebar_position: 8
---

To run the Hydrogen dev environment in production, first build the framework and then the dev project. You can run Hydrogen on the following platforms:

### Platform: Node.js

Runs the Hydrogen dev project on the port specified as `$PORT`, defaulting to `8080`.

```bash
yarn build

yarn workspace dev serve
```

Visit the project running at http://localhost:8080.

### Platform: Docker

Runs the Hydrogen dev project on the port specified as `$PORT`, defaulting to `8080`.

Inside your app directory:

```bash
docker build .

docker run -p 8080
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

Install Cloudflare's KV asset handler:

```bash
npm install @cloudflare/kv-asset-handler
```

And update your `worker.js` to pass an `assetHandler` to `handleEvent`:

```js
import handleEvent from '@shopify/hydrogen/worker';
import entrypoint from './src/App.server.jsx';
// eslint-disable-next-line node/no-missing-import
import indexHtml from './dist/client/index.html?raw';
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

async function assetHandler(event, url) {
  const response = await getAssetFromKV(event, {});

  if (response.status < 400) {
    const filename = url.pathname.split('/').pop();

    const maxAge =
      filename.split('.').length > 2
        ? 31536000 // hashed asset, will never be updated
        : 86400; // favico and other public assets

    response.headers.append('cache-control', `public, max-age=${maxAge}`);
  }

  return response;
}

addEventListener('fetch', (event) => {
  try {
    event.respondWith(
      handleEvent(event, {
        entrypoint,
        indexTemplate: indexHtml,
        assetHandler,
        cache: caches.default,
        context: event,
      })
    );
  } catch (error) {
    event.respondWith(
      new Response(error.message || error.toString(), {
        status: 500,
      })
    );
  }
});
```

Update `package.json` to include a `main` key:

```
"main": "dist/worker/worker.js"
```

Then you can deploy your project with [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update):

```bash
CF_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCT_ID> wrangler publish
```
