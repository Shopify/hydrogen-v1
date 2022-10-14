import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {
  AttributeInput,
  CartBuyerIdentityInput,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CountryCode,
} from '../../storefront-api-types.js';
import {CartContext} from './context.js';
import {
  BuyerIdentityUpdateEvent,
  CartCreateEvent,
  CartLineAddEvent,
  CartLineRemoveEvent,
  CartLineUpdateEvent,
  CartMachineContext,
  CartMachineEvent,
  CartMachineTypeState,
  CartWithActions,
  DiscountCodesUpdateEvent,
} from './types.js';
import {CartNoteUpdateMutationVariables} from './graphql/CartNoteUpdateMutation.js';
import {useCartAPIStateMachine} from './useCartAPIStateMachine.client.js';
import {CART_ID_STORAGE_KEY} from './constants.js';
import {ClientAnalytics} from '../../foundation/Analytics/ClientAnalytics.js';

export function CartProviderV2({
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
  onCreateComplete,
  onLineAddComplete,
  onLineRemoveComplete,
  onLineUpdateComplete,
  onNoteUpdateComplete,
  onBuyerIdentityUpdateComplete,
  onAttributesUpdateComplete,
  onDiscountCodesUpdateComplete,
  data: cart,
  cartFragment = defaultCartFragment,
  customerAccessToken,
  countryCode = CountryCode.Us,
}: {
  /** Any `ReactNode` elements. */
  children: React.ReactNode;
  /**  Maximum number of cart lines to fetch. Defaults to 250 cart lines. */
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
  /** A callback that is invoked when the process to create a cart completes */
  onCreateComplete?: () => void;
  /** A callback that is invoked when the process to add a line item to the cart completes */
  onLineAddComplete?: () => void;
  /** A callback that is invoked when the process to remove a line item to the cart completes */
  onLineRemoveComplete?: () => void;
  /** A callback that is invoked when the process to update a line item in the cart completes */
  onLineUpdateComplete?: () => void;
  /** A callback that is invoked when the process to add or update a note in the cart completes */
  onNoteUpdateComplete?: () => void;
  /** A callback that is invoked when the process to update the buyer identity completes */
  onBuyerIdentityUpdateComplete?: () => void;
  /** A callback that is invoked when the process to update the cart attributes completes */
  onAttributesUpdateComplete?: () => void;
  /** A callback that is invoked when the process to update the cart discount codes completes */
  onDiscountCodesUpdateComplete?: () => void;
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
  const [prevCountryCode, setPrevCountryCode] = useState(countryCode);
  const [prevCustomerAccessToken, setPrevCustomerAccessToken] =
    useState(customerAccessToken);
  const customerOverridesCountryCode = useRef(false);

  if (
    prevCountryCode !== countryCode ||
    prevCustomerAccessToken !== customerAccessToken
  ) {
    setPrevCountryCode(countryCode);
    setPrevCustomerAccessToken(customerAccessToken);
    customerOverridesCountryCode.current = false;
  }

  const [cartState, cartSend] = useCartAPIStateMachine({
    numCartLines,
    data: cart,
    cartFragment,
    countryCode,
    onCartActionEntry(context, event) {
      try {
        switch (event.type) {
          case 'CART_CREATE':
            return onCreate?.();
          case 'CARTLINE_ADD':
            return onLineAdd?.();
          case 'CARTLINE_REMOVE':
            return onLineRemove?.();
          case 'CARTLINE_UPDATE':
            return onLineUpdate?.();
          case 'NOTE_UPDATE':
            return onNoteUpdate?.();
          case 'BUYER_IDENTITY_UPDATE':
            return onBuyerIdentityUpdate?.();
          case 'CART_ATTRIBUTES_UPDATE':
            return onAttributesUpdate?.();
          case 'DISCOUNT_CODES_UPDATE':
            return onDiscountCodesUpdate?.();
        }
      } catch (error) {
        console.error('Cart entry action failed', error);
      }
    },
    onCartActionOptimisticUI(context, event) {
      if (!context?.cart) return {cart: undefined};
      switch (event.type) {
        case 'CARTLINE_REMOVE':
          return {
            ...context,
            lastValidCart: context.cart,
            cart: {
              ...context.cart,
              lines: context?.cart?.lines.filter(
                ({id}) => !event.payload.lines.includes(id)
              ),
            },
          };
        case 'CARTLINE_UPDATE':
          return {
            ...context,
            lastValidCart: context.cart,
            cart: {
              ...context.cart,
              lines: context.cart.lines.map((line) => {
                const updatedLine = event.payload.lines.find(
                  ({id}) => id === line.id
                );

                if (updatedLine && updatedLine.quantity) {
                  return {
                    ...line,
                    quantity: updatedLine.quantity,
                  };
                }

                return line;
              }),
            },
          };
      }
      return {cart: context.cart ? {...context.cart} : undefined};
    },
    onCartActionComplete(context, event) {
      const cartActionEvent = event.payload.cartActionEvent;
      try {
        switch (event.type) {
          case 'RESOLVE':
            switch (cartActionEvent.type) {
              case 'CART_CREATE':
                publishCreateAnalytics(context, cartActionEvent);
                return onCreateComplete?.();
              case 'CARTLINE_ADD':
                publishLineAddAnalytics(context, cartActionEvent);
                return onLineAddComplete?.();
              case 'CARTLINE_REMOVE':
                publishLineRemoveAnalytics(context, cartActionEvent);
                return onLineRemoveComplete?.();
              case 'CARTLINE_UPDATE':
                publishLineUpdateAnalytics(context, cartActionEvent);
                return onLineUpdateComplete?.();
              case 'NOTE_UPDATE':
                return onNoteUpdateComplete?.();
              case 'BUYER_IDENTITY_UPDATE':
                if (countryCodeNotUpdated(context, cartActionEvent)) {
                  customerOverridesCountryCode.current = true;
                }
                return onBuyerIdentityUpdateComplete?.();
              case 'CART_ATTRIBUTES_UPDATE':
                return onAttributesUpdateComplete?.();
              case 'DISCOUNT_CODES_UPDATE':
                publishDiscountCodesUpdateAnalytics(context, cartActionEvent);
                return onDiscountCodesUpdateComplete?.();
            }
        }
      } catch (error) {
        console.error('onCartActionComplete failed', error);
      }
    },
  });

  const cartReady = useRef(false);
  const cartCompleted = cartState.matches('cartCompleted');

  const countryChanged =
    (cartState.value === 'idle' ||
      cartState.value === 'error' ||
      cartState.value === 'cartCompleted') &&
    countryCode !== cartState?.context?.cart?.buyerIdentity?.countryCode &&
    !cartState.context.errors;

  const fetchingFromStorage = useRef(false);

  /**
   * Initializes cart with priority in this order:
   * 1. cart props
   * 2. localStorage cartId
   */
  useEffect(() => {
    if (!cartReady.current && !fetchingFromStorage.current) {
      if (!cart && storageAvailable('localStorage')) {
        fetchingFromStorage.current = true;
        try {
          const cartId = window.localStorage.getItem(CART_ID_STORAGE_KEY);
          if (cartId) {
            cartSend({type: 'CART_FETCH', payload: {cartId}});
          }
        } catch (error) {
          console.warn('error fetching cartId');
          console.warn(error);
        }
      }
      cartReady.current = true;
    }
  }, [cart, cartReady, cartSend]);

  // Update cart country code if cart and props countryCode's as different
  useEffect(() => {
    if (!countryChanged || customerOverridesCountryCode.current) return;
    cartSend({
      type: 'BUYER_IDENTITY_UPDATE',
      payload: {buyerIdentity: {countryCode, customerAccessToken}},
    });
  }, [
    countryCode,
    customerAccessToken,
    countryChanged,
    customerOverridesCountryCode,
    cartSend,
  ]);

  // send cart events when ready
  const onCartReadySend = useCallback(
    (cartEvent: CartMachineEvent) => {
      if (!cartReady.current) {
        return console.warn("Cart isn't ready yet");
      }
      cartSend(cartEvent);
    },
    [cartSend]
  );

  // save cart id to local storage
  useEffect(() => {
    if (cartState?.context?.cart?.id && storageAvailable('localStorage')) {
      try {
        window.localStorage.setItem(
          CART_ID_STORAGE_KEY,
          cartState.context.cart?.id
        );
      } catch (error) {
        console.warn('Failed to save cartId to localStorage', error);
      }
    }
  }, [cartState?.context?.cart?.id]);

  // delete cart from local storage if cart fetched has been completed
  useEffect(() => {
    if (cartCompleted && storageAvailable('localStorage')) {
      try {
        window.localStorage.removeItem(CART_ID_STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to delete cartId from localStorage', error);
      }
    }
  }, [cartCompleted]);

  const cartCreate = useCallback(
    (cartInput: CartInput) => {
      if (countryCode && !cartInput.buyerIdentity?.countryCode) {
        if (cartInput.buyerIdentity == null) {
          cartInput.buyerIdentity = {};
        }
        cartInput.buyerIdentity.countryCode = countryCode;
      }

      if (
        customerAccessToken &&
        !cartInput.buyerIdentity?.customerAccessToken
      ) {
        if (cartInput.buyerIdentity == null) {
          cartInput.buyerIdentity = {};
        }
        cartInput.buyerIdentity.customerAccessToken = customerAccessToken;
      }
      onCartReadySend({
        type: 'CART_CREATE',
        payload: cartInput,
      });
    },
    [countryCode, customerAccessToken, onCartReadySend]
  );

  // Delays the cart state in the context if the page is hydrating
  // preventing suspense boundary errors.
  const cartDisplayState = useDelayedStateUntilHydration(cartState);

  const cartContextValue = useMemo<CartWithActions>(() => {
    return {
      ...(cartDisplayState?.context?.cart ?? {lines: [], attributes: []}),
      status: transposeStatus(cartDisplayState.value),
      error: cartDisplayState?.context?.errors,
      totalQuantity: cartDisplayState?.context?.cart?.totalQuantity ?? 0,
      cartCreate,
      linesAdd(lines: CartLineInput[]) {
        if (cartDisplayState?.context?.cart?.id) {
          onCartReadySend({
            type: 'CARTLINE_ADD',
            payload: {lines},
          });
        } else {
          cartCreate({lines});
        }
      },
      linesRemove(lines: string[]) {
        onCartReadySend({
          type: 'CARTLINE_REMOVE',
          payload: {
            lines,
          },
        });
      },
      linesUpdate(lines: CartLineUpdateInput[]) {
        onCartReadySend({
          type: 'CARTLINE_UPDATE',
          payload: {
            lines,
          },
        });
      },
      noteUpdate(note: CartNoteUpdateMutationVariables['note']) {
        onCartReadySend({
          type: 'NOTE_UPDATE',
          payload: {
            note,
          },
        });
      },
      buyerIdentityUpdate(buyerIdentity: CartBuyerIdentityInput) {
        onCartReadySend({
          type: 'BUYER_IDENTITY_UPDATE',
          payload: {
            buyerIdentity,
          },
        });
      },
      cartAttributesUpdate(attributes: AttributeInput[]) {
        onCartReadySend({
          type: 'CART_ATTRIBUTES_UPDATE',
          payload: {
            attributes,
          },
        });
      },
      discountCodesUpdate(discountCodes: string[]) {
        onCartReadySend({
          type: 'DISCOUNT_CODES_UPDATE',
          payload: {
            discountCodes,
          },
        });
      },
      cartFragment,
    };
  }, [
    cartCreate,
    cartDisplayState?.context?.cart,
    cartDisplayState?.context?.errors,
    cartDisplayState.value,
    cartFragment,
    onCartReadySend,
  ]);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}

function transposeStatus(
  status: CartMachineTypeState['value']
): CartWithActions['status'] {
  switch (status) {
    case 'uninitialized':
    case 'initializationError':
      return 'uninitialized';
    case 'idle':
    case 'cartCompleted':
    case 'error':
      return 'idle';
    case 'cartFetching':
      return 'fetching';
    case 'cartCreating':
      return 'creating';
    case 'cartLineAdding':
    case 'cartLineRemoving':
    case 'cartLineUpdating':
    case 'noteUpdating':
    case 'buyerIdentityUpdating':
    case 'cartAttributesUpdating':
    case 'discountCodesUpdating':
      return 'updating';
  }
}

/**
 * Delays a state update until hydration finishes. Useful for preventing suspense boundaries errors when updating a context
 * @remarks this uses startTransition and waits for it to finish.
 */
function useDelayedStateUntilHydration<T>(state: T) {
  const [isPending, startTransition] = useTransition();
  const [delayedState, setDelayedState] = useState(state);

  const firstTimePending = useRef(false);
  if (isPending) {
    firstTimePending.current = true;
  }

  const firstTimePendingFinished = useRef(false);
  if (!isPending && firstTimePending.current) {
    firstTimePendingFinished.current = true;
  }

  useEffect(() => {
    startTransition(() => {
      if (!firstTimePendingFinished.current) {
        setDelayedState(state);
      }
    });
  }, [state]);

  const displayState = firstTimePendingFinished.current ? state : delayedState;

  return displayState;
}

/** Check for storage availability funciton obtained from
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
function storageAvailable(type: 'localStorage' | 'sessionStorage') {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function countryCodeNotUpdated(
  context: CartMachineContext,
  event: BuyerIdentityUpdateEvent
) {
  return (
    event.payload.buyerIdentity.countryCode &&
    context.cart?.buyerIdentity?.countryCode !==
      event.payload.buyerIdentity.countryCode
  );
}

// Cart Analytics
function publishCreateAnalytics(
  context: CartMachineContext,
  event: CartCreateEvent
) {
  ClientAnalytics.publish(ClientAnalytics.eventNames.ADD_TO_CART, true, {
    addedCartLines: event.payload.lines,
    cart: context.rawCartResult,
    prevCart: null,
  });
}

function publishLineAddAnalytics(
  context: CartMachineContext,
  event: CartLineAddEvent
) {
  ClientAnalytics.publish(ClientAnalytics.eventNames.ADD_TO_CART, true, {
    addedCartLines: event.payload.lines,
    cart: context.rawCartResult,
    prevCart: context.prevCart,
  });
}

function publishLineUpdateAnalytics(
  context: CartMachineContext,
  event: CartLineUpdateEvent
) {
  ClientAnalytics.publish(ClientAnalytics.eventNames.UPDATE_CART, true, {
    updatedCartLines: event.payload.lines,
    oldCart: context.prevCart,
    cart: context.rawCartResult,
    prevCart: context.prevCart,
  });
}

function publishLineRemoveAnalytics(
  context: CartMachineContext,
  event: CartLineRemoveEvent
) {
  ClientAnalytics.publish(ClientAnalytics.eventNames.REMOVE_FROM_CART, true, {
    removedCartLines: event.payload.lines,
    cart: context.rawCartResult,
    prevCart: context.prevCart,
  });
}

function publishDiscountCodesUpdateAnalytics(
  context: CartMachineContext,
  event: DiscountCodesUpdateEvent
) {
  ClientAnalytics.publish(
    ClientAnalytics.eventNames.DISCOUNT_CODE_UPDATED,
    true,
    {
      updatedDiscountCodes: event.payload.discountCodes,
      cart: context.rawCartResult,
      prevCart: context.prevCart,
    }
  );
}

export const defaultCartFragment = `
fragment CartFragment on Cart {
  id
  checkoutUrl
  totalQuantity
  buyerIdentity {
    countryCode
    customer {
      id
      email
      firstName
      lastName
      displayName
    }
    email
    phone
  }
  lines(first: $numCartLines) {
    edges {
      node {
        id
        quantity
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          compareAtAmountPerQuantity {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            availableForSale
            compareAtPriceV2 {
              ...MoneyFragment
            }
            priceV2 {
              ...MoneyFragment
            }
            requiresShipping
            title
            image {
              ...ImageFragment
            }
            product {
              handle
              title
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
  cost {
    subtotalAmount {
      ...MoneyFragment
    }
    totalAmount {
      ...MoneyFragment
    }
    totalDutyAmount {
      ...MoneyFragment
    }
    totalTaxAmount {
      ...MoneyFragment
    }
  }
  note
  attributes {
    key
    value
  }
  discountCodes {
    code
  }
}

fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}
`;
