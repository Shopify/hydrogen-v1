import React, {useState} from 'react';
import {useShop} from '../../foundation';
import {flattenConnection} from '../../utilities';
import {CartInput} from '../../graphql/types/types';
import {CartCreate} from '../../graphql/graphql-constants';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation';
import {Cart} from './types';

export function useCartFetch() {
  const {storeDomain, storefrontApiVersion, storefrontToken} = useShop();

  return React.useCallback(
    <T, K>({
      query,
      variables,
    }: {
      query: string;
      variables: T;
    }): Promise<{data: K | undefined; error: any}> => {
      return fetch(
        `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-SDK-Variant': 'hydrogen',
            'X-SDK-Version': storefrontApiVersion,
            'X-Shopify-Storefront-Access-Token': storefrontToken,
          },
          body: JSON.stringify({
            query: query.toString(),
            variables,
          }),
        }
      )
        .then((res) => res.json())
        .catch((error) => {
          return {
            data: undefined,
            error: error.toString(),
          };
        });
    },
    [storeDomain, storefrontApiVersion, storefrontToken]
  );
}

export function useInstantCheckout() {
  const [cart, updateCart] = useState<Cart | undefined>();
  const [checkoutUrl, updateCheckoutUrl] = useState<Cart['checkoutUrl']>();
  const [error, updateError] = useState<string | undefined>();

  const fetch = useCartFetch();

  const createInstantCheckout = React.useCallback(
    async (cartInput: CartInput) => {
      const {data, error} = await fetch<
        CartCreateMutationVariables,
        CartCreateMutation
      >({
        query: CartCreate,
        variables: {
          input: cartInput,
        },
      });

      if (error) {
        updateError(error);
        updateCart(undefined);
        updateCheckoutUrl(undefined);
      }

      if (data?.cartCreate?.cart) {
        const dataCart = data.cartCreate.cart;
        updateCart({
          ...dataCart,
          lines: flattenConnection(dataCart.lines),
          note: dataCart.note ?? undefined,
        });
        updateCheckoutUrl(dataCart.checkoutUrl);
      }
    },
    [fetch]
  );

  return {cart, checkoutUrl, error, createInstantCheckout};
}
