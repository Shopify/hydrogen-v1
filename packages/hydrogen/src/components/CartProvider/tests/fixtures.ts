import {CART_LINE} from '../../../components/CartLineProvider/tests/fixtures';
import {getPrice} from '../../../../src/utilities/tests/price';

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
