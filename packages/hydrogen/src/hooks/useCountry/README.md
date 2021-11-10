<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useCountry and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useCountry` hook returns a tuple of the current localization country and a function for updating it.
It must be a descendent of a `LocalizationProvider` component.

## Example code

```tsx
import {useCountry} from '@shopify/hydrogen';
import gql from 'graphql-tag';

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

- [`LocalizationProvider`](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [`useAvailableCountries`](/api/hydrogen/hooks/localization/useavailablecountries)
