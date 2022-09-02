import React from 'react';
import {vi} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useCart} from '../../../hooks/useCart/useCart.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';
import {CART} from './fixtures.js';

const mockUseCartActions = vi.fn();

vi.mock('../CartActions.client.js', () => ({
  useCartActions: mockUseCartActions,
}));

import {cartFromGraphQL, CartProviderV2} from '../CartProviderV2.client.js';
import {CountryCode} from '../../../storefront-api-types.js';

function ShopifyCartProvider({children}) {
  return (
    <ShopifyTestProviders>
      <CartProviderV2>{children}</CartProviderV2>
    </ShopifyTestProviders>
  );
}

describe('<CartProviderV2 />', () => {
  beforeEach(() => {
    mockUseCartActions.mockClear();
  });

  describe('uninitialized', () => {
    it('creates a cart when adding a cart line', async () => {
      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));
      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      expect(result.current.status).toBe('uninitialized');

      act(() => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      expect(result.current.status).toBe('creating');

      await act(async () => {});

      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('creates a cart when creating a cart line', async () => {
      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));
      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      expect(result.current.status).toBe('uninitialized');

      act(() => {
        result.current.cartCreate({});
      });

      expect(result.current.status).toBe('creating');

      await act(async () => {});

      expect(cartCreateSpy).toBeCalledTimes(1);

      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it.skip('fetches a cart when fetching a cart', async () => {
      // @TODO: new useCart
    });

    it('shows inializationError status when an error happens', async () => {
      const errorMock = new Error('Error creating cart');
      const cartCreateSpy = vi.fn(async () => ({
        errors: errorMock,
      }));
      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      expect(result.current.status).toBe('uninitialized');

      act(() => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      expect(result.current.status).toBe('creating');

      await act(async () => {});

      expect(result.current).toMatchObject({
        // @TODO: change to initializationError
        status: 'idle',
        error: errorMock,
      });
    });
  });

  describe('initializationError', () => {
    it('fixes on resolve', async () => {
      const errorMock = new Error('Error creating cart');
      const cartCreateSpy = vi.fn(async () => ({
        errors: errorMock,
      }));

      const cartCreateResolveSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions
        .mockReturnValueOnce({
          cartCreate: cartCreateSpy,
        })
        .mockReturnValue({
          cartCreate: cartCreateResolveSpy,
        });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // First create cart should fail with error
      act(() => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      // Wait till initializationError status
      await act(async () => {});

      // Create cart should work now
      act(() => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      expect(result.current.status).toEqual('creating');

      // wait till idle
      await act(async () => {});

      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });
  });

  describe('idle', () => {
    it('adds cartline', async () => {
      const cartLineAddSpy = vi.fn(async () => ({
        data: {cartLineAdd: {cart: {}}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        cartLineAdd: cartLineAddSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      // add cart line
      act(() => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(cartLineAddSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('updates cartline', async () => {
      const cartLineUpdateSpy = vi.fn(async () => ({
        data: {cartLineUpdate: {cart: CART}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        cartLineUpdate: cartLineUpdateSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      act(() => {
        result.current.linesUpdate([
          {
            id: '123',
            merchandiseId: '123',
          },
        ]);
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(cartLineUpdateSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('removes cartline', async () => {
      const cartLineRemoveSpy = vi.fn(async () => ({
        data: {cartLineRemove: {cart: CART}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        cartLineRemove: cartLineRemoveSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      act(() => {
        result.current.linesRemove(['123']);
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(cartLineRemoveSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('note update', async () => {
      const noteUpdateSpy = vi.fn(async () => ({
        data: {noteUpdate: {cart: CART}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        noteUpdate: noteUpdateSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      act(() => {
        result.current.noteUpdate('test note');
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(noteUpdateSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('buyer identity update', async () => {
      const buyerIdentityUpdateSpy = vi.fn(async () => ({
        data: {buyerIdentityUpdate: {cart: CART}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        buyerIdentityUpdate: buyerIdentityUpdateSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      act(() => {
        result.current.buyerIdentityUpdate({countryCode: CountryCode.Us});
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(buyerIdentityUpdateSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('cart attributes update', async () => {
      const cartAttributesUpdateSpy = vi.fn(async () => ({
        data: {cartAttributesUpdate: {cart: CART}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        cartAttributesUpdate: cartAttributesUpdateSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      act(() => {
        result.current.cartAttributesUpdate([{key: 'key', value: 'value'}]);
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(cartAttributesUpdateSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('discount update', async () => {
      const discountCodesUpdateSpy = vi.fn(async () => ({
        data: {discountCodesUpdate: {cart: CART}},
      }));

      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        discountCodesUpdate: discountCodesUpdateSpy,
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // creates a cart and wait till idle
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      act(() => {
        result.current.discountCodesUpdate(['DiscountCode']);
      });

      expect(result.current.status).toEqual('updating');

      // wait till idle
      await act(async () => {});

      expect(discountCodesUpdateSpy).toBeCalledTimes(1);
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });
  });

  describe('error', () => {
    it('from idle state', async () => {
      const errorMock = new Error('Error creating cart');
      const cartLineAddErrorSpy = vi.fn(async () => ({
        errors: errorMock,
      }));

      const cartLineAddResolveSpy = vi.fn(async () => ({
        data: {cartLineAdd: {cart: CART}},
      }));

      const cartCreateResolveSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateResolveSpy,
        cartLineAdd: cartLineAddErrorSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      // First create cart should fail with error
      await act(async () => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      // create an error
      act(() => {
        result.current.linesAdd([
          {
            merchandiseId: '123',
          },
        ]);
      });

      expect(result.current.status).toEqual('updating');

      await act(async () => {});

      // @TODO: should be an error
      expect(result.current.status).toEqual('idle');
    });
  });
});
