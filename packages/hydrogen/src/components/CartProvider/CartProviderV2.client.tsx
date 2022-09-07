import React, {useMemo} from 'react';
import {useMachine} from '@xstate/react/fsm';
import {createMachine, assign, StateMachine} from '@xstate/fsm';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {
  AttributeInput,
  CartBuyerIdentityInput,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
} from '../../storefront-api-types.js';
import {CartContext} from './context.js';
import {
  Cart,
  CartWithActions,
  CartMachineContext,
  CartMachineEvent,
  CartMachineTypeState,
} from './types.js';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';
import {CartNoteUpdateMutationVariables} from './graphql/CartNoteUpdateMutation.js';
import {useCartActions} from './CartActions.client.js';

function invokeCart(
  actions: [string],
  options?: {resolveTarget?: string; errorTarget?: string}
): StateMachine.Config<CartMachineContext, CartMachineEvent>['states']['on'] {
  return {
    entry: actions,
    on: {
      RESOLVE: {
        target: options?.resolveTarget || 'idle',
        actions: [
          assign({
            cart: (_, event) => event?.payload?.cart,
            errors: (_, event) => undefined,
          }),
        ],
      },
      ERROR: {
        target: options?.errorTarget || 'error',
        actions: assign({
          errors: (_, event) => event?.payload?.errors,
        }),
      },
    },
  };
}

const cartMachine = createMachine<
  CartMachineContext,
  CartMachineEvent,
  CartMachineTypeState
>({
  id: 'Cart',
  initial: 'uninitialized',
  states: {
    uninitialized: {
      on: {
        CART_FETCH: {
          target: 'cartFetching',
        },
        CART_CREATE: {
          target: 'cartCreating',
        },
        CARTLINE_ADD: {
          target: 'cartCreating',
        },
      },
    },
    initializationError: {
      on: {
        CART_FETCH: {
          target: 'cartFetching',
        },
        CART_CREATE: {
          target: 'cartCreating',
        },
        CARTLINE_ADD: {
          target: 'cartCreating',
        },
      },
    },
    idle: {
      on: {
        CARTLINE_ADD: {
          target: 'cartLineAdding',
        },
        CARTLINE_UPDATE: {
          target: 'cartLineUpdating',
        },
        CARTLINE_REMOVE: {
          target: 'cartLineRemoving',
        },
        NOTE_UPDATE: {
          target: 'noteUpdating',
        },
        BUYER_IDENTITY_UPDATE: {
          target: 'buyerIdentityUpdating',
        },
        CART_ATTRIBUTES_UPDATE: {
          target: 'cartAttributesUpdating',
        },
        DISCOUNT_CODES_UPDATE: {
          target: 'discountCodesUpdating',
        },
      },
    },
    error: {
      on: {
        CARTLINE_ADD: {
          target: 'cartLineAdding',
        },
        CARTLINE_UPDATE: {
          target: 'cartLineUpdating',
        },
        CARTLINE_REMOVE: {
          target: 'cartLineRemoving',
        },
        NOTE_UPDATE: {
          target: 'noteUpdating',
        },
        BUYER_IDENTITY_UPDATE: {
          target: 'buyerIdentityUpdating',
        },
        CART_ATTRIBUTES_UPDATE: {
          target: 'cartAttributesUpdating',
        },
        DISCOUNT_CODES_UPDATE: {
          target: 'discountCodesUpdating',
        },
      },
    },
    cartFetching: invokeCart(['cartFetchAction'], {
      errorTarget: 'initializationError',
    }),
    cartCreating: invokeCart(['cartCreateAction'], {
      errorTarget: 'initializationError',
    }),
    cartLineRemoving: invokeCart(['cartLineRemoveAction']),
    cartLineUpdating: invokeCart(['cartLineUpdateAction']),
    cartLineAdding: invokeCart(['cartLineAddAction']),
    noteUpdating: invokeCart(['noteUpdateAction']),
    buyerIdentityUpdating: invokeCart(['buyerIdentityUpdateAction']),
    cartAttributesUpdating: invokeCart(['cartAttributesUpdateAction']),
    discountCodesUpdating: invokeCart(['discountCodesUpdateAction']),
  },
});

