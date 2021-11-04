import {useCallback} from 'react';
import {CartProvider as ShopifyCartProvider} from '@shopify/hydrogen/client';

import CartUIProvider, {useCartUI} from './CartUIProvider.client';

export default function CartProvider({children, numCartLines}) {
  return (
    <CartUIProvider>
      <Provider numCartLines={numCartLines}>{children}</Provider>
    </CartUIProvider>
  );
}

function Provider({children, numCartLines}) {
  const {openCart} = useCartUI();

  const open = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <>
      <ShopifyCartProvider
        numCartLines={numCartLines}
        onLineAdd={open}
        onCreate={open}
      >
        {children}
      </ShopifyCartProvider>
    </>
  );
}
