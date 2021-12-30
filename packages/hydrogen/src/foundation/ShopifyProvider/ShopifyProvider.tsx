import React, {useMemo, useState, useCallback} from 'react';
import {ShopifyContext} from './ShopifyContext';
import {ShopifyProviderProps} from './types';
import {DEFAULT_API_VERSION} from './consts';
import {ServerStateContextValue} from '../../foundation/ServerStateProvider';
import {useServerState} from '../../foundation/useServerState';

export {DEFAULT_API_VERSION} from './consts';
/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 */
export function ShopifyProvider({
  shopifyConfig,
  children,
}: ShopifyProviderProps) {
  const [locale, setLocale] = useState(shopifyConfig?.locale || 'en-us');
  const {setServerState} = useServerState() as ServerStateContextValue;

  const _setLocale = useCallback(
    (locale: string) => {
      setLocale(locale);
      setServerState('locale', {isoCode: locale});
    },
    [setServerState, setLocale]
  );

  const shopifyProviderValue = useMemo(
    () => ({
      graphqlApiVersion: DEFAULT_API_VERSION,
      ...shopifyConfig,
      locale,
      setLocale: _setLocale,
      storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    }),
    [shopifyConfig, locale, setLocale]
  );

  return (
    <ShopifyContext.Provider value={shopifyProviderValue}>
      {children}
    </ShopifyContext.Provider>
  );
}
