import { STOREFRONT_API_BUYER_IP_HEADER } from '../constants';
export function hashKey(queryKey) {
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
                if (!!key.body && typeof key.body === 'string') {
                    hash += key.body;
                    if (!!key.headers && key.headers[STOREFRONT_API_BUYER_IP_HEADER]) {
                        hash += key.headers[STOREFRONT_API_BUYER_IP_HEADER];
                    }
                }
                else {
                    hash += JSON.stringify(key);
                }
            }
            else {
                hash += key;
            }
        }
    }
    return hash;
}
