import handleEvent from '@shopify/hydrogen/worker';
import entrypoint from './src/entry-server.jsx';
// eslint-disable-next-line node/no-missing-import
import indexHtml from './dist/client/index.html?raw';

addEventListener('fetch', (event) => {
  try {
    event.respondWith(
      handleEvent(event, {
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
