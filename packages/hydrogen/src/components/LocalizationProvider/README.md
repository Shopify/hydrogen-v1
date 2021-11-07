---
gid: 2d9f4930-fafe-11eb-9a03-0242ac130003
title: LocalizationProvider
description: Use a LocalizationProvider component to automatically query the Storefront API's localization field for the ISO code, name of the country, and available countries, and keep this information in a context.
---

The `LocalizationProvider` component automatically queries the Storefront API's [`localization`](/api/storefront/reference/common-objects/queryroot) field for the `isoCode` and `name` of the `country` and `availableCountries` and keeps this information in a context.

Any descendents of this provider can use the `useCountry` and `useAvailableCountries` hooks. The `isoCode` of the `country` can be used in the Storefront API's [`@inContext`](/api/storefront/reference/directives/incontext) directive as the `country` value.

## Component type

The `LocalizationProvider` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](/api/hydrogen/framework/react-server-components).

## Example code

{% codeblock file %}

```jsx
import {LocalizationProvider} from '@shopify/hydrogen';

export function Component() {
  return <LocalizationProvider>{children}</LocalizationProvider>;
}
```

{% endcodeblock %}

## Related hooks

- [`useCountry`](/api/hydrogen/hooks/localization/usecountry)
- [`useAvailableCountries`](/api/hydrogen/hooks/localization/useavailablecountries)
