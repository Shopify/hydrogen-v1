import {useMachine} from '@xstate/react/fsm';
import {createMachine, assign, StateMachine} from '@xstate/fsm';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {
  Cart,
  CartMachineActionEvent,
  CartMachineActions,
  CartMachineContext,
  CartMachineEvent,
  CartMachineFetchResultEvent,
  CartMachineTypeState,
} from './types.js';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';
import {useCartActions} from './CartActions.client.js';
import {useMemo} from 'react';
import {InitEvent} from '@xstate/fsm/lib/types.js';
import {CountryCode} from '../../storefront-api-types.js';

function invokeCart(
  action: keyof CartMachineActions,
  options?: {
    entryActions?: [keyof CartMachineActions];
    resolveTarget?: CartMachineTypeState['value'];
    errorTarget?: CartMachineTypeState['value'];
    exitActions?: [keyof CartMachineActions];
  }
): StateMachine.Config<CartMachineContext, CartMachineEvent>['states']['on'] {
  return {
    entry: [
      ...(options?.entryActions || []),
      'onCartActionEntry',
      'onCartActionOptimisticUI',
      action,
    ],
    on: {
      RESOLVE: {
        target: options?.resolveTarget || 'idle',
        actions: [
          assign({
            prevCart: (context) => context?.cart,
            cart: (_, event) => event?.payload?.cart,
            rawCartResult: (_, event) => event?.payload?.rawCartResult,
            errors: (_) => undefined,
          }),
        ],
      },
      ERROR: {
        target: options?.errorTarget || 'error',
        actions: [
          assign({
            prevCart: (context) => context?.cart,
            cart: (context, _) => context?.lastValidCart,
            errors: (_, event) => event?.payload?.errors,
          }),
        ],
      },
      CART_COMPLETED: {
        target: 'cartCompleted',
        actions: assign({
          prevCart: (_) => undefined,
          cart: (_) => undefined,
          lastValidCart: (_) => undefined,
          errors: (_) => undefined,
        }),
      },
    },
    exit: ['onCartActionComplete', ...(options?.exitActions || [])],
  };
}

const INITIALIZING_CART_EVENTS: StateMachine.Machine<
  CartMachineContext,
  CartMachineEvent,
  CartMachineTypeState
>['config']['states']['uninitialized']['on'] = {
  CART_FETCH: {
    target: 'cartFetching',
  },
  CART_CREATE: {
    target: 'cartCreating',
  },
  CART_SET: {
    target: 'idle',
    actions: [
      assign({
        rawCartResult: (_, event) => event.payload.cart,
        cart: (_, event) => cartFromGraphQL(event.payload.cart),
      }),
    ],
  },
};

const UPDATING_CART_EVENTS: StateMachine.Machine<
  CartMachineContext,
  CartMachineEvent,
  CartMachineTypeState
>['config']['states']['idle']['on'] = {
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
};

function createCartMachine(initialCart?: CartFragmentFragment) {
  return createMachine<
    CartMachineContext,
    CartMachineEvent,
    CartMachineTypeState
  >({
    id: 'Cart',
    initial: initialCart ? 'idle' : 'uninitialized',
    context: {
      cart: initialCart && cartFromGraphQL(initialCart),
    },
    states: {
      uninitialized: {
        on: INITIALIZING_CART_EVENTS,
      },
      cartCompleted: {
        on: INITIALIZING_CART_EVENTS,
      },
      initializationError: {
        on: INITIALIZING_CART_EVENTS,
      },
      idle: {
        on: {...INITIALIZING_CART_EVENTS, ...UPDATING_CART_EVENTS},
      },
      error: {
        on: {...INITIALIZING_CART_EVENTS, ...UPDATING_CART_EVENTS},
      },
      cartFetching: invokeCart('cartFetchAction', {
        errorTarget: 'initializationError',
      }),
      cartCreating: invokeCart('cartCreateAction', {
        errorTarget: 'initializationError',
      }),
      cartLineRemoving: invokeCart('cartLineRemoveAction'),
      cartLineUpdating: invokeCart('cartLineUpdateAction'),
      cartLineAdding: invokeCart('cartLineAddAction'),
      noteUpdating: invokeCart('noteUpdateAction'),
      buyerIdentityUpdating: invokeCart('buyerIdentityUpdateAction'),
      cartAttributesUpdating: invokeCart('cartAttributesUpdateAction'),
      discountCodesUpdating: invokeCart('discountCodesUpdateAction'),
    },
  });
}

