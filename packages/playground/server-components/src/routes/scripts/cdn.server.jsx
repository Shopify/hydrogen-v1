// simulate a CDN/server delivering 3rd-party scripts
export async function api(request) {
  const url = new URL(request.normalizedUrl);

  // get script we want to serve from public/
  const {script: scriptUrl} = Object.fromEntries(
    new URLSearchParams(url.search)
  );

  if (!scriptUrl) {
    return new Response('', {
      status: 400,
      statusText: 'script name not specified',
    });
  }

  try {
    // fetch the local script from public/xyz.js
    const scripts = await import.meta.glob('/public/*.js', {as: 'raw'});
    const body = scripts[`/public/${scriptUrl}`];

    if (!body) {
      return new Response('', {
        status: 400,
        statusText: 'file not found',
      });
    }

    // const script = await fetch(`http://localhost:3000/${scriptUrl}`);
    // const body = await script.text();
    const isHtmlBody = body.charAt(0) === '<';

    if (isHtmlBody) {
      return new Response(body, {
        status: 400,
        statusText: 'invalid',
      });
    }

    return new Response(body, {
      status: 200,
      statusText: 'OK',
      headers: {'Content-Type': 'application/javascript'},
    });
  } catch (error) {
    console.log('Error serving script:', error.message);
    return new Response(error.message, {
      status: 400,
      statusText: 'Not found',
    });
  }
}
