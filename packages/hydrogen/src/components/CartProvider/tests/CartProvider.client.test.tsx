import React from 'react';
import {mount} from '@shopify/react-testing';

import {flattenConnection} from '../../../utilities';
import {CartContext} from '../context';
import {CART_WITH_LINES} from './fixtures';
import type {CartWithActions} from '../types';
import type {CartInput, CartLineInput} from '../../../storefront-api-types';
import {CountryCode} from '../../../storefront-api-types';

import {CartProvider} from '../CartProvider.client';

const fetchCartMock = jest.fn();

jest.mock('../hooks', () => ({
  useCartFetch: () => fetchCartMock,
}));

jest.mock('../../../foundation/useServerState', () => ({
  useServerState: jest.fn(),
}));

const useServerStateMock: jest.Mock = jest.requireMock(
  '../../../foundation/useServerState'
).useServerState;

describe('<CartProvider />', () => {
  beforeEach(() => {
    fetchCartMock.mockReturnValue({data: {}});
    useServerStateMock.mockReturnValue({
      serverState: {},
    });
  });

  afterEach(() => {
    fetchCartMock.mockReset();
    useServerStateMock.mockReset();
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

      const wrapper = triggerCartContextCallback({
        callbackName: 'linesAdd',
        callbackArgs: [newLine],
      });

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

      triggerCartContextCallback({
        callbackName: 'linesAdd',
        callbackArgs: linesMock,
      });

      expect(fetchCartMock).toHaveBeenLastCalledWith(
        'cartCreate',
        expect.objectContaining({
          input: {lines: linesMock},
        })
      );
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

      triggerCartContextCallback({
        callbackName: 'linesAdd',
        callbackArgs: linesMock,
      });

      expect(fetchCartMock).toHaveBeenLastCalledWith({
        query: expect.stringContaining('mutation CartLineAdd'),
        variables: expect.objectContaining({
          input: {lines: linesMock},
        }),
      });
    });
  });

  describe('cartCreate()', () => {
    it('uses callback arguments as input variable in cartCreate mutation', () => {
      const cartMock: CartInput = {
        attributes: [{key: 'key1', value: 'value1'}],
        buyerIdentity: {
          countryCode: CountryCode.Ca,
          customerAccessToken: 'access token',
          email: 'myemail@org.com',
          phone: '555-123-4567',
        },
      };

      triggerCartContextCallback({
        callbackName: 'cartCreate',
        callbackArgs: cartMock,
      });

      expect(fetchCartMock).toHaveBeenLastCalledWith(
        'cartCreate',
        expect.objectContaining({
          input: cartMock,
        })
      );
    });

    it('uses countryCode in cartCreate mutation if it exist in serverState', () => {
      const mockCountryCode = 'CA';

      useServerStateMock.mockReturnValue({
        serverState: {country: {isoCode: mockCountryCode}},
      });

      triggerCartContextCallback({
        callbackName: 'cartCreate',
        callbackArgs: {},
      });

      expect(fetchCartMock).toHaveBeenLastCalledWith(
        'cartCreate',
        expect.objectContaining({
          input: {
            buyerIdentity: {countryCode: mockCountryCode},
          },
          country: mockCountryCode,
        })
      );
    });

    it('uses countryCode from cartCreate input in cartCreate mutation instead of countryCode in serverState', () => {
      const serverStateCountryCode = CountryCode.Ca;
      const cartInputCountryCode = CountryCode.Tw;

      useServerStateMock.mockReturnValue({
        serverState: {country: {isoCode: serverStateCountryCode}},
      });

      const cartMock: CartInput = {
        buyerIdentity: {
          countryCode: cartInputCountryCode,
        },
      };

      triggerCartContextCallback({
        callbackName: 'cartCreate',
        callbackArgs: cartMock,
      });

      expect(fetchCartMock).toHaveBeenLastCalledWith(
        'cartCreate',
        expect.objectContaining({
          input: {
            buyerIdentity: {countryCode: cartInputCountryCode},
          },
          country: serverStateCountryCode,
        })
      );
    });
  });
});

function triggerCartContextCallback({
  cartProviderProps,
  callbackName,
  callbackArgs,
}: {
  cartProviderProps?: Omit<
    React.ComponentProps<typeof CartProvider>,
    'children'
  >;
  callbackName: keyof CartWithActions;
  callbackArgs?: any;
}) {
  const wrapper = mount(
    <CartProvider {...cartProviderProps}>
      <CartContext.Consumer>
        {(cartContext) => {
          return (
            <button
              onClick={() => {
                if (cartContext?.[callbackName] instanceof Function) {
                  (cartContext?.[callbackName] as Function)(callbackArgs);
                }
              }}
            >
              Add
            </button>
          );
        }}
      </CartContext.Consumer>
    </CartProvider>
  );

  expect(wrapper.find(CartContext.Provider)?.prop('value')).not.toHaveProperty(
    'id'
  );

  wrapper.find('button')?.trigger('onClick');

  return wrapper;
}
