import { log } from '../../../../utilities/log';
export const PerformanceMetricsServerAnalyticsConnector = {
    request(requestUrl, requestHeader, data, contentType) {
        const url = new URL(requestUrl);
        if (url.search === '?performance' && contentType === 'json') {
            const initTime = new Date().getTime();
            fetch('https://monorail-edge.shopifysvc.com/v1/produce', {
                method: 'post',
                headers: {
                    'content-type': 'text/plain',
                    'x-forwarded-for': requestHeader.get('x-forwarded-for') || '',
                    'user-agent': requestHeader.get('user-agent') || '',
                },
                body: JSON.stringify({
                    schema_id: 'hydrogen_buyer_performance/2.0',
                    payload: data,
                    metadata: {
                        event_created_at_ms: initTime,
                        event_sent_at_ms: new Date().getTime(),
                    },
                }),
            }).catch((err) => {
                log.error(err);
            });
        }
    },
};
