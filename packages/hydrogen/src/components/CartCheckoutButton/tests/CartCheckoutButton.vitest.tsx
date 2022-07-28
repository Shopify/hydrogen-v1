import React from 'react';
import {CartProvider} from '../../CartProvider/index.js';
import {CartCheckoutButton} from '../CartCheckoutButton.client.js';
import {
  ShopifyTestProviders,
  CartTestProviders,
} from '../../../utilities/tests/provider-helpers.js';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<CartCheckoutButton/>', () => {
  const fetch = global.fetch;

  beforeEach(() => {
    // @ts-expect-error custom mock of fetch
    global.fetch = vi.fn(async (_url, _init) => {
      return {
        json: async () =>
          JSON.stringify({
            data: {},
          }),
      };
    });
  });

  afterEach(() => {
    global.fetch = fetch;
  });

  it('redirects to checkout when clicked', async () => {
    const user = userEvent.setup();
    const checkoutUrl = 'https://shopify.com/checkout';

    render(
      <CartTestProviders cartProviderValues={{checkoutUrl}}>
        <CartCheckoutButton>Checkout</CartCheckoutButton>
      </CartTestProviders>,
      {wrapper: ShopifyTestProviders}
    );

    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });

    await user.click(screen.getByRole('button'));

    expect(window.location.href).toBe(checkoutUrl);
  });
});