export function CartProviderV2({
  children,
  numCartLines,
  data: cart,
  cartFragment,
}: {
  /** Any `ReactNode` elements. */
  children: React.ReactNode;
  /**  Maximum number of cart lines to fetch. Defaults to 250 cart lines. */
  numCartLines?: number;
  /** An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart). */
  data?: CartFragmentFragment;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment?: string;
}) {
  const {
    cartFetch,
    cartCreate,
    cartLineAdd,
    cartLineUpdate,
    cartLineRemove,
    noteUpdate,
    buyerIdentityUpdate,
    cartAttributesUpdate,
    discountCodesUpdate,
    cartFragment: usedCartFragment,
  } = useCartActions({
    numCartLines,
    cartFragment,
  });

  const [state, send] = useMachine(cartMachine, {
    actions: {
      cartFetchAction: (_, event) => {
        if (event.type !== 'CART_FETCH') return;
        cartFetch(event?.payload?.cartId).then((res) => {
          if (res?.errors || !res?.data?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data.cart)},
          });
        });
      },
      cartCreateAction: (_, event) => {
        if (event.type !== 'CART_CREATE' && event.type !== 'CARTLINE_ADD')
          return;

        cartCreate(event?.payload).then((res) => {
          if (res?.errors || !res.data?.cartCreate?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartCreate.cart)},
          });
        });
      },
      cartLineAddAction: (context, event) => {
        if (event.type !== 'CARTLINE_ADD' || !context?.cart?.id) return;

        cartLineAdd(context.cart.id, event.payload.lines).then((res) => {
          if (res?.errors || !res.data?.cartLinesAdd?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartLinesAdd.cart)},
          });
        });
      },
      cartLineUpdateAction: (context, event) => {
        if (event.type !== 'CARTLINE_UPDATE' || !context?.cart?.id) return;
        cartLineUpdate(context.cart.id, event.payload.lines).then((res) => {
          if (res?.errors || !res.data?.cartLinesUpdate?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartLinesUpdate.cart)},
          });
        });
      },
      cartLineRemoveAction: (context, event) => {
        if (event.type !== 'CARTLINE_REMOVE' || !context?.cart?.id) return;
        cartLineRemove(context.cart.id, event.payload.lines).then((res) => {
          if (res?.errors || !res.data?.cartLinesRemove?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartLinesRemove.cart)},
          });
        });
      },
      noteUpdateAction: (context, event) => {
        if (event.type !== 'NOTE_UPDATE' || !context?.cart?.id) return;
        noteUpdate(context.cart.id, event.payload.note).then((res) => {
          if (res?.errors || !res.data?.cartNoteUpdate?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartNoteUpdate.cart)},
          });
        });
      },
      buyerIdentityUpdateAction: (context, event) => {
        if (event.type !== 'BUYER_IDENTITY_UPDATE' || !context?.cart?.id)
          return;
        buyerIdentityUpdate(context.cart.id, event.payload.buyerIdentity).then(
          (res) => {
            if (res?.errors || !res.data?.cartBuyerIdentityUpdate?.cart) {
              return send({type: 'ERROR', payload: {errors: res?.errors}});
            }
            send({
              type: 'RESOLVE',
              payload: {
                cart: cartFromGraphQL(res.data?.cartBuyerIdentityUpdate.cart),
              },
            });
          }
        );
      },
      cartAttributesUpdateAction: (context, event) => {
        if (event.type !== 'CART_ATTRIBUTES_UPDATE' || !context?.cart?.id)
          return;
        cartAttributesUpdate(context.cart.id, event.payload.attributes).then(
          (res) => {
            if (res?.errors || !res.data?.cartAttributesUpdate?.cart) {
              return send({type: 'ERROR', payload: {errors: res?.errors}});
            }
            send({
              type: 'RESOLVE',
              payload: {
                cart: cartFromGraphQL(res.data?.cartAttributesUpdate.cart),
              },
            });
          }
        );
      },
      discountCodesUpdateAction: (context, event) => {
        if (event.type !== 'DISCOUNT_CODES_UPDATE' || !context?.cart?.id)
          return;
        discountCodesUpdate(context.cart.id, event.payload.discountCodes).then(
          (res) => {
            if (res?.errors || !res.data?.cartDiscountCodesUpdate?.cart) {
              return send({type: 'ERROR', payload: {errors: res?.errors}});
            }
            send({
              type: 'RESOLVE',
              payload: {
                cart: cartFromGraphQL(res.data?.cartDiscountCodesUpdate.cart),
              },
            });
          }
        );
      },
    },
  });

  const cartContextValue = useMemo<CartWithActions>(() => {
    return {
      ...(state?.context?.cart ?? {lines: [], attributes: []}),
      status: tempTransposeStatus(state.value),
      error: state?.context?.errors,
      totalQuantity: state?.context?.cart?.totalQuantity ?? 0,
      cartCreate(cartInput: CartInput) {
        send({
          type: 'CART_CREATE',
          payload: cartInput,
        });
      },
      linesAdd(lines: CartLineInput[]) {
        send({
          type: 'CARTLINE_ADD',
          payload: {lines},
        });
      },
      linesRemove(lines: string[]) {
        send({
          type: 'CARTLINE_REMOVE',
          payload: {
            lines,
          },
        });
      },
      linesUpdate(lines: CartLineUpdateInput[]) {
        send({
          type: 'CARTLINE_UPDATE',
          payload: {
            lines,
          },
        });
      },
      noteUpdate(note: CartNoteUpdateMutationVariables['note']) {
        send({
          type: 'NOTE_UPDATE',
          payload: {
            note,
          },
        });
      },
      buyerIdentityUpdate(buyerIdentity: CartBuyerIdentityInput) {
        send({
          type: 'BUYER_IDENTITY_UPDATE',
          payload: {
            buyerIdentity,
          },
        });
      },
      cartAttributesUpdate(attributes: AttributeInput[]) {
        send({
          type: 'CART_ATTRIBUTES_UPDATE',
          payload: {
            attributes,
          },
        });
      },
      discountCodesUpdate(discountCodes: string[]) {
        send({
          type: 'DISCOUNT_CODES_UPDATE',
          payload: {
            discountCodes,
          },
        });
      },
      cartFragment: usedCartFragment,
    };
  }, [usedCartFragment, send, state.context, state.value]);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}

function tempTransposeStatus(
  status: CartMachineTypeState['value']
): CartWithActions['status'] {
  switch (status) {
    case 'uninitialized':
      return 'uninitialized';
    case 'idle':
    case 'error':
    case 'initializationError':
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

export function cartFromGraphQL(cart: CartFragmentFragment): Cart {
  return {
    ...cart,
    // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
    lines: flattenConnection(cart.lines),
    note: cart.note ?? undefined,
  };
}
