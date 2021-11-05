import React from 'react';

import {CartProvider} from '../../CartProvider';
import {CART} from '../../CartProvider/tests/fixtures';
import {AddToCartButton} from '../AddToCartButton.client';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';

const mockCreateCart = jest.fn();
const mockAddLines = jest.fn();

jest.mock('../../CartProvider', () => ({
  ...(jest.requireActual('../../CartProvider') as {}),
  useCartCreateCallback: () => mockCreateCart,
  useCartLinesAddCallback: () => mockAddLines,
}));

describe('AddToCartButton', () => {
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
    jest.clearAllMocks();
  });

  it('renders a button', () => {
    const component = mountWithShopifyProvider(
      <CartProvider>
        <AddToCartButton variantID="123">Add to cart</AddToCartButton>
      </CartProvider>
    );

    expect(component).toContainReactComponent('button', {
      children: 'Add to cart',
    });
  });

  it('allows passthrough props', () => {
    const component = mountWithShopifyProvider(
      <CartProvider>
        <AddToCartButton variantID="123" className="bg-blue-600">
          Add to cart
        </AddToCartButton>
      </CartProvider>
    );

    expect(component.find('button')).toHaveReactProps({
      className: 'bg-blue-600',
    });
  });

  describe('when the button is clicked', () => {
    it('disables the button', () => {
      const component = mountWithShopifyProvider(
        <CartProvider>
          <AddToCartButton variantID="123" className="bg-blue-600">
            Add to cart
          </AddToCartButton>
        </CartProvider>
      );

      component.act(() => {
        component.find('button')?.trigger('onClick');
      });

      expect(component.find('button')).toHaveReactProps({disabled: true});
    });

    it('renders a message for screen readers when an accessible label is provided', () => {
      const component = mountWithShopifyProvider(
        <CartProvider>
          <AddToCartButton
            accessibleAddingToCartLabel="Adding product to your cart"
            variantID="123"
            className="bg-blue-600"
          >
            Add to cart
          </AddToCartButton>
        </CartProvider>
      );

      component.act(() => {
        component.find('button')?.trigger('onClick');
      });

      expect(component).toContainReactComponent('p', {
        children: 'Adding product to your cart',
      });
    });

    describe('and a Cart ID is present', () => {
      it('calls useCartLinesAddCallback', () => {
        const component = mountWithShopifyProvider(
          <CartProvider cart={CART}>
            <AddToCartButton
              attributes={[{key: 'size', value: 'large'}]}
              variantID="123"
              className="bg-blue-600"
            >
              Add to cart
            </AddToCartButton>
          </CartProvider>
        );

        component.act(() => {
          component.find('button')?.trigger('onClick');
        });

        expect(mockAddLines).toHaveBeenCalledTimes(1);
        expect(mockAddLines).toHaveBeenCalledWith([
          {
            quantity: 1,
            merchandiseId: '123',
            attributes: [{key: 'size', value: 'large'}],
          },
        ]);
      });
    });

    describe('and a Cart ID is not present', () => {
      it('calls useCartCreateCallback', () => {
        const component = mountWithShopifyProvider(
          <CartProvider>
            <AddToCartButton
              attributes={[{key: 'size', value: 'large'}]}
              variantID="123"
              className="bg-blue-600"
            >
              Add to cart
            </AddToCartButton>
          </CartProvider>
        );

        component.act(() => {
          component.find('button')?.trigger('onClick');
        });

        expect(mockCreateCart).toHaveBeenCalledTimes(1);
        expect(mockCreateCart).toHaveBeenCalledWith({
          lines: [
            {
              quantity: 1,
              merchandiseId: '123',
              attributes: [{key: 'size', value: 'large'}],
            },
          ],
        });
      });
    });
  });
});
