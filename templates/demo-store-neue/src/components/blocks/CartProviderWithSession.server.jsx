import {CartProvider, useSession} from '@shopify/hydrogen';

export function CartProviderWithSession({children}) {
  const {countryCode = 'US'} = useSession();
  return <CartProvider countryCode={countryCode}>{children}</CartProvider>;
}
