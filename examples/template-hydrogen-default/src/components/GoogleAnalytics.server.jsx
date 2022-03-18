export function request(request, data, contentType) {
  const url = new URL(request.url);
  if (url.pathname === '/__event/g/collect') {
    const gaUrl = `https://analytics.google.com/g/collect${
      url.search
    }&uip=${request.headers.get('x-forwarded-for')}`;
    const headers = {
      'User-Agent': request.headers.get('User-Agent'),
      'Content-Type': request.headers.get('Content-Type')
    };

    try {
      if (request.method === 'GET') {
        fetch(gaUrl, {method: 'GET', headers})
          .catch((err) => {
            console.log(err);
          });
      } else {
        fetch(gaUrl, {
          method: 'POST',
          headers,
          body: contentType === 'json' ? JSON.stringify(data) : data
        }).catch((err) => {
          console.log(err);
        });
        ;
      }
    } catch(error) {
      console.log(error);
    }
  }
}
