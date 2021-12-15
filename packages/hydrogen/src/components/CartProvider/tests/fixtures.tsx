import React from 'react';
import {createMount} from '@shopify/react-testing';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {getPrice} from '../../../utilities/tests/price';
import {CartContext} from '../context';
import {CartWithActions} from '../types';
import {CartFragmentFragment} from '../graphql/CartFragment';

export const CART: CartFragmentFragment = {
  id: 'abc',
  checkoutUrl: 'https://shopify.com/checkout',
  attributes: [],
  buyerIdentity: {},
  discountCodes: [],
  estimatedCost: {
    subtotalAmount: getPrice(),
    totalAmount: getPrice(),
    totalTaxAmount: getPrice(),
    totalDutyAmount: getPrice(),
  },
  lines: {edges: []},
};

export const CART_WITH_LINES = {
  ...CART,
  lines: [CART_LINE],
};

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
    ...CART_WITH_LINES,
    ...config,
  } as CartWithActions;
}

type CartProviderOptions = Partial<CartWithActions>;
