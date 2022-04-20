import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Outlet, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import DefaultSeo from './components/DefaultSeo.server';
import LoadingFallback from './components/LoadingFallback';
import CartProvider from './components/CartProvider.client';

export default renderHydrogen(() => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        <CartProvider>
          <DefaultSeo />
          <Outlet />
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
});
