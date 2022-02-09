import {useMoney} from '@shopify/hydrogen/client';

/**
 * A client component that defines the currency code, currency symbol, and amount of a product
 */
export default function MoneyPrice({money}) {
  const {currencyCode, currencyNarrowSymbol, amount} = useMoney(money);
  return (
    <span className="text-black text-md">
      {currencyCode}
      {currencyNarrowSymbol}
      {amount}
    </span>
  );
}
