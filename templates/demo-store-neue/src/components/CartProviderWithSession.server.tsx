import {CartProvider, useSession} from '@shopify/hydrogen';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export function CartProviderWithSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const {countryCode = 'US'} = useSession();
  return (
    <CartProvider countryCode={countryCode as CountryCode}>
      {children}
    </CartProvider>
  );
}
