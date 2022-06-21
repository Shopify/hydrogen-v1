import React, {ReactNode} from 'react';
import LocalizationClientProvider from './LocalizationClientProvider.client';
import {useShop} from '../../foundation/useShop';
import {useServerRequest} from '../../foundation/ServerRequestProvider';

export interface LocalizationProviderProps {
  /** A `ReactNode` element. */
  children: ReactNode;

  /**
   * Override the `isoCode` to define the active country
   */
  countryCode?: string;

  /**
   * Override the `languageCode` to define the active language
   */
  languageCode?: string;
}

/**
 * The `LocalizationProvider` component automatically queries the Storefront API's
 * [`localization`](https://shopify.dev/api/storefront/reference/common-objects/queryroot) field
 * for the `isoCode` and `name` of the `country` and keeps this information in a context.
 *
 * Any descendents of this provider can use the `useLocalization` hook.
 */
export function LocalizationProvider(props: LocalizationProviderProps) {
  const {defaultLanguageCode, defaultCountryCode} = useShop();

  const languageCode = (
    props.languageCode ?? defaultLanguageCode
  ).toUpperCase();
  const countryCode = (props.countryCode ?? defaultCountryCode).toUpperCase();

  const request = useServerRequest();
  const localization = {
    country: {
      isoCode: countryCode,
    },
    language: {
      isoCode: languageCode,
    },
  };
  request.ctx.localization = localization;

  return (
    <LocalizationClientProvider localization={localization}>
      {props.children}
    </LocalizationClientProvider>
  );
}
