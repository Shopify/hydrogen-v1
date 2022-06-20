import {CartProvider, useLocalization} from '@shopify/hydrogen';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export function CartProviderWithSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    country: {isoCode: countryCode},
  } = useLocalization();
  return (
    <CartProvider countryCode={countryCode as CountryCode}>
      {children}
    </CartProvider>
  );
}
