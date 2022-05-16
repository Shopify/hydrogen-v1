import {defer} from '@shopify/hydrogen/dist/esnext/utilities/defer';
import {useServerRequest} from '@shopify/hydrogen/dist/esnext/foundation/ServerRequestProvider';

export function createData(key, ms) {
  const {cache} = useServerRequest().ctx;

  if (!cache.has(key)) {
    let result;
    const deferred = defer();
    setTimeout(deferred.resolve, ms);
    deferred.promise.then((r) => {
      result = r;
    });

    cache.set(key, {
      read: () => {
        if (deferred.status === 'pending') {
          throw deferred.promise;
        }

        return result || 'done';
      },
    });
  }

  return cache.get(key);
}
