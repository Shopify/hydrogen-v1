export function request(
  request: Request,
  data?: any,
  contentType?: string
): void {
  const url = new URL(request.url);
  if (url.search === '?shopify' && contentType === 'json') {
    data.events.forEach((event: any) => {
      event.payload.client_ip_address = request.headers.get('x-forwarded-for');
      event.payload.client_user_agent = request.headers.get('user-agent');
    });

    // fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
    //   method: 'post',
    //   headers: {
    //     'content-type': 'text/plain',
    //   },
    //   body: JSON.stringify(data),
    // }).catch((error) => {
    //   // send to bugsnag? oxygen?
    // });
  }
}
