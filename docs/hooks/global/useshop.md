---
gid: c850ae3e-fafd-11eb-9a03-0242ac130007
title: useShop
description: The useShop hook provides access to values within hydrogen.config.js.
---

The `useShop` hook provides access to values within the `shopify` property in [the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config). It must be a descendent of a `ShopifyProvider` component.

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

| Key                    | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `defaultCountryCode`   | The `defaultCountryCode` from `hydrogenConfig.shopify`.     |
| `defaultLanguageCode`  | The `defaultLanguageCode` from `hydrogenConfig.shopify`.    |
| `storeDomain`          | The store domain set in `hydrogenConfig.shopify`.           |
| `storefrontToken`      | The Storefront API token set in `hydrogenConfig.shopify`.   |
| `storefrontApiVersion` | The Storefront API version set in `hydrogenConfig.shopify`. |

## Related components

- [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider)

## Related framework topics

- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config)
