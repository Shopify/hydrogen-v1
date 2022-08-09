import React from 'react';
import {useCart} from '@shopify/hydrogen';
import {CheckoutButtonMultipass} from './CheckoutButtonMultipass.client';

export function Cart() {
  const {lines} = useCart();

  function deleteCart() {
    // don't try this at home. use the cart API endpoint instead.
    window.localStorage.removeItem('shopifyCartId');
    window.location.href = '/';
  }

  return (
    <div>
      <h3>Cart</h3>
      <p>Cart count: {lines?.length || 0}</p>
      <CheckoutButtonMultipass />
      <button onClick={deleteCart}>Delete cart</button>
    </div>
  );
}
