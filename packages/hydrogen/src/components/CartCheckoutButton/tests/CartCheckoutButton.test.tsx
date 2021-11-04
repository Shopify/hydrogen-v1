import React from 'react';
import {CartProvider} from '../../CartProvider';
import {CartCheckoutButton} from '../CartCheckoutButton.client';
import {CART} from '../../CartProvider/tests/fixtures';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';

describe('CartCheckoutButton', () => {
  it('redirects to checkout when clicked', () => {
    const button = mountWithShopifyProvider(
      <CartProvider cart={CART}>
        <CartCheckoutButton>Checkout</CartCheckoutButton>
      </CartProvider>
    );

    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });

    button.find('button')!.trigger('onClick');

    expect(window.location.href).toBe('https://shopify.com/checkout');
  });
});
