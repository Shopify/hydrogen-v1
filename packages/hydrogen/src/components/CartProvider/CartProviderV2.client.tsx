import React, {useCallback, useEffect, useMemo} from 'react';
import {useMachine} from '@xstate/react/fsm';
import {createMachine, assign} from '@xstate/fsm';
import {CartFragmentFragment} from './graphql/CartFragment.js';
import {useCartFetch} from './hooks.client.js';
import {CartQueryQuery, CartQueryQueryVariables} from './graphql/CartQuery.js';
import {CartCreate, CartLineAdd, CartQuery} from './cart-queries.js';
import {
  AttributeInput,
  CartBuyerIdentityInput,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CountryCode,
} from '../../storefront-api-types.js';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation.js';
import {
  CartLineAddMutation,
  CartLineAddMutationVariables,
} from './graphql/CartLineAddMutation.js';
import {CartContext} from './context.js';
import {Cart, CartWithActions} from './types.js';
import {flattenConnection} from '../../utilities.js';
import {CartNoteUpdateMutationVariables} from './graphql/CartNoteUpdateMutation.js';
import {CartDiscountCodesUpdateMutationVariables} from './graphql/CartDiscountCodesUpdateMutation.js';

type CartContext = {
  cart?: Cart;
  errors?: any;
};

type FetchCartEvent = {
  type: 'FETCH_CART';
  payload: {
    cartId: string;
  };
};

type CreateCartEvent = {
  type: 'CREATE_CART';
  payload: CartInput;
};

type AddCartLineEvent = {
  type: 'ADD_CARTLINE';
  payload: {
    cartId: string;
    lines: CartLineInput[];
  };
};

type RemoveCartLineEvent = {type: 'REMOVE_CARTLINE'};

type UpdateCartLineEvent = {type: 'UPDATE_CARTLINE'};

type CartEvent =
  | FetchCartEvent
  | CreateCartEvent
  | AddCartLineEvent
  | RemoveCartLineEvent
  | UpdateCartLineEvent
  | {type: 'DELETE_CART'}
  | {type: 'RESOLVE'; payload: {cart: Cart}}
  | {type: 'ERROR'; payload: {errors: any}};

type CartTypeState =
  | {
      value: 'No Cart';
      context: CartContext & {
        cart: undefined;
        errors?: any;
      };
    }
  | {
      value: 'hasCart';
      context: CartContext & {
        cart: Cart;
        errors?: any;
      };
    }
  | {value: 'Fetching'; context: CartContext}
  | {value: 'CreatingCart'; context: CartContext}
  | {value: 'RemovingCartLine'; context: CartContext}
  | {value: 'UpdatingCartLine'; context: CartContext}
  | {value: 'AddingCartLine'; context: CartContext};

const cartMachine = createMachine<CartContext, CartEvent, CartTypeState>({
  id: 'Cart',
  initial: 'No Cart',
  states: {
    'No Cart': {
      on: {
        FETCH_CART: {
          target: 'Fetching',
        },
        CREATE_CART: {
          target: 'CreatingCart',
        },
      },
    },
    hasCart: {
      on: {
        REMOVE_CARTLINE: {
          target: 'RemovingCartLine',
        },
        DELETE_CART: {
          target: 'DeletingCart',
        },
        ADD_CARTLINE: {
          target: 'AddingCartLine',
        },
        UPDATE_CARTLINE: {
          target: 'UpdatingCartLine',
        },
      },
    },
    Fetching: {
      entry: ['fetchCart'],
      on: {
        RESOLVE: {
          target: 'hasCart',
          actions: [
            assign({
              cart: (context, event) => event.payload.cart,
            }),
          ],
        },
        ERROR: {
          target: 'No Cart',
          actions: assign({
            errors: (context, event) => event.payload.errors,
          }),
        },
      },
    },
    CreatingCart: {
      entry: ['createCart'],
      on: {
        RESOLVE: {
          target: 'hasCart',
          actions: assign({
            cart: (context, event): Cart => event.payload.cart,
          }),
        },
        ERROR: {
          target: 'No Cart',
          actions: assign({
            errors: (context, event) => event.payload.errors,
          }),
        },
      },
    },
    RemovingCartLine: {
      entry: ['removeCartLine'],
      on: {
        RESOLVE: {
          target: 'hasCart',
          actions: assign({
            cart: (context, event) => event.payload.cart,
          }),
        },
        ERROR: {
          target: 'hasCart',
          actions: assign({
            errors: (context, event) => event.payload.errors,
          }),
        },
      },
    },
    UpdatingCartLine: {
      entry: ['updateCartLine'],
      on: {
        RESOLVE: {
          target: 'hasCart',
          actions: assign({
            cart: (context, event) => event.payload.cart,
          }),
        },
        ERROR: {
          target: 'hasCart',
          actions: assign({
            errors: (context, event) => event.payload.errors,
          }),
        },
      },
    },
    AddingCartLine: {
      entry: ['addCartLine'],
      on: {
        RESOLVE: {
          target: 'hasCart',
          actions: assign({
            cart: (context, event) => event.payload.cart,
          }),
        },
        ERROR: {
          target: 'hasCart',
          actions: assign({
            errors: (context, event) => event.payload.errors,
          }),
        },
      },
    },
  },
});

