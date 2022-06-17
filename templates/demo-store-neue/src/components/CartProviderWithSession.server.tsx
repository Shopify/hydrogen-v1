import {CartProvider, useLocalization} from '@shopify/hydrogen';

export function CartProviderWithSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    country: {isoCode: countryCode},
  } = useLocalization();
  return <CartProvider countryCode={countryCode}>{children}</CartProvider>;
}
