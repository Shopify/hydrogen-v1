import React from 'react';
import {CartProvider, useCart} from '../../CartProvider';
import {CART} from '../../CartProvider/tests/fixtures';
import {AddToCartButton} from '../AddToCartButton.client';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {CartContext} from '../../CartProvider/context';

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
    const component = mountWithProviders(
      <CartProvider>
        <AddToCartButton variantId="123">Add to cart</AddToCartButton>
      </CartProvider>
    );

    expect(component).toContainReactComponent('button', {
      children: 'Add to cart',
    });
  });

  it('allows passthrough props', () => {
    const component = mountWithProviders(
      <CartProvider>
        <AddToCartButton variantId="123" className="bg-blue-600">
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
      const component = mountWithProviders(
        <CartProvider>
          <AddToCartButton variantId="123" className="bg-blue-600">
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
      const component = mountWithProviders(
        <CartProvider>
          <AddToCartButton
            accessibleAddingToCartLabel="Adding product to your cart"
            variantId="123"
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
      it('calls useCart() linesAdd callback', () => {
        const mockAddLines = jest.fn();

        /**
         * This CustomUseCartProvider allows us to override what is returned when 'useCart()' is called.
         * We do this by essentially copying the default return value of 'useCart()' and then providing our own CartContext.Provider with our value mixed in.
         * Relying on the fact that React will always use the closest context provider for a given context.
         */
        const CustomUseCartProvider = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const useCartDefault = useCart();
          return (
            <CartContext.Provider
              value={{...useCartDefault, linesAdd: mockAddLines}}
            >
              {children}
            </CartContext.Provider>
          );
        };

        const component = mountWithProviders(
          <CartProvider data={CART}>
            <CustomUseCartProvider>
              <AddToCartButton
                attributes={[{key: 'size', value: 'large'}]}
                variantId="123"
                className="bg-blue-600"
              >
                Add to cart
              </AddToCartButton>
            </CustomUseCartProvider>
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
      it('calls useCart() cartCreate callback', () => {
        const mockCreateCart = jest.fn();

        /**
         * This CustomUseCartProvider allows us to override what is returned when 'useCart()' is called.
         * We do this by essentially copying the default return value of 'useCart()' and then providing our own CartContext.Provider with our value mixed in.
         * Relying on the fact that React will always use the closest context provider for a given context.
         */
        const CustomUseCartProvider = ({
          children,
        }: {
          children: React.ReactNode;
        }) => {
          const useCartDefault = useCart();
          return (
            <CartContext.Provider
              value={{...useCartDefault, cartCreate: mockCreateCart}}
            >
              {children}
            </CartContext.Provider>
          );
        };

        const component = mountWithProviders(
          <CartProvider onCreate={mockCreateCart}>
            <CustomUseCartProvider>
              <AddToCartButton
                attributes={[{key: 'size', value: 'large'}]}
                variantId="123"
                className="bg-blue-600"
              >
                Add to cart
              </AddToCartButton>
            </CustomUseCartProvider>
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
