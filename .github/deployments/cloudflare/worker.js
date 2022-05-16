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

    // TODO: Switch to module syntax and transfer args to Oxygen.env
    if (!globalThis.Oxygen) {
      globalThis.Oxygen = {};
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
