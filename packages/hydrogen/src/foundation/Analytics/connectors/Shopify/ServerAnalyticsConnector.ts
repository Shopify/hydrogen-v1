import {log} from '../../../../utilities/log';

export const ShopifyServerAnalyticsConnector = {
  request(
    requestUrl: string,
    requestHeader: Headers,
    waitUntil?: ((fn: Promise<any>) => void) | undefined,
    data?: any,
    contentType?: string
  ): void {
    const url = new URL(requestUrl);
    if (url.search === '?shopify' && contentType === 'json') {
      data.events.forEach((event: any) => {
        event.payload.client_ip_address = requestHeader.get('x-forwarded-for');
        event.payload.client_user_agent = requestHeader.get('user-agent');
      });

      const monorailPromise = fetch(
        'https://monorail-edge.shopifysvc.com/unstable/produce_batch',
        {
          method: 'post',
          headers: {
            'content-type': 'text/plain',
          },
          body: JSON.stringify(data),
        }
      ).catch((err) => {
        log.error(err);
      });

      waitUntil && waitUntil(monorailPromise);
    }
  },
};
