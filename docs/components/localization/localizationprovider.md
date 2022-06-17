---
gid: 2d9f4930-fafe-11eb-9a03-0242ac130003
title: LocalizationProvider
description: The LocalizationProvider component automatically queries the Storefront API's localization field for the isoCode and name of the country and keeps this information in a context.
---

The `LocalizationProvider` component provides localization data in a context that can be used both within server and client components by the `useLocalization()` hook. The default localization data is defined from your `hydrogen.config.js` file. You can change the active country and langauge at runtime by passing `countryCode` and `languageCode` props to the `LocalizationProvider`.

Any descendents of this provider can use the `useLocalization` hook. The `isoCode` of the `country` can be used in the Storefront API's `@inContext` directive as the `country` value.

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
| countryCode? | <code>isoCode</code> <code>string</code> | The `isoCode` for the country. |
| languageCode? | <code>isoCode</code> <code>string</code> | The `isoCode` for the language country. |

## Component type

The `LocalizationProvider` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related hooks

- [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization)
