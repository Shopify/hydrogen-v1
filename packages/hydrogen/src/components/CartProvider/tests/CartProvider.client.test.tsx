import React from 'react';
import {mount} from '@shopify/react-testing';

import {flattenConnection} from '../../../utilities';
import {CartContext} from '../context';
import {CART_WITH_LINES} from './fixtures';
import type {CartLineInput} from '../../../storefront-api-types';

import {CartProvider} from '../CartProvider.client';

const fetchCartMock = jest.fn(() => ({data: {}}));

jest.mock('../hooks.client', () => {
  return {
    useCartFetch: () => fetchCartMock,
  };
});

describe('<CartProvider />', () => {
  beforeEach(() => {
    fetchCartMock.mockReturnValue({data: {}});
  });

  afterEach(() => {
    fetchCartMock.mockClear();
  });

  describe('prop `data` does not exist', () => {
    it('renders CartContext.Provider with default cart data and status=uninitialized', () => {
      const wrapper = mount(<CartProvider>test</CartProvider>);

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          lines: [],
          attributes: [],
        }),
      });
    });

    it('renders CartContext.Provider with status=uninitialized', () => {
      const wrapper = mount(<CartProvider>test</CartProvider>);

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          status: 'uninitialized',
          error: undefined,
        }),
      });
    });
  });

  describe('prop `data` exist', () => {
    it('renders CartContext.Provider with cart data and flatten lines', () => {
      const wrapper = mount(
        <CartProvider data={CART_WITH_LINES}>test</CartProvider>
      );

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          ...CART_WITH_LINES,
          lines: flattenConnection(CART_WITH_LINES.lines),
        }),
      });
    });

    it('renders CartContext.Provider with status=idle follows by status=updating', () => {
      const cartContextMock = jest.fn();
      mount(
        <CartProvider data={CART_WITH_LINES}>
          <CartContext.Consumer>
            {(cartContext) => {
              cartContextMock(cartContext);
              return null;
            }}
          </CartContext.Consumer>
        </CartProvider>
      );

      expect(cartContextMock.mock.calls).toHaveLength(2);

      expect(cartContextMock.mock.calls[0][0]).toMatchObject(
        expect.objectContaining({
          status: 'idle',
          error: undefined,
        })
      );

      expect(cartContextMock.mock.calls[1][0]).toMatchObject(
        expect.objectContaining({
          status: 'updating',
        })
      );
    });
  });

  describe('totalQuantity', () => {
    it('defaults to 0 when cart is empty', () => {
      const wrapper = mount(<CartProvider>test</CartProvider>);

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          totalQuantity: 0,
        }),
      });
    });

    it('starts with the line numbers in the cart', () => {
      const wrapper = mount(
        <CartProvider data={CART_WITH_LINES}>test</CartProvider>
      );

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          totalQuantity: CART_WITH_LINES.lines.edges.length,
        }),
      });
    });

    it.skip('increase by 1 when a new line is added', () => {
      const newLine: CartLineInput = {
        merchandiseId: '123',
      };

      fetchCartMock.mockReturnValue({
        data: {
          cartLinesAdd: {
            cart: {
              ...CART_WITH_LINES,
              lines: {edges: [...CART_WITH_LINES.lines.edges, newLine]},
            },
          },
        },
      });

      const wrapper = mount(
        <CartProvider data={CART_WITH_LINES}>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.linesAdd([newLine]);
                  }}
                >
                  Add
                </button>
              );
            }}
          </CartContext.Consumer>
        </CartProvider>
      );

      wrapper.find('button')?.trigger('onClick');

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          totalQuantity: CART_WITH_LINES.lines.edges.length + 1,
        }),
      });
    });
  });

  describe('linesAdd()', () => {
    it('calls CartCreateMutation with lines if cart id does not exist', () => {
      const linesMock: CartLineInput[] = [
        {
          merchandiseId: '123',
        },
      ];

      const wrapper = mount(
        <CartProvider>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.linesAdd(linesMock);
                  }}
                >
                  Add
                </button>
              );
            }}
          </CartContext.Consumer>
        </CartProvider>
      );

      expect(
        wrapper.find(CartContext.Provider)?.prop('value')
      ).not.toHaveProperty('id');

      wrapper.find('button')?.trigger('onClick');

      expect(fetchCartMock).toHaveBeenLastCalledWith({
        query: expect.stringContaining('mutation CartCreate'),
        variables: {
          input: {lines: linesMock},
          numCartLines: undefined,
          country: undefined,
        },
      });
    });

    it.skip('calls CartLineAddMutation with lines if cart id exist', () => {
      Object.defineProperties(window, {
        localStorage: {
          value: {
            getItem: jest.fn().mockReturnValue('abc'),
            removeItem: jest.fn(),
          },
        },
      });

      fetchCartMock.mockReturnValue({
        data: {
          cartLinesAdd: {
            cart: CART_WITH_LINES,
          },
        },
      });

      const linesMock: CartLineInput[] = [
        {
          merchandiseId: '123',
        },
      ];

      const wrapper = mount(
        <CartProvider>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.linesAdd(linesMock);
                  }}
                >
                  Add
                </button>
              );
            }}
          </CartContext.Consumer>
        </CartProvider>
      );

      expect(wrapper.find(CartContext.Provider)?.prop('value')).toHaveProperty(
        'id'
      );

      wrapper.find('button')?.trigger('onClick');

      expect(fetchCartMock).toHaveBeenLastCalledWith({
        query: expect.stringContaining('mutation CartLineAdd'),
        variables: {
          input: {lines: linesMock},
          numCartLines: undefined,
          country: undefined,
        },
      });
    });
  });
});
