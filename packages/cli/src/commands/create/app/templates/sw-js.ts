export default function () {
  return `
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';
import {precacheAndRoute} from 'workbox-precaching';

// self.__WB_MANIFEST is default injection point - DO NOT REMOVE
precacheAndRoute(self.__WB_MANIFEST);

// By default, vite-plugin-pwa will generate a manifest file that
// will cache all resulting production build files.
// However, it will not have caching strategy for any files
// outside of that list.
// We can define additional routes or setup push messaging here

// Cache for images from the same origin and cdn.shopify.com
registerRoute(
  ({sameOrigin, url, request}) => {
    return (
      request.destination === 'image' &&
      (sameOrigin || url.hostname === 'cdn.shopify.com')
    );
  },
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);
`;
}
