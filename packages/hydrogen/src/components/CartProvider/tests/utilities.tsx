import React from 'react';
import {createMount} from '@shopify/react-testing';
import {CartContext} from '../context';
import {CartWithActions} from '../types';
import {CART_WITH_LINES_FLATTENED} from './fixtures';

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

function getCartConfig(config: CartProviderOptions = {}): CartWithActions {
  return {
    ...CART_WITH_LINES_FLATTENED,
    ...config,
  } as CartWithActions;
}

type CartProviderOptions = Partial<CartWithActions>;
