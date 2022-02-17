# Migration Guide

This file is a living document that gathers required changes to user applications for every release. These changes must be applied incrementally: when upgrading from version A to C, changes for version B must also be considered unless stated otherwise. If a version is missing from this guide, it should be safe to upgrade without changing the app code.

## Unreleased

### Worker entry file now imports `handleRequest` and needs manual asset handling.

`renderHydrogen` now returns a `handleRequest` function that must be called once per request. Therefore, in the Worker entry file we must use it directly instead of importing `handleEvent`.

```diff
// worker.js
- import handleEvent from '@shopify/hydrogen/worker';
- import entrypoint from './src/entry-server.jsx';
+ import handleRequest from './src/entry-server.jsx';
import indexTemplate from './dist/client/index.html?raw';

// ...

    event.respondWith(
-       handleEvent(event, {indexTemplate, entrypoint, assetHandler, context: event})
+       handleRequest(event.request, {indexTemplate, context: event})
    )
```

Furthermore, the new `handleRequest` function does not have access to static assets anymore (`assetHandler` parameter has also been removed). Therefore, we must handle assets manually in our worker. For example, when deploying to Cloudflare Workers, use the `@cloudflare/kv-asset-handler` package:

```js
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

// ...

event.respondWith(
  isAsset(event)
    ? getAssetFromKv(event)
    : handleRequest(event.request, {
        /* ... */
      })
);
```

#### Full example of a worker entry file (`/src/worker.js`)

```js
import handleRequest from './src/entry-server.jsx';
// eslint-disable-next-line node/no-missing-import
import indexHtml from './dist/client/index.html?raw';
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

// Custom asset handling logic
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

## Older versions

Please see the the [release notes on GitHub](https://github.com/Shopify/hydrogen/releases) for more details about older versions.
