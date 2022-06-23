---
gid: 9f04886e-d3f9-490d-87aa-7e655a0fbcf9
title: useLocalization
description: The useLocalization hook returns the locale, country, and language of the current page.
---

The `useLocalization` hook returns the locale, country, and language of the current page. It can be used within server or client components and it must be a descendent of a [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider) component.

## Example code

```tsx
import {useLocalization, gql} from '@shopify/hydrogen';

export function MyComponent() {
  const {country, locale, language} = useLocalization();

  const query = gql`
    query ProductPriceMax($country: CountryCode) @inContext(country: $country) {
      productByHandle(handle: "1234") {
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const {data} = useShopQuery({
    query,
    variables: {
      country: country.isoCode,
    },
  });

  return {
    /* Your JSX*/
  };
}
```

## Return value

This hook returns an object with the following properties:

| Property   | Description                                                                              |
| ---------- | ---------------------------------------------------------------------------------------- |
| `country`  | An object with the country's `isoCode`.                                       |
| `language` | An object with the language's `isoCode`.                                                 |
| `locale`   | A locale string, which includes the `isoCode` of both the `language` and `country`. For example, `en-US`. |

## Related components

- [`ShopifyProvider` component](https://shopify.dev/api/hydrogen/components/global/shopifyprovider)
