import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {getPrice} from '../../../utilities/tests/price.js';
import {flattenConnection} from '../../../utilities/index.js';
import type {CartWithActions} from '../types.js';
import {defaultCartFragment} from '../cart-queries.js';
import {CartFragmentFragment} from '../graphql/CartFragment.js';

export const CART = {
  id: 'abc',
  checkoutUrl: 'https://shopify.com/checkout',
  attributes: [],
  buyerIdentity: {},
  discountCodes: [],
  totalQuantity: 0,
  cost: {
    subtotalAmount: getPrice(),
    totalAmount: getPrice(),
    totalTaxAmount: getPrice(),
    totalDutyAmount: getPrice(),
  },
  lines: {edges: []},
};

export function getCartMock(options?: Partial<CartFragmentFragment>) {
  return {...CART, ...options};
}

export const CART_WITH_LINES = {
  ...CART,
  lines: {edges: [{node: CART_LINE}]},
};

export const CART_WITH_LINES_FLATTENED = {
  ...CART,
  lines: flattenConnection(CART_WITH_LINES.lines),
};

export const CART_ACTIONS: CartWithActions = {
  // @ts-ignore
  lines: [],
  attributes: [],
  status: 'idle',
  cartCreate: () => {},
  linesAdd: () => {},
  linesRemove: () => {},
  linesUpdate: () => {},
  noteUpdate: () => {},
  buyerIdentityUpdate: () => {},
  cartAttributesUpdate: () => {},
  discountCodesUpdate: () => {},
  totalQuantity: CART_WITH_LINES_FLATTENED.lines.reduce((prev, curr) => {
    return prev + (curr?.quantity ?? 0);
  }, 0),
  cartFragment: defaultCartFragment,
};

// @ts-ignore
export const CART_WITH_ACTIONS: CartWithActions = {
  ...CART_ACTIONS,
  ...CART_WITH_LINES_FLATTENED,
};
