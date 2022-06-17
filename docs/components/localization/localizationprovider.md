---
gid: 2d9f4930-fafe-11eb-9a03-0242ac130003
title: LocalizationProvider
description: The LocalizationProvider component automatically queries the Storefront API's localization field for the isoCode and name of the country and keeps this information in a context.
---

The `LocalizationProvider` component provides localization data in a context that can be used both within server and client components by the [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization) hook. The default localization data is defined in your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config). You can change the active country and language at runtime by passing `countryCode` and `languageCode` props to the `LocalizationProvider`.

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
| countryCode? | <code>string</code> | The [code](https://shopify.dev/api/storefront/latest/enums/CountryCode) designating a country or region, which generally follows ISO 3166-1 alpha-2 guidelines. |
| languageCode? | <code>string</code> | The ISO 639-1 [language codes](https://shopify.dev/api/storefront/latest/enums/LanguageCode) supported by Shopify.  |

## Component type

The `LocalizationProvider` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related hooks

- [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization)
