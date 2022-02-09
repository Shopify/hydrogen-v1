import CartProvider from './components/CartProvider.client';

/**
 *  Setup client context, though the children are most likely server components
 */
export default function ClientApp({children}) {
  return <CartProvider>{children}</CartProvider>;
}
