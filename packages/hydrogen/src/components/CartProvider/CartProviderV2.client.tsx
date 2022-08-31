import React, {useEffect, useMemo} from 'react';
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
import {CartDiscountCodesUpdateMutationVariables} from './graphql/CartDiscountCodesUpdateMutation.js';
import {useCartActions} from './CartActions.client.js';

function invokeCart(
  actions: [string]
): StateMachine.Config<CartMachineContext, CartMachineEvent>['states']['on'] {
  return {
    entry: actions,
    on: {
      RESOLVE: {
        target: 'idle',
        actions: [
          assign({
            cart: (_, event) => event?.payload?.cart,
          }),
        ],
      },
      ERROR: {
        target: 'error',
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
      },
    },
    cartFetching: invokeCart(['xCartFetch']),
    cartCreating: invokeCart(['xCartCreate']),
    cartLineRemoving: invokeCart(['xCartLineRemove']),
    cartLineUpdating: invokeCart(['xCartLineUpdate']),
    cartLineAdding: invokeCart(['xCartLineAdd']),
    noteUpdating: invokeCart(['xNoteUpdate']),
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
    cartFragment: usedCartFragment,
  } = useCartActions({
    numCartLines,
    cartFragment,
  });

  const [state, send, service] = useMachine(cartMachine, {
    actions: {
      xCartFetch: (_, event) => {
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
      xCartCreate: (_, event) => {
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
      xCartLineAdd: (context, event) => {
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
      xCartLineUpdate: (context, event) => {
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
      xCartLineRemove: (context, event) => {
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
      xNoteUpdate: (context, event) => {
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
    },
  });

  useEffect(() => {
    const subscription = service.subscribe((state) => console.log(state));
    return subscription.unsubscribe;
  }, [service]);

  function tempTransposeStatus(
    status: CartMachineTypeState['value']
  ): CartWithActions['status'] {
    switch (status) {
      case 'uninitialized':
        return 'uninitialized';
      case 'idle':
      case 'error':
        return 'idle';
      case 'cartFetching':
        return 'fetching';
      case 'cartCreating':
        return 'creating';
      case 'cartLineAdding':
      case 'cartLineRemoving':
      case 'cartLineUpdating':
        return 'updating';
      case 'noteUpdating':
        return 'updating';
    }
  }

  const cartContextValue = useMemo<CartWithActions>(() => {
    return {
      ...(state?.context?.cart ?? {lines: [], attributes: []}),
      status: tempTransposeStatus(state.value),
      error: state?.context?.errors ? state.context.errors : undefined,
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
        // buyerIdentityUpdate(buyerIdentity, state);
      },
      cartAttributesUpdate(attributes: AttributeInput[]) {
        // cartAttributesUpdateattributes, state);
      },
      discountCodesUpdate(
        discountCodes: CartDiscountCodesUpdateMutationVariables['discountCodes']
      ) {
        // discountCodesUpdate(discountCodes, state);
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

function cartFromGraphQL(cart: CartFragmentFragment): Cart {
  return {
    ...cart,
    // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
    lines: flattenConnection(cart.lines),
    note: cart.note ?? undefined,
  };
}
