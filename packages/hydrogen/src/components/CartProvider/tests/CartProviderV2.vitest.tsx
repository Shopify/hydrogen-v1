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

import {CartProviderV2} from '../CartProviderV2.client.js';
import {cartFromGraphQL} from '../useCartAPIStateMachine.client.js';
import {CountryCode} from '../../../storefront-api-types.js';
import {CART_ID_STORAGE_KEY} from '../constants.js';

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
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue('');
  });

  describe('local storage', () => {
    it('fetches the cart with the cart id in local storage when initializing the app', async () => {
      const cartFetchSpy = vi.fn(async () => ({
        data: {cart: CART},
      }));
      vi.spyOn(window.localStorage, 'getItem').mockReturnValue('cart-id');

      mockUseCartActions.mockReturnValue({
        cartFetch: cartFetchSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      expect(result.current.status).toBe('fetching');

      await act(async () => {});

      expect(cartFetchSpy).toBeCalledWith('cart-id');
      expect(result.current).toMatchObject({
        status: 'idle',
        ...cartFromGraphQL(CART),
      });
    });

    it('does not fetch cart if cart id is not in local storage', async () => {
      const cartFetchSpy = vi.fn(async () => ({
        data: {cart: CART},
      }));
      vi.spyOn(window.localStorage, 'getItem').mockReturnValue('');

      mockUseCartActions.mockReturnValue({
        cartFetch: cartFetchSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      expect(result.current.status).not.toBe('fetching');

      await act(async () => {});

      expect(cartFetchSpy).not.toBeCalled();
      expect(result.current).toMatchObject({
        status: 'uninitialized',
        lines: expect.arrayContaining([]),
      });
    });

    it('saves cart id on cart creation', async () => {
      vi.spyOn(window.localStorage, 'getItem').mockReturnValue('');
      const spy = vi.spyOn(window.localStorage, 'setItem');

      const result = await useCartWithInitializedCart();

      expect(spy).toBeCalledWith(CART_ID_STORAGE_KEY, result.current.id);
    });

    it('deletes cart id on cart completion', async () => {
      const cartFetchSpy = vi.fn(async () => ({
        data: {cart: null},
      }));
      vi.spyOn(window.localStorage, 'getItem').mockReturnValue('cart-id');

      const spy = vi.spyOn(window.localStorage, 'removeItem');

      mockUseCartActions.mockReturnValue({
        cartFetch: cartFetchSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider,
      });

      await act(async () => {});

      expect(cartFetchSpy).toBeCalledWith('cart-id');
      expect(result.current).toMatchObject({
        status: 'idle',
        lines: [],
      });

      expect(spy).toBeCalledWith(CART_ID_STORAGE_KEY);
    });
  });

  describe('uninitialized cart after local storage init', () => {
    it('creates a cart when creating a cart', async () => {
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

      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateSpy,
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

      mockUseCartActions.mockClear();

      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateResolveSpy,
      });

      // Wait for initialization error
      await act(async () => {});

      expect(result.current).toMatchObject({
        status: 'idle',
        error: expect.arrayContaining([]),
      });

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
    describe('adds cart line', async () => {
      it('resolves', async () => {
        const cartLineAddSpy = vi.fn(async () => ({
          data: {cartLinesAdd: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          cartLineAdd: cartLineAddSpy,
        });

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

      it('deletes local storage on complete', async () => {
        const cartLineAddSpy = vi.fn(async () => ({
          data: {cartLinesAdd: {cart: null}},
        }));

        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const result = await useCartWithInitializedCart({
          cartLineAdd: cartLineAddSpy,
        });

        act(() => {
          result.current.linesAdd([
            {
              merchandiseId: '123',
            },
          ]);
        });

        // wait till idle
        await act(async () => {});

        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });

    describe('updates cartline', async () => {
      it('resolves', async () => {
        const cartLineUpdateSpy = vi.fn(async () => ({
          data: {cartLinesUpdate: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          cartLineUpdate: cartLineUpdateSpy,
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

      it('deletes local storage on complete', async () => {
        const cartLineUpdateSpy = vi.fn(async () => ({
          data: {cartLinesUpdate: {cart: null}},
        }));

        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const result = await useCartWithInitializedCart({
          cartLineUpdate: cartLineUpdateSpy,
        });

        act(() => {
          result.current.linesUpdate([
            {
              id: '123',
              merchandiseId: '123',
            },
          ]);
        });

        // wait till idle
        await act(async () => {});

        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });

    describe('removes cartline', async () => {
      it('resolves', async () => {
        const cartLineRemoveSpy = vi.fn(async () => ({
          data: {cartLinesRemove: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          cartLineRemove: cartLineRemoveSpy,
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

      it('deletes local storage on complete', async () => {
        const cartLineRemoveSpy = vi.fn(async () => ({
          data: {cartLinesRemove: {cart: null}},
        }));

        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const result = await useCartWithInitializedCart({
          cartLineRemove: cartLineRemoveSpy,
        });

        act(() => {
          result.current.linesRemove(['123']);
        });

        // wait till idle
        await act(async () => {});
        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });

    describe('note update', async () => {
      it('resolves', async () => {
        const noteUpdateSpy = vi.fn(async () => ({
          data: {cartNoteUpdate: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          noteUpdate: noteUpdateSpy,
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

      it('deletes local storage on complete', async () => {
        const noteUpdateSpy = vi.fn(async () => ({
          data: {cartNoteUpdate: {cart: null}},
        }));

        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const result = await useCartWithInitializedCart({
          noteUpdate: noteUpdateSpy,
        });

        act(() => {
          result.current.noteUpdate('test note');
        });

        // wait till idle
        await act(async () => {});
        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });

    describe('buyer identity update', async () => {
      it('resolves', async () => {
        const buyerIdentityUpdateSpy = vi.fn(async () => ({
          data: {cartBuyerIdentityUpdate: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          buyerIdentityUpdate: buyerIdentityUpdateSpy,
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

      it('deletes local storage on complete', async () => {
        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const buyerIdentityUpdateSpy = vi.fn(async () => ({
          data: {cartBuyerIdentityUpdate: {cart: null}},
        }));

        const result = await useCartWithInitializedCart({
          buyerIdentityUpdate: buyerIdentityUpdateSpy,
        });

        act(() => {
          result.current.buyerIdentityUpdate({countryCode: CountryCode.Us});
        });

        // wait till idle
        await act(async () => {});
        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });

    describe('cart attributes update', async () => {
      it('resolves', async () => {
        const cartAttributesUpdateSpy = vi.fn(async () => ({
          data: {cartAttributesUpdate: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          cartAttributesUpdate: cartAttributesUpdateSpy,
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

      it('deletes local storage on complete', async () => {
        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const cartAttributesUpdateSpy = vi.fn(async () => ({
          data: {cartAttributesUpdate: {cart: null}},
        }));

        const result = await useCartWithInitializedCart({
          cartAttributesUpdate: cartAttributesUpdateSpy,
        });

        act(() => {
          result.current.cartAttributesUpdate([{key: 'key', value: 'value'}]);
        });

        // wait till idle
        await act(async () => {});
        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });

    describe('discount update', async () => {
      it('resolves', async () => {
        const discountCodesUpdateSpy = vi.fn(async () => ({
          data: {cartDiscountCodesUpdate: {cart: CART}},
        }));

        const result = await useCartWithInitializedCart({
          discountCodesUpdate: discountCodesUpdateSpy,
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

      it('deletes local storage on complete', async () => {
        const spy = vi.spyOn(window.localStorage, 'removeItem');

        const discountCodesUpdateSpy = vi.fn(async () => ({
          data: {cartDiscountCodesUpdate: {cart: null}},
        }));

        const result = await useCartWithInitializedCart({
          discountCodesUpdate: discountCodesUpdateSpy,
        });

        act(() => {
          result.current.discountCodesUpdate(['DiscountCode']);
        });

        // wait till idle
        await act(async () => {});

        expect(spy).toHaveBeenCalledWith(CART_ID_STORAGE_KEY);
      });
    });
  });

  describe('error', () => {
    it('from idle state', async () => {
      const errorMock = new Error('Error creating cart');
      const cartLineAddErrorSpy = vi.fn(async () => ({
        errors: errorMock,
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

      // @TODO: show idle state for now instead of an error state
      expect(result.current.status).toEqual('idle');
    });
  });
});

async function useCartWithInitializedCart(cartActionsMocks = {}) {
  const cartCreateSpy = vi.fn(async () => ({
    data: {cartCreate: {cart: CART}},
  }));

  mockUseCartActions.mockReturnValue({
    cartCreate: cartCreateSpy,
    ...cartActionsMocks,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  return result;
}
