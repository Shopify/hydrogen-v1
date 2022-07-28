import React, {ReactNode} from 'react';
import LocalizationClientProvider from './LocalizationClientProvider.client.js';
import {useShop} from '../../foundation/useShop/index.js';
import {useServerRequest} from '../../foundation/ServerRequestProvider/index.js';
import {log} from '../../utilities/log/index.js';
import {CountryCode, LanguageCode} from '../../storefront-api-types.js';
import {getLocalizationContextValue} from '../../foundation/ShopifyProvider/ShopifyProvider.server.js';

export interface LocalizationProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;

  /**
   * Override the `isoCode` to define the active country
   */
  countryCode?: CountryCode;

  /**
   * Override the `languageCode` to define the active language
   */
  languageCode?: LanguageCode;
}

/**
 * The `LocalizationProvider` component automatically queries the Storefront API's
 * [`localization`](https://shopify.dev/api/storefront/reference/common-objects/queryroot) field
 * for the `isoCode` and `name` of the `country` and keeps this information in a context.
 *
 * Any descendents of this provider can use the `useLocalization` hook.
 */
export function LocalizationProvider(props: LocalizationProviderProps) {
  if (import.meta.env.DEV) {
    log.warn(
      '<LocalizationProvider> is no longer necessary. Pass localization props directly to `<ShopifyProvider>` instead.'
    );
  }
  const {defaultLanguageCode, defaultCountryCode} = useShop();

  const request = useServerRequest();

  const localization = getLocalizationContextValue(
    defaultLanguageCode,
    defaultCountryCode,
    props.languageCode,
    props.countryCode
  );

  request.ctx.localization = localization;

  return (
    <LocalizationClientProvider localization={localization}>
      {props.children}
    </LocalizationClientProvider>
  );
}
