import React, {useEffect, useCallback, useMemo, useRef, useState} from 'react';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';

import {
  CartLineAdd,
  CartCreate,
  CartLineRemove,
  CartLineUpdate,
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
import {CartContext} from './context.js';

import {CartNoteUpdateMutationVariables} from './graphql/CartNoteUpdateMutation.js';
import {CartDiscountCodesUpdateMutationVariables} from './graphql/CartDiscountCodesUpdateMutation.js';

import {CART_ID_STORAGE_KEY} from './constants.js';
import {CartFragmentFragment} from './graphql/CartFragment.js';

import type {Cart, CartWithActions} from './types.js';
import {ClientAnalytics} from '../../foundation/Analytics/ClientAnalytics.js';

import {
  createClient,
  Provider,
  useQuery,
  useMutation,
  dedupExchange,
  fetchExchange,
} from 'urql';
import {cacheExchange} from '@urql/exchange-graphcache';
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

function logError(errors: any) {
  console.group('%cCart Error:', 'color:red');
  for (const [i, error] of errors.entries()) {
    console.log(`%c${i + 1}. ` + error.message, 'color:red');
  }
  console.groupEnd();
}

function useFetchCart(options: any) {
  // eslint-disable-next-line hydrogen/client-component-banned-hooks
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

function useUpdateCartLine() {
  return useMutation(CartLineUpdate(defaultCartFragment));
}

function useRemoveCartLine() {
  return useMutation(CartLineRemove(defaultCartFragment));
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

  // const initialStatus: State = cart
  //   ? {status: 'idle', cart: cartFromGraphQL(cart)}
  //   : {status: 'uninitialized'};
  const [cartId, setCartId] = useState<string | null>(null);

  const [result] = useFetchCart({
    variables: {
      id: cartId,
      numCartLines,
      country: countryCode,
    },
    pause: !cartId,
  });

  const [resultAdd, uAddCartLine] = useAddCartLine();
  const [resultCreate, uCreateCart] = useCreateCart();
  const [resultUpdate, uUpdateCartLine] = useUpdateCartLine();
  const [resultRemove, uRemoveCartLine] = useRemoveCartLine();

  const status = useMemo(() => {
    if (!cartId) return 'uninitialized';

    if (result.fetching) {
      return 'fetching';
    }

    if (resultCreate.fetching) {
      return 'creating';
    }

    if (resultAdd.fetching || resultUpdate.fetching || resultRemove.fetching) {
      return 'updating';
    }

    return 'idle';
  }, [
    cartId,
    result.fetching,
    resultAdd.fetching,
    resultCreate.fetching,
    resultUpdate.fetching,
    resultRemove.fetching,
  ]);

  const countryChanged =
    status === 'idle' &&
    countryCode !== result.data?.cart?.buyerIdentity?.countryCode;

  const cartCreate = useCallback(
    async (cart: CartInput) => {
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

      const {data, error} = await uCreateCart({
        input: cart,
        numCartLines,
        country: countryCode,
      });

      if (error) {
        logError(error);
      }

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

        window.localStorage.setItem(
          CART_ID_STORAGE_KEY,
          data.cartCreate.cart.id
        );
      }
    },
    [onCreate, countryCode, customerAccessToken, uCreateCart, numCartLines]
  );

  const addLineItem = useCallback(
    async (lines: CartLineInput[]) => {
      if (status === 'idle') {
        onLineAdd?.();
        const {data, error} = await uAddCartLine({
          cartId,
          lines,
          numCartLines,
          country: countryCode,
        });

        if (error) {
          logError(error);
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
        }
      }
    },
    [status, onLineAdd, uAddCartLine, cartId, numCartLines, countryCode]
  );

  const removeLineItem = useCallback(
    async (lines: string[]) => {
      if (status === 'idle') {
        onLineRemove?.();

        const {data, error} = await uRemoveCartLine({
          cartId,
          lines,
          numCartLines,
          country: countryCode,
        });

        if (error) {
          logError(error);
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
        }
      }
    },
    [status, onLineRemove, uRemoveCartLine, cartId, numCartLines, countryCode]
  );

  const updateLineItem = useCallback(
    async (lines: CartLineUpdateInput[]) => {
      if (status === 'idle') {
        const oldCart = {...result.data.cart};
        const {data, error} = await uUpdateCartLine({
          cartId,
          lines,
          numCartLines,
          country: countryCode,
        });

        if (error) {
          logError(error);
        }

        if (data?.cartLinesUpdate?.cart) {
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.UPDATE_CART,
            true,
            {
              updatedCartLines: lines,
              oldCart,
            }
          );
        }
      }
    },
    [
      status,
      result?.data?.cart,
      uUpdateCartLine,
      cartId,
      numCartLines,
      countryCode,
    ]
  );

  const noteUpdate = useCallback(
    async (note: CartNoteUpdateMutationVariables['note']) => {
      if (status === 'idle') {
        onNoteUpdate?.();

        // const {data, errors} = await fetchCart<
        //   CartNoteUpdateMutationVariables,
        //   CartNoteUpdateMutation
        // >({
        //   query: CartNoteUpdate(cartFragment),
        //   variables: {
        //     cartId: state.cart.id!,
        //     note,
        //     numCartLines,
        //     country: countryCode,
        //   },
        // });

        // if (errors) {
        //   dispatch({
        //     type: 'reject',
        //     errors,
        //   });
        // }

        // if (data?.cartNoteUpdate?.cart) {
        //   dispatch({
        //     type: 'resolve',
        //     cart: cartFromGraphQL(data.cartNoteUpdate.cart),
        //   });
        // }
      }
    },
    [status, onNoteUpdate]
  );

  const buyerIdentityUpdate = useCallback(
    async (buyerIdentity: CartBuyerIdentityInput) => {
      if (status === 'idle') {
        // onBuyerIdentityUpdate?.();
        // const {data, errors} = await fetchCart<
        //   CartBuyerIdentityUpdateMutationVariables,
        //   CartBuyerIdentityUpdateMutation
        // >({
        //   query: CartBuyerIdentityUpdate(cartFragment),
        //   variables: {
        //     cartId: state.cart.id!,
        //     buyerIdentity,
        //     numCartLines,
        //     country: countryCode,
        //   },
        // });
        // if (errors) {
        //   dispatch({
        //     type: 'reject',
        //     errors,
        //   });
        // }
      }
    },
    [status]
  );

  const cartAttributesUpdate = useCallback(
    async (attributes: AttributeInput[]) => {
      if (status === 'idle') {
        // onAttributesUpdate?.();
        // const {data, errors} = await fetchCart<
        //   CartAttributesUpdateMutationVariables,
        //   CartAttributesUpdateMutation
        // >({
        //   query: CartAttributesUpdate(cartFragment),
        //   variables: {
        //     cartId: state.cart.id!,
        //     attributes,
        //     numCartLines,
        //     country: countryCode,
        //   },
        // });
        // if (errors) {
        //   dispatch({
        //     type: 'reject',
        //     errors,
        //   });
        // }
      }
    },
    [status]
  );

  const discountCodesUpdate = useCallback(
    async (
      discountCodes: CartDiscountCodesUpdateMutationVariables['discountCodes']
    ) => {
      if (status === 'idle') {
        // onDiscountCodesUpdate?.();
        // const {data, errors} = await fetchCart<
        //   CartDiscountCodesUpdateMutationVariables,
        //   CartDiscountCodesUpdateMutation
        // >({
        //   query: CartDiscountCodesUpdate(cartFragment),
        //   variables: {
        //     cartId: state.cart.id!,
        //     discountCodes,
        //     numCartLines,
        //     country: countryCode,
        //   },
        // });
        // if (errors) {
        //   dispatch({
        //     type: 'reject',
        //     errors,
        //   });
        // }
        // if (data?.cartDiscountCodesUpdate?.cart) {
        //   ClientAnalytics.publish(
        //     ClientAnalytics.eventNames.DISCOUNT_CODE_UPDATED,
        //     true,
        //     {
        //       updatedDiscountCodes: discountCodes,
        //       cart: data.cartDiscountCodesUpdate.cart,
        //     }
        //   );
        // }
      }
    },
    [status]
  );

  const didFetchCart = useRef(false);

  useEffect(() => {
    if (
      localStorage.getItem(CART_ID_STORAGE_KEY) &&
      status === 'uninitialized' &&
      !didFetchCart.current
    ) {
      didFetchCart.current = true;
      setCartId(localStorage.getItem(CART_ID_STORAGE_KEY));
      // cartFetch(localStorage.getItem(CART_ID_STORAGE_KEY)!);
    }
  }, [status]);

  useEffect(() => {
    if (!countryChanged) return;
    buyerIdentityUpdate({countryCode, customerAccessToken});
  }, [
    status,
    buyerIdentityUpdate,
    countryCode,
    customerAccessToken,
    countryChanged,
  ]);

  const cartContextValue = useMemo<CartWithActions>(() => {
    return {
      ...(result?.data?.cart
        ? cartFromGraphQL(result.data.cart)
        : {
            lines: [],
            attributes: [],
            ...(cart ? cartFromGraphQL(cart) : {}),
          }),
      status,
      // error: 'error' in state ? state.error : undefined,
      error: undefined,
      totalQuantity: result.data?.cart?.totalQuantity ?? 0,
      cartCreate,
      linesAdd(lines: CartLineInput[]) {
        if (cartId) {
          addLineItem(lines);
        } else {
          cartCreate({lines});
        }
      },
      linesRemove(lines: string[]) {
        removeLineItem(lines);
      },
      linesUpdate(lines: CartLineUpdateInput[]) {
        updateLineItem(lines);
      },
      noteUpdate(note: CartNoteUpdateMutationVariables['note']) {
        noteUpdate(note);
      },
      buyerIdentityUpdate(buyerIdentity: CartBuyerIdentityInput) {
        buyerIdentityUpdate(buyerIdentity);
      },
      cartAttributesUpdate(attributes: AttributeInput[]) {
        cartAttributesUpdate(attributes);
      },
      discountCodesUpdate(
        discountCodes: CartDiscountCodesUpdateMutationVariables['discountCodes']
      ) {
        discountCodesUpdate(discountCodes);
      },
      cartFragment,
    };
  }, [
    result?.data?.cart,
    cart,
    status,
    cartCreate,
    cartFragment,
    cartId,
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
      exchanges: [dedupExchange, cacheExchange({}), fetchExchange],
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
