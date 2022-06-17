---
'@shopify/hydrogen': minor
---

We have reworked how localization works in Hydrogen. By default the `useLocalization()` hook returns the default locale defined within your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config). The `<LocalizationProvider>` component now takes `countryCode` and `languageCode` as optional props. Any props given to `<LocalizationProvider>` will also be used by the `useLocalization` hook.

**Breaking Change**

The `useCountry` hook has been removed. Instead use the [`useLocalization` hook](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization).

```diff
- import {useCountry, gql} from '@shopify/hydrogen';
+ import {useLocalization, gql} from '@shopify/hydrogen';

export function MyComponent() {

-  const [country] = useCountry();
+  const {country} = useLocalization();

  return ( /* Your JSX */ );
}
```

The `Link` component now respects the `basePath` property defined within it's parent `FileRoutes` component. For example, given `<FileRoutes basePath="/cn">`, a route within that renders `<Link to="/products">` will actually produce an anchor tag prefixed with `/cn`: `<a href="/cn/products">`. You can override the `basePath` with a `basePath` prop on the `Link` component.
