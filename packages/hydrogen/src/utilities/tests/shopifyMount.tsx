import React from 'react';
import {createMount} from '@shopify/react-testing';
import {BrowserHistory} from 'history';
import {DEFAULT_LOCALE} from '../../foundation/constants';

import {ShopifyConfig} from '../../types';
import {ShopifyProvider} from '../../foundation/ShopifyProvider/ShopifyProvider.server';
import {BrowserRouter} from '../../foundation/Router/BrowserRouter.client';
import LocalizationClientProvider from '../../components/LocalizationProvider/LocalizationClientProvider.client';
import {
  LocationServerProps,
  ServerProps,
  ServerPropsProvider,
} from '../../foundation/ServerPropsProvider/ServerPropsProvider';

type SetServerProps = React.Dispatch<React.SetStateAction<ServerProps>>;
export interface ShopifyProviderOptions {
  shopifyConfig?: Partial<ShopifyConfig>;
  setServerProps?: SetServerProps;
  serverProps?: LocationServerProps;
  history?: BrowserHistory;
}

export interface ShopifyProviderContext {
  shopifyConfig: ShopifyConfig;
  setServerProps: SetServerProps;
  serverProps: LocationServerProps;
  history?: BrowserHistory;
}

export const mountWithProviders = createMount<
  ShopifyProviderOptions,
  ShopifyProviderContext
>({
  context: (options) => ({
    shopifyConfig: getShopifyConfig(options.shopifyConfig),
    setServerProps: options.setServerProps || ((() => {}) as SetServerProps),
    serverProps: options.serverProps || {pathname: '', search: ''},
    history: options.history,
  }),
  render: (element, {shopifyConfig, setServerProps, serverProps, history}) => (
    <ServerPropsProvider
      setServerPropsForRsc={setServerProps}
      initialServerProps={serverProps}
    >
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <LocalizationClientProvider
          localization={{
            language: {isoCode: 'en'},
            country: {isoCode: 'US', name: 'United States'},
          }}
        >
          <BrowserRouter history={history}>{element}</BrowserRouter>
        </LocalizationClientProvider>
      </ShopifyProvider>
    </ServerPropsProvider>
  ),
});

export function getShopifyConfig(config: Partial<ShopifyConfig> = {}) {
  const locale = config.defaultLocale ?? DEFAULT_LOCALE;
  const languageCode = locale.split(/[-_]/)[0];

  return {
    locale: locale.toUpperCase(),
    languageCode: languageCode.toUpperCase(),
    storeDomain: config.storeDomain ?? 'notashop.myshopify.io',
    storefrontToken: config.storefrontToken ?? 'abc123',
    storefrontApiVersion: config.storefrontApiVersion ?? '2022-07',
    multipassSecret: config.multipassSecret,
  };
}
