import {QueryKey} from '../types';

export function hashKey(queryKey: QueryKey): string {
  const rawKeys = Array.isArray(queryKey) ? queryKey : [queryKey];
  let hash = '';

  // Keys from useShopQuery are in the following shape:
  // ['prefix', 'api-endpoint', {body:'query',headers:{}}]
  // Since the API endpoint already contains the shop domain and api version,
  // we can ignore the headers and only use the `body` from the payload.
  for (const key of rawKeys) {
    if (key != null) {
      if (typeof key === 'object') {
        // Queries from useQuery might not have a `body`. In that case,
        // fallback to a safer (but slower) stringify.
        hash += key.body || JSON.stringify(key);
      } else {
        hash += key;
      }
    }
  }

  return hash;
}
