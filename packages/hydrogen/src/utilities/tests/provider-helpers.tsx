import React from 'react';
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
import {CartContext} from '../../components/CartProvider/context.js';
import {
  type CartWithActions,
  type Cart,
} from '../../components/CartProvider/types.js';
import {CART_ACTIONS} from '../../components/CartProvider/tests/fixtures.js';

export function ShopifyTestProviders({
  children,
  setServerProps = (() => {}) as SetServerProps,
  serverProps = {pathname: '', search: ''},
  shopifyConfig,
  history,
}: ShopifyProviderOptions & {children: React.ReactNode}) {
  const finalShopifyConfig = getShopifyConfig(shopifyConfig);
  return (
    <ServerPropsProvider
      setServerPropsForRsc={setServerProps}
      initialServerProps={serverProps}
      setRscResponseFromApiRoute={() => {}}
    >
      <ShopifyProvider
        shopifyConfig={finalShopifyConfig}
        languageCode="EN"
        countryCode="US"
      >
        <BrowserRouter history={history}>{children}</BrowserRouter>
      </ShopifyProvider>
    </ServerPropsProvider>
  );
}

export function CartTestProviders({
  children,
  cartProviderValues,
}: {
  children: React.ReactNode;
  cartProviderValues?: Parameters<typeof getCartProviderValues>[0];
}) {
  const finalValue = getCartProviderValues(cartProviderValues);
  return (
    <CartContext.Provider value={finalValue}>{children}</CartContext.Provider>
  );
}

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

function getCartProviderValues({
  cart = {},
  ...config
}: CartProviderOptions = {}): CartWithActions {
  const finalConfig = {
    ...CART_ACTIONS,
    ...cart,
    ...config,
  };

  return finalConfig;
}

type SetServerProps = React.Dispatch<React.SetStateAction<ServerProps>>;

export interface ShopifyProviderOptions {
  shopifyConfig?: Partial<ShopifyConfig>;
  setServerProps?: SetServerProps;
  serverProps?: LocationServerProps;
  history?: BrowserHistory;
}

type CartProviderOptions = {
  cart?: Partial<Cart>;
} & Partial<CartWithActions>;
