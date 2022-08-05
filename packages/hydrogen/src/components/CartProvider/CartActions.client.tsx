import {useCallback, useMemo} from 'react';
import {
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CountryCode,
} from '../../storefront-api-types.js';
import {
  CartCreate,
  CartLineAdd,
  CartLineUpdate,
  CartQuery,
} from './cart-queries.js';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation.js';
import {
  CartLineAddMutation,
  CartLineAddMutationVariables,
} from './graphql/CartLineAddMutation.js';
import {
  CartLineUpdateMutation,
  CartLineUpdateMutationVariables,
} from './graphql/CartLineUpdateMutation.js';
import {CartQueryQuery, CartQueryQueryVariables} from './graphql/CartQuery.js';
import {useCartFetch} from './hooks.client.js';

export function useCartActions({
  numCartLines,
  cartFragment = defaultCartFragment,
}: {
  numCartLines?: number;
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

  const cartLineUpdate = useCallback(
    async (cartId: string, lines: CartLineUpdateInput[]) => {
      return fetchCart<CartLineUpdateMutationVariables, CartLineUpdateMutation>(
        {
          query: CartLineUpdate(cartFragment),
          variables: {
            cartId,
            lines,
            numCartLines,
            country: CountryCode.Us,
          },
        }
      );
    },
    [cartFragment, fetchCart, numCartLines]
  );

  const cartLineRemove = useCallback(
    async (cartId: string, lines: CartLineUpdateInput[]) => {
      return fetchCart<CartLineUpdateMutationVariables, CartLineUpdateMutation>(
        {
          query: CartLineUpdate(cartFragment),
          variables: {
            cartId,
            lines,
            numCartLines,
            country: CountryCode.Us,
          },
        }
      );
    },
    [cartFragment, fetchCart, numCartLines]
  );

  return useMemo(
    () => ({
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      cartFragment,
    }),
    [cartFetch, cartCreate, cartLineAdd, cartLineUpdate, cartFragment]
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
