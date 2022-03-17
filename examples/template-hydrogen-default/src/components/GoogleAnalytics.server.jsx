export function request(request, data) {
  const url = new URL(request.url);
  if (url.pathname === '/__event/g/collect') {
    fetch(
      `https://analytics.google.com/g/collect${
        url.search
      }&uip=${request.headers.get('x-forwarded-for')}`,
      {
        headers: {
          'user-agent': request.headers.get('user-agent'),
        },
      },
    );
  }
}
