import {useMachine} from '@xstate/react/fsm';
import {createMachine, assign, StateMachine} from '@xstate/fsm';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {
  Cart,
  CartMachineContext,
  CartMachineEvent,
  CartMachineTypeState,
} from './types.js';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';
import {useCartActions} from './CartActions.client.js';
import {useMemo} from 'react';

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

export function useCartAPIStateMachine({
  numCartLines,
  data: cart,
  cartFragment,
}: {
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
  } = useCartActions({
    numCartLines,
    cartFragment,
  });

  const [state, send, service] = useMachine(cartMachine, {
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

  return useMemo(() => [state, send, service] as const, [state, send, service]);
}

export function cartFromGraphQL(cart: CartFragmentFragment): Cart {
  return {
    ...cart,
    // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
    lines: flattenConnection(cart.lines),
    note: cart.note ?? undefined,
  };
}
