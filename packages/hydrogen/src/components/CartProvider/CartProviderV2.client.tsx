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
        FETCH_CART: {
          target: 'Fetching',
        },
        CREATE_CART: {
          target: 'CreatingCart',
        },
        ADD_CARTLINE: {
          target: 'CreatingCart',
        },
      },
    },
    idle: {
      on: {
        REMOVE_CARTLINE: {
          target: 'RemovingCartLine',
        },
        ADD_CARTLINE: {
          target: 'AddingCartLine',
        },
        UPDATE_CARTLINE: {
          target: 'UpdatingCartLine',
        },
      },
    },
    error: {
      on: {
        REMOVE_CARTLINE: {
          target: 'RemovingCartLine',
        },
        ADD_CARTLINE: {
          target: 'AddingCartLine',
        },
        UPDATE_CARTLINE: {
          target: 'UpdatingCartLine',
        },
      },
    },
    Fetching: invokeCart(['fetchCart']),
    CreatingCart: invokeCart(['createCart']),
    RemovingCartLine: invokeCart(['removeCartLine']),
    UpdatingCartLine: invokeCart(['updateCartLine']),
    AddingCartLine: invokeCart(['addCartLine']),
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
    cartFragment: usedCartFragment,
  } = useCartActions({
    numCartLines,
    cartFragment,
  });

  const [state, send, service] = useMachine(cartMachine, {
    actions: {
      fetchCart: (_, event) => {
        if (event.type !== 'FETCH_CART') return;
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
      createCart: (_, event) => {
        if (event.type !== 'CREATE_CART' && event.type !== 'ADD_CARTLINE')
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
      addCartLine: (context, event) => {
        if (event.type !== 'ADD_CARTLINE' || !context?.cart?.id) return;

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
      updateCartLine: (context, event) => {
        if (event.type !== 'UPDATE_CARTLINE' || !context?.cart?.id) return;
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

      removeCartLine: (context, event) => {
        if (event.type !== 'UPDATE_CARTLINE' || !context?.cart?.id) return;
        cartLineRemove(context.cart.id, event.payload.lines).then((res) => {
          if (res?.errors || !res.data?.cartLinesUpdate?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartLinesUpdate.cart)},
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
      case 'Fetching':
        return 'fetching';
      case 'CreatingCart':
        return 'creating';
      case 'AddingCartLine':
      case 'RemovingCartLine':
      case 'UpdatingCartLine':
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
          type: 'CREATE_CART',
          payload: cartInput,
        });
      },
      linesAdd(lines: CartLineInput[]) {
        send({
          type: 'ADD_CARTLINE',
          payload: {lines},
        });
      },
      linesRemove(lines: string[]) {
        send({
          type: 'REMOVE_CARTLINE',
          payload: {
            lines,
          },
        });
      },
      linesUpdate(lines: CartLineUpdateInput[]) {
        send({
          type: 'UPDATE_CARTLINE',
          payload: {
            lines,
          },
        });
      },
      noteUpdate(note: CartNoteUpdateMutationVariables['note']) {
        // noteUpdate(note, state);
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
