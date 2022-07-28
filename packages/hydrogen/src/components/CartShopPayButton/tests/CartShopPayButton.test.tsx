import React from 'react';
import {CartShopPayButton} from '../CartShopPayButton.client.js';
import {CartProvider} from '../../CartProvider/index.js';
import {CART_WITH_LINES} from '../../CartProvider/tests/fixtures.js';
import {ShopPayButton} from '../../ShopPayButton/index.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';

describe('CartShopPayButton', () => {
  const fetch = global.fetch;

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

  afterEach(() => {
    global.fetch = fetch;
  });

  it('renders a ShopPayButton', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={CART_WITH_LINES}>
        <CartShopPayButton />
      </CartProvider>
    );

    expect(wrapper).toContainReactComponent(ShopPayButton, {
      variantIdsAndQuantities: [
        {
          id: CART_WITH_LINES.lines.edges[0].node.merchandise.id,
          quantity: CART_WITH_LINES.lines.edges[0].node.quantity,
        },
      ],
    });
  });
});
