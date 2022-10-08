import {CurrencyCode} from '../../../storefront-api-types.js';
import {CartFragmentFragment} from '../../CartProvider/graphql/CartFragment.js';

export const CART_LINE = {
  attributes: [{key: 'color', value: 'red'}],
  quantity: 1,
  id: 'abc',
  merchandise: {
    id: 'def',
    availableForSale: true,
    priceV2: {
      amount: '123',
      currencyCode: CurrencyCode.Usd,
    },
    product: {
      handle: 'foo',
      title: 'Product Name',
    },
    requiresShipping: true,
    selectedOptions: [{name: 'size', value: 'large'}],
    title: 'Product Name - Large',
  },
  cost: {
    totalAmount: {
      amount: '123',
      currencyCode: CurrencyCode.Usd,
    },
    compareAtAmount: {
      amount: '125',
      currencyCode: CurrencyCode.Usd,
    },
  },
};

export function getCartLineMock(
  options?: Partial<CartFragmentFragment['lines']['edges'][0]['node']>
) {
  return {...CART_LINE, ...options};
}
