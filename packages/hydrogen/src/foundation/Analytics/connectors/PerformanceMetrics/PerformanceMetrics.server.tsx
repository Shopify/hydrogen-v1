export function request(
  request: Request,
  data?: any,
  contentType?: string
): void {
  const url = new URL(request.url);
  if (url.search === '?performance' && contentType === 'json') {
    const initTime = new Date().getTime();

    fetch('https://monorail-edge.shopifysvc.com/v1/produce', {
      method: 'post',
      headers: {
        'content-type': 'text/plain',
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({
        schema_id: 'hydrogen_buyer_performance/2.0',
        payload: data,
        metadata: {
          event_created_at_ms: initTime,
          event_sent_at_ms: new Date().getTime(),
        },
      }),
    }).catch((error) => {
      // send to bugsnag? oxygen?
    });
  }
}
