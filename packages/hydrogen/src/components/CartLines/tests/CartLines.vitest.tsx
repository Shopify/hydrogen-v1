import React from 'react';
import {vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {CartLines} from '../CartLines.client.js';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {CartLineProductTitle} from '../../CartLineProductTitle/index.js';
import {CART} from '../../CartProvider/tests/fixtures.js';
import {CartProvider} from '../../CartProvider/index.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';

describe('CartLines', () => {
  const fetch = global.fetch;

  beforeEach(() => {
    // @ts-ignore
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

  it('renders items', () => {
    render(
      <CartProvider data={cart}>
        <CartLines>
          <CartLineProductTitle />
        </CartLines>
      </CartProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders items in li if ul is provided as tag', () => {
    const {container} = render(
      <CartProvider data={cart}>
        <CartLines as="ul">
          <CartLineProductTitle />
        </CartLines>
      </CartProvider>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelector('li')).toBeInTheDocument();
  });
});

const cart = {
  ...CART,
  lines: {
    edges: [
      {
        node: {
          ...CART_LINE,
          id: 'abc',
          merchandise: {
            ...CART_LINE.merchandise,
            product: {
              ...CART_LINE.merchandise.product,
              title: 'Product 1',
            },
          },
        },
      },
      {
        node: {
          ...CART_LINE,
          id: 'def',
          merchandise: {
            ...CART_LINE.merchandise,
            product: {
              ...CART_LINE.merchandise.product,
              title: 'Product 2',
            },
          },
        },
      },
    ],
  },
};
