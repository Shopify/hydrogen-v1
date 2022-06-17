import React, {useState} from 'react';
import {useShop} from '../../foundation';
import {flattenConnection} from '../../utilities';
import {CartInput} from '../../storefront-api-types';
import {CartCreate, defaultCartFragment} from './cart-queries';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation';
import {Cart} from './types';

export function useCartFetch() {
  const {storeDomain, storefrontApiVersion, storefrontToken, storefrontId} =
    useShop();

  return React.useCallback(
    <T, K>({
      query,
      variables,
    }: {
      query: string;
      variables: T;
    }): Promise<{data: K | undefined; error: any}> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-SDK-Variant': 'hydrogen',
        'X-SDK-Version': storefrontApiVersion,
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      };

      if (storefrontId) {
        headers['Shopify-Storefront-Id'] = storefrontId;
      }

      return fetch(
        `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
        {
          method: 'POST',
          headers,
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
        query: CartCreate(defaultCartFragment),
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
          // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
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
