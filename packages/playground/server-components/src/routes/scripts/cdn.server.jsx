// simulate a CDN/server delivering 3rd-party scripts
export async function api(request) {
  const url = new URL(request.normalizedUrl);
  const params = new URLSearchParams(url.search);
  const scriptUrl = params.get('script');

  if (!scriptUrl) {
    return new Response(body, {
      status: 400,
      statusText: 'Script URL not specified',
    });
  }
  const script = await fetch(`http://localhost:3000/${scriptUrl}`);
  const body = await script.text();

  const isHtmlBody = body.charAt(0) === '<';

  if (isHtmlBody) {
    return new Response(body, {
      status: 400,
      statusText: 'Script not found',
    });
  }

  // const body = await script.text();
  return new Response(body, {
    status: 200,
    statusText: 'OK',
    headers: {'Content-Type': 'application/javascript'},
  });
}
