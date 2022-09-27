import React from 'react';
import {createMount} from '@shopify/react-testing';
import {BrowserHistory} from 'history';
import {DEFAULT_COUNTRY, DEFAULT_LANGUAGE} from '../../foundation/constants.js';

import {ShopifyConfig} from '../../types.js';
import {ShopifyProvider} from '../../foundation/ShopifyProvider/ShopifyProvider.server.js';
import {BrowserRouter} from '../../foundation/Router/BrowserRouter.client.js';
import {
  LocationServerProps,
  ServerProps,
  ServerPropsProvider,
} from '../../foundation/ServerPropsProvider/ServerPropsProvider.js';

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
      setRscResponseFromApiRoute={() => {}}
    >
      <ShopifyProvider
        shopifyConfig={shopifyConfig}
        languageCode="EN"
        countryCode="US"
      >
        <BrowserRouter history={history}>{element}</BrowserRouter>
      </ShopifyProvider>
    </ServerPropsProvider>
  ),
});

export function getShopifyConfig(config: Partial<ShopifyConfig> = {}) {
  const languageCode = config.defaultLanguageCode ?? DEFAULT_LANGUAGE;
  const countryCode = config.defaultCountryCode ?? DEFAULT_COUNTRY;

  return {
    countryCode: countryCode.toUpperCase(),
    languageCode: languageCode.toUpperCase(),
    storeDomain: config.storeDomain ?? 'notashop.myshopify.io',
    storefrontToken: config.storefrontToken ?? 'abc123',
    storefrontApiVersion: config.storefrontApiVersion ?? '2022-07',
  };
}
