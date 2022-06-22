import React from 'react';
import {parse} from 'worktop/cookie';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import {useServerRequest} from '../../../ServerRequestProvider';
import {useServerAnalytics} from '../../hook';
import {useShop} from '../../../useShop';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client';
import {useShopQuery} from '../../../../hooks/useShopQuery';
import {CacheLong} from '../../../Cache/strategies';
import {gql} from '../../../../utilities/graphql-tag';
import {SHOPIFY_Y, SHOPIFY_S} from '../../../../constants';

export function ShopifyAnalytics({cookieDomain}: {cookieDomain?: string}) {
  const {storeDomain} = useShop();
  const request = useServerRequest();
  const cookies = parse(request.headers.get('Cookie') || '');
  const domain = cookieDomain || storeDomain;

  const {
    data: {
      shop: {
        id,
        paymentSettings: {currencyCode},
      },
    },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  useServerAnalytics({
    shopify: {
      shopId: id,
      currency: currencyCode,
      storefrontId: globalThis.Oxygen?.env?.SHOPIFY_STOREFRONT_ID || '0',
      acceptedLanguage:
        request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
      isPersistentCookie: !!cookies[SHOPIFY_S] || !!cookies[SHOPIFY_Y],
    },
  });

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient cookieDomain={domain} />
    </AnalyticsErrorBoundary>
  );
}

const SHOP_QUERY = gql`
  query shopAnalyticsInfo {
    shop {
      id
      paymentSettings {
        currencyCode
      }
    }
  }
`;
