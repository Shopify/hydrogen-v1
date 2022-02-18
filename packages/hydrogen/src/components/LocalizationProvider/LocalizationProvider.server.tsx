import React, {ReactNode} from 'react';
import LocalizationClientProvider from './LocalizationClientProvider.client';
import {useShopQuery} from '../../hooks/useShopQuery';
import {LocalizationQuery} from './LocalizationQuery';
import {Localization} from '../../graphql/graphql-constants';
import {CacheDays} from '../../framework/CachingStrategy';

/**
 * The `LocalizationProvider` component automatically queries the Storefront API's
 * [`localization`](/api/storefront/reference/common-objects/queryroot) field
 * for the `isoCode` and `name` of the `country` and `availableCountries` and keeps this information in a context.
 *
 * Any descendents of this provider can use the `useCountry` and `useAvailableCountries` hooks.
 * The `isoCode` of the `country` can be used in the Storefront API's
 * `@inContext` directive as the `country` value.
 */
export function LocalizationProvider({children}: {children: ReactNode}) {
  const {
    data: {localization},
  } = useShopQuery<LocalizationQuery>({
    query: Localization,
    cache: CacheDays(),
  });

  return (
    <LocalizationClientProvider localization={localization}>
      {children}
    </LocalizationClientProvider>
  );
}
