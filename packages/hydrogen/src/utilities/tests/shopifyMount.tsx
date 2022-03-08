import React from 'react';
import {createMount} from '@shopify/react-testing';
import {BrowserHistory} from 'history';
import {DEFAULT_LOCALE} from '../../foundation/constants';

import {ShopifyConfig} from '../../types';
import {ShopifyProvider} from '../../foundation/ShopifyProvider';
import {BrowserRouter} from '../../foundation/Router/BrowserRouter.client';
import {ServerState, ServerStateProvider} from '../../foundation';

type SetServerState = React.Dispatch<React.SetStateAction<ServerState>>;
export interface ShopifyProviderOptions {
  shopifyConfig?: Partial<ShopifyConfig>;
  setServerState?: SetServerState;
  serverState?: ServerState;
  history?: BrowserHistory;
}

export interface ShopifyProviderContext {
  shopifyConfig: ShopifyConfig;
  setServerState: SetServerState;
  serverState: ServerState;
  history?: BrowserHistory;
}

export const mountWithProviders = createMount<
  ShopifyProviderOptions,
  ShopifyProviderContext
>({
  context: (options) => ({
    shopifyConfig: getShopifyConfig(options.shopifyConfig),
    setServerState: options.setServerState || ((() => {}) as SetServerState),
    serverState: options.serverState || {pathname: '', search: ''},
    history: options.history,
  }),
  render: (element, {shopifyConfig, setServerState, serverState, history}) => (
    <ServerStateProvider
      setServerState={setServerState}
      serverState={serverState}
    >
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <BrowserRouter history={history}>{element}</BrowserRouter>
      </ShopifyProvider>
    </ServerStateProvider>
  ),
});

export function getShopifyConfig(config: Partial<ShopifyConfig> = {}) {
  return {
    locale: config.defaultLocale ?? DEFAULT_LOCALE,
    storeDomain: config.storeDomain ?? 'notashop.myshopify.io',
    storefrontToken: config.storefrontToken ?? 'abc123',
    storefrontApiVersion: config.storefrontApiVersion ?? '2022-04',
  };
}
