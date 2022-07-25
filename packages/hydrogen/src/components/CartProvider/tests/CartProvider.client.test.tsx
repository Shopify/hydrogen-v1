import React from 'react';
import {mount} from '@shopify/react-testing';

import {flattenConnection} from '../../../utilities/index.js';
import {CartContext} from '../context.js';
import {CART_WITH_LINES} from './fixtures.js';
import type {CartInput, CartLineInput} from '../../../storefront-api-types.js';
import {CountryCode} from '../../../storefront-api-types.js';

import {CartProvider} from '../CartProvider.client.js';

const fetchCartMock = jest.fn(() => ({data: {}}));

jest.mock('../hooks.client', () => {
  return {
    useCartFetch: () => fetchCartMock,
  };
});

jest.mock('../../../foundation/useServerProps', () => ({
  userServerProps: jest.fn(),
}));

describe('<CartProvider />', () => {
  beforeEach(() => {
    fetchCartMock.mockReturnValue({data: {}});
  });

  afterEach(() => {
    fetchCartMock.mockReset();
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

    it('allows a query customization', () => {
      const cartFragment = 'fragment CartFragment on Cart { foo }';
      const linesMock: CartLineInput[] = [
        {
          merchandiseId: '123',
        },
      ];

      const wrapper = mount(
        <CartProvider cartFragment={cartFragment}>
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

      expect(wrapper).toContainReactComponent(CartContext.Provider, {
        value: expect.objectContaining({
          lines: [],
          attributes: [],
          cartFragment,
        }),
      });

      wrapper.find('button')?.trigger('onClick');

      expect(fetchCartMock).toHaveBeenLastCalledWith({
        query: expect.stringContaining(cartFragment),
        variables: {
          input: {lines: linesMock, buyerIdentity: {countryCode: 'US'}},
          numCartLines: undefined,
          country: 'US',
        },
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

      expect(fetchCartMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          query: expect.stringContaining('mutation CartCreate'),
          variables: expect.objectContaining({
            input: expect.objectContaining({lines: linesMock}),
            numCartLines: undefined,
            country: 'US',
          }),
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

  describe('cartCreate', () => {
    it('use countryCode if it exist in serverState', () => {
      const mockCountryCode = CountryCode.Ca;

      const cartMock: CartInput = {
        lines: [
          {
            merchandiseId: '123',
          },
        ],
      };

      const wrapper = mount(
        <CartProvider countryCode={mockCountryCode}>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.cartCreate(cartMock);
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
          input: {
            ...cartMock,
            buyerIdentity: {countryCode: mockCountryCode},
          },
          numCartLines: undefined,
          country: mockCountryCode,
        },
      });
    });

    it('use countryCode from cartCreate input instead of countryCode in serverState', () => {
      const serverStateCountryCode = CountryCode.Ca;
      const cartInputCountryCode = CountryCode.Tw;

      const cartMock: CartInput = {
        lines: [
          {
            merchandiseId: '123',
          },
        ],
        buyerIdentity: {
          countryCode: cartInputCountryCode,
        },
      };

      const wrapper = mount(
        <CartProvider countryCode={serverStateCountryCode}>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.cartCreate(cartMock);
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
          input: {
            ...cartMock,
            buyerIdentity: {countryCode: cartInputCountryCode},
          },
          numCartLines: undefined,
          country: serverStateCountryCode,
        },
      });
    });

    it('use customerAccessToken if it exist in props', () => {
      const mockCustomerAccessToken = 'access token test';

      const cartMock: CartInput = {
        lines: [
          {
            merchandiseId: '123',
          },
        ],
      };

      const wrapper = mount(
        <CartProvider customerAccessToken={mockCustomerAccessToken}>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.cartCreate(cartMock);
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
          input: {
            ...cartMock,
            buyerIdentity: {
              countryCode: 'US',
              customerAccessToken: mockCustomerAccessToken,
            },
          },
          numCartLines: undefined,
          country: 'US',
        },
      });
    });

    it('use customerAccessToken from cartCreate input instead of customerAccessToken from props', () => {
      const propsCustomerAccessToken = 'access token props';
      const cartInputCustomerAccessToken = 'access token cart input';

      const cartMock: CartInput = {
        lines: [
          {
            merchandiseId: '123',
          },
        ],
        buyerIdentity: {
          customerAccessToken: cartInputCustomerAccessToken,
        },
      };

      const wrapper = mount(
        <CartProvider customerAccessToken={propsCustomerAccessToken}>
          <CartContext.Consumer>
            {(cartContext) => {
              return (
                <button
                  onClick={() => {
                    cartContext?.cartCreate(cartMock);
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
          input: {
            ...cartMock,
            buyerIdentity: {
              countryCode: 'US',
              customerAccessToken: cartInputCustomerAccessToken,
            },
          },
          numCartLines: undefined,
          country: 'US',
        },
      });
    });
  });
});
