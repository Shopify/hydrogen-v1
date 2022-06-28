import {CacheNone, CacheLong, fetchSync} from '@shopify/hydrogen';

export function api() {
  return new Response(JSON.stringify({bodyContent: 'OK'}), {
    status: 201,
    headers: {test: '42'},
  });
}

export default function ResponseSync({response}) {
  response.cache(CacheNone());

  const fetchResponse = fetchSync('/response-sync', {
    method: 'POST',
    cache: CacheLong(),
    preload: false,
  });

  return (
    <>
      <h1>Request Sync</h1>

      <div>
        <div id="response-body">{fetchResponse.json().bodyContent}</div>
        <div id="response-status">{fetchResponse.status}</div>
        <div id="response-header-test">{fetchResponse.headers.get('test')}</div>
      </div>
    </>
  );
}
