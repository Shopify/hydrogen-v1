import CartProvider from './components/CartProvider.client';
import {HelmetProvider} from 'react-helmet-async';

/**
 *  Setup client context, though the children are most likely server components
 */
export default function ClientApp({helmetContext, children}) {
  return (
    <HelmetProvider helmetContext={helmetContext}>
      <CartProvider>{children}</CartProvider>
    </HelmetProvider>
  );
}
