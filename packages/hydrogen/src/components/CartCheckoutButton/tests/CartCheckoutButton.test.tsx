import React from 'react';
import {CartProvider} from '../../CartProvider';
import {CartCheckoutButton} from '../CartCheckoutButton.client';
import {CART} from '../../CartProvider/tests/fixtures';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

jest.mock('../../CartProvider', () => ({
  ...(jest.requireActual('../../CartProvider') as {}),
  useCartCheckoutUrl: () => {
    return CART['checkoutUrl'];
  },
  useCart: () => {
    return {
      status: 'idle',
    };
  },
}));

describe('CartCheckoutButton', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(async (_url, _init) => {
      return {
        json: async () =>
          JSON.stringify({
            data: {},
          }),
      };
    });
  });

  // TODO fix this when @shopify/react-testing supports React 18 experimental
  it.skip('redirects to checkout when clicked', () => {
    const button = mountWithProviders(
      <CartProvider>
        <CartCheckoutButton>Checkout</CartCheckoutButton>
      </CartProvider>
    );

    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });

    button.act(() => {
      button.find('button')!.trigger('onClick');
    });

    expect(window.location.href).toBe('https://shopify.com/checkout');
  });
});
