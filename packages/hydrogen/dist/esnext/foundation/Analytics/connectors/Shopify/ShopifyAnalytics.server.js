import React from 'react';
import { parse } from 'worktop/cookie';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import { useServerRequest } from '../../../ServerRequestProvider';
import { useServerAnalytics } from '../../hook';
import { useShop } from '../../../useShop';
import { SHOPIFY_S, SHOPIFY_Y } from './const';
import { ShopifyAnalyticsClient } from './ShopifyAnalytics.client';
export function ShopifyAnalytics({ cookieDomain }) {
    const { storeDomain } = useShop();
    const request = useServerRequest();
    const cookies = parse(request.headers.get('Cookie') || '');
    const domain = cookieDomain || storeDomain;
    useServerAnalytics({
        shopify: {
            storefrontId: globalThis.Oxygen?.env?.SHOPIFY_STOREFRONT_ID || '0',
            acceptedLanguage: request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
            isPersistentCookie: !!cookies[SHOPIFY_S] || !!cookies[SHOPIFY_Y],
        },
    });
    return (React.createElement(AnalyticsErrorBoundary, null,
        React.createElement(ShopifyAnalyticsClient, { cookieDomain: domain })));
}
