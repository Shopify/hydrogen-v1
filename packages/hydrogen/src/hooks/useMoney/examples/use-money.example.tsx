import {useMoney} from '@shopify/hydrogen';

export function MyComponent() {
  const [value, parts] = useMoney(variant.pricev2);

  return (
    <div>
      <strong>{parts.currencyCode}</strong>
      <span>{parts.currencySymbol}</span>
      <span>{parts.amount}</span>
    </div>
  );
}
