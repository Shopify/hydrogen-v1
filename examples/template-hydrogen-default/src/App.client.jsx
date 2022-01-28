import {HelmetProvider} from '@shopify/hydrogen/client';
import CartProvider from './components/CartProvider.client';
import {ShopifyProvider} from '@shopify/hydrogen/client';

/**
 *  Setup client context, though the children are most likely server components
 */
export default function ClientApp({helmetContext, children, shopifyConfig}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      <HelmetProvider context={helmetContext}>
        <CartProvider>{children}</CartProvider>
      </HelmetProvider>
    </ShopifyProvider>
  );
}
