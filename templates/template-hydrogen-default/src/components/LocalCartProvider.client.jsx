import {useCallback} from 'react';
import {CartProvider as ShopifyCartProvider} from '@shopify/hydrogen';

import CartUIProvider, {useCartUI} from './CartUIProvider.client';

/**
 * A client component that creates a cart object and provides callbacks that can be accessed by any descendent component using the `useCart` hook and related hooks
 */
export default function LocalCartProvider({
  children,
  numCartLines,
  customerAccessToken,
}) {
  return (
    <CartUIProvider>
      <Provider
        numCartLines={numCartLines}
        customerAccessToken={customerAccessToken}
      >
        {children}
      </Provider>
    </CartUIProvider>
  );
}

function Provider({children, numCartLines, customerAccessToken}) {
  const {openCart} = useCartUI();

  const open = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <>
      <ShopifyCartProvider
        customerAccessToken={customerAccessToken}
        numCartLines={numCartLines}
        onLineAdd={open}
        onCreate={open}
      >
        {children}
      </ShopifyCartProvider>
    </>
  );
}