export function CartProviderV2({
  children,
  numCartLines,
  data: cart,
  cartFragment = defaultCartFragment,
}: {
  /** Any `ReactNode` elements. */
  children: React.ReactNode;
  numCartLines?: number;
  /** An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart). */
  data?: CartFragmentFragment;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment?: string;
}) {
  const fetchCart = useCartFetch();

  const cartFetch = useCallback(
    async (cartId: string) => {
      return fetchCart<CartQueryQueryVariables, CartQueryQuery>({
        query: CartQuery(cartFragment),
        variables: {
          id: cartId,
          numCartLines,
          country: CountryCode.Us,
        },
      });
    },
    [fetchCart, cartFragment, numCartLines]
  );

  const cartCreate = useCallback(
    async (cart: CartInput) => {
      return fetchCart<CartCreateMutationVariables, CartCreateMutation>({
        query: CartCreate(cartFragment),
        variables: {
          input: cart,
          numCartLines,
          country: CountryCode.Us,
        },
      });
    },
    [cartFragment, fetchCart, numCartLines]
  );

  const cartLineAdd = useCallback(
    async (cartId: string, lines: CartLineInput[]) => {
      return fetchCart<CartLineAddMutationVariables, CartLineAddMutation>({
        query: CartLineAdd(cartFragment),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: CountryCode.Us,
        },
      });
    },
    [cartFragment, fetchCart, numCartLines]
  );

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
        if (event.type !== 'CREATE_CART') return;

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
        console.log(event);
        if (event.type !== 'ADD_CARTLINE') return;

        cartLineAdd(event.payload.cartId, event.payload.lines).then((res) => {
          if (res?.errors || !res.data?.cartLinesAdd?.cart) {
            return send({type: 'ERROR', payload: {errors: res?.errors}});
          }
          send({
            type: 'RESOLVE',
            payload: {cart: cartFromGraphQL(res.data?.cartLinesAdd.cart)},
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
    status: CartTypeState['value']
  ): CartWithActions['status'] {
    switch (status) {
      case 'No Cart':
        return 'uninitialized';
      case 'hasCart':
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
        if (state.value === 'hasCart') {
          send({
            type: 'ADD_CARTLINE',
            payload: {
              cartId: state.context.cart!.id!,
              lines,
            },
          });
        } else {
          send({
            type: 'CREATE_CART',
            payload: {lines},
          });
        }
      },
      linesRemove(lines: string[]) {
        // removeLineItem(lines, state);
      },
      linesUpdate(lines: CartLineUpdateInput[]) {
        // updateLineItem(lines, state);
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
      cartFragment,
    };
  }, [cartFragment, send, state.context, state.value]);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
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

function cartFromGraphQL(cart: CartFragmentFragment): Cart {
  return {
    ...cart,
    // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
    lines: flattenConnection(cart.lines),
    note: cart.note ?? undefined,
  };
}
