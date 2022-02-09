import {handleRequest} from '@shopify/hydrogen';
import entrypoint from './src/entry-server.jsx';
// eslint-disable-next-line node/no-missing-import
import indexHtml from './dist/client/index.html?raw';

addEventListener('fetch', (event) => {
  try {
    event.respondWith(
      handleRequest(event.request, {
        entrypoint,
        indexTemplate: indexHtml,
        cache: caches.default,
        context: event,
      }),
    );
  } catch (error) {
    event.respondWith(
      new Response(error.message || error.toString(), {
        status: 500,
      }),
    );
  }
});
