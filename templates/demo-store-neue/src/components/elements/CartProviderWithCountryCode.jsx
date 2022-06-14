import {CartProvider, useSession} from '@shopify/hydrogen';

export function CartProviderWithCountryCode({children}) {
  const {countryCode = 'US'} = useSession();
  return <CartProvider countryCode={countryCode}>{children}</CartProvider>;
}
