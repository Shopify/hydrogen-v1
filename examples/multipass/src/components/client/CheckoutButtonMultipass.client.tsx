import React from 'react';
import {useCart} from '@shopify/hydrogen';
import {multipass} from '~/lib/multipass';

/*
  This component attempts to persist the customer session
  state in the checkout by using multipass.
  Note: multipass checkout is a Shopify Plus+ feature only.
*/
export function CheckoutButtonMultipass() {
  const {checkoutUrl} = useCart();

  async function checkoutHandler() {
    if (!checkoutUrl) return;

    // checkout via multipass.
    // If they user is logged in we persist it in the checkout,
    // otherwise we log them out of the checkout too.
    await multipass({
      return_to: checkoutUrl,
      redirect: true,
    });
  }

  return <button onClick={checkoutHandler}>Checkout (multipass)</button>;
}
