import React, {ComponentProps} from 'react';
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

function ShopifyCartProvider(
  props: Omit<ComponentProps<typeof CartProviderV2>, 'children'> = {}
) {
  return function Wrapper({children}) {
    return (
      <ShopifyTestProviders>
        <CartProviderV2 {...props}>{children}</CartProviderV2>
      </ShopifyTestProviders>
    );
  };
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
        wrapper: ShopifyCartProvider(),
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
        wrapper: ShopifyCartProvider(),
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
        wrapper: ShopifyCartProvider(),
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
        wrapper: ShopifyCartProvider(),
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

    it('runs the onCartCreate and onCartCreateComplete callbacks when creating a cart', async () => {
      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));

      const onCartCreateSpy = vi.fn();
      const onCartCreateCompleteSpy = vi.fn();

      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider({
          onCreate: onCartCreateSpy,
          onCreateComplete: onCartCreateCompleteSpy,
        }),
      });

      act(() => {
        result.current.cartCreate({});
      });

      expect(onCartCreateSpy).toBeCalledTimes(1);
      expect(onCartCreateCompleteSpy).toBeCalledTimes(0);

      await act(async () => {});

      expect(onCartCreateCompleteSpy).toBeCalledTimes(1);
    });

    it('creates a cart when adding a cart line', async () => {
      const cartCreateSpy = vi.fn(async () => ({
        data: {cartCreate: {cart: CART}},
      }));
      mockUseCartActions.mockReturnValue({
        cartCreate: cartCreateSpy,
      });

      const {result} = renderHook(() => useCart(), {
        wrapper: ShopifyCartProvider(),
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
        wrapper: ShopifyCartProvider(),
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
        wrapper: ShopifyCartProvider(),
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

      it('runs onLineAdd and onLineAddComplete callbacks', async () => {
        const cartLineAddSpy = vi.fn(async () => ({
          data: {cartLinesAdd: {cart: CART}},
        }));

        const onLineAddSpy = vi.fn();
        const onLineAddCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            cartLineAdd: cartLineAddSpy,
          },
          {
            onLineAdd: onLineAddSpy,
            onLineAddComplete: onLineAddCompleteSpy,
          }
        );

        act(() => {
          result.current.linesAdd([
            {
              merchandiseId: '123',
            },
          ]);
        });

        // Two times since `useCartWithInitializedCart` calls `linesAdd` once
        expect(onLineAddSpy).toBeCalledTimes(2);
        expect(onLineAddCompleteSpy).toBeCalledTimes(1);

        // wait till idle
        await act(async () => {});

        expect(onLineAddCompleteSpy).toBeCalledTimes(2);
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

      it('runs onLineUpdate and onLineUpdateComplete callbacks', async () => {
        const cartLineUpdateSpy = vi.fn(async () => ({
          data: {cartLinesUpdate: {cart: CART}},
        }));

        const onLineUpdateSpy = vi.fn();
        const onLineUpdateCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            cartLineUpdate: cartLineUpdateSpy,
          },
          {
            onLineUpdate: onLineUpdateSpy,
            onLineUpdateComplete: onLineUpdateCompleteSpy,
          }
        );

        act(() => {
          result.current.linesUpdate([
            {
              id: '123',
              merchandiseId: '123',
            },
          ]);
        });

        expect(onLineUpdateSpy).toBeCalledTimes(1);
        expect(onLineUpdateCompleteSpy).toBeCalledTimes(0);

        // wait till idle
        await act(async () => {});

        expect(onLineUpdateCompleteSpy).toBeCalledTimes(1);
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

      it('runs onLineRemove and onLineRemoveComplete callbacks', async () => {
        const cartLineRemoveSpy = vi.fn(async () => ({
          data: {cartLinesRemove: {cart: CART}},
        }));

        const onLineRemoveSpy = vi.fn();
        const onLineRemoveCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            cartLineRemove: cartLineRemoveSpy,
          },
          {
            onLineRemove: onLineRemoveSpy,
            onLineRemoveComplete: onLineRemoveCompleteSpy,
          }
        );

        act(() => {
          result.current.linesRemove(['123']);
        });

        expect(onLineRemoveSpy).toBeCalledTimes(1);
        expect(onLineRemoveCompleteSpy).toBeCalledTimes(0);

        // wait till idle
        await act(async () => {});

        expect(onLineRemoveCompleteSpy).toBeCalledTimes(1);
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

      it('runs onNoteUpdate and onNoteUpdateComplete callbacks', async () => {
        const noteUpdateSpy = vi.fn(async () => ({
          data: {cartNoteUpdate: {cart: CART}},
        }));

        const onNoteUpdateSpy = vi.fn();
        const onNoteUpdateCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            noteUpdate: noteUpdateSpy,
          },
          {
            onNoteUpdate: onNoteUpdateSpy,
            onNoteUpdateComplete: onNoteUpdateCompleteSpy,
          }
        );

        act(() => {
          result.current.noteUpdate('test note');
        });

        expect(onNoteUpdateSpy).toBeCalledTimes(1);
        expect(onNoteUpdateCompleteSpy).toBeCalledTimes(0);

        // wait till idle
        await act(async () => {});

        expect(onNoteUpdateCompleteSpy).toBeCalledTimes(1);
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

      it('runs onBuyerIdentityUpdate and onBuyerIdentityUpdateComplete callbacks', async () => {
        const buyerIdentityUpdateSpy = vi.fn(async () => ({
          data: {cartBuyerIdentityUpdate: {cart: CART}},
        }));

        const onBuyerIdentityUpdateSpy = vi.fn();
        const onBuyerIdentityUpdateCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            buyerIdentityUpdate: buyerIdentityUpdateSpy,
          },
          {
            onBuyerIdentityUpdate: onBuyerIdentityUpdateSpy,
            onBuyerIdentityUpdateComplete: onBuyerIdentityUpdateCompleteSpy,
          }
        );

        act(() => {
          result.current.buyerIdentityUpdate({countryCode: CountryCode.Us});
        });

        expect(onBuyerIdentityUpdateSpy).toBeCalledTimes(1);
        expect(onBuyerIdentityUpdateCompleteSpy).toBeCalledTimes(0);

        // wait till idle
        await act(async () => {});

        expect(onBuyerIdentityUpdateCompleteSpy).toBeCalledTimes(1);
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

      it('runs onAttributesUpdate and onAttributesUpdateComplete callbacks', async () => {
        const cartAttributesUpdateSpy = vi.fn(async () => ({
          data: {cartAttributesUpdate: {cart: CART}},
        }));

        const onCartAttributesUpdateSpy = vi.fn();
        const onCartAttributesUpdateCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            cartAttributesUpdate: cartAttributesUpdateSpy,
          },
          {
            onAttributesUpdate: onCartAttributesUpdateSpy,
            onAttributesUpdateComplete: onCartAttributesUpdateCompleteSpy,
          }
        );

        act(() => {
          result.current.cartAttributesUpdate([{key: 'key', value: 'value'}]);
        });

        expect(onCartAttributesUpdateSpy).toBeCalledTimes(1);
        expect(onCartAttributesUpdateCompleteSpy).toBeCalledTimes(0);

        // wait till idle
        await act(async () => {});

        expect(onCartAttributesUpdateCompleteSpy).toBeCalledTimes(1);
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

      it('runs onDiscountCodesUpdate and onDiscountCodesUpdateComplete callbacks', async () => {
        const discountCodesUpdateSpy = vi.fn(async () => ({
          data: {cartDiscountCodesUpdate: {cart: CART}},
        }));

        const onDiscountUpdateSpy = vi.fn();
        const onDiscountUpdateCompleteSpy = vi.fn();

        const result = await useCartWithInitializedCart(
          {
            discountCodesUpdate: discountCodesUpdateSpy,
          },
          {
            onDiscountCodesUpdate: onDiscountUpdateSpy,
            onDiscountCodesUpdateComplete: onDiscountUpdateCompleteSpy,
          }
        );

        act(() => {
          result.current.discountCodesUpdate(['DiscountCode']);
        });

        expect(onDiscountUpdateSpy).toBeCalledTimes(1);
        expect(onDiscountUpdateCompleteSpy).toBeCalledTimes(0);

        // wait till idle
        await act(async () => {});

        expect(onDiscountUpdateCompleteSpy).toBeCalledTimes(1);
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
        wrapper: ShopifyCartProvider(),
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

async function useCartWithInitializedCart(
  cartActionsMocks = {},
  cartProviderProps: Omit<
    ComponentProps<typeof CartProviderV2>,
    'children'
  > = {}
) {
  const cartCreateSpy = vi.fn(async () => ({
    data: {cartCreate: {cart: CART}},
  }));

  mockUseCartActions.mockReturnValue({
    cartCreate: cartCreateSpy,
    ...cartActionsMocks,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {result} = renderHook(() => useCart(), {
    wrapper: ShopifyCartProvider(cartProviderProps),
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
