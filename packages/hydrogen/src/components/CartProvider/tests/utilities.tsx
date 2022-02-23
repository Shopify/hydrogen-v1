import React from 'react';
import {createMount} from '@shopify/react-testing';
import {CartContext} from '../context';
import {CartWithActions, Cart} from '../types';
import {CART_ACTIONS} from './fixtures';

export const mountWithCartProvider = createMount<
  CartProviderOptions,
  CartWithActions
>({
  context: (options) => ({
    ...getCartConfig(options),
  }),
  render: (element, cartConfig) => (
    <CartContext.Provider value={cartConfig}>{element}</CartContext.Provider>
  ),
});

function getCartConfig({
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

type CartProviderOptions = {
  cart?: Partial<Cart>;
} & Partial<CartWithActions>;
