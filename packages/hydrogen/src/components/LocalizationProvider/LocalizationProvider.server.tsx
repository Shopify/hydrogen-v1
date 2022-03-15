import React, {ReactNode} from 'react';
import LocalizationClientProvider from './LocalizationClientProvider.client';
import {useShopQuery} from '../../hooks/useShopQuery';
import {LocalizationQuery} from './LocalizationQuery';
import {Localization} from '../../graphql/graphql-constants';
import {CacheDays} from '../../framework/CachingStrategy';
import {PreloadOptions} from '../../types';

export interface LocalizationProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;
  /** Whether to preload the query. Defaults to `false`. Specify `true` to
   * [preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries) for the URL
   * or `'*'` to preload the query for all requests.
   */
  preload: PreloadOptions;
}

/**
 * The `LocalizationProvider` component automatically queries the Storefront API's
 * [`localization`](/api/storefront/reference/common-objects/queryroot) field
 * for the `isoCode` and `name` of the `country` and keeps this information in a context.
 *
 * Any descendents of this provider can use the `useCountry` hook.
 * The `isoCode` of the `country` can be used in the Storefront API's
 * `@inContext` directive as the `country` value.
 */
export function LocalizationProvider(props: LocalizationProviderProps) {
  const {
    data: {localization},
  } = useShopQuery<LocalizationQuery>({
    query: Localization,
    cache: CacheDays(),
    preload: props.preload,
  });

  return (
    <LocalizationClientProvider localization={localization}>
      {props.children}
    </LocalizationClientProvider>
  );
}
