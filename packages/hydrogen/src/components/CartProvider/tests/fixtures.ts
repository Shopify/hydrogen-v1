import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {getPrice} from '../../../utilities/tests/price';
import {flattenConnection} from '../../../utilities';
import type {Cart, CartWithActions} from '../types';
import type {CartFragmentFragment} from '../graphql/CartFragment';

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

export const CART_WITH_LINES: CartFragmentFragment = {
  ...CART,
  lines: {edges: [{node: CART_LINE}]},
};

export const CART_WITH_LINES_FLATTENED: Cart = {
  ...CART,
  lines: flattenConnection(CART_WITH_LINES.lines),
  note: CART.note ?? undefined,
};

export const CART_ACTIONS: CartWithActions = {
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
    return prev + curr.quantity;
  }, 0),
};

export const CART_WITH_ACTIONS: CartWithActions = {
  ...CART_ACTIONS,
  ...CART_WITH_LINES_FLATTENED,
};
