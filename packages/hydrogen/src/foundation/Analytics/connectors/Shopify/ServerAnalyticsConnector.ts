import {log} from '../../../../utilities/log';

export const ShopifyServerAnalyticsConnector = {
  request(
    requestUrl: string,
    requestHeader: Headers,
    data?: any,
    contentType?: string
  ): Promise<any> {
    const url = new URL(requestUrl);
    if (url.search === '?shopify' && contentType === 'json') {
      console.log('Shopify analytics');
      const buyerIp = requestHeader.get('x-forwarded-for');
      const userAgent = requestHeader.get('user-agent');

      console.log('ip / ua:', buyerIp, userAgent);

      data.events.forEach((event: any) => {
        event.payload.client_ip_address = buyerIp;
        event.payload.client_user_agent = userAgent;
      });

      return fetch(
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
    }
    return Promise.resolve(true);
  },
};
