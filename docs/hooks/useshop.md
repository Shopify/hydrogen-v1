---
url: /api/hydrogen/hooks/global/useshop
title: useShop
description: The useShop hook provides access to values within shopify.config.js.
---

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
