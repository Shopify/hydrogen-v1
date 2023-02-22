# useMoney


The `useMoney` hook takes a [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) and returns a
default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by
[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

## Example code

```tsx
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
```

## Return value

This hook returns an object with the following keys:

| Key                               | Description                                                                                                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `localizedString`                 | A string returned by `new Intl.NumberFormat` for the amount and currency code, using the `locale` value from the [`ShopifyProvider`](/components/global/shopifyprovider/) component.            |
| `currencyCode`                    | The currency code from the `MoneyV2` object.                                                                                                                                                                                                   |
| `currencyName`                    | The name for the currency code, returned by `Intl.NumberFormat`.                                                                                                                                                                               |
| `currencySymbol`                  | The currency symbol returned by `Intl.NumberFormat`.                                                                                                                                                                                           |
| `currencyNarrowSymbol`            | The currency narrow symbol returned by `Intl.NumberFormat`.                                                                                                                                                                                    |
| `amount`                          | The localized amount, without any currency symbols or non-number types from the `Intl.NumberFormat.formatToParts` parts.                                                                                                                       |
| `parts`                           | All parts returned by `Intl.NumberFormat.formatToParts`.                                                                                                                                                                                       |
| `original`                        | The original `MoneyV2` object passed as an argument.                                                                                                                                                                                           |
| `withoutTrailingZeros`            | A string with trailing zeros removed from the fractional part, if any exist. If there are no trailing zeros, then the fractional part remains. For example, `$640.00` turns into `$640`. `$640.42` turns into `$640.42`.                       |
| `withoutTrailingZerosAndCurrency` | A string without currency and without trailing zeros removed from the fractional part, if any exist. If there are no trailing zeros, then the fractional part remains. For example, `$640.00` turns into `640`. `$640.42` turns into `640.42`. |

## Related components

- [`Money`](/components/primitive/money/)
