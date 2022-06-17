import { log } from '../../../../utilities/log';
export const ShopifyServerAnalyticsConnector = {
    request(requestUrl, requestHeader, data, contentType) {
        const url = new URL(requestUrl);
        if (url.search === '?shopify' && contentType === 'json') {
            data.events.forEach((event) => {
                event.payload.client_ip_address = requestHeader.get('x-forwarded-for');
                event.payload.client_user_agent = requestHeader.get('user-agent');
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
