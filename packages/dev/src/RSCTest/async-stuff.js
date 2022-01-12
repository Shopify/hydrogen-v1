import {useServerRequest} from '@shopify/hydrogen';

export default function (key, ms = 1000) {
  const request = useServerRequest();
  const cache = request.context.cache;

  const cached = cache.get(key);

  if (cached) {
    if (cached instanceof Promise) {
      throw cached;
    }

    return cached;
  }

  console.log('---FETCHING', key, request?.id || 'undefined');
  const promise = new Promise((r) => setTimeout(() => r(true), ms));
  cache.set(key, promise);
  promise.then((result) => {
    cache.set(key, result);
  });

  throw promise;
}
