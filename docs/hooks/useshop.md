---
url: /api/hydrogen/hooks/global/useshop
title: useShop
description: The useShop hook provides access to values within shopify.config.js.
---

The `useShop` hook provides access to values within the `shopify` property in the `hydrogen.config.js` file.. It must be a descendent of a `ShopifyProvider` component.

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

| Key                    | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `locale`               | The application locale. Defaults to `defaultLocale` in `hydrogenConfig.shopify` then `EN-US`. |
| `languageCode`         | The first two characters of the `locale` key. For example, `EN`.                              |
| `storeDomain`          | The store domain set in `hydrogenConfig.shopify`.                                             |
| `storefrontToken`      | The Storefront API token set in `hydrogenConfig.shopify`.                                     |
| `storefrontApiVersion` | The Storefront API version set in `hydrogenConfig.shopify`.                                   |

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)
