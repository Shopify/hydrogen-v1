/*
  Reverse proxies partytown libs that require CORS. Used by Partytown resolveUrl
  @see: https://partytown.builder.io/proxying-requests
  @see: https://developers.cloudflare.com/workers/examples/cors-header-proxy/
*/

// The endpoint you want the CORS reverse proxy to be on
const PROXY_ENDPOINT = '/reverse-proxy';

export async function api(request) {
  const url = new URL(request.url);
  const isProxyReq = url.pathname.startsWith(PROXY_ENDPOINT);
  const isGet = request.method === 'GET';

  if (isProxyReq && isGet) {
    // Handle requests to the API server
    return handleRequest(request);
  } else {
    return new Response(null, {
      status: 405,
      statusText: 'Only proxy requests are allowed',
    });
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);
  // The target lib url
  let libUrl = url.searchParams.get('libUrl');

  if (libUrl == null) {
    libUrl = request.url.href;
  }

  try {
    let response = await fetch(libUrl);
    const body = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');
    const cacheControl = response.headers.get('cache-control');

    // Recreate the response so you can modify the headers
    response = new Response(body, {
      headers: {
        'content-type': contentType,
        'Access-Control-Allow-Origin': url.origin,
        'cache-control': `${cacheControl}`,
        Vary: 'Origin', // Append to/Add Vary header so browser will cache response correctly
      },
      status: 200,
    });

    return response;
  } catch (error) {
    console.log('error', error);
    return new Response(error, {status: 500});
  }
}
