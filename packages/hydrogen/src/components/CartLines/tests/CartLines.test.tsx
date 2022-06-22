import React from 'react';
import {CartLines} from '../CartLines.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {CartLineProductTitle} from '../../CartLineProductTitle';
import {CART} from '../../CartProvider/tests/fixtures';
import {CartProvider} from '../../CartProvider';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

describe('CartLines', () => {
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

  it('renders items', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={cart}>
        <CartLines>
          <CartLineProductTitle />
        </CartLines>
      </CartProvider>
    );

    expect(wrapper).toContainReactComponent('span', {children: 'Product 1'});
    expect(wrapper).toContainReactComponent('span', {children: 'Product 2'});
  });

  it('renders items in li if ul is provided as tag', () => {
    const wrapper = mountWithProviders(
      <CartProvider data={cart}>
        <CartLines as="ul">
          <CartLineProductTitle />
        </CartLines>
      </CartProvider>
    );

    expect(wrapper).toContainReactComponent('ul');
    expect(wrapper).toContainReactComponent('li');
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
