<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useShop and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.

## Example code

```tsx
import {useShop} from '@shopify/hydrogen';

export default function MyPage() {
  const {locale} = useShop();

  return <h1>The locale is {locale}</h1>;
}
```

## Return value

The `useShop` hook returns an object with the following keys:

| Key                    | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `locale`               | The application locale. Defaults to `defaultLocale` in `shopify.config.js` then `EN-US`. |
| `languageCode`         | The first two characters of the `locale` key. For example, `EN`.                         |
| `storeDomain`          | The store domain set in `shopify.config.js`.                                             |
| `storefrontToken`      | The Storefront API token set in `shopify.config.js`.                                     |
| `storefrontApiVersion` | The Storefront API version set in `shopify.config.js`.                                   |

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)
