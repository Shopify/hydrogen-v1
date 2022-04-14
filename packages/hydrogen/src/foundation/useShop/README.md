<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/foundation/useShop and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useShop` hook provides access to values within the `shopify` property in the `hydrogen.config.js` file. The `useShop` hook must be a descendent of a `ShopifyProvider` component.

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

| Key                    | Description                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `locale`               | The application locale. Defaults to `defaultLocale` in `hydrogenConfing.shopify` then `EN-US`. |
| `languageCode`         | The first two characters of the `locale` key. For example, `EN`.                               |
| `storeDomain`          | The store domain set in `hydrogenConfing.shopify`.                                             |
| `storefrontToken`      | The Storefront API token set in `hydrogenConfing.shopify`.                                     |
| `storefrontApiVersion` | The Storefront API version set in `hydrogenConfing.shopify`.                                   |

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)
