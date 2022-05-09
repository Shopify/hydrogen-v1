import React, {ReactNode} from 'react';
import LocalizationClientProvider from './LocalizationClientProvider.client';
import {useShop} from '../../foundation/useShop';
import {useShopQuery} from '../../hooks/useShopQuery';
import {CacheDays} from '../../framework/CachingStrategy';
import {PreloadOptions} from '../../types';
import {Country, Currency} from '../../storefront-api-types';

export interface LocalizationProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;
  /** Whether to preload the query. Defaults to `false`. Specify `true` to
   * [preload the query](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries) for the URL
   * or `'*'` to preload the query for all requests.
   */
  preload: PreloadOptions;
}

/**
 * The `LocalizationProvider` component automatically queries the Storefront API's
 * [`localization`](https://shopify.dev/api/storefront/reference/common-objects/queryroot) field
 * for the `isoCode` and `name` of the `country` and keeps this information in a context.
 *
 * Any descendents of this provider can use the `useCountry` hook.
 * The `isoCode` of the `country` can be used in the Storefront API's
 * `@inContext` directive as the `country` value.
 */
export function LocalizationProvider(props: LocalizationProviderProps) {
  const {languageCode} = useShop();

  const {
    data: {localization},
  } = useShopQuery<LocalizationQuery>({
    query,
    variables: {language: languageCode},
    cache: CacheDays(),
    preload: props.preload,
  });

  return (
    <LocalizationClientProvider localization={localization}>
      {props.children}
    </LocalizationClientProvider>
  );
}

export type LocalizationQuery = {__typename?: 'QueryRoot'} & {
  localization: {__typename?: 'Localization'} & {
    country: {__typename?: 'Country'} & Pick<Country, 'isoCode' | 'name'> & {
        currency: {__typename?: 'Currency'} & Pick<Currency, 'isoCode'>;
      };
  };
};

const query = `
query Localization($language: LanguageCode)
@inContext(language: $language) {
   localization {
    country {
      isoCode
      name
      currency {
        isoCode
      }
    }
  }
}
`;
