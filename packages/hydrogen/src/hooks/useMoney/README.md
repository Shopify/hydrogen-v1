<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useMoney and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useMoney` hook takes a [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) and returns a
default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by
[`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

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

| Key                    | Description                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `localizedString`      | A string returned by `new Intl.NumberFormat` for the amount and currency code, using the `shopify.config.js` locale.     |
| `currencyCode`         | The currency code from the `MoneyV2` object.                                                                             |
| `currencyName`         | The name for the currency code, returned by `Intl.NumberFormat`.                                                         |
| `currencySymbol`       | The currency symbol returned by `Intl.NumberFormat`.                                                                     |
| `currencyNarrowSymbol` | The currency narrow symbol returned by `Intl.NumberFormat`.                                                              |
| `amount`               | The localized amount, without any currency symbols or non-number types from the `Intl.NumberFormat.formatToParts` parts. |
| `parts`                | All parts returned by `Intl.NumberFormat.formatToParts`.                                                                 |
| `original`             | The original `MoneyV2` object passed as an argument.                                                                     |

## Related components

- [`Money`](/api/hydrogen/components/primitive/money)