export function useCartAPIStateMachine({
  numCartLines,
  onCartActionEntry,
  onCartActionOptimisticUI,
  onCartActionComplete,
  data: cart,
  cartFragment,
  countryCode,
}: {
  /**  Maximum number of cart lines to fetch. Defaults to 250 cart lines. */
  numCartLines?: number;
  /** A callback that is invoked just before a Cart API action executes. */
  onCartActionEntry?: (
    context: CartMachineContext,
    event: CartMachineActionEvent
  ) => void;
  /** A callback that is invoked after executing the entry actions for optimistic UI changes.  */
  onCartActionOptimisticUI?: (
    context: CartMachineContext,
    event: CartMachineEvent
  ) => Partial<CartMachineContext>;
  /** A callback that is invoked after a Cart API completes. */
  onCartActionComplete?: (
    context: CartMachineContext,
    event: CartMachineFetchResultEvent
  ) => void;
  /** An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart). */
  data?: CartFragmentFragment;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment: string;
  /** The ISO country code for i18n. */
  countryCode?: CountryCode;
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
    countryCode,
  });

  const cartMachine = useMemo(() => createCartMachine(cart), [cart]);

  const [state, send, service] = useMachine(cartMachine, {
    actions: {
      cartFetchAction: async (_, event): Promise<void> => {
        if (event.type !== 'CART_FETCH') return;

        const {data, errors} = await cartFetch(event?.payload?.cartId);
        const resultEvent = eventFromFetchResult(event, data?.cart, errors);
        send(resultEvent);
      },
      cartCreateAction: async (_, event): Promise<void> => {
        if (event.type !== 'CART_CREATE') return;

        const {data, errors} = await cartCreate(event?.payload);
        const resultEvent = eventFromFetchResult(
          event,
          data?.cartCreate?.cart,
          errors
        );
        send(resultEvent);
      },
      cartLineAddAction: async (context, event): Promise<void> => {
        if (event.type !== 'CARTLINE_ADD' || !context?.cart?.id) return;

        const {data, errors} = await cartLineAdd(
          context.cart.id,
          event.payload.lines
        );

        const resultEvent = eventFromFetchResult(
          event,
          data?.cartLinesAdd?.cart,
          errors
        );

        send(resultEvent);
      },
      cartLineUpdateAction: async (context, event): Promise<void> => {
        if (event.type !== 'CARTLINE_UPDATE' || !context?.cart?.id) return;
        const {data, errors} = await cartLineUpdate(
          context.cart.id,
          event.payload.lines
        );

        const resultEvent = eventFromFetchResult(
          event,
          data?.cartLinesUpdate?.cart,
          errors
        );

        send(resultEvent);
      },
      cartLineRemoveAction: async (context, event): Promise<void> => {
        if (event.type !== 'CARTLINE_REMOVE' || !context?.cart?.id) return;
        const {data, errors} = await cartLineRemove(
          context.cart.id,
          event.payload.lines
        );

        const resultEvent = eventFromFetchResult(
          event,
          data?.cartLinesRemove?.cart,
          errors
        );

        send(resultEvent);
      },
      noteUpdateAction: async (context, event): Promise<void> => {
        if (event.type !== 'NOTE_UPDATE' || !context?.cart?.id) return;
        const {data, errors} = await noteUpdate(
          context.cart.id,
          event.payload.note
        );

        const resultEvent = eventFromFetchResult(
          event,
          data?.cartNoteUpdate?.cart,
          errors
        );

        send(resultEvent);
      },
      buyerIdentityUpdateAction: async (context, event): Promise<void> => {
        if (event.type !== 'BUYER_IDENTITY_UPDATE' || !context?.cart?.id)
          return;
        const {data, errors} = await buyerIdentityUpdate(
          context.cart.id,
          event.payload.buyerIdentity
        );

        const resultEvent = eventFromFetchResult(
          event,
          data?.cartBuyerIdentityUpdate?.cart,
          errors
        );

        send(resultEvent);
      },
      cartAttributesUpdateAction: async (context, event): Promise<void> => {
        if (event.type !== 'CART_ATTRIBUTES_UPDATE' || !context?.cart?.id)
          return;
        const {data, errors} = await cartAttributesUpdate(
          context.cart.id,
          event.payload.attributes
        );

        const resultEvent = eventFromFetchResult(
          event,
          data?.cartAttributesUpdate?.cart,
          errors
        );

        send(resultEvent);
      },
      discountCodesUpdateAction: async (context, event): Promise<void> => {
        if (event.type !== 'DISCOUNT_CODES_UPDATE' || !context?.cart?.id)
          return;
        const {data, errors} = await discountCodesUpdate(
          context.cart.id,
          event.payload.discountCodes
        );
        const resultEvent = eventFromFetchResult(
          event,
          data?.cartDiscountCodesUpdate?.cart,
          errors
        );

        send(resultEvent);
      },
      ...(onCartActionEntry && {
        onCartActionEntry: (context, event) => {
          if (isCartActionEvent(event)) {
            onCartActionEntry(context, event);
          }
        },
      }),
      ...(onCartActionOptimisticUI && {
        onCartActionOptimisticUI: assign((context, event) => {
          return onCartActionOptimisticUI(context, event);
        }),
      }),
      ...(onCartActionComplete && {
        onCartActionComplete: (context, event) => {
          if (isCartFetchResultEvent(event)) {
            onCartActionComplete(context, event);
          }
        },
      }),
    } as CartMachineActions,
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

function eventFromFetchResult(
  cartActionEvent: CartMachineActionEvent,
  cart?: CartFragmentFragment | null,
  errors?: any
): CartMachineFetchResultEvent {
  if (errors) {
    return {type: 'ERROR', payload: {errors, cartActionEvent}};
  }

  if (!cart) {
    return {
      type: 'CART_COMPLETED',
      payload: {
        cartActionEvent,
      },
    };
  }

  return {
    type: 'RESOLVE',
    payload: {
      cart: cartFromGraphQL(cart),
      rawCartResult: cart,
      cartActionEvent,
    },
  };
}

function isCartActionEvent(
  event: CartMachineEvent | InitEvent
): event is CartMachineActionEvent {
  return (
    event.type === 'CART_CREATE' ||
    event.type === 'CARTLINE_ADD' ||
    event.type === 'CARTLINE_UPDATE' ||
    event.type === 'CARTLINE_REMOVE' ||
    event.type === 'NOTE_UPDATE' ||
    event.type === 'BUYER_IDENTITY_UPDATE' ||
    event.type === 'CART_ATTRIBUTES_UPDATE' ||
    event.type === 'DISCOUNT_CODES_UPDATE'
  );
}

function isCartFetchResultEvent(
  event: CartMachineEvent | InitEvent
): event is CartMachineFetchResultEvent {
  return (
    event.type === 'RESOLVE' ||
    event.type === 'ERROR' ||
    event.type === 'CART_COMPLETED'
  );
}
