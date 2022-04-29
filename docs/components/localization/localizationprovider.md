---
gid: 2d9f4930-fafe-11eb-9a03-0242ac130003
title: LocalizationProvider
description: The LocalizationProvider component automatically queries the Storefront API's localization field for the isoCode and name of the country and keeps this information in a context.
---

The `LocalizationProvider` component automatically queries the Storefront API's [localization](https://shopify.dev/api/storefront/latest/objects/queryroot) field for the `isoCode` and `name` of the `country` and keeps this information in a context.

Any descendents of this provider can use the `useCountry` hook. The `isoCode` of the `country` can be used in the Storefront API's `@inContext` directive as the `country` value.

## Example code

```tsx
import {LocalizationProvider} from '@shopify/hydrogen';

export function Component() {
  return <LocalizationProvider>{children}</LocalizationProvider>;
}
```

## Props

| Name     | Type                        | Description                                                                                                                                                                                                                       |
| -------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children | <code>ReactNode</code>      | A `ReactNode` element.                                                                                                                                                                                                            |
| preload? | <code>PreloadOptions</code> | Whether to [preload the query](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries). Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |

## Component type

The `LocalizationProvider` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related hooks

- [`useCountry`](https://shopify.dev/api/hydrogen/hooks/localization/usecountry)

## Related framework topics

- [Preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries)
