import {Money} from '@shopify/hydrogen/client';

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
