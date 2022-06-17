import {CartProvider, useLocalization} from '@shopify/hydrogen';

export function CartProviderWithSession({children}) {
  const {
    country: {isoCode: countryCode},
  } = useLocalization();
  return <CartProvider countryCode={countryCode}>{children}</CartProvider>;
}
