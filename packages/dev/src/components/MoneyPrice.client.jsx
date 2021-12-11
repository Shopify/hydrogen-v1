import {Money} from '@shopify/hydrogen/client';

/**
 * Defines the currency code, currency symbol, and amount of a product
 */
export default function MoneyPrice({money}) {
  return (
    <Money className="text-black text-md" money={money}>
      {({amount, currencyNarrowSymbol, currencyCode}) => (
        <>
          {currencyCode}
          {currencyNarrowSymbol}
          {amount}
        </>
      )}
    </Money>
  );
}
