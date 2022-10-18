import React from 'react';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client.js';
import {useServerRequest} from '../../../ServerRequestProvider/index.js';
import {useServerAnalytics} from '../../hook.js';
import {useShop} from '../../../useShop/index.js';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client.js';
import {useShopQuery} from '../../../../hooks/useShopQuery/index.js';
import {CacheLong} from '../../../Cache/strategies/index.js';
import {gql} from '../../../../utilities/graphql-tag.js';
import type {Localization, Shop} from '../../../../storefront-api-types.js';
import {useLocalization} from '../../../../hooks/useLocalization/useLocalization.js';

export function ShopifyAnalytics({cookieDomain}: {cookieDomain?: string}) {
  const {storeDomain, storefrontId} = useShop();
  const request = useServerRequest();
  const domain = cookieDomain || storeDomain;
  const {country} = useLocalization();

  const {
    data: {
      shop: {id},
      localization: {
        country: {currency},
      },
    },
  } = useShopQuery<{shop: Shop; localization: Localization}>({
    query: SHOP_QUERY,
    variables: {
      country: country.isoCode,
    },
    cache: CacheLong(),
    preload: '*',
  });

  useServerAnalytics({
    shopify: {
      shopId: id,
      currency: currency.isoCode,
      storefrontId,
      acceptedLanguage:
        request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
    },
  });

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient cookieDomain={domain} />
    </AnalyticsErrorBoundary>
  );
}

const SHOP_QUERY = gql`
  query shopAnalyticsInfo($country: CountryCode = ZZ)
  @inContext(country: $country) {
    shop {
      id
    }
    localization {
      country {
        currency {
          isoCode
        }
      }
    }
  }
`;
