import React from 'react';
import {createMount} from '@shopify/react-testing';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {getPrice} from '../../../utilities/tests/price';
import {CartContext} from '../context';
import {CartWithActions} from '../types';
import {flattenConnection} from '../../../utilities';

export const CART = {
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
  lines: {edges: [{node: CART_LINE}]},
};

export const CART_WITH_LINES_FLATTENED = {
  ...CART,
  lines: flattenConnection(CART_WITH_LINES.lines),
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
    ...CART_WITH_LINES_FLATTENED,
    ...config,
  } as CartWithActions;
}

type CartProviderOptions = Partial<CartWithActions>;
