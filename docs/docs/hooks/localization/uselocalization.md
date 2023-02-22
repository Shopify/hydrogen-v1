# useLocalization


The `useLocalization` hook returns the locale, country, and language of the current page. It can be used within server or client components and it must be a descendent of a [`ShopifyProvider`](/components/global/shopifyprovider/) component.

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
| `locale`   | The locale string based on `country` and `language`. See [how we determine locale](#determine-the-locale-for-i18n).  |

## Determine the locale for i18n

We use the assigned `language` and `countryCode` in the `ShopifyProvider` to determine the `locale`.

If the `language` doesn't contain language tag extensions, then we try to merge `language` and `countryCode`. For example, if `language` is `EN` (English) and `countryCode` is `US` (United States), then `locale` is `EN-US`.

Alternatively if the `language` contains a language tag extension, then we use it directly as `locale`. For example, if
`language` is `PT_BR` (Brazilian Portuguese) and `countryCode` is `US` (United States), then `locale` is `PT_BR`
## Related components

- [`ShopifyProvider`](/components/global/shopifyprovider/)

## Related framework topics

- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/)
- [Internationalization](https://shopify.dev/custom-storefronts/hydrogen/internationalization)
