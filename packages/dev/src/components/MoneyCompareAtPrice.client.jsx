import {Money} from '@shopify/hydrogen/client';

export default function MoneyCompareAtPrice({money}) {
  return (
    <Money money={money}>
      {({amount, currencyNarrowSymbol}) => (
        <span className="line-through text-lg mr-2.5 text-gray-500">
          {currencyNarrowSymbol}
          {amount}
        </span>
      )}
    </Money>
  );
}
