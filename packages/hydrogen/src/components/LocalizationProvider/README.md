<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/LocalizationProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useCountry` hook returns a tuple of the current localization country and a function for updating it.
It must be a descendent of a `LocalizationProvider` component.

## Example code

```tsx
import {LocalizationProvider} from '@shopify/hydrogen';

export function Component() {
  return <LocalizationProvider>{children}</LocalizationProvider>;
}
```

## Props

| Name     | Type                        | Description                                                                                                                                                                                                    |
| -------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children | <code>ReactNode</code>      | A `ReactNode` element.                                                                                                                                                                                         |
| preload? | <code>PreloadOptions</code> | Whether to [preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries). Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |

## Component type

The `LocalizationProvider` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related hooks

- [`useCountry`](/api/hydrogen/hooks/localization/usecountry)
