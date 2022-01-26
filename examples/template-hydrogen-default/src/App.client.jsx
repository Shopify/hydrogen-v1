import {HelmetProvider} from '@shopify/hydrogen/client';
import CartProvider from './components/CartProvider.client';

/**
 *  Setup client context, though the children are most likely server components
 */
export default function ClientApp({helmetContext, children}) {
  return (
    <HelmetProvider context={helmetContext}>
      <CartProvider>{children}</CartProvider>
    </HelmetProvider>
  );
}
