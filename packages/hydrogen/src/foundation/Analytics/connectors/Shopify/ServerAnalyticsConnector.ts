import {log} from '../../../../utilities/log';

export const ShopifyServerAnalyticsConnector = {
  request(
    requestUrl: string,
    requestHeader: Headers,
    data?: any,
    contentType?: string
  ): void {
    const url = new URL(requestUrl);
    if (url.search === '?shopify' && contentType === 'json') {
      const buyerIp = requestHeader.get('x-forwarded-for');
      const userAgent = requestHeader.get('user-agent');

      console.log(buyerIp, userAgent);

      data.events.forEach((event: any) => {
        event.payload.client_ip_address = buyerIp;
        event.payload.client_user_agent = userAgent;
      });

      fetch('https://monorail-edge.shopifysvc.com/unstable/produce_batch', {
        method: 'post',
        headers: {
          'content-type': 'text/plain',
        },
        body: JSON.stringify(data),
      }).catch((err) => {
        log.error(err);
      });
    }
  },
};
