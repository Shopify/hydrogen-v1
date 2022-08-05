import React, {
  useEffect,
  useCallback,
  useReducer,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {Reducer} from 'react';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation.js';
import {Cart, CartAction, State} from './types.js';
import {
  CartLineAddMutation,
  CartLineAddMutationVariables,
} from './graphql/CartLineAddMutation.js';
import {
  CartLineAdd,
  CartCreate,
  CartLineRemove,
  CartLineUpdate,
  CartNoteUpdate,
  CartBuyerIdentityUpdate,
  CartAttributesUpdate,
  CartDiscountCodesUpdate,
  CartQuery,
  defaultCartFragment,
} from './cart-queries.js';
import {
  CartLineInput,
  CartInput,
  CartLineUpdateInput,
  CartBuyerIdentityInput,
  AttributeInput,
  CountryCode,
} from '../../storefront-api-types.js';
import {useCartFetch} from './hooks.client.js';
import {CartContext} from './context.js';
import {
  CartLineRemoveMutationVariables,
  CartLineRemoveMutation,
} from './graphql/CartLineRemoveMutation.js';
import {
  CartLineUpdateMutationVariables,
  CartLineUpdateMutation,
} from './graphql/CartLineUpdateMutation.js';
import {
  CartNoteUpdateMutationVariables,
  CartNoteUpdateMutation,
} from './graphql/CartNoteUpdateMutation.js';
import {
  CartBuyerIdentityUpdateMutationVariables,
  CartBuyerIdentityUpdateMutation,
} from './graphql/CartBuyerIdentityUpdateMutation.js';
import {
  CartDiscountCodesUpdateMutationVariables,
  CartDiscountCodesUpdateMutation,
} from './graphql/CartDiscountCodesUpdateMutation.js';

import {
  CartAttributesUpdateMutationVariables,
  CartAttributesUpdateMutation,
} from './graphql/CartAttributesUpdateMutation.js';
import {CART_ID_STORAGE_KEY} from './constants.js';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {CartQueryQuery, CartQueryQueryVariables} from './graphql/CartQuery.js';

import type {CartWithActions} from './types.js';
import {ClientAnalytics} from '../../foundation/Analytics/ClientAnalytics.js';

import {createClient, Provider, useQuery, useMutation, useClient} from 'urql';
import {useShop} from '../../client.js';
import {
  SHOPIFY_STOREFRONT_ID_HEADER,
  STOREFRONT_API_PUBLIC_TOKEN_HEADER,
  SHOPIFY_STOREFRONT_Y_HEADER,
  SHOPIFY_STOREFRONT_S_HEADER,
  SHOPIFY_S,
  SHOPIFY_Y,
} from '../../constants.js';
import {parse} from 'worktop/cookie';

function cartReducer(state: State, action: CartAction): State {
  switch (action.type) {
    case 'cartFetch': {
      if (state.status === 'uninitialized') {
        return {
          status: 'fetching',
        };
      }
      break;
    }
    case 'cartCreate': {
      if (state.status === 'uninitialized') {
        return {
          status: 'creating',
        };
      }
      break;
    }
    case 'resolve': {
      const resolvableStatuses = ['updating', 'fetching', 'creating'];
      if (resolvableStatuses.includes(state.status)) {
        return {
          status: 'idle',
          cart: action.cart,
        };
      }
      break;
    }
    case 'reject': {
      if (action.errors) {
        console.group('%cCart Error:', 'color:red');
        for (const [i, error] of action.errors.entries()) {
          console.log(`%c${i + 1}. ` + error.message, 'color:red');
        }
        console.groupEnd();
      }
      if (state.status === 'fetching' || state.status === 'creating') {
        return {status: 'uninitialized', error: action.errors};
      } else if (state.status === 'updating') {
        return {
          status: 'idle',
          cart: state.lastValidCart,
          error: action.errors,
        };
      }
      break;
    }
    case 'resetCart': {
      if (state.status === 'fetching') {
        return {status: 'uninitialized'};
      }
      break;
    }
    case 'addLineItem': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: state.cart,
          lastValidCart: state.cart,
        };
      }
      break;
    }
    case 'removeLineItem': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: {
            ...state.cart,
            lines: state.cart.lines.filter(
              ({id}) => !action.lines.includes(id)
            ),
          },
          lastValidCart: state.cart,
        };
      }
      break;
    }
    case 'updateLineItem': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: {
            ...state.cart,
            lines: state.cart.lines.map((line) => {
              const updatedLine = action.lines.find(({id}) => id === line.id);

              if (updatedLine && updatedLine.quantity) {
                return {
                  ...line,
                  quantity: updatedLine.quantity,
                };
              }

              return line;
            }),
          },
          lastValidCart: state.cart,
        };
      }
      break;
    }
    case 'noteUpdate': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: state.cart,
          lastValidCart: state.cart,
        };
      }
      break;
    }
    case 'buyerIdentityUpdate': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: state.cart,
          lastValidCart: state.cart,
        };
      }
      break;
    }
    case 'cartAttributesUpdate': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: state.cart,
          lastValidCart: state.cart,
        };
      }
      break;
    }
    case 'discountCodesUpdate': {
      if (state.status === 'idle') {
        return {
          status: 'updating',
          cart: state.cart,
          lastValidCart: state.cart,
        };
      }
      break;
    }
  }
  throw new Error(
    `Cannot dispatch event (${action.type}) for current cart state (${state.status})`
  );
}

