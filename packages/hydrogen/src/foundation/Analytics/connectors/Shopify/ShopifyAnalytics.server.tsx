import React from 'react';
import {parse} from 'worktop/cookie';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client.js';
import {useServerRequest} from '../../../ServerRequestProvider/index.js';
import {useServerAnalytics} from '../../hook.js';
import {useShop} from '../../../useShop/index.js';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client.js';
import {useShopQuery} from '../../../../hooks/useShopQuery/index.js';
import {CacheLong} from '../../../Cache/strategies/index.js';
import {gql} from '../../../../utilities/graphql-tag.js';
import {SHOPIFY_Y, SHOPIFY_S} from '../../../../constants.js';
import type {Shop} from '../../../../storefront-api-types.js';
import {log} from '../../../../utilities/log/index.js';

export function ShopifyAnalytics({cookieDomain}: {cookieDomain?: string}) {
  const {storeDomain} = useShop();
  const request = useServerRequest();
  const cookies = parse(request.headers.get('Cookie') || '');
  const domain = cookieDomain || storeDomain;

  const {data, errors} = useShopQuery<{shop: Shop}>({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  if (!data?.shop || errors) {
    const noDataError = `ShopifyAnalytics.server.tsx: no data was returned for the analytics query. ${
      errors ? `Errors: ${errors.map((err) => err.message).join('; ')}` : ''
    }`;
    if (__HYDROGEN_DEV__) {
      throw new Error(noDataError);
    } else {
      log.error(noDataError);
      return null;
    }
  }

  const {
    shop: {
      id,
      paymentSettings: {currencyCode},
    },
  } = data;

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
