import { useEffect } from 'react';
import { ClientAnalytics } from './ClientAnalytics';
export function Analytics({ analyticsDataFromServer, }) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        addUTMData(urlParams, 'id');
        addUTMData(urlParams, 'source');
        addUTMData(urlParams, 'campaign');
        addUTMData(urlParams, 'medium');
        addUTMData(urlParams, 'content');
        addUTMData(urlParams, 'term');
        ClientAnalytics.pushToPageAnalyticsData(analyticsDataFromServer);
        ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW, true);
        if (analyticsDataFromServer.publishEventsOnNavigate) {
            analyticsDataFromServer.publishEventsOnNavigate.forEach((eventName) => {
                ClientAnalytics.publish(eventName, true);
            });
        }
    }, [analyticsDataFromServer]);
    return null;
}
function addUTMData(urlParams, key) {
    if (urlParams.has(`utm_${key}`)) {
        ClientAnalytics.pushToPageAnalyticsData({
            utm: {
                [key]: urlParams.get(`utm_${key}`),
            },
        });
    }
}
