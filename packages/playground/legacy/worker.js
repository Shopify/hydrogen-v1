import {getAssetFromKV} from '@cloudflare/kv-asset-handler';
import handleRequest from '@shopify/hydrogen/server';
// eslint-disable-next-line node/no-missing-import
import indexTemplate from './dist/client/index.html?raw';

// Mock Oxygen global
globalThis.Oxygen = {env: globalThis};

function isAsset(url) {
  return /\.(png|jpe?g|gif|css|js|svg|ico|map)$/i.test(url.pathname);
}

async function handleAsset(url, event) {
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
