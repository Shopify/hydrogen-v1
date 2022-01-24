import React, {useState} from 'react';
import {useShop, useSFAPIClient} from '../../foundation';
import {flattenConnection} from '../../utilities';
import {CartInput, Cart} from '../../graphql/types/types';

export function useCartFetch() {
  const {storeDomain, graphqlApiVersion, storefrontToken} = useShop();

  return React.useCallback(
    ({
      query,
      variables,
    }: {
      query: string;
      variables: Record<string, any>;
    }): Promise<{data: any | undefined; error: any}> => {
      return fetch(
        `https://${storeDomain}/api/${graphqlApiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
    [storeDomain, graphqlApiVersion, storefrontToken]
  );
}

export function useInstantCheckout() {
  const [cart, updateCart] = useState<Cart | undefined>();
  const [checkoutUrl, updateCheckoutUrl] = useState<Cart['checkoutUrl']>();
  const [error, updateError] = useState<string | undefined>();

  const fetch = useCartFetch();

  const createInstantCheckout = React.useCallback(
    async (cartInput: CartInput) => {
      const SFAPIClient = useSFAPIClient();

      const {gql, variables} = SFAPIClient.cart.createCart({input: cartInput});

      const {data, error} = await fetch({
        query: gql,
        variables,
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
