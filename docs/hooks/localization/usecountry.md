---
gid: 9f04886e-d3f9-490d-87aa-7e655a0fbcf9
title: useCountry
description: The useCountry hook returns a tuple of the current localization country and a function for updating it.
---

The `useCountry` hook returns a tuple of the current localization country and a function for updating it.
It must be a descendent of a `LocalizationProvider` component.

## Example code

```tsx
import {useCountry, gql} from '@shopify/hydrogen';

export function MyComponent() {
  const [country, setCountry] = useCountry();

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

This hook returns an array with the following elements:

| Index | Description                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------- |
| `0`   | An object with the country's `isoCode` and `name`.                                                         |
| `1`   | A function for updating the country. Accepts one object as an argument with the keys `isoCode` and `name`. |

## Related components

- [`LocalizationProvider`](https://shopify.dev/api/hydrogen/components/localization/localizationprovider)
