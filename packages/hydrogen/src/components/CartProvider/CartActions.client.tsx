import {useCallback, useMemo} from 'react';
import {
  AttributeInput,
  CartBuyerIdentityInput,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CountryCode,
} from '../../storefront-api-types.js';
import {
  CartAttributesUpdate,
  CartBuyerIdentityUpdate,
  CartCreate,
  CartDiscountCodesUpdate,
  CartLineAdd,
  CartLineRemove,
  CartLineUpdate,
  CartNoteUpdate,
  CartQuery,
} from './cart-queries.js';
import {
  CartAttributesUpdateMutation,
  CartAttributesUpdateMutationVariables,
} from './graphql/CartAttributesUpdateMutation.js';
import {
  CartBuyerIdentityUpdateMutation,
  CartBuyerIdentityUpdateMutationVariables,
} from './graphql/CartBuyerIdentityUpdateMutation.js';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation.js';
import {
  CartDiscountCodesUpdateMutation,
  CartDiscountCodesUpdateMutationVariables,
} from './graphql/CartDiscountCodesUpdateMutation.js';
import {
  CartLineAddMutation,
  CartLineAddMutationVariables,
} from './graphql/CartLineAddMutation.js';
import {
  CartLineRemoveMutation,
  CartLineRemoveMutationVariables,
} from './graphql/CartLineRemoveMutation.js';
import {
  CartLineUpdateMutation,
  CartLineUpdateMutationVariables,
} from './graphql/CartLineUpdateMutation.js';
import {
  CartNoteUpdateMutation,
  CartNoteUpdateMutationVariables,
} from './graphql/CartNoteUpdateMutation.js';
import {CartQueryQuery, CartQueryQueryVariables} from './graphql/CartQuery.js';
import {useCartFetch} from './hooks.client.js';

/**
 * The `useCartActions` hook returns helper graphql functions for Storefront Cart API
 *
 * See [cart API graphql mutations](https://shopify.dev/api/storefront/2022-07/objects/Cart)
 */
export function useCartActions({
  numCartLines,
  cartFragment,
  countryCode = CountryCode.Us,
}: {
  /**  Maximum number of cart lines to fetch. Defaults to 250 cart lines. */
  numCartLines?: number;
  /** A fragment used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. */
  cartFragment: string;
  /** The ISO country code for i18n. */
  countryCode?: CountryCode;
}) {
  const fetchCart = useCartFetch();

  const cartFetch = useCallback(
    (cartId: string) => {
      return fetchCart<CartQueryQueryVariables, CartQueryQuery>({
        query: CartQuery(cartFragment),
        variables: {
          id: cartId,
          numCartLines,
          country: countryCode,
        },
      });
    },
    [fetchCart, cartFragment, numCartLines, countryCode]
  );

  const cartCreate = useCallback(
    (cart: CartInput) => {
      return fetchCart<CartCreateMutationVariables, CartCreateMutation>({
        query: CartCreate(cartFragment),
        variables: {
          input: cart,
          numCartLines,
          country: countryCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  const cartLineAdd = useCallback(
    (cartId: string, lines: CartLineInput[]) => {
      return fetchCart<CartLineAddMutationVariables, CartLineAddMutation>({
        query: CartLineAdd(cartFragment),
        variables: {
          cartId,
          lines,
          numCartLines,
          country: countryCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  const cartLineUpdate = useCallback(
    (cartId: string, lines: CartLineUpdateInput[]) => {
      return fetchCart<CartLineUpdateMutationVariables, CartLineUpdateMutation>(
        {
          query: CartLineUpdate(cartFragment),
          variables: {
            cartId,
            lines,
            numCartLines,
            country: countryCode,
          },
        }
      );
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  const cartLineRemove = useCallback(
    (cartId: string, lines: string[]) => {
      return fetchCart<CartLineRemoveMutationVariables, CartLineRemoveMutation>(
        {
          query: CartLineRemove(cartFragment),
          variables: {
            cartId,
            lines,
            numCartLines,
            country: countryCode,
          },
        }
      );
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  const noteUpdate = useCallback(
    (cartId: string, note: CartNoteUpdateMutationVariables['note']) => {
      return fetchCart<CartNoteUpdateMutationVariables, CartNoteUpdateMutation>(
        {
          query: CartNoteUpdate(cartFragment),
          variables: {
            cartId,
            note,
            numCartLines,
            country: countryCode,
          },
        }
      );
    },
    [fetchCart, cartFragment, numCartLines, countryCode]
  );

  const buyerIdentityUpdate = useCallback(
    (cartId: string, buyerIdentity: CartBuyerIdentityInput) => {
      return fetchCart<
        CartBuyerIdentityUpdateMutationVariables,
        CartBuyerIdentityUpdateMutation
      >({
        query: CartBuyerIdentityUpdate(cartFragment),
        variables: {
          cartId,
          buyerIdentity,
          numCartLines,
          country: countryCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  const cartAttributesUpdate = useCallback(
    (cartId: string, attributes: AttributeInput[]) => {
      return fetchCart<
        CartAttributesUpdateMutationVariables,
        CartAttributesUpdateMutation
      >({
        query: CartAttributesUpdate(cartFragment),
        variables: {
          cartId,
          attributes,
          numCartLines,
          country: countryCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  const discountCodesUpdate = useCallback(
    (
      cartId: string,
      discountCodes: CartDiscountCodesUpdateMutationVariables['discountCodes']
    ) => {
      return fetchCart<
        CartDiscountCodesUpdateMutationVariables,
        CartDiscountCodesUpdateMutation
      >({
        query: CartDiscountCodesUpdate(cartFragment),
        variables: {
          cartId,
          discountCodes,
          numCartLines,
          country: countryCode,
        },
      });
    },
    [cartFragment, countryCode, fetchCart, numCartLines]
  );

  return useMemo(
    () => ({
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      noteUpdate,
      buyerIdentityUpdate,
      cartAttributesUpdate,
      discountCodesUpdate,
      cartFragment,
    }),
    [
      cartFetch,
      cartCreate,
      cartLineAdd,
      cartLineUpdate,
      cartLineRemove,
      noteUpdate,
      buyerIdentityUpdate,
      cartAttributesUpdate,
      discountCodesUpdate,
      cartFragment,
    ]
  );
}