function useFetchCart(options: any) {
  return useQuery({
    query: CartQuery(defaultCartFragment),
    ...options,
  });
}

function useAddCartLine() {
  return useMutation(CartLineAdd(defaultCartFragment));
}

function useCreateCart() {
  return useMutation(CartCreate(defaultCartFragment));
}

/**
 * The `CartProvider` component creates a context for using a cart. It creates a cart object and callbacks
 * that can be accessed by any descendent component using the `useCart` hook and related hooks. It also carries out
 * any callback props when a relevant action is performed. For example, if a `onLineAdd` callback is provided,
 * then the callback will be called when a new line item is successfully added to the cart.
 *
 * The `CartProvider` component must be a descendent of the `ShopifyProvider` component.
 * You must use this component if you want to use the `useCart` hook or related hooks, or if you would like to use the `AddToCartButton` component.
 */
export function CartProviderInternal({
  children,
  numCartLines,
  onCreate,
  onLineAdd,
  onLineRemove,
  onLineUpdate,
  onNoteUpdate,
  onBuyerIdentityUpdate,
  onAttributesUpdate,
  onDiscountCodesUpdate,
  data: cart,
  cartFragment = defaultCartFragment,
  customerAccessToken,
  countryCode = CountryCode.Us,
}: {
  /** Any `ReactNode` elements. */
  children: React.ReactNode;
  numCartLines?: number;
  /** A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API. */
  onCreate?: () => void;
  /** A callback that is invoked when the process to add a line item to the cart begins, but before the line item is added to the Storefront API. */
  onLineAdd?: () => void;
  /** A callback that is invoked when the process to remove a line item to the cart begins, but before the line item is removed from the Storefront API. */
  onLineRemove?: () => void;
  /** A callback that is invoked when the process to update a line item in the cart begins, but before the line item is updated in the Storefront API. */
  onLineUpdate?: () => void;
  /** A callback that is invoked when the process to add or update a note in the cart begins, but before the note is added or updated in the Storefront API. */
  onNoteUpdate?: () => void;
  /** A callback that is invoked when the process to update the buyer identity begins, but before the buyer identity is updated in the Storefront API. */
  onBuyerIdentityUpdate?: () => void;
  /** A callback that is invoked when the process to update the cart attributes begins, but before the attributes are updated in the Storefront API. */
  onAttributesUpdate?: () => void;
  /** A callback that is invoked when the process to update the cart discount codes begins, but before the discount codes are updated in the Storefront API. */
  onDiscountCodesUpdate?: () => void;
  /** An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart). */
  data?: CartFragmentFragment;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment?: string;
  /** A customer access token that's accessible on the server if there's a customer login. */
  customerAccessToken?: CartBuyerIdentityInput['customerAccessToken'];
  /** The ISO country code for i18n. */
  countryCode?: CountryCode;
}) {
  if (countryCode) countryCode = countryCode.toUpperCase() as CountryCode;

  const initialStatus: State = cart
    ? {status: 'idle', cart: cartFromGraphQL(cart)}
    : {status: 'uninitialized'};
  const [state, dispatch] = useReducer<Reducer<State, CartAction>>(
    (state, dispatch) => cartReducer(state, dispatch),
    initialStatus
  );

  const fetchCart = useCartFetch();

  const countryChanged =
    state.status === 'idle' &&
    countryCode !== state?.cart?.buyerIdentity?.countryCode &&
    !state.error;

  const cartFetch = useCallback(
    async (cartId: string) => {
      dispatch({type: 'cartFetch'});

      const {data} = await fetchCart<CartQueryQueryVariables, CartQueryQuery>({
        query: CartQuery(cartFragment),
        variables: {
          id: cartId,
          numCartLines,
          country: countryCode,
        },
      });

      if (!data?.cart) {
        window.localStorage.removeItem(CART_ID_STORAGE_KEY);
        dispatch({type: 'resetCart'});
        return;
      }

      dispatch({type: 'resolve', cart: cartFromGraphQL(data.cart)});
    },
    [fetchCart, cartFragment, numCartLines, countryCode]
  );

  const cartCreate = useCallback(
    async (cart: CartInput) => {
      dispatch({type: 'cartCreate'});

      onCreate?.();

      if (countryCode && !cart.buyerIdentity?.countryCode) {
        if (cart.buyerIdentity == null) {
          cart.buyerIdentity = {};
        }
        cart.buyerIdentity.countryCode = countryCode;
      }

      if (customerAccessToken && !cart.buyerIdentity?.customerAccessToken) {
        if (cart.buyerIdentity == null) {
          cart.buyerIdentity = {};
        }
        cart.buyerIdentity.customerAccessToken = customerAccessToken;
      }

      // const {data, errors: error} = await fetchCart<
      //   CartCreateMutationVariables,
      //   CartCreateMutation
      // >({
      //   query: CartCreate(cartFragment),
      //   variables: {
      //     input: cart,
      //     numCartLines,
      //     country: countryCode,
      //   },
      // });

      const {data, error} = await uCreateCart({
        input: cart,
        numCartLines,
        country: countryCode,
      });

      if (error) {
        dispatch({
          type: 'reject',
          errors: error,
        });
      }

      console.log(data);

      if (data?.cartCreate?.cart) {
        if (cart.lines) {
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.ADD_TO_CART,
            true,
            {
              addedCartLines: cart.lines,
              cart: data.cartCreate.cart,
            }
          );
        }
        dispatch({
          type: 'resolve',
          cart: cartFromGraphQL(data.cartCreate.cart),
        });

        window.localStorage.setItem(
          CART_ID_STORAGE_KEY,
          data.cartCreate.cart.id
        );
      }
    },
    [
      onCreate,
      countryCode,
      fetchCart,
      cartFragment,
      numCartLines,
      customerAccessToken,
    ]
  );

  const addLineItem = useCallback(
    async (lines: CartLineInput[], state: State) => {
      if (state.status === 'idle') {
        dispatch({type: 'addLineItem'});
        onLineAdd?.();
        // const {data, errors} = await fetchCart<
        //   CartLineAddMutationVariables,
        //   CartLineAddMutation
        // >({
        //   query: CartLineAdd(cartFragment),
        //   variables: {
        //     cartId: state.cart.id!,
        //     lines,
        //     numCartLines,
        //     country: countryCode,
        //   },
        // });
        const {data, error} = await uAddCartLine({
          cartId: state.cart.id!,
          lines,
          numCartLines,
          country: countryCode,
        });

        if (error) {
          dispatch({
            type: 'reject',
            errors: error,
          });
        }

        if (data?.cartLinesAdd?.cart) {
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.ADD_TO_CART,
            true,
            {
              addedCartLines: lines,
              cart: data.cartLinesAdd.cart,
            }
          );
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartLinesAdd.cart),
          });
        }
      }
    },
    [onLineAdd, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const removeLineItem = useCallback(
    async (lines: string[], state: State) => {
      if (state.status === 'idle') {
        dispatch({type: 'removeLineItem', lines});

        onLineRemove?.();

        const {data, errors} = await fetchCart<
          CartLineRemoveMutationVariables,
          CartLineRemoveMutation
        >({
          query: CartLineRemove(cartFragment),
          variables: {
            cartId: state.cart.id!,
            lines,
            numCartLines,
            country: countryCode,
          },
        });

        if (errors) {
          dispatch({
            type: 'reject',
            errors,
          });
        }

        if (data?.cartLinesRemove?.cart) {
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.REMOVE_FROM_CART,
            true,
            {
              removedCartLines: lines,
              cart: data.cartLinesRemove.cart,
            }
          );
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartLinesRemove.cart),
          });
        }
      }
    },
    [onLineRemove, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const updateLineItem = useCallback(
    async (lines: CartLineUpdateInput[], state: State) => {
      if (state.status === 'idle') {
        dispatch({type: 'updateLineItem', lines});

        onLineUpdate?.();

        const {data, errors} = await fetchCart<
          CartLineUpdateMutationVariables,
          CartLineUpdateMutation
        >({
          query: CartLineUpdate(cartFragment),
          variables: {
            cartId: state.cart.id!,
            lines,
            numCartLines,
            country: countryCode,
          },
        });
        if (errors) {
          dispatch({
            type: 'reject',
            errors,
          });
        }

        if (data?.cartLinesUpdate?.cart) {
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.UPDATE_CART,
            true,
            {
              updatedCartLines: lines,
              oldCart: state.cart,
            }
          );
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartLinesUpdate.cart),
          });
        }
      }
    },
    [onLineUpdate, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const noteUpdate = useCallback(
    async (note: CartNoteUpdateMutationVariables['note'], state: State) => {
      if (state.status === 'idle') {
        dispatch({type: 'noteUpdate'});

        onNoteUpdate?.();

        const {data, errors} = await fetchCart<
          CartNoteUpdateMutationVariables,
          CartNoteUpdateMutation
        >({
          query: CartNoteUpdate(cartFragment),
          variables: {
            cartId: state.cart.id!,
            note,
            numCartLines,
            country: countryCode,
          },
        });

        if (errors) {
          dispatch({
            type: 'reject',
            errors,
          });
        }

        if (data?.cartNoteUpdate?.cart) {
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartNoteUpdate.cart),
          });
        }
      }
    },
    [onNoteUpdate, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const buyerIdentityUpdate = useCallback(
    async (buyerIdentity: CartBuyerIdentityInput, state: State) => {
      if (state.status === 'idle') {
        dispatch({type: 'buyerIdentityUpdate'});

        onBuyerIdentityUpdate?.();

        const {data, errors} = await fetchCart<
          CartBuyerIdentityUpdateMutationVariables,
          CartBuyerIdentityUpdateMutation
        >({
          query: CartBuyerIdentityUpdate(cartFragment),
          variables: {
            cartId: state.cart.id!,
            buyerIdentity,
            numCartLines,
            country: countryCode,
          },
        });

        if (errors) {
          dispatch({
            type: 'reject',
            errors,
          });
        }

        if (data?.cartBuyerIdentityUpdate?.cart) {
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartBuyerIdentityUpdate.cart),
          });
        }
      }
    },
    [onBuyerIdentityUpdate, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const cartAttributesUpdate = useCallback(
    async (attributes: AttributeInput[], state: State) => {
      if (state.status === 'idle') {
        dispatch({type: 'cartAttributesUpdate'});

        onAttributesUpdate?.();

        const {data, errors} = await fetchCart<
          CartAttributesUpdateMutationVariables,
          CartAttributesUpdateMutation
        >({
          query: CartAttributesUpdate(cartFragment),
          variables: {
            cartId: state.cart.id!,
            attributes,
            numCartLines,
            country: countryCode,
          },
        });

        if (errors) {
          dispatch({
            type: 'reject',
            errors,
          });
        }

        if (data?.cartAttributesUpdate?.cart) {
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartAttributesUpdate.cart),
          });
        }
      }
    },
    [onAttributesUpdate, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const discountCodesUpdate = useCallback(
    async (
      discountCodes: CartDiscountCodesUpdateMutationVariables['discountCodes'],
      state: State
    ) => {
      if (state.status === 'idle') {
        dispatch({type: 'discountCodesUpdate'});

        onDiscountCodesUpdate?.();

        const {data, errors} = await fetchCart<
          CartDiscountCodesUpdateMutationVariables,
          CartDiscountCodesUpdateMutation
        >({
          query: CartDiscountCodesUpdate(cartFragment),
          variables: {
            cartId: state.cart.id!,
            discountCodes,
            numCartLines,
            country: countryCode,
          },
        });

        if (errors) {
          dispatch({
            type: 'reject',
            errors,
          });
        }

        if (data?.cartDiscountCodesUpdate?.cart) {
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.DISCOUNT_CODE_UPDATED,
            true,
            {
              updatedDiscountCodes: discountCodes,
              cart: data.cartDiscountCodesUpdate.cart,
            }
          );
          dispatch({
            type: 'resolve',
            cart: cartFromGraphQL(data.cartDiscountCodesUpdate.cart),
          });
        }
      }
    },
    [onDiscountCodesUpdate, fetchCart, cartFragment, numCartLines, countryCode]
  );

  const didFetchCart = useRef(false);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    if (
      localStorage.getItem(CART_ID_STORAGE_KEY) &&
      state.status === 'uninitialized' &&
      !didFetchCart.current
    ) {
      didFetchCart.current = true;
      setCartId(localStorage.getItem(CART_ID_STORAGE_KEY));
      // cartFetch(localStorage.getItem(CART_ID_STORAGE_KEY)!);
    }
  }, [cartFetch, state]);

  const [result] = useFetchCart({
    variables: {
      id: cartId,
      numCartLines,
      country: countryCode,
    },
    pause: !cartId,
  });

  console.log(result);

  const [, uAddCartLine] = useAddCartLine();
  const [, uCreateCart] = useCreateCart();

  useEffect(() => {
    if (!countryChanged) return;
    buyerIdentityUpdate({countryCode, customerAccessToken}, state);
  }, [
    state,
    buyerIdentityUpdate,
    countryCode,
    customerAccessToken,
    countryChanged,
  ]);

  const cartContextValue = useMemo<CartWithActions>(() => {
    return {
      ...('cart' in state
        ? state.cart
        : {
            lines: [],
            attributes: [],
            ...(cart ? cartFromGraphQL(cart) : {}),
          }),
      status: state.status,
      error: 'error' in state ? state.error : undefined,
      totalQuantity: 'cart' in state ? state?.cart?.totalQuantity ?? 0 : 0,
      cartCreate,
      linesAdd(lines: CartLineInput[]) {
        if ('cart' in state && state.cart.id) {
          addLineItem(lines, state);
        } else {
          cartCreate({lines});
        }
      },
      linesRemove(lines: string[]) {
        removeLineItem(lines, state);
      },
      linesUpdate(lines: CartLineUpdateInput[]) {
        updateLineItem(lines, state);
      },
      noteUpdate(note: CartNoteUpdateMutationVariables['note']) {
        noteUpdate(note, state);
      },
      buyerIdentityUpdate(buyerIdentity: CartBuyerIdentityInput) {
        buyerIdentityUpdate(buyerIdentity, state);
      },
      cartAttributesUpdate(attributes: AttributeInput[]) {
        cartAttributesUpdate(attributes, state);
      },
      discountCodesUpdate(
        discountCodes: CartDiscountCodesUpdateMutationVariables['discountCodes']
      ) {
        discountCodesUpdate(discountCodes, state);
      },
      cartFragment,
    };
  }, [
    state,
    cart,
    cartCreate,
    cartFragment,
    addLineItem,
    removeLineItem,
    updateLineItem,
    noteUpdate,
    buyerIdentityUpdate,
    cartAttributesUpdate,
    discountCodesUpdate,
  ]);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function CartProvider({
  children,
  ...props
}: {
  /** Any `ReactNode` elements. */
  children: React.ReactNode;
  numCartLines?: number;
  /** A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API. */
  onCreate?: () => void;
  /** A callback that is invoked when the process to add a line item to the cart begins, but before the line item is added to the Storefront API. */
  onLineAdd?: () => void;
  /** A callback that is invoked when the process to remove a line item to the cart begins, but before the line item is removed from the Storefront API. */
  onLineRemove?: () => void;
  /** A callback that is invoked when the process to update a line item in the cart begins, but before the line item is updated in the Storefront API. */
  onLineUpdate?: () => void;
  /** A callback that is invoked when the process to add or update a note in the cart begins, but before the note is added or updated in the Storefront API. */
  onNoteUpdate?: () => void;
  /** A callback that is invoked when the process to update the buyer identity begins, but before the buyer identity is updated in the Storefront API. */
  onBuyerIdentityUpdate?: () => void;
  /** A callback that is invoked when the process to update the cart attributes begins, but before the attributes are updated in the Storefront API. */
  onAttributesUpdate?: () => void;
  /** A callback that is invoked when the process to update the cart discount codes begins, but before the discount codes are updated in the Storefront API. */
  onDiscountCodesUpdate?: () => void;
  /** An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart). */
  data?: CartFragmentFragment;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment?: string;
  /** A customer access token that's accessible on the server if there's a customer login. */
  customerAccessToken?: CartBuyerIdentityInput['customerAccessToken'];
  /** The ISO country code for i18n. */
  countryCode?: CountryCode;
}) {
  const {storeDomain, storefrontApiVersion, storefrontToken, storefrontId} =
    useShop();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-SDK-Variant': 'hydrogen',
    'X-SDK-Version': storefrontApiVersion,
    [STOREFRONT_API_PUBLIC_TOKEN_HEADER]: storefrontToken,
  };

  if (storefrontId) {
    headers[SHOPIFY_STOREFRONT_ID_HEADER] = storefrontId;
  }

  // Find Shopify cookies
  const cookieData = parse(document.cookie);
  if (cookieData[SHOPIFY_Y] && cookieData[SHOPIFY_S]) {
    headers[SHOPIFY_STOREFRONT_Y_HEADER] = cookieData[SHOPIFY_Y];
    headers[SHOPIFY_STOREFRONT_S_HEADER] = cookieData[SHOPIFY_S];
  }

  const url = `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`;

  const client = useRef(
    createClient({
      url,
      fetchOptions: {
        headers,
      },
    })
  );

  return (
    <Provider value={client.current}>
      <CartProviderInternal {...props}>{children}</CartProviderInternal>
    </Provider>
  );
}

function cartFromGraphQL(cart: CartFragmentFragment): Cart {
  return {
    ...cart,
    // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
    lines: flattenConnection(cart.lines),
    note: cart.note ?? undefined,
  };
}
