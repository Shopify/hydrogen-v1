import React, {useState} from 'react';
import {flattenConnection} from '../../utilities';
import {CartInput} from '../../storefront-api-types';
import {Cart} from './types';

export function useCartFetch(endpoint: string) {
  return async function (action: string, variables: any) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          _action: action,
          ...variables,
        }),
      });
      return await res.json();
    } catch (error: any) {
      return {
        data: undefined,
        error: error.toString(),
      };
    }
  };
}

export function useInstantCheckout(endpoint = '/cart') {
  const [cart, updateCart] = useState<Cart | undefined>();
  const [checkoutUrl, updateCheckoutUrl] = useState<Cart['checkoutUrl']>();
  const [error, updateError] = useState<string | undefined>();

  const fetch = useCartFetch(endpoint);

  const createInstantCheckout = React.useCallback(
    async (cartInput: CartInput) => {
      const {data, error} = await fetch('cartCreate', {
        input: cartInput,
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
