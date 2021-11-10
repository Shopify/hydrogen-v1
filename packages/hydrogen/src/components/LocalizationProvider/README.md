<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/LocalizationProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

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
